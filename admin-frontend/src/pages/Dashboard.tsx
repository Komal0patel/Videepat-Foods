import { useStore } from '../context/StoreContext';
import { ShoppingBag, FileText, Tag, DollarSign, ArrowUpRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product, Page, Coupon } from '../types';

const WEBSITE_URL = 'http://localhost:5173';

const resolveImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    if (url.startsWith('/assets')) return `${WEBSITE_URL}${url}`;
    return url;
};

const Dashboard = () => {

    const { products, pages, coupons } = useStore();

    // Calculate basic stats
    const totalProducts = products.length;
    const activeProducts = products.filter((p: Product) => p.is_active).length;
    const totalPages = pages.length;
    const activeCoupons = coupons.filter((c: Coupon) => c.is_active).length;

    const stats = [
        { label: 'Total Sales', value: '₹12,450', change: '+12%', icon: DollarSign, color: 'text-emerald-400' },
        { label: 'Active Products', value: activeProducts.toString(), change: `${totalProducts} Total`, icon: ShoppingBag, color: 'text-blue-400' },
        { label: 'Pages Published', value: pages.filter((p: Page) => p.status === 'published').length.toString(), change: `${totalPages} Total`, icon: FileText, color: 'text-purple-400' },
        { label: 'Active Coupons', value: activeCoupons.toString(), change: 'Campaigns', icon: Tag, color: 'text-orange-400' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-100">Dashboard</h1>
                <p className="text-slate-400 mt-1">Overview of your village store performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="glass p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="flex items-center text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                                {stat.change} <ArrowUpRight size={12} className="ml-1" />
                            </span>
                        </div>
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
                            <p className="text-3xl font-bold text-slate-100 mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Products */}
                <div className="lg:col-span-2 glass rounded-3xl border border-white/5 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-100">Recent Products</h2>
                        <Link to="/products" className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {products.slice(0, 4).map((product: Product) => (
                            <div key={product.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-slate-700 overflow-hidden">
                                    <img src={resolveImageUrl(product.images[0]) || ''} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-200">{product.name}</h4>
                                    <p className="text-xs text-slate-400">{product.category_ids[0]}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-100">₹{product.price}</p>
                                    <p className="text-xs text-emerald-400">{product.stock} in stock</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass rounded-3xl border border-white/5 p-6">
                    <h2 className="text-lg font-bold text-slate-100 mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link to="/products/new" className="w-full p-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2">
                            <Plus size={20} /> Add Product
                        </Link>
                        <Link to="/pages/new" className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-medium transition-colors flex items-center justify-center gap-2 border border-white/5">
                            <Plus size={18} className="text-slate-400" /> Create New Page
                        </Link>
                        <Link to="/coupons/new" className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-medium transition-colors flex items-center justify-center gap-2 border border-white/5">
                            <Tag size={18} className="text-slate-400" /> Launch Campaign
                        </Link>
                        <Link to="/stories/new" className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-medium transition-colors flex items-center justify-center gap-2 border border-white/5">
                            <FileText size={18} className="text-slate-400" /> Create Village Story
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
