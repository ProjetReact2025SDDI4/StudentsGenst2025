import React, { useContext, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';
import { Menu, Sun, Moon } from 'lucide-react';

const MainLayout = ({ theme = 'light', onToggleTheme }) => {
    const { user, loading } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-white dark:bg-secondary-900">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-gray-50 dark:border-secondary-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
        </div>
    );

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="flex bg-gray-50/30 dark:bg-secondary-950 min-h-screen relative overflow-hidden">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-secondary-900 border-b border-gray-100 dark:border-secondary-800 flex items-center justify-between px-6 z-40">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                        <Menu size={20} />
                    </div>
                    <h1 className="text-lg font-black text-secondary-900 dark:text-gray-50 tracking-tighter italic">Gest.</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onToggleTheme}
                        className="p-2 rounded-xl border border-gray-100 dark:border-secondary-700 bg-white/80 dark:bg-secondary-800 text-gray-500 dark:text-gray-200 hover:bg-primary-50/60 hover:text-primary-600 dark:hover:bg-secondary-700 transition-all"
                        aria-label="Basculer le thème"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-secondary-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-secondary-800 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-secondary-900/60 backdrop-blur-sm z-50 transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar with mobile support */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-[60] transform 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 transition-transform duration-300 ease-in-out
            `}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} theme={theme} onToggleTheme={onToggleTheme} />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full pt-16 lg:pt-0 max-h-screen overflow-y-auto custom-scrollbar">
                <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
