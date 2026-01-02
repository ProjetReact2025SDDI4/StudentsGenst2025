import React, { useState, useEffect, useContext } from 'react';
import { planningAPI, formationAPI, formateurAPI, entrepriseAPI } from '../services/api';
import { useConfirm } from '../context/ConfirmContext';
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
    const confirm = useConfirm();
    const isFormateur = user?.role === 'FORMATEUR';
    const [plannings, setPlannings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

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
        const loadData = async () => {
            setLoading(true);
            try {
                if (isFormateur) {
                    const planRes = await planningAPI.getAll();
                    setPlannings(planRes.data.data);
                } else {
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
                }
            } catch (err) {
                console.error('Erreur chargement données planning', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isFormateur]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await planningAPI.create(formData);
            setIsModalOpen(false);
            const planRes = await planningAPI.getAll();
            setPlannings(planRes.data.data);
        } catch (err) {
            console.error('Erreur lors de la planification', err);
            alert(err.response?.data?.message || 'Erreur lors de la planification');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Annuler la session ?',
            message: 'Cette session sera supprimée du planning. Les formateurs et entreprises concernés ne seront plus notifiés.',
            type: 'danger',
            confirmText: 'Supprimer la session'
        });

        if (isConfirmed) {
            try {
                await planningAPI.delete(id);
                const planRes = await planningAPI.getAll();
                setPlannings(planRes.data.data);
            } catch (err) {
                console.error('Erreur lors de la suppression', err);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const visiblePlannings = isFormateur
        ? plannings.filter(p => p.formateurId?.userId?._id === user._id)
        : plannings;

    const filtered = visiblePlannings.filter(p => {
        const titre = p.formationId?.titre || '';
        return titre.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const exportToCsv = (rows, filename) => {
        if (!rows || rows.length === 0) return;
        const headers = Object.keys(rows[0]);
        const escapeValue = (value) => {
            if (value === null || value === undefined) return '""';
            const str = String(value).replace(/"/g, '""');
            return `"${str}"`;
        };
        const lines = [];
        lines.push(headers.map(escapeValue).join(';'));
        rows.forEach(row => {
            const line = headers.map(h => escapeValue(row[h])).join(';');
            lines.push(line);
        });
        const csvContent = lines.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExport = () => {
        if (filtered.length === 0) return;
        const rows = filtered.map(s => ({
            Formation: s.formationId?.titre || '',
            Formateur: s.formateurId?.userId ? `${s.formateurId.userId.prenom} ${s.formateurId.userId.nom}` : '',
            Entreprise: s.entrepriseId?.nom || 'Individuel',
            Statut: s.statut || '',
            DateDebut: s.dateDebut ? new Date(s.dateDebut).toLocaleDateString('fr-FR') : '',
            DateFin: s.dateFin ? new Date(s.dateFin).toLocaleDateString('fr-FR') : '',
            HeureDebut: s.heureDebut || '',
            HeureFin: s.heureFin || '',
            Lieu: s.lieu || ''
        }));
        exportToCsv(rows, 'plannings.csv');
    };

    const getIdFromRef = (ref) => {
        if (!ref) return '';
        if (typeof ref === 'string') return ref;
        if (typeof ref === 'object' && ref._id) return ref._id;
        return '';
    };

    const getEvaluationLink = (session) => {
        if (!session) return '';
        const formationId = getIdFromRef(session.formationId);
        const formateurId = getIdFromRef(session.formateurId);
        if (!formationId || !formateurId) return '';
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        if (!baseUrl) return '';
        return `${baseUrl}/evaluation/${formationId}/${formateurId}`;
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="animate-slide-up">
                    <h1 className="text-4xl font-black text-secondary-900 tracking-tight italic">
                        Sessions <span className="text-primary-600">&</span> Planning.
                    </h1>
                    <p className="text-gray-400 text-sm font-medium mt-2">Coordonnez les sessions de formation et les intervenants.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="relative flex-1 md:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher une session..."
                            className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary-500/5 shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {!isFormateur && (
                        <button
                            type="button"
                            onClick={handleExport}
                            className="flex items-center gap-2 px-5 py-3 bg-gray-50 text-secondary-900 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 hover:bg-secondary-900 hover:text-white transition-all shadow-sm whitespace-nowrap"
                        >
                            <ArrowRight size={14} /> Exporter
                        </button>
                    )}
                    {!isFormateur && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-secondary-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-secondary-900/10 active:scale-95"
                        >
                            <Plus size={16} /> Planifier
                        </button>
                    )}
                </div>
            </header>

            <div className="grid gap-4">
                {loading ? (
                    [1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-50 rounded-2xl animate-pulse"></div>)
                ) : filtered.length === 0 ? (
                    <div className="py-24 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 italic">
                        <Calendar size={40} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold">Aucune session programmée.</p>
                    </div>
                ) : (
                    filtered.map((session, idx) => (
                        <div
                            key={session._id}
                            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row items-center gap-6 animate-slide-up"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            {/* Date Compact */}
                            <div className="flex flex-row md:flex-col items-center justify-center bg-gray-50 rounded-xl p-3 min-w-[80px] group-hover:bg-secondary-900 group-hover:text-white transition-colors duration-500">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-60 md:mb-1 mr-2 md:mr-0">
                                    {new Date(session.dateDebut).toLocaleString('fr-FR', { month: 'short' })}
                                </span>
                                <span className="text-xl font-black">{new Date(session.dateDebut).getDate()}</span>
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-base font-black text-secondary-900 truncate italic">
                                        {session.formationId?.titre}
                                    </h3>
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                                        <CheckCircle2 size={10} /> Confirmé
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                                    <div className="flex items-center gap-1.5 text-primary-600">
                                        <Users size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-[150px]">
                                            {session.entrepriseId?.nom || 'Individuel'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <Clock size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">
                                            {session.heureDebut} - {session.heureFin}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <MapPin size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-[120px]">
                                            {session.lieu}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Formateur & Actions */}
                            <div className="flex items-center gap-6 md:border-l border-gray-50 md:pl-6 w-full md:w-auto">
                                <div className="flex items-center gap-3 flex-1 md:flex-none">
                                    <div className="w-8 h-8 bg-secondary-100 text-secondary-900 rounded-lg flex items-center justify-center text-[10px] font-black italic">
                                        {session.formateurId?.userId?.prenom[0]}{session.formateurId?.userId?.nom[0]}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Formateur</span>
                                        <span className="text-[10px] font-bold text-secondary-900 capitalize whitespace-nowrap">
                                            {session.formateurId?.userId?.prenom} {session.formateurId?.userId?.nom}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {!isFormateur && (
                                        <button
                                            onClick={() => handleDelete(session._id)}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Supprimer la session"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                    <button
                                        className="p-2 text-gray-300 hover:text-secondary-900 hover:bg-gray-50 rounded-lg transition-all group/btn"
                                        onClick={() => {
                                            setSelectedSession(session);
                                            setIsDetailOpen(true);
                                        }}
                                        title="Détails de la session"
                                    >
                                        <ChevronRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                    </button>
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

            {selectedSession && (
                <Modal
                    isOpen={isDetailOpen}
                    onClose={() => {
                        setIsDetailOpen(false);
                        setSelectedSession(null);
                    }}
                    title="Détails de la session"
                >
                    <div className="space-y-6 italic">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-gray-50 rounded-2xl">
                            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-secondary-900 text-white">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-70">
                                    {new Date(selectedSession.dateDebut).toLocaleString('fr-FR', { month: 'short' })}
                                </span>
                                <span className="text-xl font-black">
                                    {new Date(selectedSession.dateDebut).getDate()}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-black text-secondary-900 leading-tight">
                                    {selectedSession.formationId?.titre}
                                </h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2 mt-1">
                                    <CheckCircle2 size={12} /> Session confirmée
                                </p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Calendrier</h4>
                                <div className="p-4 border border-gray-100 rounded-2xl space-y-2">
                                    <p className="text-[11px] font-bold text-secondary-900 flex items-center gap-2">
                                        <Calendar size={14} className="text-primary-500" />
                                        Du {new Date(selectedSession.dateDebut).toLocaleDateString('fr-FR')} au {new Date(selectedSession.dateFin).toLocaleDateString('fr-FR')}
                                    </p>
                                    <p className="text-[11px] font-bold text-gray-500 flex items-center gap-2">
                                        <Clock size={14} className="text-primary-500" />
                                        {selectedSession.heureDebut} - {selectedSession.heureFin}
                                    </p>
                                    <p className="text-[11px] font-bold text-gray-500 flex items-center gap-2">
                                        <MapPin size={14} className="text-primary-500" />
                                        {selectedSession.lieu}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Client</h4>
                                <div className="p-4 border border-gray-100 rounded-2xl space-y-1">
                                    <p className="text-[11px] font-black text-secondary-900 flex items-center gap-2">
                                        <Users size={14} className="text-primary-500" />
                                        {selectedSession.entrepriseId?.nom || 'Session individuelle'}
                                    </p>
                                    {selectedSession.entrepriseId && (
                                        <p className="text-[10px] font-bold text-gray-500">
                                            {selectedSession.entrepriseId.ville} • {selectedSession.entrepriseId.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Formateur</h4>
                            <div className="p-4 border border-gray-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-secondary-900 text-white flex items-center justify-center text-[11px] font-black">
                                    {selectedSession.formateurId?.userId?.prenom?.[0]}{selectedSession.formateurId?.userId?.nom?.[0]}
                                </div>
                                <div>
                                    <p className="text-[12px] font-black text-secondary-900">
                                        {selectedSession.formateurId?.userId?.prenom} {selectedSession.formateurId?.userId?.nom}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-500">
                                        {selectedSession.formateurId?.userId?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {getEvaluationLink(selectedSession) && (
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Évaluation & Feedback</h4>
                                <div className="p-4 border border-gray-100 rounded-2xl space-y-3">
                                    <p className="text-[11px] font-bold text-secondary-900 flex items-center gap-2">
                                        <ArrowRight size={14} className="text-primary-500" />
                                        Lien direct vers le formulaire d'évaluation
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-[11px] font-mono text-gray-700 overflow-x-auto"
                                            value={getEvaluationLink(selectedSession)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const link = getEvaluationLink(selectedSession);
                                                if (!link) return;
                                                if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                                                    navigator.clipboard.writeText(link)
                                                        .then(() => alert('Lien d\'évaluation copié dans le presse-papiers.'))
                                                        .catch(() => alert('Impossible de copier le lien. Copiez-le manuellement.'));
                                                } else {
                                                    alert('Copie automatique non disponible. Copiez le lien manuellement.');
                                                }
                                            }}
                                            className="inline-flex items-center justify-center px-4 py-2 bg-secondary-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all whitespace-nowrap"
                                        >
                                            Copier le lien
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-400">
                                        Envoyez ce lien aux apprenants (email, WhatsApp, etc.) pour collecter leurs retours.
                                    </p>
                                </div>
                            </div>
                        )}

                        {selectedSession.notes && (
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Notes & commentaires</h4>
                                <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50 text-[11px] font-medium text-gray-700 leading-relaxed">
                                    {selectedSession.notes}
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default PlanningList;
