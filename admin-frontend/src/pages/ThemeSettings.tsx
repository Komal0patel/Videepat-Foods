import { useState } from 'react';
import { Palette, Check, Monitor, Moon, Sun } from 'lucide-react';

const ThemeSettings = () => {
    const [activeTheme, setActiveTheme] = useState('village');

    const themes = [
        { id: 'village', name: 'Village Earth', primary: '#5c8d37', bg: '#1a1e16', text: 'Earthy greens and warm browns.' },
        { id: 'modern', name: 'Modern Dark', primary: '#3b82f6', bg: '#0f172a', text: 'Sleek blue and slate tones.' },
        { id: 'sunset', name: 'Sunset Spice', primary: '#f97316', bg: '#2a1205', text: 'Warm orange and deep reds.' }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-100">Theme Customization</h1>
                <p className="text-slate-400 mt-1">Manage your store's visual appearance and branding.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        <Palette size={20} className="text-primary-400" />
                        Color Palettes
                    </h2>

                    <div className="space-y-4">
                        {themes.map(theme => (
                            <div
                                key={theme.id}
                                onClick={() => setActiveTheme(theme.id)}
                                className={`cursor-pointer group relative overflow-hidden rounded-xl border-2 transition-all p-4 flex items-center gap-4 ${activeTheme === theme.id ? 'border-primary-500 bg-white/5' : 'border-white/5 hover:border-white/20'}`}
                            >
                                <div className="w-12 h-12 rounded-full shadow-lg" style={{ backgroundColor: theme.primary }}></div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-200">{theme.name}</h3>
                                    <p className="text-xs text-slate-500">{theme.text}</p>
                                </div>
                                {activeTheme === theme.id && <Check size={20} className="text-primary-400" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        <Monitor size={20} className="text-primary-400" />
                        Appearance Mode
                    </h2>

                    <div className="grid grid-cols-3 gap-4">
                        <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-primary-500 bg-primary-500/10 text-primary-400">
                            <Moon size={24} />
                            <span className="text-sm font-medium">Dark</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors">
                            <Sun size={24} />
                            <span className="text-sm font-medium">Light</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-colors">
                            <Monitor size={24} />
                            <span className="text-sm font-medium">System</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all">
                    Save Theme Changes
                </button>
            </div>
        </div>
    );
};

export default ThemeSettings;
