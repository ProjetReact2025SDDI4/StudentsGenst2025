import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

const UserCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 'ASSISTANT'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.prenom || !formData.nom || !formData.email || !formData.password) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        setLoading(true);
        try {
            const res = await userAPI.getAll();
            const exists = res.data.data.some(
                (u) => u.email && u.email.toLowerCase() === formData.email.toLowerCase()
            );

            if (exists) {
                setError('Un utilisateur avec cet email existe déjà.');
                return;
            }

            await userAPI.create(formData);
            navigate('/admin/users');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-secondary-900 p-6 sm:p-8 lg:p-10 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16"></div>
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                    >
                        ← Retour
                    </button>
                    <h1 className="text-3xl font-black italic">Recrutement <span className="text-primary-500">Interne</span></h1>
                    <p className="text-gray-400 text-sm mt-2 font-medium">Ajoutez un nouveau membre au personnel administratif.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10 space-y-8 italic">
                    {error && (
                        <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-medium text-red-700">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Prénom</label>
                            <input
                                type="text"
                                name="prenom"
                                required
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                                value={formData.prenom}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nom</label>
                            <input
                                type="text"
                                name="nom"
                                required
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                                value={formData.nom}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Professionnel</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none underline decoration-primary-500/30"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Mot de passe</label>
                            <input
                                type="password"
                                name="password"
                                required
                                minLength="6"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Rôle Affecté</label>
                            <select
                                name="role"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none appearance-none"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="ASSISTANT">Assistant Administratif</option>
                                <option value="ADMIN">Administrateur Système</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-secondary-900 hover:bg-black text-white py-5 rounded-2xl text-sm font-black uppercase tracking-[0.3em] transition-all transform active:scale-[0.98] shadow-2xl shadow-gray-200"
                        >
                            {loading ? 'Traitement en cours...' : 'Finaliser le Recrutement'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserCreate;
