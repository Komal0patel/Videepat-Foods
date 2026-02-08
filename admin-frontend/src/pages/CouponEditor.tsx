import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Tag, Calendar, Users, DollarSign } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { cn } from '../utils/cn';
import type { Coupon } from '../types';

const CouponEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { coupons, addCoupon, updateCoupon } = useStore();
    const isNew = !id || id === 'new';

    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'percentage' as 'percentage' | 'flat',
        discount_value: '',
        min_cart_value: '',
        expiry_date: '',
        usage_limit: '',
        is_active: true
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew && id) {
            const coupon = coupons.find(c => c.id === id || c._id === id);
            if (coupon) {
                setFormData({
                    code: coupon.code,
                    discount_type: coupon.discount_type,
                    discount_value: coupon.discount_value.toString(),
                    min_cart_value: coupon.min_cart_value.toString(),
                    expiry_date: coupon.expiry_date || '',
                    usage_limit: coupon.usage_limit?.toString() || '',
                    is_active: coupon.is_active
                });
            }
        }
    }, [id, isNew, coupons]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const currentCoupon = coupons.find(c => c.id === id || c._id === id);
        const couponData: Coupon = {
            code: formData.code.toUpperCase(),
            discount_type: formData.discount_type,
            discount_value: Number(formData.discount_value),
            min_cart_value: Number(formData.min_cart_value),
            expiry_date: formData.expiry_date,
            usage_limit: Number(formData.usage_limit) || undefined,
            usage_count: isNew ? 0 : (currentCoupon?.usage_count || 0),
            is_active: formData.is_active,
            applied_to: { type: 'all', ids: [] }
        };

        try {
            if (isNew) {
                await addCoupon(couponData);
            } else if (id) {
                await updateCoupon(id, couponData);
            }
            navigate('/coupons');
        } catch (err) {
            console.error('Save coupon failed:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/coupons" className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-100">
                            {isNew ? 'Create Coupon' : 'Edit Coupon'}
                        </h1>
                        <p className="text-slate-400 mt-1">
                            {isNew ? 'Generate a new discount code.' : 'Update campaign details.'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className={cn(
                        "flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-xl transition-all shadow-lg shadow-primary-500/20 font-bold disabled:opacity-50 disabled:cursor-not-allowed",
                        saving ? "animate-pulse" : ""
                    )}
                >
                    <Save size={20} />
                    <span>{saving ? 'Saving...' : 'Save Coupon'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
                <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
                    <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <Tag size={18} className="text-primary-400" />
                        Campaign Details
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Coupon Code</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="e.g. SUMMER20"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-100 placeholder:text-slate-600 font-mono tracking-wider"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Discount Type</label>
                                <select
                                    value={formData.discount_type}
                                    onChange={e => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'flat' })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-100"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="flat">Flat Amount ($)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Value</label>
                                <input
                                    type="number"
                                    value={formData.discount_value}
                                    onChange={e => setFormData({ ...formData, discount_value: e.target.value })}
                                    placeholder="0"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Minimum Cart Value</label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="number"
                                    value={formData.min_cart_value}
                                    onChange={e => setFormData({ ...formData, min_cart_value: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-100"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
                    <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <Calendar size={18} className="text-primary-400" />
                        Limits & Validity
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Expiry Date</label>
                            <input
                                type="date"
                                value={formData.expiry_date}
                                onChange={e => setFormData({ ...formData, expiry_date: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-100 placeholder:text-slate-600 block"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Usage Limit (Max Uses)</label>
                            <div className="relative">
                                <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="number"
                                    value={formData.usage_limit}
                                    onChange={e => setFormData({ ...formData, usage_limit: e.target.value })}
                                    placeholder="Unlimited"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-100"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <label className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500 bg-transparent border-slate-500"
                                />
                                <span className="font-medium text-slate-200">Review status: {formData.is_active ? 'Active' : 'Inactive'}</span>
                            </label>
                            <p className="text-xs text-slate-500 mt-2 px-1">Uncheck this box to disable the coupon without deleting it.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CouponEditor;
