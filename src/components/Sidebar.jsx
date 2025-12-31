import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    FileUser,
    Calendar,
    Building2,
    ClipboardList,
    Star,
    Settings,
    LogOut,
    UserCircle,
    Lock
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuGroups = [
        {
            label: 'Principal',
            roles: ['ADMIN', 'ASSISTANT', 'FORMATEUR'],
            items: [
                {
                    label: 'Dashboard',
                    path: user?.role === 'ADMIN' ? '/admin/dashboard' : user?.role === 'ASSISTANT' ? '/assistant/dashboard' : '/formateur/dashboard',
                    icon: LayoutDashboard,
                    roles: ['ADMIN', 'ASSISTANT', 'FORMATEUR']
                }
            ]
        },
        {
            label: 'Académique',
            roles: ['ADMIN', 'ASSISTANT', 'FORMATEUR'],
            items: [
                { label: 'Catalogue', path: '/formations', icon: BookOpen, roles: ['ADMIN', 'ASSISTANT', 'FORMATEUR'] },
                { label: 'Inscriptions', path: '/admin/inscriptions', icon: ClipboardList, roles: ['ADMIN', 'ASSISTANT'] },
                {
                    label: 'Sessions',
                    path: user?.role === 'FORMATEUR' ? '/formateur/sessions' : '/admin/plannings',
                    icon: Calendar,
                    roles: ['ADMIN', 'ASSISTANT', 'FORMATEUR']
                },
            ]
        },
        {
            label: 'Ressources',
            roles: ['ADMIN', 'ASSISTANT'],
            items: [
                { label: 'Formateurs', path: '/admin/formateurs', icon: Users, roles: ['ADMIN'] },
                { label: 'Candidatures', path: '/admin/candidatures', icon: FileUser, roles: ['ADMIN'] },
                { label: 'Entreprises', path: '/admin/entreprises', icon: Building2, roles: ['ADMIN', 'ASSISTANT'] },
            ]
        },
        {
            label: 'Système',
            roles: ['ADMIN', 'FORMATEUR'],
            items: [
                { label: 'Mon Profil', path: '/profil', icon: Settings, roles: ['ADMIN', 'ASSISTANT', 'FORMATEUR'] },

                { label: 'Utilisateurs', path: '/admin/users', icon: UserCircle, roles: ['ADMIN'] },
                {
                    label: 'Évaluations',
                    path: user?.role === 'FORMATEUR' ? '/formateur/evaluations' : '/admin/evaluations',
                    icon: Star,
                    roles: ['ADMIN', 'FORMATEUR']
                },
            ]
        }
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 italic">
            {/* Brand Logo */}
            <div className="p-8 pb-12 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                    <BookOpen size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-black text-secondary-900 tracking-tighter">Formations<span className="text-primary-600">Gest</span>.</h1>
                    <p className="text-[8px] font-black uppercase text-gray-300 tracking-[0.3em]">Premium ERP</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 space-y-8 overflow-y-auto pb-8 custom-scrollbar">
                {menuGroups.map((group, groupIdx) => {
                    const groupItems = group.items.filter(item => item.roles.includes(user?.role));
                    if (groupItems.length === 0) return null;

                    return (
                        <div key={groupIdx} className="space-y-4">
                            <h3 className="px-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{group.label}</h3>
                            <div className="space-y-1">
                                {groupItems.map((item, itemIdx) => (
                                    <Link
                                        key={itemIdx}
                                        to={item.path}
                                        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[11px] font-black tracking-widest transition-all duration-300 group
                                            ${isActive(item.path)
                                                ? 'bg-primary-50 text-primary-600 shadow-sm'
                                                : 'text-gray-400 hover:text-secondary-900 hover:bg-gray-50'}`}
                                    >
                                        <item.icon size={18} className={`${isActive(item.path) ? 'text-primary-600' : 'text-gray-300 group-hover:text-secondary-900'} transition-colors`} />
                                        {item.label}
                                        {isActive(item.path) && (
                                            <span className="ml-auto w-1.5 h-1.5 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-6 border-t border-gray-50 bg-gray-50/30">
                <div className="flex items-center gap-4 mb-6 px-2">
                    <div className="w-10 h-10 bg-secondary-900 rounded-full flex items-center justify-center text-white text-sm font-black italic">
                        {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-black text-secondary-900 truncate">{user?.prenom} {user?.nom}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white border border-gray-200 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-red-500 hover:border-red-100 hover:bg-red-50/50 transition-all active:scale-95 group"
                >
                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
