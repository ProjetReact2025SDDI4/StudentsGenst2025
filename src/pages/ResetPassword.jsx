import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Lock, ArrowLeft, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        if (password !== confirmPassword) {
            setErrorMessage('Les deux mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }

        try {
            await authAPI.resetPassword({ token, password });
            setSuccessMessage('Votre mot de passe a été réinitialisé avec succès. Vous pouvez vous connecter.');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-secondary-900 flex flex-col justify-center items-center p-6 italic">
            <div className="w-full max-w-md space-y-8">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary-900 transition-colors"
                >
                    <ArrowLeft size={16} /> Retour à la connexion
                </Link>

                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
                        <ShieldCheck size={12} /> Sécurité
                    </div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tighter">Réinitialiser le mot de passe.</h1>
                    <p className="text-gray-500 text-sm font-medium">
                        Choisissez un nouveau mot de passe pour votre compte FormationsGest.
                    </p>
                </div>

                {errorMessage && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-600 flex items-center gap-2">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                        <CheckCircle2 size={16} /> {successMessage}
                    </div>
                )}

                <div className="bg-secondary-900 rounded-[2rem] p-8 text-white shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 ml-1">
                                Nouveau mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-11 text-sm font-bold text-white placeholder-gray-400 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-300 outline-none"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-300 transition-colors flex items-center justify-center"
                                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 ml-1">
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-11 pl-4 text-sm font-bold text-white placeholder-gray-400 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-300 outline-none"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-300 transition-colors flex items-center justify-center"
                                    aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !password || !confirmPassword}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-lg shadow-primary-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
