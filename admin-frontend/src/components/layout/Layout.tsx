import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto h-screen p-8 custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
