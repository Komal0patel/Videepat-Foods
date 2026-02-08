import { useState } from 'react';
import { Save, Lock, Mail, Globe, MapPin, Store } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-100">Store Settings</h1>
                <p className="text-slate-400 mt-1">Manage global configurations and preferences.</p>
            </div>

            <div className="flex items-start gap-8">
                {/* Settings Sidebar */}
                <div className="w-64 shrink-0 glass rounded-2xl border border-white/5 p-2 space-y-1">
                    {['General', 'Security', 'Notifications', 'Integrations'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.toLowerCase() ? 'bg-primary-500/10 text-primary-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 glass rounded-2xl border border-white/5 p-8">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-200 mb-6">General Information</h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Store Name</label>
                                    <div className="relative">
                                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input type="text" defaultValue="My Village Store" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Support Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input type="email" defaultValue="support@villagestore.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Website URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input type="text" defaultValue="https://villagestore.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input type="text" defaultValue="Green Valley, CA" className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex justify-end">
                                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20">
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="text-center py-12 text-slate-500">
                            <Lock size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Security settings coming soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
