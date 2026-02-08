import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save, Upload, IndianRupee, Package, Tag, Info, Play, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { cn } from '../utils/cn';
import type { Product } from '../types';

const WEBSITE_URL = 'http://localhost:5173';

const resolveImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    if (url.startsWith('/assets')) return `${WEBSITE_URL}${url}`;
    return url;
};


const ProductEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addProduct, updateProduct, categories } = useStore();
    const isNew = !id || id === 'new';

    // Local form state handles "image" as string and "price/stock" as string for input handling
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: categories[0]?.name || 'Organic', // Selected category
        image: '',         // Main image URL or base64
        video: '',         // Video URL or base64
        is_active: true
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew && id) {
            const product = products.find(p => p.id === id || p._id === id);
            if (product) {
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price.toString(),
                    stock: product.stock.toString(),
                    category: product.category_ids[0] || (categories[0] ? (categories[0].name || '') : 'Organic'),
                    image: product.images[0] || '',
                    video: product.videos ? product.videos[0] : '',
                    is_active: product.is_active
                });
            }
        }
    }, [id, isNew, products, categories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const productData: Product = {
            name: formData.name,
            description: formData.description,
            price: Number(formData.price) || 0,
            stock: Number(formData.stock) || 0,
            category_ids: [formData.category],
            images: formData.image ? [formData.image] : [],
            videos: formData.video ? [formData.video] : [],
            is_active: formData.is_active,
            attributes: {}
        };

        try {
            if (isNew) {
                await addProduct(productData);
            } else if (id) {
                await updateProduct(id, productData);
            }
            navigate('/products');
        } catch (err) {
            console.error('Save product failed:', err);
        } finally {
            setSaving(false);
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, video: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link to="/products" className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-100">
                            {isNew ? 'Add New Product' : 'Edit Product'}
                        </h1>
                        <p className="text-slate-400 mt-1">
                            {isNew ? 'Create a new item for your village menu.' : 'Update product details.'}
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
                    <span>{saving ? 'Saving...' : 'Save Product'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
                        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <Info size={18} className="text-primary-400" />
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Grandma's Chicken Curry"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-100 placeholder:text-slate-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the taste, ingredients, and story..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-100 placeholder:text-slate-600 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
                        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <Upload size={18} className="text-primary-400" />
                            Media
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image Upload */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-400">Main Image</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:border-primary-500/30 hover:bg-white/5 transition-all cursor-pointer group aspect-video relative overflow-hidden"
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    {formData.image ? (
                                        <>
                                            <img src={resolveImageUrl(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-xs font-medium">Change Image</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={20} className="text-slate-400 mb-2" />
                                            <p className="text-xs font-medium text-slate-300">Upload Image</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="Image URL..."
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 text-xs"
                                />
                            </div>

                            {/* Video Upload */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-slate-400">Product Video</label>
                                <div
                                    onClick={() => videoInputRef.current?.click()}
                                    className="border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:border-primary-500/30 hover:bg-white/5 transition-all cursor-pointer group aspect-video relative overflow-hidden"
                                >
                                    <input
                                        type="file"
                                        ref={videoInputRef}
                                        onChange={handleVideoUpload}
                                        className="hidden"
                                        accept="video/*"
                                    />
                                    {formData.video ? (
                                        <>
                                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                <Play size={32} className="text-primary-400" />
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, video: '' })); }}
                                                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-xs font-medium">Change Video</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Play size={20} className="text-slate-400 mb-2" />
                                            <p className="text-xs font-medium text-slate-300">Upload Video</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={formData.video}
                                    onChange={e => setFormData({ ...formData, video: e.target.value })}
                                    placeholder="Video URL (YouTube/MP4)..."
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Right Column - Organization & Pricing */}
                <div className="space-y-6">
                    <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
                        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <IndianRupee size={18} className="text-primary-400" />
                            Pricing & Stock
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Price (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Stock Quantity</label>
                                <div className="relative">
                                    <Package size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        placeholder="0"
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
                        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <Tag size={18} className="text-primary-400" />
                            Category
                        </h2>

                        <div className="space-y-2">
                            {categories.map(cat => (
                                <label key={cat.id} className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:bg-white/5 cursor-pointer transition-all">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={formData.category === cat.name}
                                        onChange={() => setFormData({ ...formData, category: cat.name })}
                                        className="w-4 h-4 text-primary-500 border-slate-600 focus:ring-primary-500 bg-transparent"
                                    />
                                    <span className="text-sm font-medium text-slate-300">{cat.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductEditor;
