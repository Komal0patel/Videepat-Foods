import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    Play,
    GripVertical,
    Trash2,
    Layout as LayoutIcon,
    Heading1,
    Heading2,
    AlignLeft,
    Upload
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Reorder } from 'framer-motion';
import type { Story, StoryContent } from '../types';

const PALETTE_ITEMS = [
    { type: 'heading', icon: Heading1, label: 'Main Heading', description: 'Large cinematic title' },
    { type: 'subheading', icon: Heading2, label: 'Sub-heading', description: 'Section divider' },
    { type: 'text', icon: AlignLeft, label: 'Paragraph', description: 'Rich storytelling text' },
    { type: 'image', icon: ImageIcon, label: 'Image', description: 'High-quality photo' },
    { type: 'video', icon: Play, label: 'Video', description: 'Cinematic video clip' },
];

const WEBSITE_URL = 'http://localhost:5173';

const resolveImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    if (url.startsWith('/assets')) return `${WEBSITE_URL}${url}`;
    return url;
};

const StoryEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { stories, addStory, updateStory } = useStore();
    const isNew = !id || id === 'new';

    const [storyData, setStoryData] = useState<Story>({
        title: '',
        subtitle: '',
        thumbnailImage: '',
        heroImage: '',
        shortExcerpt: '',
        fullStoryContent: [],
        is_active: true
    });

    const [isSaving, setIsSaving] = useState(false);
    const [draggingType, setDraggingType] = useState<string | null>(null);

    useEffect(() => {
        if (!isNew && id) {
            const story = stories.find(s => (s.id === id || s._id === id));
            if (story) {
                setStoryData({
                    ...story,
                    fullStoryContent: (story.fullStoryContent || []).map(block => ({
                        ...block,
                        id: block.id || (block as any)._id || `blk_${Math.random().toString(36).substr(2, 9)}`
                    }))
                });
            }
        }
    }, [id, isNew, stories]);

    const handleSave = async () => {
        if (!storyData.title) {
            alert('Please enter a story title.');
            return;
        }
        if (!storyData.thumbnailImage) {
            alert('Please upload a Card Thumbnail image.');
            return;
        }
        if (!storyData.heroImage) {
            alert('Please upload a Hero Background image.');
            return;
        }
        if (!storyData.shortExcerpt) {
            alert('Please provide a Short Excerpt for the preview.');
            return;
        }

        setIsSaving(true);
        try {
            if (isNew) {
                await addStory(storyData);
            } else if (id) {
                await updateStory(id!, storyData);
            }
            navigate('/stories');
        } catch (err: any) {
            console.error(err);
            alert(`Failed to save story: ${err.message || 'Unknown error'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const addBlock = (type: string, index?: number) => {
        const newBlock: StoryContent = {
            id: `blk_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: type as any,
            content: (type === 'text' || type === 'heading' || type === 'subheading') ? '' : undefined,
            url: (type === 'image' || type === 'video') ? '' : undefined,
            caption: (type === 'image' || type === 'video') ? '' : undefined
        };

        const newContent = [...storyData.fullStoryContent];
        if (typeof index === 'number') {
            newContent.splice(index, 0, newBlock);
        } else {
            newContent.push(newBlock);
        }

        setStoryData({ ...storyData, fullStoryContent: newContent });
    };

    const updateBlock = (blockId: string, updates: Partial<StoryContent>) => {
        setStoryData({
            ...storyData,
            fullStoryContent: storyData.fullStoryContent.map(blk =>
                blk.id === blockId ? { ...blk, ...updates } : blk
            )
        });
    };

    const removeBlock = (blockId: string) => {
        setStoryData({
            ...storyData,
            fullStoryContent: storyData.fullStoryContent.filter(blk => blk.id !== blockId)
        });
    };

    const handleFileUpload = (blockId: string, file: File | undefined, field: 'url' | 'thumbnailImage' | 'heroImage') => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            if (blockId === 'root') {
                setStoryData(prev => ({ ...prev, [field]: base64 }));
            } else {
                updateBlock(blockId, { [field]: base64 });
            }
        };
        reader.readAsDataURL(file);
    };

    // Drag-from-palette logic
    const onPaletteDragStart = (type: string) => {
        setDraggingType(type);
    };

    const onPaletteDragEnd = () => {
        setDraggingType(null);
    };

    const onDropOnZone = (index: number) => {
        if (draggingType) {
            addBlock(draggingType, index);
            setDraggingType(null);
        }
    };

    const DropZone = ({ index, label }: { index: number, label?: string }) => {
        const [isOver, setIsOver] = useState(false);

        return (
            <div
                onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
                onDragLeave={() => setIsOver(false)}
                onDrop={() => { setIsOver(false); onDropOnZone(index); }}
                className={`relative transition-all duration-300 ${isOver ? 'py-12' : 'py-2'} group`}
            >
                <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-300 ${isOver ? 'bg-primary-500 scale-x-100 opacity-100' : 'bg-white/5 scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-20'}`} />
                {isOver && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-primary-500 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary-500/50 animate-bounce">
                            DROP TO INSERT {draggingType?.toUpperCase()}
                        </div>
                    </div>
                )}
                {!isOver && label && (
                    <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => addBlock('text', index)}
                            className="bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 px-4 py-1.5 rounded-full border border-white/5 transition-all"
                        >
                            + Click to Insert Section
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-screen bg-slate-950 text-slate-200 flex flex-col overflow-hidden">
            {/* Top Navigation */}
            <div className="sticky top-0 z-50 glass border-b border-white/5 py-4 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/stories" className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black text-white mb-0.5 tracking-tight">{isNew ? 'Create New Story' : 'Story Workspace'}</h1>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{storyData.title || 'Untitled Narrative'}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-primary-500/20 transition-all active:scale-95 group"
                    >
                        {isSaving ? <Upload className="animate-bounce" size={18} /> : <Save className="group-hover:rotate-12 transition-transform" size={18} />}
                        <span>{isNew ? 'PUBLISH STORY' : 'SAVE CHANGES'}</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Drag Palette */}
                <aside className="w-80 shrink-0 glass border-r border-white/5 flex flex-col p-8 space-y-8 overflow-y-auto hidden lg:flex select-none custom-scrollbar">
                    <section>
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Visual Library</h3>
                        <div className="space-y-4">
                            {PALETTE_ITEMS.map((item) => (
                                <div
                                    key={item.type}
                                    draggable
                                    onDragStart={() => onPaletteDragStart(item.type)}
                                    onDragEnd={onPaletteDragEnd}
                                    onClick={() => addBlock(item.type)}
                                    className="flex items-center gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 cursor-grab active:cursor-grabbing hover:bg-white/[0.05] hover:border-primary-500/30 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary-400 group-hover:border-primary-500/30 transition-all shadow-xl">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-200 group-hover:text-white uppercase tracking-tight">{item.label}</p>
                                        <p className="text-[10px] text-slate-600 group-hover:text-slate-400 font-bold">{item.description}</p>
                                    </div>
                                    <div className="ml-auto text-slate-700 group-hover:text-primary-500 transition-colors">
                                        <GripVertical size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="mt-auto p-6 bg-primary-500/5 border border-primary-500/10 rounded-3xl">
                        <p className="text-[10px] text-primary-400/80 leading-relaxed font-bold uppercase tracking-widest mb-2">Instructions</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                            DRAG an element from here and DROP it into the story timeline. You can also reorder existing sections by dragging the handles.
                        </p>
                    </div>
                </aside>

                {/* Main Story Canvas */}
                <main className="flex-1 overflow-y-auto bg-[#080a06] p-8 lg:px-24 lg:py-16 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-16">
                        {/* Story Identity */}
                        <section className="space-y-12">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">Story Title</label>
                                <input
                                    type="text"
                                    value={storyData.title}
                                    onChange={e => setStoryData({ ...storyData, title: e.target.value })}
                                    className="w-full bg-transparent border-none p-0 text-6xl font-black text-white placeholder:text-slate-900 outline-none focus:ring-0 leading-[1.1] tracking-tight"
                                    placeholder="The Legend of..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Subtitle / Tagline</label>
                                        <input
                                            type="text"
                                            value={storyData.subtitle}
                                            onChange={e => setStoryData({ ...storyData, subtitle: e.target.value })}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none font-bold"
                                            placeholder="Write something evocative..."
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Short Excerpt (Search Friendly)</label>
                                        <textarea
                                            value={storyData.shortExcerpt}
                                            onChange={e => setStoryData({ ...storyData, shortExcerpt: e.target.value })}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-5 text-slate-300 focus:ring-2 focus:ring-primary-500 transition-all outline-none resize-none h-40 leading-relaxed"
                                            placeholder="Summarize the soul of this story..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Cinematic Covers</label>
                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Thumbnail Browse */}
                                        <div className="group relative aspect-square rounded-[2rem] bg-slate-900 border-2 border-dashed border-white/5 hover:border-primary-500/40 transition-all overflow-hidden cursor-pointer shadow-2xl">
                                            {storyData.thumbnailImage ? (
                                                <img src={resolveImageUrl(storyData.thumbnailImage)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 p-6 text-center">
                                                    <Upload size={28} className="mb-3 opacity-20" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Browse Card Thumbnail</span>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={e => handleFileUpload('root', e.target.files?.[0], 'thumbnailImage')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            {storyData.thumbnailImage && (
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                    <span className="text-[9px] font-black text-white bg-primary-600 px-4 py-2 rounded-full tracking-widest">CHANGE FILE</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Hero Browse */}
                                        <div className="group relative aspect-square rounded-[2rem] bg-slate-900 border-2 border-dashed border-white/5 hover:border-primary-500/40 transition-all overflow-hidden cursor-pointer shadow-2xl">
                                            {storyData.heroImage ? (
                                                <img src={resolveImageUrl(storyData.heroImage)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 p-6 text-center">
                                                    <ImageIcon size={28} className="mb-3 opacity-20" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Browse Hero Background</span>
                                                </div>
                                            )}
                                            <input type="file" accept="image/*" onChange={e => handleFileUpload('root', e.target.files?.[0], 'heroImage')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            {storyData.heroImage && (
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                    <span className="text-[9px] font-black text-white bg-primary-600 px-4 py-2 rounded-full tracking-widest">CHANGE FILE</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-slate-700 italic font-medium">Card image is for the preview grid. Hero image is for the immersive details header.</p>
                                </div>
                            </div>
                        </section>

                        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent w-full" />

                        {/* Story Builder Timeline */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="h-px flex-1 bg-white/5" />
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Chronological Narrative</h3>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>

                            <div className="space-y-6">
                                {storyData.fullStoryContent.length === 0 && (
                                    <div className="py-24 flex flex-col items-center justify-center text-slate-800 space-y-8 select-none">
                                        <div className="w-32 h-32 rounded-full bg-white/[0.01] border border-white/5 flex items-center justify-center shadow-inner">
                                            <LayoutIcon size={48} className="opacity-10" />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <p className="font-black text-slate-700 uppercase tracking-widest text-sm">Narrative Canvas is Empty</p>
                                            <p className="text-xs max-w-xs text-slate-800 font-bold uppercase tracking-tight">Your story's heart is beating, add some chapters to bring it to life.</p>
                                        </div>
                                    </div>
                                )}

                                <Reorder.Group axis="y" values={storyData.fullStoryContent} onReorder={(newOrder) => setStoryData({ ...storyData, fullStoryContent: newOrder })} className="space-y-4">
                                    <DropZone index={0} label="Start Story Here" />
                                    {storyData.fullStoryContent.map((block, idx) => (
                                        <Reorder.Item
                                            key={block.id}
                                            value={block}
                                            className="group relative"
                                        >
                                            {/* Side Controls */}
                                            <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                                                <div className="p-3 glass rounded-2xl cursor-grab active:cursor-grabbing border border-white/10 shadow-2xl">
                                                    <GripVertical size={20} className="text-primary-500" />
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                                                    className="p-3 glass rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-2xl"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-[2.5rem] p-10 transition-all relative group-focus-within:border-primary-500/30">
                                                <div className="flex items-center gap-3 mb-8">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-500 bg-primary-500/10 px-4 py-1.5 rounded-full border border-primary-500/20 shadow-lg">
                                                        {block.type} BLOCK
                                                    </span>
                                                    <div className="h-px flex-1 bg-white/5" />
                                                </div>

                                                {/* Block Editors */}
                                                {block.type === 'heading' && (
                                                    <input
                                                        type="text"
                                                        value={block.content}
                                                        onChange={e => updateBlock(block.id, { content: e.target.value })}
                                                        className="w-full bg-transparent border-none p-0 text-4xl font-black text-white placeholder:text-slate-900 outline-none italic"
                                                        placeholder="Chapter Title..."
                                                    />
                                                )}

                                                {block.type === 'subheading' && (
                                                    <input
                                                        type="text"
                                                        value={block.content}
                                                        onChange={e => updateBlock(block.id, { content: e.target.value })}
                                                        className="w-full bg-transparent border-none p-0 text-2xl font-bold text-primary-400 placeholder:text-slate-900 outline-none"
                                                        placeholder="Section Theme..."
                                                    />
                                                )}

                                                {block.type === 'text' && (
                                                    <textarea
                                                        value={block.content}
                                                        onChange={e => updateBlock(block.id, { content: e.target.value })}
                                                        className="w-full bg-transparent border-none p-0 text-slate-300 placeholder:text-slate-900 outline-none resize-none leading-relaxed text-xl font-medium"
                                                        rows={Math.max(4, block.content?.split('\n').length || 0)}
                                                        placeholder="Describe the moment in detail..."
                                                    />
                                                )}

                                                {(block.type === 'image' || block.type === 'video') && (
                                                    <div className="space-y-10">
                                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                                            <div className="lg:col-span-7 space-y-6">
                                                                <div className="group relative aspect-video rounded-3xl bg-slate-950 border-2 border-dashed border-white/5 hover:border-primary-500/40 transition-all overflow-hidden flex flex-col items-center justify-center text-slate-700 shadow-inner">
                                                                    {block.url ? (
                                                                        block.type === 'image' ? (
                                                                            <img src={resolveImageUrl(block.url)} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center bg-black/60">
                                                                                <Play size={64} className="text-primary-500 animate-pulse" />
                                                                            </div>
                                                                        )
                                                                    ) : (
                                                                        <>
                                                                            <Upload size={48} className="mb-4 opacity-10" />
                                                                            <span className="text-[10px] font-black uppercase tracking-widest">Browse {block.type} file</span>
                                                                        </>
                                                                    )}
                                                                    <input type="file" accept={block.type === 'image' ? "image/*" : "video/*"} onChange={e => handleFileUpload(block.id, e.target.files?.[0], 'url')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                                </div>
                                                                <div className="flex flex-col gap-3">
                                                                    <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest pl-2">Media URL Link</label>
                                                                    <input
                                                                        type="text"
                                                                        value={block.url}
                                                                        onChange={e => updateBlock(block.id, { url: e.target.value })}
                                                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-3 text-xs text-slate-500 outline-none focus:border-primary-500/50"
                                                                        placeholder="https://..."
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="lg:col-span-5 space-y-4">
                                                                <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest block pl-2">Description / Label</label>
                                                                <textarea
                                                                    value={block.caption}
                                                                    onChange={e => updateBlock(block.id, { caption: e.target.value })}
                                                                    className="w-full bg-white/[0.03] border border-white/5 rounded-[2rem] px-6 py-6 text-sm text-slate-400 outline-none focus:border-primary-500/50 resize-none h-full min-h-[150px] leading-relaxed"
                                                                    placeholder="Context matters. Add a poetic description for this visual block..."
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <DropZone index={idx + 1} />
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            {/* Mobile Tool Palette */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
                <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] flex items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    {PALETTE_ITEMS.map(item => (
                        <button
                            key={item.type}
                            onClick={() => addBlock(item.type)}
                            className="p-4 bg-white/5 hover:bg-primary-500 text-slate-300 hover:text-white rounded-3xl transition-all active:scale-90"
                        >
                            <item.icon size={22} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoryEditor;
