import React, { useState, useEffect, useContext } from 'react';
import { planningAPI, formationAPI, formateurAPI, entrepriseAPI } from '../services/api';
import {
    Calendar,
    Search,
    Plus,
    Clock,
    MapPin,
    Users,
    Settings,
    Trash2,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import Modal from '../components/Modal';
import { InputField, Button } from '../components/UIComponents';
import { AuthContext } from '../context/AuthContext';

/**
 * Gestion du Planning des Sessions
 * Interface dynamique avec Modal pour la planification
 */
const PlanningList = () => {
    const { user } = useContext(AuthContext);
    const isFormateur = user?.role === 'FORMATEUR';
    const [plannings, setPlannings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    // Data pour les selects
    const [formations, setFormations] = useState([]);
    const [formateurs, setFormateurs] = useState([]);
    const [entreprises, setEntreprises] = useState([]);

    // FormData
    const [formData, setFormData] = useState({
        formationId: '',
        formateurId: '',
        entrepriseId: '',
        dateDebut: '',
        dateFin: '',
        heureDebut: '09:00',
        heureFin: '17:00',
        lieu: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [planRes, formRes, factRes, entRes] = await Promise.all([
                planningAPI.getAll(),
                formationAPI.getAll(),
                formateurAPI.getAll(),
                entrepriseAPI.getAll()
            ]);
            setPlannings(planRes.data.data);
            setFormations(formRes.data.data);
            setFormateurs(factRes.data.data);
            setEntreprises(entRes.data.data);
        } catch (err) {
            console.error('Erreur chargement données planning');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await planningAPI.create(formData);
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de la planification');
        } finally {
            setFormLoading(false);
        }
    };

    const visiblePlannings = isFormateur
        ? plannings.filter(p => p.formateurId?.userId?._id === user._id)
        : plannings;

    const filtered = visiblePlannings.filter(p =>
        p.formationId?.titre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 italic">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tighter italic">Sessions & Planning.</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Coordonnez les sessions de formation et les intervenants.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher une session..."
                            className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary-500/5 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {!isFormateur && (
                        <Button onClick={() => setIsModalOpen(true)} variant="primary" icon={Plus}>Planifier</Button>
                    )}
                </div>
            </header>

            <div className="space-y-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-50 rounded-[2.5rem] animate-pulse"></div>)
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 italic">
                        <Calendar size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold">Aucune session programmée.</p>
                    </div>
                ) : (
                    filtered.map((session, idx) => (
                        <div key={session._id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col md:flex-row items-center gap-8 animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                            {/* Date Card */}
                            <div className="w-full md:w-32 h-32 bg-secondary-900 text-white rounded-[2rem] flex flex-col items-center justify-center p-4 shadow-xl">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{new Date(session.dateDebut).toLocaleString('fr-FR', { month: 'short' })}</span>
                                <span className="text-3xl font-black">{new Date(session.dateDebut).getDate()}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest bg-primary-600 px-2 py-0.5 rounded-md mt-2">2025</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-black text-secondary-900 tracking-tight italic">{session.formationId?.titre}</h3>
                                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mt-1 flex items-center gap-2 italic">
                                            <Users size={12} /> {session.entrepriseId?.nom || 'Individuel'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 italic"><CheckCircle2 size={10} /> Confirmé</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-gray-50 italic">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Formateur</p>
                                        <p className="text-[11px] font-bold text-secondary-900 capitalize">{session.formateurId?.userId?.prenom} {session.formateurId?.userId?.nom}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Horaire</p>
                                        <p className="text-[11px] font-bold text-secondary-900">{session.heureDebut} - {session.heureFin}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Lieu</p>
                                        <p className="text-[11px] font-bold text-secondary-900 truncate">{session.lieu}</p>
                                    </div>
                                    <div className="flex items-end justify-end">
                                        <button className="text-[10px] font-black text-secondary-400 hover:text-secondary-900 flex items-center gap-2 uppercase tracking-widest transition-colors">Détails <ArrowRight size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {!isFormateur && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Programmer une nouvelle session"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Formation</label>
                            <select
                                required className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 outline-none"
                                value={formData.formationId} onChange={e => setFormData({ ...formData, formationId: e.target.value })}
                            >
                                <option value="">Sélectionner une formation</option>
                                {formations.map(f => <option key={f._id} value={f._id}>{f.titre}</option>)}
                            </select>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Formateur</label>
                                <select
                                    required className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 outline-none"
                                    value={formData.formateurId} onChange={e => setFormData({ ...formData, formateurId: e.target.value })}
                                >
                                    <option value="">Sélectionner l'expert</option>
                                    {formateurs.map(f => <option key={f._id} value={f._id}>{f.userId?.prenom} {f.userId?.nom}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Client (Entreprise)</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 outline-none"
                                    value={formData.entrepriseId} onChange={e => setFormData({ ...formData, entrepriseId: e.target.value })}
                                >
                                    <option value="">Individuel (Pas d'entreprise)</option>
                                    {entreprises.map(e => <option key={e._id} value={e._id}>{e.nom}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <InputField label="Date de Début" name="dateDebut" type="date" required value={formData.dateDebut} onChange={e => setFormData({ ...formData, dateDebut: e.target.value })} />
                            <InputField label="Date de Fin" name="dateFin" type="date" required value={formData.dateFin} onChange={e => setFormData({ ...formData, dateFin: e.target.value })} />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <InputField label="Heure Debut" name="heureDebut" type="time" value={formData.heureDebut} onChange={e => setFormData({ ...formData, heureDebut: e.target.value })} />
                            <InputField label="Heure Fin" name="heureFin" type="time" value={formData.heureFin} onChange={e => setFormData({ ...formData, heureFin: e.target.value })} />
                        </div>

                        <InputField label="Lieu de formation" name="lieu" icon={MapPin} required value={formData.lieu} onChange={e => setFormData({ ...formData, lieu: e.target.value })} placeholder="ex: Paris, 75001" />

                        <div className="flex gap-4 pt-4">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Annuler</Button>
                            <Button type="submit" variant="accent" loading={formLoading} className="flex-1">Planifier la session</Button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default PlanningList;
