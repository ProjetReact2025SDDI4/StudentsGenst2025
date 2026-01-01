import React, { useState, useEffect, useCallback } from 'react';
import { candidatureAPI } from '../services/api';
import { useConfirm } from '../context/ConfirmContext';
import Modal from '../components/Modal';
import {
    FileText,
    CheckCircle2,
    XCircle,
    Mail,
    Briefcase,
    Calendar,
    ChevronRight,
    Search,
    ExternalLink,
    Download
} from 'lucide-react';

const buildFileUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace(/\/api$/, '');
    const normalized = url.replace(/^\/+/, '');
    return `${baseUrl}/${normalized}`;
};

const CandidatureList = () => {
    const confirm = useConfirm();
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedCandidature, setSelectedCandidature] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchCandidatures = useCallback(async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter !== 'ALL') {
                params.statut = statusFilter;
            }
            const res = await candidatureAPI.getAll(params);
            setCandidatures(res.data.data);
        } catch (err) {
            console.error('Erreur chargement candidatures', err);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchCandidatures();
    }, [fetchCandidatures]);

    const handleApprove = async (candidature) => {
        const isConfirmed = await confirm({
            title: 'Approuver la candidature ?',
            message: `Un compte formateur sera créé pour ${candidature.prenom} ${candidature.nom} et les accès seront envoyés par email.`,
            type: 'info',
            confirmText: 'Confirmer l\'approbation'
        });

        if (!isConfirmed) return;
        try {
            setActionLoading(true);
            await candidatureAPI.approve(candidature._id, {
                commentaire: 'Candidature validée et compte formateur créé.'
            });
            await fetchCandidatures();
            setSelectedCandidature(null);
            setIsDetailOpen(false);
        } catch (err) {
            console.error('Erreur lors de la validation', err);
            alert(err.response?.data?.message || 'Erreur lors de la validation');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (candidature) => {
        const isConfirmed = await confirm({
            title: 'Refuser la candidature ?',
            message: `Cette candidature sera marquée comme refusée. Aucune création de compte ne sera effectuée.`,
            type: 'warning',
            confirmText: 'Confirmer le refus'
        });

        if (!isConfirmed) return;
        try {
            setActionLoading(true);
            await candidatureAPI.reject(candidature._id, {
                commentaire: 'Profil non retenu pour le moment.'
            });
            await fetchCandidatures();
            setSelectedCandidature(null);
            setIsDetailOpen(false);
        } catch (err) {
            console.error('Erreur lors du refus', err);
            alert(err.response?.data?.message || 'Erreur lors du refus');
        } finally {
            setActionLoading(false);
        }
    };

    const openDetail = (candidature) => {
        setSelectedCandidature(candidature);
        setIsDetailOpen(true);
    };

    const filteredCandidatures = candidatures.filter(c => {
        const matchesSearch =
            `${c.prenom} ${c.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.motsCles?.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus =
            statusFilter === 'ALL' || c.statut === statusFilter;

        return matchesSearch && matchesStatus;
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
        if (filteredCandidatures.length === 0) return;
        const rows = filteredCandidatures.map(c => ({
            Prenom: c.prenom,
            Nom: c.nom,
            Email: c.email,
            Statut: c.statut,
            ExperienceAnnees: c.experience,
            DateReception: c.createdAt ? new Date(c.createdAt).toLocaleDateString('fr-FR') : ''
        }));
        exportToCsv(rows, 'candidatures.csv');
    };

    if (loading) return <div className="space-y-6">
        <div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse"></div>
        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-3xl animate-pulse"></div>)}
    </div>;

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="animate-slide-up">
                    <h1 className="text-4xl font-black text-secondary-900 tracking-tight italic">
                        Recrutements <span className="text-primary-600">Talents.</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium mt-2">
                        Gérez les nouveaux talents, analysez les profils et validez les experts formateurs.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-1 group animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher un expert..."
                            className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary-500/5 shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 animate-slide-up" style={{ animationDelay: '150ms' }}>
                        {['ALL', 'EN_ATTENTE', 'ACCEPTEE', 'REFUSEE'].map(status => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                    statusFilter === status
                                        ? 'bg-secondary-900 text-white border-secondary-900'
                                        : 'bg-white text-gray-400 border-gray-100 hover:border-primary-200 hover:text-secondary-900'
                                }`}
                            >
                                {status === 'ALL' ? 'Toutes' : status}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleExport}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-secondary-900 rounded-xl text-[9px] font-black uppercase tracking-widest border border-gray-100 hover:bg-secondary-900 hover:text-white transition-all shadow-sm"
                    >
                        <Download size={14} /> Exporter
                    </button>
                </div>
            </header>

            <div className="grid gap-4">
                {filteredCandidatures.length === 0 ? (
                    <div className="bg-white rounded-[2rem] py-24 text-center border-2 border-dashed border-gray-100 italic">
                        <FileText size={40} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Aucune candidature trouvée</p>
                    </div>
                ) : (
                    filteredCandidatures.map((c, idx) => (
                        <div
                            key={c._id}
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col lg:flex-row items-center gap-6 animate-slide-up"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            {/* Avatar Compact */}
                            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-secondary-900 text-lg font-black italic border border-gray-100 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                                {c.prenom.charAt(0)}{c.nom.charAt(0)}
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openDetail(c)}>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-black text-secondary-900 italic group-hover:text-primary-600 transition-colors">
                                        {c.prenom} {c.nom}
                                    </h3>
                                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase ${c.statut === 'EN_ATTENTE' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                        {c.statut}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <Mail size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-[180px]">{c.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-primary-600">
                                        <Briefcase size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{c.experience} ans d'XP</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-300">
                                        <Calendar size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider italic">Reçu le {new Date(c.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tags Compact */}
                            <div className="hidden xl:flex flex-wrap gap-2 max-w-[200px]">
                                {c.motsCles?.slice(0, 3).map((tag, i) => (
                                    <span key={i} className="bg-gray-50 text-gray-400 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-gray-50 group-hover:border-primary-100 transition-all">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Actions Buttons */}
                            <div className="flex items-center gap-2 md:border-l border-gray-50 md:pl-6 w-full lg:w-auto justify-center">
                                <button
                                    onClick={() => openDetail(c)}
                                    className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-secondary-900 hover:text-white transition-all shadow-sm"
                                >
                                    <FileText size={14} /> Détails
                                </button>
                                {c.cv && (
                                    <a
                                        href={buildFileUrl(c.cv)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-secondary-900 hover:text-white transition-all group/btn shadow-sm"
                                        title="Voir le CV"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                                {c.statut === 'EN_ATTENTE' && (
                                    <button
                                        onClick={() => handleApprove(c)}
                                        className="flex items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all active:scale-95"
                                    >
                                        <CheckCircle2 size={14} /> Valider Profil
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                title="Dossier Candidature"
            >
                {selectedCandidature && (
                    <div className="space-y-8">
                        <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-2xl">
                            <div className="w-16 h-16 bg-secondary-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black italic">
                                {selectedCandidature.prenom[0]}{selectedCandidature.nom[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-black text-secondary-900 truncate">
                                        {selectedCandidature.prenom} {selectedCandidature.nom}
                                    </h3>
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                        selectedCandidature.statut === 'EN_ATTENTE'
                                            ? 'bg-amber-50 text-amber-600'
                                            : selectedCandidature.statut === 'ACCEPTEE'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-red-50 text-red-600'
                                    }`}>
                                        {selectedCandidature.statut}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-400 font-medium">
                                    Dossier reçu le {new Date(selectedCandidature.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Coordonnées</p>
                                <div className="space-y-1 text-[12px]">
                                    <div className="flex items-center gap-2 text-secondary-900">
                                        <Mail size={14} className="text-gray-300" />
                                        <span className="font-bold break-all">{selectedCandidature.email}</span>
                                    </div>
                                    {selectedCandidature.telephone && (
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Briefcase size={14} className="text-gray-300" />
                                            <span className="font-medium">{selectedCandidature.telephone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Profil</p>
                                <div className="space-y-1 text-[12px]">
                                    <p className="font-bold text-secondary-900">
                                        {selectedCandidature.experience} ans d'expérience
                                    </p>
                                    {selectedCandidature.motsCles?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedCandidature.motsCles.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest border border-gray-100"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {selectedCandidature.remarques && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Présentation & motivations</p>
                                <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">
                                    {selectedCandidature.remarques}
                                </p>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Curriculum Vitae</p>
                                {selectedCandidature.cv ? (
                                    <a
                                        href={buildFileUrl(selectedCandidature.cv)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 text-secondary-900 text-[11px] font-black uppercase tracking-widest hover:bg-secondary-900 hover:text-white transition-all"
                                    >
                                        <ExternalLink size={14} /> Ouvrir le CV
                                    </a>
                                ) : (
                                    <p className="text-[12px] text-gray-400">Aucun CV fourni.</p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Documents complémentaires</p>
                                {selectedCandidature.documents && selectedCandidature.documents.length > 0 ? (
                                    <ul className="space-y-2 text-[12px] text-gray-700">
                                        {selectedCandidature.documents.map((doc, idx) => (
                                            <li key={idx}>
                                                <a
                                                    href={buildFileUrl(doc.url)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-secondary-900 transition-colors"
                                                >
                                                    <FileText size={14} className="text-gray-400" />
                                                    <span className="truncate max-w-[160px]">{doc.name || 'Document joint'}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-[12px] text-gray-400">Aucun document complémentaire.</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-between">
                            <div className="text-[11px] text-gray-400 space-y-1">
                                {selectedCandidature.dateTraitement && (
                                    <p>
                                        Traité le {new Date(selectedCandidature.dateTraitement).toLocaleString()}
                                    </p>
                                )}
                                {selectedCandidature.commentaireAdmin && (
                                    <p className="italic">
                                        Note interne : <span className="text-secondary-900">{selectedCandidature.commentaireAdmin}</span>
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-3 justify-end">
                                {selectedCandidature.statut === 'EN_ATTENTE' && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleReject(selectedCandidature)}
                                            disabled={actionLoading}
                                            className="px-5 py-3 rounded-2xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
                                        >
                                            Marquer Refusé
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleApprove(selectedCandidature)}
                                            disabled={actionLoading}
                                            className="px-6 py-3 rounded-2xl bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20"
                                        >
                                            {actionLoading ? 'Traitement...' : 'Valider le Profil'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CandidatureList;
