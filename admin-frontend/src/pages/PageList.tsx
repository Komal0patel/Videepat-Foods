import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useStore } from '../context/StoreContext';

const PageList = () => {
    const { pages, deletePage } = useStore();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
                    <p className="text-slate-400 mt-1">Manage your website pages and content structure.</p>
                </div>
                <Link
                    to="/pages/new"
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary-500/20"
                >
                    <Plus size={20} />
                    <span>Create New Page</span>
                </Link>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/5">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-300">Page Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-300">Slug</th>
                            <th className="px-6 py-4 font-semibold text-slate-300">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-300">Visibility</th>
                            <th className="px-6 py-4 font-semibold text-slate-300">Last Updated</th>
                            <th className="px-6 py-4 font-semibold text-slate-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {pages.map((page) => (
                            <tr key={page._id || page.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <span className="font-medium text-slate-100">{page.name}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-400">/{page.slug}</td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-semibold",
                                        page.status === 'published' ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"
                                    )}>
                                        {page.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            page.is_active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-600"
                                        )} />
                                        <span className="text-sm">{page.is_active ? 'Visible' : 'Hidden'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">2024-03-20</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={`http://localhost:5174/page/${page.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                            title="View Page"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                        <Link to={`/pages/edit/${page._id || page.id}`} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-primary-400 transition-colors" title="Edit Content">
                                            <Edit2 size={18} />
                                        </Link>
                                        <button
                                            onClick={() => deletePage((page._id || page.id) || '')}
                                            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                            title="Delete Page"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Simple helper to avoid import issues for now
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

export default PageList;
