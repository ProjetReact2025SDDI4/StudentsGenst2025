import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    Mail,
    Lock,
    ChevronRight,
    BookOpen,
    ShieldCheck,
    ArrowLeft,
    Sparkles
} from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await login(credentials);
            if (user.role === 'ADMIN') navigate('/admin/dashboard');
            else if (user.role === 'ASSISTANT') navigate('/assistant/dashboard');
            else if (user.role === 'FORMATEUR') navigate('/formateur/dashboard');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Identifiants invalides');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row italic">
            {/* Brand/Visual Side */}
            <div className="hidden md:flex md:w-1/2 bg-secondary-900 relative overflow-hidden items-center justify-center p-20">
                {/* Background effects */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600 rounded-full blur-[140px] opacity-20"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[140px] opacity-10"></div>
                </div>

                <div className="relative z-10 max-w-lg space-y-12">
                    <div className="flex items-center gap-4 animate-fade-in italic">
                        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-500/20">
                            <BookOpen size={36} />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter italic">Formations<span className="text-primary-600">Gest</span>.</h1>
                    </div>

                    <div className="space-y-6 animate-slide-up delay-100">
                        <h2 className="text-5xl font-black text-white leading-tight italic">
                            Pilotez votre <span className="text-primary-500 underline decoration-4 underline-offset-8">Excellence</span> Académique.
                        </h2>
                        <p className="text-xl text-gray-400 font-medium leading-relaxed italic">
                            La plateforme ERP tout-en-un pour les centres de formation modernes. Gérez, planifiez et évaluez avec précision.
                        </p>
                    </div>

                    <div className="flex items-center gap-8 pt-8 animate-slide-up delay-200">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-secondary-900 bg-gray-800 flex items-center justify-center text-xs font-black text-gray-400">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] italic">Rejoint par +500 Experts</p>
                    </div>
                </div>

                {/* Bottom glass badge */}
                <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 italic">
                    <p className="text-[10px] font-black uppercase text-primary-500 tracking-[0.3em] mb-2 flex items-center gap-2">
                        <ShieldCheck size={14} /> Sécurité Certifiée
                    </p>
                    <p className="text-xs text-gray-400 font-medium italic">Accès restreint aux administrateurs et formateurs accrédités de FormationsGest.</p>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-20 relative bg-gray-50/10 italic">
                <Link to="/" className="absolute top-12 left-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary-900 transition-colors">
                    <ArrowLeft size={16} /> Retour au Site
                </Link>

                <div className="w-full max-w-md space-y-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[9px] font-black uppercase tracking-[0.2em] italic italic">
                            <Sparkles size={12} /> Espaces Privés
                        </div>
                        <h2 className="text-4xl font-black text-secondary-900 tracking-tighter italic">Connexion.</h2>
                        <p className="text-gray-400 font-medium italic">Veuillez entrer vos identifiants pour accéder à votre console.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Adresse Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                                    <input
                                        type="email" name="email" required
                                        className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-16 pr-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none shadow-sm"
                                        placeholder="expert@formationsgest.com"
                                        value={credentials.email} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Mot de Passe</label>
                                    <button type="button" className="text-[9px] font-black text-primary-600 uppercase tracking-widest hover:underline">Oublié ?</button>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                                    <input
                                        type="password" name="password" required
                                        className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-16 pr-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none shadow-sm"
                                        placeholder="••••••••••••"
                                        value={credentials.password} onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-red-100 italic">
                                <ShieldCheck size={16} /> {error}
                            </div>
                        )}

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-secondary-900 hover:bg-black text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all transform active:scale-[0.98] shadow-2xl shadow-gray-200 flex items-center justify-center gap-3 italic italic"
                        >
                            {loading ? 'Authentification...' : 'Accéder à la Console'}
                            {!loading && <ChevronRight size={18} />}
                        </button>
                    </form>

                    <div className="pt-8 text-center italic">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
                            Pas encore formateur ? <Link to="/candidature" className="text-primary-600 hover:underline">Postulez ici</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
