import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { entrepriseAPI } from '../services/api';

/**
 * Formulaire de création d'entreprise
 * Accessible par l'Admin et l'Assistant
 */
const EntrepriseCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        adresse: '',
        telephone: '',
        email: '',
        siteWeb: '',
        secteurActivite: '',
        contactPrincipal: {
            nom: '',
            prenom: '',
            email: '',
            telephone: '',
            fonction: ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: { ...formData[parent], [child]: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await entrepriseAPI.create(formData);
            alert('Entreprise ajoutée avec succès !');
            navigate('/admin/entreprises');
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="card-glass p-10 shadow-2xl animate-fade-in">
                    <h1 className="text-3xl font-black text-secondary-900 mb-8 pb-4 border-b">Nouvelle Entreprise Cliente</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className="input-label">Nom de l'entreprise</label>
                                <input type="text" name="nom" required className="input-field" value={formData.nom} onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="input-label">Adresse Complète</label>
                                <input type="text" name="adresse" required className="input-field" value={formData.adresse} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="input-label">Téléphone</label>
                                <input type="text" name="telephone" required className="input-field" value={formData.telephone} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="input-label">Email de contact</label>
                                <input type="email" name="email" required className="input-field" value={formData.email} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="input-label">Site Web (URL)</label>
                                <input type="url" name="siteWeb" className="input-field" value={formData.siteWeb} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="input-label">Secteur d'activité</label>
                                <input type="text" name="secteurActivite" className="input-field" value={formData.secteurActivite} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <h2 className="text-xl font-bold text-secondary-800 mb-6 italic text-primary-600">Contact Référent</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="input-label">Nom du contact</label>
                                    <input type="text" name="contactPrincipal.nom" required className="input-field" value={formData.contactPrincipal.nom} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="input-label">Prénom du contact</label>
                                    <input type="text" name="contactPrincipal.prenom" required className="input-field" value={formData.contactPrincipal.prenom} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="input-label">Fonction</label>
                                    <input type="text" name="contactPrincipal.fonction" className="input-field" value={formData.contactPrincipal.fonction} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="input-label">Email direct</label>
                                    <input type="email" name="contactPrincipal.email" className="input-field" value={formData.contactPrincipal.email} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button type="button" onClick={() => navigate('/admin/entreprises')} className="btn-secondary flex-1">Annuler</button>
                            <button type="submit" disabled={loading} className="btn-primary flex-[2]">
                                {loading ? 'Création...' : 'Enregistrer l\'entreprise'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EntrepriseCreate;
