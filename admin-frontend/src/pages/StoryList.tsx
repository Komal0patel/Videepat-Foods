import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const WEBSITE_URL = 'http://localhost:5173';

const resolveImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    if (url.startsWith('/assets')) return `${WEBSITE_URL}${url}`;
    return url;
};

const StoryList = () => {
    const { stories, deleteStory } = useStore();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Village Stories</h1>
                    <p className="text-slate-400 mt-1">Manage the narrative of your village and traditions.</p>
                </div>
                <Link
                    to="/stories/new"
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary-500/20"
                >
                    <Plus size={20} />
                    <span>Create New Story</span>
                </Link>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/5">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-300 whitespace-nowrap">Story</th>
                            <th className="px-6 py-4 font-semibold text-slate-300">Excerpt</th>
                            <th className="px-6 py-4 font-semibold text-slate-300">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {stories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    No stories found. Create your first village story!
                                </td>
                            </tr>
                        ) : (
                            stories.map((story) => (
                                <tr key={story.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 min-w-[300px]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800 border border-white/5">
                                                {story.thumbnailImage ? (
                                                    <img src={resolveImageUrl(story.thumbnailImage)} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                        <ImageIcon size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-100">{story.title}</div>
                                                <div className="text-sm text-slate-500">{story.subtitle}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-400 line-clamp-2 max-w-md">
                                            {story.shortExcerpt}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                story.is_active ? "bg-emerald-500" : "bg-slate-600"
                                            )} />
                                            <span className="text-sm">{story.is_active ? 'Active' : 'Draft'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/stories/edit/${story.id || story._id}`}
                                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-primary-400 transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </Link>
                                            <button
                                                onClick={() => story.id && deleteStory(story.id)}
                                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

export default StoryList;
