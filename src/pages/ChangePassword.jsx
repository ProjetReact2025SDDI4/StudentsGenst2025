import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { Lock, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        if (formData.newPassword !== formData.confirmPassword) {
            setErrorMessage('Les deux nouveaux mots de passe ne correspondent pas.');
            setLoading(false);
            return;
        }

        try {
            await authAPI.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            setSuccessMessage('Mot de passe modifié avec succès.');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Erreur lors de la modification du mot de passe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 italic">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-secondary-900 text-white flex items-center justify-center shadow-lg shadow-secondary-500/30">
                        <Lock size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-secondary-900 tracking-tighter">Sécurité du compte.</h1>
                        <p className="text-gray-400 text-sm font-medium mt-1">Mettez à jour votre mot de passe en toute sécurité.</p>
                    </div>
                </div>
                <div className="px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-[10px] font-black uppercase tracking-widest text-primary-600 flex items-center gap-2">
                    <ShieldCheck size={14} />
                    Protection renforcée
                </div>
            </header>

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

            <div className="bg-secondary-900 rounded-[2.5rem] p-10 text-white shadow-2xl max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">Mot de passe actuel</label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-11 px-6 text-sm font-bold text-white placeholder-gray-400 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-300 outline-none"
                                placeholder="••••••••"
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(prev => !prev)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-300 transition-colors flex items-center justify-center"
                                aria-label={showCurrentPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">Nouveau mot de passe</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-11 px-6 text-sm font-bold text-white placeholder-gray-400 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-300 outline-none"
                                    placeholder="••••••••"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(prev => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-300 transition-colors flex items-center justify-center"
                                    aria-label={showNewPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">Confirmer le nouveau mot de passe</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-11 px-6 text-sm font-bold text-white placeholder-gray-400 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-300 outline-none"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
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
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-10 py-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-lg shadow-primary-500/30 transition-all active:scale-95"
                        >
                            {loading ? 'Mise à jour...' : 'Modifier le mot de passe'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
