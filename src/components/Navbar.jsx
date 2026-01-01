import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, LayoutDashboard, Sparkles, Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = ({ theme = 'light', onToggleTheme }) => {
    const { user, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleToggleTheme = () => {
        if (onToggleTheme) {
            onToggleTheme();
        }
    };

    return (
        <nav className="bg-white/80 dark:bg-secondary-950/80 backdrop-blur-xl border-b border-gray-50 dark:border-secondary-800 h-20 flex items-center sticky top-0 z-[100] italic">
            <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 flex justify-between items-center">

                {/* Brand */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 rounded-2xl bg-secondary-900 overflow-hidden shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-900" />
                        <div className="absolute -right-1 -top-1 w-6 h-6 rounded-xl border border-white/20 bg-white/10" />
                        <div className="absolute left-1 bottom-1 w-5 h-5 rounded-lg border border-white/30 bg-white/5" />
                        <div className="relative w-full h-full flex items-center justify-center">
                            <BookOpen size={18} className="text-white/80" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-secondary-900 dark:text-gray-50 tracking-tighter">
                            Formations<span className="text-primary-600">Gest</span>.
                        </h1>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-10">
                    <div className="flex items-center gap-8">
                        <Link to="/formations" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary-600 ${location.pathname === '/formations' ? 'text-primary-600' : 'text-gray-400 dark:text-gray-500'}`}>Catalogue</Link>
                        <Link to="/candidature" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary-600 ${location.pathname === '/candidature' ? 'text-primary-600' : 'text-gray-400 dark:text-gray-500'}`}>Recrutement</Link>
                    </div>

                    <div className="h-6 w-px bg-gray-100"></div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleToggleTheme}
                                    className="p-2.5 rounded-2xl border border-gray-100 dark:border-secondary-700 bg-white/80 dark:bg-secondary-900 text-gray-400 dark:text-gray-300 hover:text-secondary-900 hover:border-primary-200 hover:bg-primary-50/60 dark:hover:bg-secondary-800 transition-all flex items-center gap-2"
                                    aria-label="Basculer le thème"
                                >
                                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                                    <span className="text-[9px] font-black uppercase tracking-widest hidden xl:inline">
                                        {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                                    </span>
                                </button>
                                <Link
                                    to={user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'ASSISTANT' ? '/assistant/dashboard' : '/formateur/dashboard'}
                                    className="flex items-center gap-2 bg-secondary-900 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
                                >
                                    <LayoutDashboard size={14} />
                                    Tableau de bord
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 text-gray-300 hover:text-red-500 transition-colors"
                                    title="Déconnexion"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleToggleTheme}
                                    className="p-2.5 rounded-2xl border border-gray-100 dark:border-secondary-700 bg-white/80 dark:bg-secondary-900 text-gray-400 dark:text-gray-300 hover:text-secondary-900 hover:border-primary-200 hover:bg-primary-50/60 dark:hover:bg-secondary-800 transition-all flex items-center gap-2"
                                    aria-label="Basculer le thème"
                                >
                                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                                    <span className="text-[9px] font-black uppercase tracking-widest hidden xl:inline">
                                        {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                                    </span>
                                </button>
                                <Link
                                    to="/login"
                                    className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-secondary-900 dark:hover:text-primary-400 px-4 py-2 transition-all"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/candidature"
                                    className="flex items-center gap-2 bg-primary-100 text-primary-700 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all italic"
                                >
                                    <Sparkles size={14} /> Explorer
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden p-2 text-secondary-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-secondary-800 rounded-xl transition-colors"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-x-0 top-20 bg-white dark:bg-secondary-950 border-b border-gray-100 dark:border-secondary-800 shadow-2xl p-6 space-y-6 animate-slide-up z-[90]">
                    <div className="flex flex-col gap-4">
                        <Link 
                            to="/formations" 
                            onClick={() => setIsMenuOpen(false)}
                            className={`text-[11px] font-black uppercase tracking-[0.2em] p-4 rounded-xl ${location.pathname === '/formations' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 dark:text-gray-500'}`}
                        >
                            Catalogue
                        </Link>
                        <Link 
                            to="/candidature" 
                            onClick={() => setIsMenuOpen(false)}
                            className={`text-[11px] font-black uppercase tracking-[0.2em] p-4 rounded-xl ${location.pathname === '/candidature' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 dark:text-gray-500'}`}
                        >
                            Recrutement
                        </Link>
                    </div>
                    
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-50 dark:border-secondary-800">
                        <span>Thème</span>
                        <button
                            onClick={handleToggleTheme}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 dark:border-secondary-700 bg-gray-50 dark:bg-secondary-900 text-gray-500 dark:text-gray-200 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-secondary-800 transition-all"
                        >
                            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                            <span>{theme === 'dark' ? 'Clair' : 'Sombre'}</span>
                        </button>
                    </div>

                    <div className="pt-6 space-y-6">
                        {user ? (
                            <div className="flex flex-col gap-4">
                                <Link
                                    to={user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'ASSISTANT' ? '/assistant/dashboard' : '/formateur/dashboard'}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center gap-3 bg-secondary-900 text-white p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest"
                                >
                                    <LayoutDashboard size={16} />
                                    Tableau de bord
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center justify-center gap-3 text-red-500 p-4 rounded-2xl bg-red-50 text-[11px] font-black uppercase tracking-widest"
                                >
                                    <LogOut size={16} />
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-center p-4 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-secondary-700 rounded-2xl"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/candidature"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 bg-primary-600 text-white p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest"
                                >
                                    <Sparkles size={16} /> Explorer
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
