import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { UserCircle, Mail, Shield, Lock, CheckCircle2 } from 'lucide-react';

const Profile = () => {
    const { user, refreshUser } = useContext(AuthContext);
    const [profileData, setProfileData] = useState({
        nom: user?.nom || '',
        prenom: user?.prenom || '',
        email: user?.email || '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileMessage('');
        setErrorMessage('');
        try {
            await authAPI.updateMe(profileData);
            await refreshUser();
            setProfileMessage('Profil mis à jour avec succès.');
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Erreur lors de la mise à jour du profil.');
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setSavingPassword(true);
        setPasswordMessage('');
        setErrorMessage('');
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setErrorMessage('Les deux nouveaux mots de passe ne correspondent pas.');
            setSavingPassword(false);
            return;
        }
        try {
            await authAPI.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setPasswordMessage('Mot de passe modifié avec succès.');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Erreur lors de la modification du mot de passe.');
        } finally {
            setSavingPassword(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-10 italic">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/30">
                        <UserCircle size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-secondary-900 tracking-tighter">Mon Profil.</h1>
                        <p className="text-gray-400 text-sm font-medium mt-1">Gérez vos informations personnelles et vos accès.</p>
                    </div>
                </div>
                <div className="px-4 py-2 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Shield size={14} className="text-primary-500" />
                    Rôle : <span className="text-secondary-900">{user.role}</span>
                </div>
            </header>

            {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-600 flex items-center gap-2">
                    {errorMessage}
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
                    <h2 className="text-xl font-black text-secondary-900 tracking-tight flex items-center gap-2">
                        <Mail size={18} className="text-primary-500" />
                        Informations personnelles
                    </h2>
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Prénom</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none"
                                    value={profileData.prenom}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nom</label>
                                <input
                                    type="text"
                                    name="nom"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none"
                                    value={profileData.nom}
                                    onChange={handleProfileChange}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Adresse email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none"
                                value={profileData.email}
                                onChange={handleProfileChange}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="px-8 py-3 rounded-2xl bg-secondary-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-gray-200 transition-all active:scale-95"
                            >
                                {savingProfile ? 'Enregistrement...' : 'Mettre à jour le profil'}
                            </button>
                        </div>
                        {profileMessage && (
                            <div className="flex items-center gap-2 text-[11px] font-black text-emerald-600 uppercase tracking-widest">
                                <CheckCircle2 size={16} /> {profileMessage}
                            </div>
                        )}
                    </form>
                </div>

                <div className="bg-secondary-900 rounded-[2.5rem] p-8 text-white shadow-2xl space-y-6">
                    <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <Lock size={18} className="text-primary-300" />
                        Sécurité & Mot de passe
                    </h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">Mot de passe actuel</label>
                            <input
                                type="password"
                                name="currentPassword"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm font-bold text-white placeholder-gray-400 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-300 outline-none"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm font-bold text-white placeholder-gray-400 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-300 outline-none"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 ml-1">Confirmer le nouveau mot de passe</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm font-bold text-white placeholder-gray-400 focus:ring-4 focus:ring-primary-500/20 focus:border-primary-300 outline-none"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={savingPassword}
                                className="px-8 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-500/30 transition-all active:scale-95"
                            >
                                {savingPassword ? 'Mise à jour...' : 'Modifier le mot de passe'}
                            </button>
                        </div>
                        {passwordMessage && (
                            <div className="flex items-center gap-2 text-[11px] font-black text-emerald-300 uppercase tracking-widest">
                                <CheckCircle2 size={16} /> {passwordMessage}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;

