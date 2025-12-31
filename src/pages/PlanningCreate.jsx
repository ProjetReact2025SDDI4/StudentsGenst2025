import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { planningAPI, formationAPI, formateurAPI, entrepriseAPI } from '../services/api';

/**
 * Formulaire de planification de session de formation
 * Permet d'affecter un formateur et une entreprise (optionnelle pour les sessions publiques)
 */
const PlanningCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formations, setFormations] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [entreprises, setEntreprises] = useState([]);

    const [formData, setFormData] = useState({
        formationId: '',
        formateurId: '',
        entrepriseId: '',
        dateDebut: '',
        dateFin: '',
        lieu: '',
        statut: 'PLANIFIE'
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [resForm, resFact, resEnt] = await Promise.all([
                    formationAPI.getAll(),
                    formateurAPI.getAll(),
                    entrepriseAPI.getAll()
                ]);
                setFormations(resForm.data.data);
                setFormateurs(resFact.data.data);
                setEntreprises(resEnt.data.data);
            } catch (err) {
                console.error('Erreur chargement données planification');
            }
        };
        loadData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await planningAPI.create(formData);
            alert('Session planifiée avec succès !');
            navigate('/admin/plannings');
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de la planification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="card-glass p-10 shadow-2xl animate-fade-in">
                    <h1 className="text-3xl font-black text-secondary-900 mb-8 pb-4 border-b">Planifier une Session</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className="input-label">Formation à planifier</label>
                                <select name="formationId" required className="input-field" value={formData.formationId} onChange={handleChange}>
                                    <option value="">Sélectionnez une formation</option>
                                    {formations.map(f => (
                                        <option key={f._id} value={f._id}>{f.titre} ({f.nombreHeures}h)</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="input-label">Affecter un Formateur</label>
                                <select name="formateurId" required className="input-field" value={formData.formateurId} onChange={handleChange}>
                                    <option value="">Sélectionnez un formateur</option>
                                    {formateurs.map(f => (
                                        <option key={f._id} value={f._id}>{f.userId?.nomComplet}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="input-label">Entreprise Cliente (Optionnel)</label>
                                <select name="entrepriseId" className="input-field" value={formData.entrepriseId} onChange={handleChange}>
                                    <option value="">Individu (Ouvert au public)</option>
                                    {entreprises.map(e => (
                                        <option key={e._id} value={e._id}>{e.nom}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="input-label">Date de début</label>
                                <input type="date" name="dateDebut" required className="input-field" value={formData.dateDebut} onChange={handleChange} />
                            </div>

                            <div>
                                <label className="input-label">Date de fin</label>
                                <input type="date" name="dateFin" required className="input-field" value={formData.dateFin} onChange={handleChange} />
                            </div>

                            <div className="md:col-span-2">
                                <label className="input-label">Lieu de la formation</label>
                                <input type="text" name="lieu" placeholder="Ex: Salle A, Distanciel, etc." className="input-field" value={formData.lieu} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button type="button" onClick={() => navigate('/admin/plannings')} className="btn-secondary flex-1">Annuler</button>
                            <button type="submit" disabled={loading} className="btn-primary flex-[2]">
                                {loading ? 'Planification...' : 'Confirmer la Planification'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PlanningCreate;
