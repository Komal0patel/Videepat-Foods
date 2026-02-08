import { useState, useEffect } from 'react';
import { Upload, Save, Eye, Image as ImageIcon } from 'lucide-react';

const API_URL = 'http://localhost:8000/api';

interface HeroData {
    _id?: string;
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
}

export default function HeroEditor() {
    const [hero, setHero] = useState<HeroData>({
        title: 'Fresh from Our Village',
        subtitle: 'Authentic flavors, delivered to your doorstep',
        description: 'Experience the taste of tradition with our handpicked selection of village-fresh products',
        backgroundImage: '/assets/hero.png',
        ctaText: 'Explore Our Products',
        ctaLink: '/products',
        secondaryCtaText: 'Our Story',
        secondaryCtaLink: '/story'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchHero();
    }, []);

    const fetchHero = async () => {
        try {
            const res = await fetch(`${API_URL}/hero/`);
            const data = await res.json();
            setHero(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching hero:', error);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const res = await fetch(`${API_URL}/hero/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(hero)
            });
            if (res.ok) {
                setMessage('Hero section updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Error saving hero section');
            }
        } catch (error) {
            console.error('Error saving hero:', error);
            setMessage('Error saving hero section');
        }
        setSaving(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setHero({ ...hero, backgroundImage: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Hero Section Editor</h1>
                <p className="text-gray-600">Customize the hero section on your home page</p>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
                    {message}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">

                {/* Background Image */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <ImageIcon className="inline mr-2" size={18} />
                        Background Image
                    </label>
                    <div className="space-y-4">
                        {hero.backgroundImage && (
                            <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                                <img
                                    src={hero.backgroundImage}
                                    alt="Hero Background"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex gap-4">
                            <label className="flex-1 cursor-pointer">
                                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg border-2 border-blue-200 hover:bg-blue-100 transition-colors">
                                    <Upload size={20} />
                                    <span className="font-medium">Upload New Image</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                            <input
                                type="text"
                                value={hero.backgroundImage}
                                onChange={(e) => setHero({ ...hero, backgroundImage: e.target.value })}
                                placeholder="Or enter image URL"
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Main Title
                    </label>
                    <input
                        type="text"
                        value={hero.title}
                        onChange={(e) => setHero({ ...hero, title: e.target.value })}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Fresh from Our Village"
                    />
                </div>

                {/* Subtitle */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Subtitle
                    </label>
                    <input
                        type="text"
                        value={hero.subtitle}
                        onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Authentic flavors, delivered to your doorstep"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={hero.description}
                        onChange={(e) => setHero({ ...hero, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Experience the taste of tradition..."
                    />
                </div>

                {/* Primary CTA */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Primary Button Text
                        </label>
                        <input
                            type="text"
                            value={hero.ctaText}
                            onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Explore Our Products"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Primary Button Link
                        </label>
                        <input
                            type="text"
                            value={hero.ctaLink}
                            onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="/products"
                        />
                    </div>
                </div>

                {/* Secondary CTA */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Secondary Button Text
                        </label>
                        <input
                            type="text"
                            value={hero.secondaryCtaText}
                            onChange={(e) => setHero({ ...hero, secondaryCtaText: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Our Story"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Secondary Button Link
                        </label>
                        <input
                            type="text"
                            value={hero.secondaryCtaLink}
                            onChange={(e) => setHero({ ...hero, secondaryCtaLink: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="/story"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <a
                        href="http://localhost:5173"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        <Eye size={20} />
                        Preview Website
                    </a>
                </div>
            </div>

            {/* Preview Section */}
            <div className="mt-8 bg-gray-50 rounded-xl p-8 border-2 border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
                <div className="relative h-96 rounded-lg overflow-hidden">
                    <img
                        src={hero.backgroundImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-8">
                        <h1 className="text-5xl font-black mb-4 text-center">{hero.title}</h1>
                        <p className="text-2xl mb-2 text-center">{hero.subtitle}</p>
                        <p className="text-lg mb-8 text-center max-w-2xl opacity-90">{hero.description}</p>
                        <div className="flex gap-4">
                            <div className="px-6 py-3 bg-green-600 rounded-full font-bold">
                                {hero.ctaText}
                            </div>
                            <div className="px-6 py-3 border-2 border-white rounded-full font-bold">
                                {hero.secondaryCtaText}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
