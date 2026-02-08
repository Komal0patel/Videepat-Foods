import React, { useState } from 'react';
import {
    ArrowLeft,
    Save,
    Eye,
    Plus,
    Type,
    Image as ImageIcon,
    Play,
    Layout as LayoutIcon,
    Box,
    GripVertical,
    Trash2,
    Package,
    Upload,
    Monitor,
    FileText
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { cn } from '../utils/cn';
import { Reorder } from 'framer-motion';
import type { Section, Page } from '../types';

const PageEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { pages, addPage, updatePage } = useStore();
    const isNew = !id || id === 'new';

    const [pageName, setPageName] = useState('New Page');
    const [sections, setSections] = useState<Section[]>([
        {
            id: 'sec_1',
            layout: 'boxed',
            styles: { backgroundColor: 'transparent', padding: '64px 0' },
            order: 0,
            blocks: [
                {
                    id: 'blk_1',
                    type: 'text',
                    content: { heading: 'Welcome to our Bakery', body: 'The best bread in town.' },
                    styles: { textAlign: 'center' },
                    animations: { type: 'fade', delay: 0 },
                    visibility: { mobile: true, tablet: true, desktop: true }
                }
            ]
        }
    ]);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pageLayout, setPageLayout] = useState<'default' | 'landing' | 'minimal'>('default');

    const imageInputRef = React.useRef<HTMLInputElement>(null);
    const videoInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (!isNew && id) {
            const page = pages.find(p => p.id === id || p._id === id);
            if (page) {
                setPageName(page.name);
                setSections(page.sections);
                if (page.layout) setPageLayout(page.layout);
            }
        }
    }, [id, isNew, pages]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            updateBlockContent('url', reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!pageName.trim()) {
            setError("Page name is required");
            return;
        }

        setSaving(true);
        setError(null);

        const pageData: Page = {
            name: pageName,
            slug: pageName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            meta_title: pageName,
            meta_description: `Description for ${pageName}`,
            layout: pageLayout,
            is_active: true,
            status: 'published',
            sections: sections,
            version: 1
        };

        try {
            if (isNew) {
                await addPage(pageData);
            } else if (id) {
                await updatePage(id, pageData);
            }
            navigate('/pages');
        } catch (err: any) {
            console.error('Save failed:', err);
            setError(typeof err === 'string' ? err : "Failed to save page. Please check if slug is unique.");
        } finally {
            setSaving(false);
        }
    };

    const [activeTab, setActiveTab] = useState<'content' | 'styles' | 'preview'>('content');
    const [selectedElement, setSelectedElement] = useState<{ type: 'section' | 'block', id: string } | null>(null);

    const addSection = () => {
        const newSection: Section = {
            id: `sec_${Date.now()}`,
            layout: 'boxed',
            styles: { padding: '40px 0' },
            order: sections.length,
            blocks: []
        };
        setSections([...sections, newSection]);
    };

    const addBlock = (sectionId: string, type: any) => {
        setSections(sections.map(sec => {
            if (sec.id === sectionId) {
                return {
                    ...sec,
                    blocks: [...sec.blocks, {
                        id: `blk_${Date.now()}`,
                        type,
                        content:
                            type === 'text' ? { heading: 'New Heading', body: 'Add your text here...', alignment: 'left' } :
                                type === 'image' ? { url: '', caption: '' } :
                                    type === 'video' ? { url: '' } :
                                        type === 'button' ? { text: 'Click Here', link: '#' } :
                                            type === 'product_list' ? { style: 'grid' } : {},
                        styles: {},
                        animations: {},
                        visibility: { mobile: true, tablet: true, desktop: true }
                    }]
                };
            }
            return sec;
        }));
    };

    const getSelectedBlock = () => {
        if (selectedElement?.type !== 'block') return null;
        for (const section of sections) {
            const block = section.blocks.find(b => b.id === selectedElement.id);
            if (block) return block;
        }
        return null;
    };

    const updateBlockContent = (key: string, value: any) => {
        if (selectedElement?.type !== 'block') return;
        setSections(sections.map(sec => ({
            ...sec,
            blocks: sec.blocks.map(blk => {
                if (blk.id === selectedElement.id) {
                    return { ...blk, content: { ...blk.content, [key]: value } };
                }
                return blk;
            })
        })));
    };

    const deleteBlock = (sectionId: string, blockId: string) => {
        setSections(sections.map(sec => {
            if (sec.id === sectionId) {
                return {
                    ...sec,
                    blocks: sec.blocks.filter(blk => blk.id !== blockId)
                };
            }
            return sec;
        }));
        if (selectedElement?.id === blockId) {
            setSelectedElement(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#080a0b] flex flex-col z-50">
            {/* Top Bar */}
            <div className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 relative z-30">
                <div className="flex items-center gap-6">
                    <Link to="/pages" className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all">
                        <ArrowLeft size={18} />
                    </Link>
                    <div className="h-8 w-px bg-white/5" />
                    <div className="flex flex-col min-w-[200px]">
                        <input
                            type="text"
                            value={pageName}
                            onChange={(e) => setPageName(e.target.value)}
                            className="font-black text-slate-100 bg-transparent border-none focus:ring-0 p-0 text-lg w-full placeholder:text-slate-700"
                        />
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                            URL Slug: <span className="text-primary-500">/{pageName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}</span>
                        </p>
                    </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-black/40 p-1 rounded-xl border border-white/5">
                    {['content', 'styles', 'preview'].map((tab: any) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === tab ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    {error && (
                        <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] text-red-500 font-bold animate-pulse">
                            {error}
                        </div>
                    )}
                    <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-all px-4 py-2 rounded-xl hover:bg-white/5">
                        <Eye size={18} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Preview</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={cn(
                            "flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-xl transition-all shadow-xl shadow-primary-500/20 font-black uppercase tracking-wider text-[10px] disabled:opacity-50 disabled:cursor-not-allowed",
                            saving ? "animate-pulse" : ""
                        )}
                    >
                        <Save size={18} />
                        <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Far Left Sidebar: Page List */}
                <aside className="w-64 border-r border-white/5 flex flex-col shrink-0 bg-[#0c0f12]">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Your Pages</h3>
                        <div className="space-y-1.5 overflow-y-auto max-h-[30vh] custom-scrollbar pr-2">
                            {pages.map(page => (
                                <Link
                                    key={page.id || page._id}
                                    to={`/pages/edit/${page.id || page._id}`}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl transition-all group",
                                        (id === (page.id || page._id)) ? "bg-primary-500/10 border border-primary-500/20" : "hover:bg-white/5 border border-transparent"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                        (id === (page.id || page._id)) ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" : "bg-slate-900 text-slate-500 group-hover:text-slate-300"
                                    )}>
                                        <FileText size={14} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className={cn(
                                            "text-xs font-bold truncate transition-all",
                                            (id === (page.id || page._id)) ? "text-primary-400" : "text-slate-400 group-hover:text-slate-200"
                                        )}>{page.name}</span>
                                        <span className="text-[9px] text-slate-600 font-bold truncate tracking-widest uppercase">/{page.slug}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <Link to="/pages/new" className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all border border-white/5 hover:border-white/10">
                            <Plus size={14} />
                            <span>Create Page</span>
                        </Link>
                    </div>
                </aside>

                <div className="flex-1 flex overflow-hidden">
                    {/* Secondary Sidebar - Tools */}
                    <aside className="w-80 glass border-r border-white/5 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                        <div className="p-6 space-y-8">
                            <section>
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Page Layout</h3>
                                <div className="grid grid-cols-1 gap-2.5">
                                    {[
                                        { id: 'default', label: 'Default', icon: LayoutIcon, desc: 'Header + Main + Footer' },
                                        { id: 'landing', label: 'Landing', icon: Monitor, desc: 'Full-width Canvas' },
                                        { id: 'minimal', label: 'Minimal', icon: FileText, desc: 'Clean Single Row' }
                                    ].map(layout => (
                                        <button
                                            key={layout.id}
                                            onClick={() => setPageLayout(layout.id as any)}
                                            className={cn(
                                                "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                                                pageLayout === layout.id ? "bg-primary-500/5 border-primary-500/30 ring-1 ring-primary-500/20" : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                                pageLayout === layout.id ? "bg-primary-500 text-white shadow-xl shadow-primary-500/20" : "bg-slate-900 text-slate-500"
                                            )}>
                                                <layout.icon size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={cn("text-xs font-black uppercase tracking-widest", pageLayout === layout.id ? "text-primary-400" : "text-slate-300")}>{layout.label}</span>
                                                <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">{layout.desc}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <div className="h-px bg-white/5" />

                            <section>
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Add Section</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <button onClick={addSection} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary-400 group-hover:border-primary-500/30 transition-all">
                                            <LayoutIcon size={18} />
                                        </div>
                                        <div>
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-200">New Content Section</span>
                                            <p className="text-[9px] text-slate-600 font-bold uppercase">Empty Canvas Area</p>
                                        </div>
                                    </button>
                                </div>
                            </section>

                            <div className="h-px bg-white/5" />

                            <section>
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Content Blocks</h3>
                                <p className="text-[9px] text-slate-600 font-black uppercase mb-4 tracking-widest leading-relaxed">Select a section on canvas<br />to enable block injection</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { type: 'text', label: 'Text', icon: Type },
                                        { type: 'image', label: 'Image', icon: ImageIcon },
                                        { type: 'video', label: 'Video', icon: Play },
                                        { type: 'button', label: 'Button', icon: Box },
                                        { type: 'product_list', label: 'Products', icon: Package }
                                    ].map(item => (
                                        <button
                                            key={item.type}
                                            disabled={selectedElement?.type !== 'section'}
                                            onClick={() => selectedElement?.type === 'section' && addBlock(selectedElement.id, item.type)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2 group",
                                                selectedElement?.type === 'section'
                                                    ? "bg-white/[0.02] border-white/5 hover:border-primary-500/50 hover:bg-primary-500/5"
                                                    : "opacity-20 grayscale border-white/5 cursor-not-allowed"
                                            )}
                                        >
                                            <item.icon className={cn("transition-colors", selectedElement?.type === 'section' ? "text-slate-400 group-hover:text-primary-400" : "text-slate-700")} size={18} />
                                            <span className={cn("text-[10px] font-black uppercase tracking-widest", selectedElement?.type === 'section' ? "text-slate-500 group-hover:text-slate-200" : "text-slate-800")}>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </aside>

                    {/* Main Canvas */}
                    <div className="flex-1 overflow-y-auto bg-[#080a0b] p-12 custom-scrollbar relative">
                        <div className="max-w-4xl mx-auto space-y-8 pb-32">
                            <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-8">
                                {sections.map((section) => (
                                    <Reorder.Item
                                        key={section.id}
                                        value={section}
                                        className={cn(
                                            "relative group transition-all",
                                            selectedElement?.id === section.id ? "ring-2 ring-primary-500/50 ring-offset-8 ring-offset-[#080a0b] rounded-3xl" : ""
                                        )}
                                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedElement({ type: 'section', id: section.id }); }}
                                    >
                                        <div className="absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <GripVertical className="text-slate-700 cursor-grab active:cursor-grabbing" size={20} />
                                        </div>

                                        <div className="bg-[#0c0f12] border border-white/5 rounded-3xl p-8 min-h-[160px] relative shadow-2xl transition-all group-hover:border-white/10">
                                            <div className="absolute -top-3 left-6 flex items-center gap-2">
                                                <div className="px-3 py-1 bg-slate-900 border border-white/5 rounded-full text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">
                                                    Section: {section.layout}
                                                </div>
                                            </div>

                                            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSections(sections.filter(s => s.id !== section.id)); }}
                                                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            {section.blocks.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Section Empty</p>
                                                    <p className="text-[9px] text-slate-800 font-bold uppercase mt-2">Add blocks from the tools sidebar</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    {section.blocks.map(block => (
                                                        <div
                                                            key={block.id}
                                                            className={cn(
                                                                "p-6 rounded-2xl border transition-all cursor-pointer group/block relative",
                                                                selectedElement?.id === block.id
                                                                    ? "bg-primary-500/5 border-primary-500/30 shadow-xl shadow-primary-500/10"
                                                                    : "border-transparent hover:bg-white/[0.02] hover:border-white/5"
                                                            )}
                                                            onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedElement({ type: 'block', id: block.id }); }}
                                                        >
                                                            <div className="absolute -top-2 -left-2 px-2 py-0.5 bg-slate-800 border border-white/5 rounded text-[8px] font-black text-slate-500 uppercase tracking-widest opacity-0 group-hover/block:opacity-100 transition-opacity z-20">
                                                                {block.type}
                                                            </div>

                                                            <div className="absolute top-2 right-2 opacity-0 group-hover/block:opacity-100 transition-opacity z-20">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); deleteBlock(section.id, block.id); }}
                                                                    className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/20 shadow-lg"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>

                                                            <div className="text-slate-300">
                                                                {block.type === 'text' && (
                                                                    <div style={{ textAlign: (block.content as any).alignment || 'left' }}>
                                                                        <h4 className="text-2xl font-black text-white mb-2">{(block.content as any).heading || 'New Heading'}</h4>
                                                                        <p className="text-slate-400 leading-relaxed text-sm">{(block.content as any).body || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}</p>
                                                                    </div>
                                                                )}
                                                                {block.type === 'image' && (
                                                                    <div className="aspect-[16/9] rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden border border-white/5 shadow-inner">
                                                                        {(block.content as any).url ? (
                                                                            <img src={(block.content as any).url} className="w-full h-full object-cover" alt="Preview" />
                                                                        ) : (
                                                                            <div className="flex flex-col items-center gap-3">
                                                                                <ImageIcon className="text-slate-800" size={48} />
                                                                                <span className="text-[9px] font-black uppercase text-slate-700 tracking-widest">No Image Configured</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {block.type === 'video' && (
                                                                    <div className="aspect-video rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden border border-white/5 relative">
                                                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                                                            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center border border-primary-500/40 backdrop-blur-sm">
                                                                                <Play className="text-primary-400 ml-1" size={28} />
                                                                            </div>
                                                                        </div>
                                                                        {(block.content as any).url ? (
                                                                            <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-24">Media Connected</div>
                                                                        ) : (
                                                                            <div className="text-[9px] text-slate-700 font-black uppercase tracking-widest mt-24">Video required</div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {block.type === 'button' && (
                                                                    <div className="flex justify-center py-4">
                                                                        <button className="px-10 py-4 bg-primary-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/30">
                                                                            {(block.content as any).text || 'Action Button'}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {block.type === 'product_list' && (
                                                                    <div className="grid grid-cols-2 gap-6 p-4">
                                                                        {[1, 2].map(i => (
                                                                            <div key={i} className="bg-slate-900/50 rounded-2xl p-4 border border-white/5 opacity-40">
                                                                                <div className="aspect-square bg-slate-800 rounded-xl mb-4" />
                                                                                <div className="h-4 bg-slate-800 rounded-lg w-3/4 mb-2" />
                                                                                <div className="h-3 bg-slate-800 rounded-lg w-1/4" />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>

                            <button
                                onClick={addSection}
                                className="w-full py-12 border-2 border-dashed border-white/5 rounded-3xl text-slate-600 hover:border-primary-500/30 hover:text-primary-400 transition-all flex flex-col items-center justify-center gap-3 group bg-white/[0.01]"
                            >
                                <div className="p-4 rounded-full bg-slate-900 border border-white/5 group-hover:bg-primary-500/10 group-hover:border-primary-500/30 group-hover:text-primary-400 transition-all">
                                    <Plus size={24} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add New Section</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Sidebar - Properties */}
                    <aside className="w-80 glass border-l border-white/5 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                        {selectedElement ? (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Edit {selectedElement.type}</h3>
                                    <code className="text-[9px] font-bold text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded tracking-tighter uppercase">{selectedElement.id}</code>
                                </div>

                                <div className="space-y-8">
                                    {selectedElement.type === 'block' && getSelectedBlock()?.type === 'text' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-3">Heading</label>
                                                <input
                                                    type="text"
                                                    value={(getSelectedBlock()?.content as any).heading || ''}
                                                    onChange={(e) => updateBlockContent('heading', e.target.value)}
                                                    placeholder="Enter heading..."
                                                    className="w-full px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:ring-2 focus:ring-primary-500 placeholder:text-slate-700"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-3">Body Text</label>
                                                <textarea
                                                    value={(getSelectedBlock()?.content as any).body || ''}
                                                    onChange={(e) => updateBlockContent('body', e.target.value)}
                                                    placeholder="Enter content..."
                                                    rows={5}
                                                    className="w-full px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:ring-2 focus:ring-primary-500 placeholder:text-slate-700 resize-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-3">Text Alignment</label>
                                                <div className="flex bg-slate-900/50 rounded-xl p-1 border border-white/5">
                                                    {['left', 'center', 'right'].map(align => (
                                                        <button
                                                            key={align}
                                                            onClick={() => updateBlockContent('alignment', align)}
                                                            className={cn(
                                                                "flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                                                                (getSelectedBlock()?.content as any).alignment === align
                                                                    ? "bg-primary-600 text-white shadow-xl shadow-primary-500/20"
                                                                    : "text-slate-500 hover:text-slate-300"
                                                            )}
                                                        >
                                                            {align}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {selectedElement.type === 'block' && getSelectedBlock()?.type === 'image' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-3">Image Source</label>
                                                <div className="space-y-3">
                                                    <input
                                                        type="text"
                                                        value={(getSelectedBlock()?.content as any).url || ''}
                                                        onChange={(e) => updateBlockContent('url', e.target.value)}
                                                        placeholder="Paste image link..."
                                                        className="w-full px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:ring-2 focus:ring-primary-500 placeholder:text-slate-700"
                                                    />
                                                    <button
                                                        onClick={() => imageInputRef.current?.click()}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600/10 hover:bg-primary-600/20 border border-primary-500/20 rounded-xl text-[10px] text-primary-400 font-black uppercase tracking-[0.2em] transition-all"
                                                    >
                                                        <Upload size={14} />
                                                        <span>Upload from Device</span>
                                                    </button>
                                                    <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e)} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-3">Alt Text</label>
                                                <input
                                                    type="text"
                                                    value={(getSelectedBlock()?.content as any).caption || ''}
                                                    onChange={(e) => updateBlockContent('caption', e.target.value)}
                                                    placeholder="Description for accessibility"
                                                    className="w-full px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {selectedElement.type === 'block' && getSelectedBlock()?.type === 'video' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-3">Video Source</label>
                                                <div className="space-y-3">
                                                    <input
                                                        type="text"
                                                        value={(getSelectedBlock()?.content as any).url || ''}
                                                        onChange={(e) => updateBlockContent('url', e.target.value)}
                                                        placeholder="YouTube or MP4 link..."
                                                        className="w-full px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-slate-200 focus:ring-2 focus:ring-primary-500 placeholder:text-slate-700"
                                                    />
                                                    <button
                                                        onClick={() => videoInputRef.current?.click()}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600/10 hover:bg-primary-600/20 border border-primary-500/20 rounded-xl text-[10px] text-primary-400 font-black uppercase tracking-[0.2em] transition-all"
                                                    >
                                                        <Upload size={14} />
                                                        <span>Upload Animation</span>
                                                    </button>
                                                    <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={(e) => handleFileUpload(e)} />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {selectedElement.type === 'block' && getSelectedBlock()?.type === 'button' && (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-3">Label</label>
                                                <input
                                                    type="text"
                                                    value={(getSelectedBlock()?.content as any).text || ''}
                                                    onChange={(e) => updateBlockContent('text', e.target.value)}
                                                    placeholder="e.g. Shop Harvest"
                                                    className="w-full px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-3">Destination URL</label>
                                                <input
                                                    type="text"
                                                    value={(getSelectedBlock()?.content as any).link || ''}
                                                    onChange={(e) => updateBlockContent('link', e.target.value)}
                                                    placeholder="/products"
                                                    className="w-full px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-slate-100 focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {selectedElement.type === 'block' && getSelectedBlock()?.type === 'product_list' && (
                                        <div className="p-4 bg-primary-600/5 rounded-2xl border border-primary-600/20">
                                            <p className="text-[10px] text-primary-400 font-black uppercase tracking-widest leading-loose">
                                                Automation Active:<br />This block syncs with your live inventory.
                                            </p>
                                        </div>
                                    )}

                                    {selectedElement.type === 'section' && (
                                        <div>
                                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-4">Container Style</label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {['boxed', 'full', 'split'].map(l => (
                                                    <button
                                                        key={l}
                                                        onClick={() => setSections(sections.map(s => s.id === selectedElement.id ? { ...s, layout: l as any } : s))}
                                                        className={cn(
                                                            "w-full py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-left transition-all border",
                                                            sections.find(s => s.id === selectedElement.id)?.layout === l
                                                                ? "bg-primary-600 text-white border-primary-500 shadow-xl shadow-primary-500/20"
                                                                : "bg-white/5 text-slate-500 border-white/5 hover:border-white/10"
                                                        )}
                                                    >
                                                        {l} Width
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#080a0b]/50">
                                <Box size={40} className="mb-6 text-slate-800" />
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 text-center">Empty Selection</h4>
                                <p className="text-[10px] text-slate-700 font-bold uppercase leading-relaxed tracking-widest">Select an element to<br />unlock its settings</p>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default PageEditor;
