import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, UserCircle, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-50 h-20 flex items-center sticky top-0 z-[100] italic">
            <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 flex justify-between items-center">

                {/* Brand */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-secondary-900 tracking-tighter">Formations<span className="text-primary-600">Gest</span>.</h1>
                    </div>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-10">
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/formations" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary-600 ${location.pathname === '/formations' ? 'text-primary-600' : 'text-gray-400'}`}>Catalogue</Link>
                        <Link to="/candidature" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary-600 ${location.pathname === '/candidature' ? 'text-primary-600' : 'text-gray-400'}`}>Recrutement</Link>
                    </div>

                    <div className="h-6 w-px bg-gray-100 hidden md:block"></div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
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
                                <Link
                                    to="/login"
                                    className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary-900 px-4 py-2 transition-all"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/candidature"
                                    className="hidden sm:flex items-center gap-2 bg-primary-100 text-primary-700 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all italic italic"
                                >
                                    <Sparkles size={14} /> Explorer
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
