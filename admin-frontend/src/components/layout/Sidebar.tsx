import React from 'react';
import {
    LayoutDashboard,
    FileText,
    Package,
    Tag,
    Palette,
    Settings,
    ChevronRight,
    LogOut,
    ChevronLeft,
    Image
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Image, label: 'Hero Section', path: '/hero' },
        { icon: FileText, label: 'Page Builder', path: '/pages' },
        { icon: FileText, label: 'Village Stories', path: '/stories' },
        { icon: Package, label: 'Products', path: '/products' },
        { icon: Tag, label: 'Coupons', path: '/coupons' },
        { icon: Palette, label: 'Themes', path: '/theme' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className={cn(
            "h-screen glass border-r border-white/5 flex flex-col transition-all duration-300",
            isCollapsed ? "w-20" : "w-64"
        )}>
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Admin Panel</h1>}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                            isActive
                                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                                : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                        )}
                    >
                        <item.icon size={22} className={cn(
                            "transition-colors",
                            isCollapsed ? "mx-auto" : ""
                        )} />
                        {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button className="flex items-center gap-4 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200">
                    <LogOut size={22} className={isCollapsed ? "mx-auto" : ""} />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
