import { Plus, Trash2, Tag, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { cn } from '../utils/cn'; // Assuming this exists or I'll use local

const CouponList = () => {
    const { coupons, deleteCoupon } = useStore();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-100">Coupons & Offers</h1>
                    <p className="text-slate-400 mt-1">Create promotional codes and manage discounts.</p>
                </div>
                <Link
                    to="/coupons/new"
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary-500/20"
                >
                    <Plus size={20} />
                    <span>New Coupon</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {coupons.map((coupon) => (
                    <div key={coupon.id} className="glass rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold tracking-wider",
                                coupon.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                            )}>
                                {coupon.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 border border-primary-500/20">
                                <Tag size={32} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-2xl font-black tracking-tight text-white">{coupon.code}</h3>
                                    <button className="text-xs text-primary-400 hover:text-primary-300 font-bold">COPY</button>
                                </div>
                                <p className="text-slate-400 font-medium">
                                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `$${coupon.discount_value} FLAT OFF`} on orders above ${coupon.min_cart_value}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar size={16} />
                                        <span>Expires: {coupon.expiry_date || 'Never'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Users size={16} />
                                        <span>Usage: {coupon.usage_count}/{coupon.usage_limit || '∞'}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <Link to={`/coupons/edit/${coupon.id}`} className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all border border-white/5 text-center">Edit Details</Link>
                                    <button
                                        onClick={() => deleteCoupon(coupon.id || '')}
                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/10"
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

export default CouponList;
