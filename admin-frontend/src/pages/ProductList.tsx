import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Tag, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useStore } from '../context/StoreContext';

const WEBSITE_URL = 'http://localhost:5173';

const resolveImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    if (url.startsWith('/assets')) return `${WEBSITE_URL}${url}`;
    return url;
};


const ProductList = () => {
    const { products, deleteProduct, categories, addCategory, deleteCategory } = useStore();
    const [showCatManager, setShowCatManager] = useState(false);
    const [newCatName, setNewCatName] = useState('');

    const handleAddCategory = () => {
        if (!newCatName.trim()) return;
        addCategory({ name: newCatName.trim(), is_active: true });
        setNewCatName('');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-slate-400 mt-1">Manage your menu items, pricing, and stock.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCatManager(!showCatManager)}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl border border-white/10 transition-all"
                    >
                        <Tag size={20} />
                        <span>Categories</span>
                    </button>
                    <Link
                        to="/products/new"
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary-500/20"
                    >
                        <Plus size={20} />
                        <span>Add Product</span>
                    </Link>
                </div>
            </div>

            {/* Category Manager Panel */}
            {showCatManager && (
                <div className="p-6 glass rounded-2xl border border-primary-500/20 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Tag size={20} className="text-primary-400" />
                            Manage Categories
                        </h2>
                        <button onClick={() => setShowCatManager(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex gap-3 mb-6">
                        <input
                            type="text"
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            placeholder="Category name (e.g. Desserts)"
                            className="flex-1 px-4 py-2 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <button
                            onClick={handleAddCategory}
                            className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-xl font-bold transition-all"
                        >
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <div key={cat.id} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/5 hover:border-white/20 transition-all group">
                                <span className="text-sm font-medium">{cat.name}</span>
                                <button
                                    onClick={() => deleteCategory(cat.id || '')}
                                    className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-slate-400 hover:text-white transition-all">
                    <Filter size={18} />
                    <span>Filters</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="glass rounded-2xl overflow-hidden border border-white/5 group hover:border-primary-500/30 transition-all">
                        <div className="h-48 relative overflow-hidden">
                            <img
                                src={resolveImageUrl(product.images[0])}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold tracking-wider",
                                    product.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                                )}>
                                    {product.is_active ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-100">{product.name}</h3>
                                    <span className="text-xs text-slate-500">{product.category_ids[0]}</span>
                                </div>
                                <span className="text-xl font-bold text-primary-400">₹{Number(product.price).toFixed(2)}</span>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Stock</span>
                                    <span className={cn(
                                        "font-bold",
                                        product.stock > 0 ? "text-slate-200" : "text-red-500"
                                    )}>{product.stock} units</span>
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/products/edit/${product.id}`} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                                        <Edit2 size={18} />
                                    </Link>
                                    <button
                                        onClick={() => deleteProduct(product.id || '')}
                                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Local cn helper
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

export default ProductList;

