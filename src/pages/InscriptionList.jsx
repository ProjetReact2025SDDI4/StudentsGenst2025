import React, { useState, useEffect } from 'react';
import { inscriptionAPI } from '../services/api';
import { useConfirm } from '../context/ConfirmContext';
import {
    Users,
    Search,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    MoreVertical,
    Download,
    Eye,
    Briefcase,
    Building2,
    AlertCircle
} from 'lucide-react';
import Modal from '../components/Modal';
import { Button } from '../components/UIComponents';

const buildFileUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const baseUrl = apiUrl.replace(/\/api$/, '');
    const normalized = url.replace(/^\/+/, '');
    return `${baseUrl}/${normalized}`;
};

/**
 * Registre des Inscriptions
 * Gestion du flux de stagiaires avec vue détaillée en Modal
 */
const InscriptionList = () => {
    const confirm = useConfirm();
    const [inscriptions, setInscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIns, setSelectedIns] = useState(null);

    useEffect(() => {
        fetchInscriptions();
    }, []);

    const fetchInscriptions = async () => {
        setLoading(true);
        try {
            const res = await inscriptionAPI.getAll();
            setInscriptions(res.data.data);
        } catch (err) {
            console.error('Erreur chargement inscriptions', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetail = (ins) => {
        setSelectedIns(ins);
        setIsModalOpen(true);
    };

    const handleStatusChange = async (id, status) => {
        const statusLabels = {
            'VALIDE': 'Valider',
            'ANNULEE': 'Annuler',
            'EN_ATTENTE': 'Remettre en attente'
        };

        const isConfirmed = await confirm({
            title: `${statusLabels[status] || 'Modifier'} l'inscription ?`,
            message: `Êtes-vous sûr de vouloir passer cette inscription au statut "${status}" ?`,
            type: status === 'ANNULEE' ? 'danger' : 'info',
            confirmText: 'Confirmer le changement'
        });

        if (isConfirmed) {
            try {
                await inscriptionAPI.updateStatus(id, status);
                setIsModalOpen(false);
                fetchInscriptions();
            } catch (err) {
                console.error('Erreur lors de la mise à jour', err);
                alert('Erreur lors de la mise à jour');
            }
        }
    };

    const filtered = inscriptions.filter(i =>
        `${i.prenom} ${i.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.formationId?.titre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        const rows = filtered.map(i => ({
            Prenom: i.prenom,
            Nom: i.nom,
            Email: i.email,
            Programme: i.formationId?.titre || '',
            Statut: i.statut,
            DateInscription: i.createdAt ? new Date(i.createdAt).toLocaleDateString('fr-FR') : ''
        }));
        exportToCsv(rows, 'inscriptions.csv');
    };

    if (loading) return (
        <div className="space-y-10 animate-pulse italic">
            <div className="h-10 w-48 bg-gray-100 rounded-lg"></div>
            <div className="h-96 bg-gray-50 rounded-[3rem]"></div>
        </div>
    );

    return (
        <div className="space-y-10 italic">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tighter italic">Registre Stagiaires.</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Suivi administratif des dossiers d'inscription.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary-500/5 transition-all shadow-sm shadow-gray-200/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleExport}
                        icon={Download}
                        className="whitespace-nowrap"
                    >
                        Exporter
                    </Button>
                </div>
            </header>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 italic">
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Apprenant</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Programme</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Statut</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 italic">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center">
                                        <Users size={48} className="mx-auto text-gray-100 mb-4" />
                                        <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.3em]">Aucune data disponible</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((i) => (
                                    <tr key={i._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-secondary-900 text-white rounded-2xl flex items-center justify-center font-black italic shadow-lg shadow-gray-200">
                                                    {i.prenom[0]}{i.nom[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-secondary-900 capitalize">{i.prenom} {i.nom}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <p className="text-[10px] font-bold text-gray-400">{i.email}</p>
                                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${i.typeCandidat === 'ENTREPRISE' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                                            {i.typeCandidat === 'ENTREPRISE' ? 'Entreprise' : 'Particulier'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-secondary-900 line-clamp-1 italic">{i.formationId?.titre}</p>
                                                <div className="flex items-center gap-2 text-[9px] font-black text-gray-300 uppercase italic">
                                                    <Calendar size={10} /> {new Date(i.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-2 w-fit italic
                                                ${i.statut === 'CONFIRMEE' ? 'bg-emerald-100 text-emerald-700' :
                                                    i.statut === 'EN_ATTENTE' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'}`}>
                                                {i.statut === 'CONFIRMEE' ? <CheckCircle2 size={12} /> :
                                                    i.statut === 'EN_ATTENTE' ? <Clock size={12} /> :
                                                        <XCircle size={12} />}
                                                {i.statut}
                                            </span>
                                        </td>
                                        <td className="p-8">
                                            <button
                                                onClick={() => handleOpenDetail(i)}
                                                className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-secondary-900 hover:text-white transition-all shadow-sm"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Detail Inscription */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Détails du Dossier"
            >
                {selectedIns && (
                    <div className="space-y-10 italic">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 bg-gray-50 rounded-[2rem]">
                            <div className="w-20 h-20 bg-secondary-900 text-white rounded-[1.5rem] flex items-center justify-center text-3xl font-black italic">
                                {selectedIns.prenom[0]}{selectedIns.nom[0]}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-secondary-900 italic">{selectedIns.prenom} {selectedIns.nom}</h3>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 italic"><Mail size={14} /> {selectedIns.email}</span>
                                    <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 italic"><Phone size={14} /> {selectedIns.telephone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8 italic">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Information Formation</h4>
                                <div className="p-5 border border-gray-100 rounded-2xl space-y-3 shadow-sm">
                                    <p className="text-sm font-black text-secondary-900 leading-tight italic">{selectedIns.formationId?.titre}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2"><Briefcase size={12} /> {selectedIns.formationId?.categorie}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Contexte</h4>
                                <div className="p-5 border border-gray-100 rounded-2xl space-y-3 shadow-sm">
                                    {selectedIns.typeCandidat === 'ENTREPRISE' ? (
                                        <>
                                            <p className="text-sm font-black text-secondary-900 flex items-center gap-2 italic">
                                                <Building2 size={16} className="text-primary-500" /> {selectedIns.entreprise}
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase italic">Poste : {selectedIns.fonction || 'Non précisé'}</p>
                                        </>
                                    ) : (
                                        <p className="text-sm font-black text-secondary-900 flex items-center gap-2 italic">
                                            <Users size={16} className="text-primary-500" /> Particulier
                                        </p>
                                    )}
                                    <p className="text-[10px] font-bold text-gray-400 uppercase italic">Inscrit le {new Date(selectedIns.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {selectedIns.documents && selectedIns.documents.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Documents joints</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {selectedIns.documents.map((doc, index) => (
                                        <a
                                            key={index}
                                            href={buildFileUrl(doc)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-primary-500 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary-600 shadow-sm">
                                                    <Download size={14} />
                                                </div>
                                                <span className="text-[10px] font-black text-secondary-900 uppercase tracking-tight">Document {index + 1}</span>
                                            </div>
                                            <Eye size={14} className="text-gray-300 group-hover:text-primary-500" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedIns.statut === 'EN_ATTENTE' && (
                            <>
                                <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100 flex items-start gap-4 italic">
                                    <AlertCircle className="text-amber-500 shrink-0" size={20} />
                                    <div>
                                        <p className="text-[11px] font-black text-amber-900 uppercase tracking-widest mb-1">Dossier en attente</p>
                                        <p className="text-[10px] text-amber-700/80 font-medium">Veuillez vérifier les pièces jointes et la validité du mode de financement avant de confirmer définitivement.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        variant="secondary"
                                        loading={loading}
                                        onClick={() => handleStatusChange(selectedIns._id, 'ANNULEE')}
                                        icon={XCircle}
                                        className="flex-1 text-red-500 hover:bg-red-50"
                                    >
                                        Refuser
                                    </Button>
                                    <Button
                                        variant="accent"
                                        loading={loading}
                                        onClick={() => handleStatusChange(selectedIns._id, 'CONFIRMEE')}
                                        icon={CheckCircle2}
                                        className="flex-[2]"
                                    >
                                        Confirmer l'Inscription
                                    </Button>
                                </div>
                            </>
                        )}

                        {selectedIns.statut === 'CONFIRMEE' && (
                            <>
                                <div className="bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100 flex items-start gap-4 italic">
                                    <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                                    <div>
                                        <p className="text-[11px] font-black text-emerald-900 uppercase tracking-widest mb-1">Dossier confirmé</p>
                                        <p className="text-[10px] text-emerald-700/80 font-medium">Cette inscription a été validée. Vous pouvez la remettre en attente ou l'annuler si besoin.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        variant="secondary"
                                        loading={loading}
                                        onClick={() => handleStatusChange(selectedIns._id, 'EN_ATTENTE')}
                                        icon={Clock}
                                        className="flex-1 text-amber-600 hover:bg-amber-50"
                                    >
                                        Remettre en attente
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        loading={loading}
                                        onClick={() => handleStatusChange(selectedIns._id, 'ANNULEE')}
                                        icon={XCircle}
                                        className="flex-1 text-red-500 hover:bg-red-50"
                                    >
                                        Annuler l'inscription
                                    </Button>
                                </div>
                            </>
                        )}

                        {selectedIns.statut === 'ANNULEE' && (
                            <>
                                <div className="bg-red-50 rounded-[2rem] p-6 border border-red-100 flex items-start gap-4 italic">
                                    <XCircle className="text-red-500 shrink-0" size={20} />
                                    <div>
                                        <p className="text-[11px] font-black text-red-900 uppercase tracking-widest mb-1">Dossier annulé</p>
                                        <p className="text-[10px] text-red-700/80 font-medium">Cette inscription a été annulée. Vous pouvez la réactiver ou la confirmer exceptionnellement.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        variant="secondary"
                                        loading={loading}
                                        onClick={() => handleStatusChange(selectedIns._id, 'EN_ATTENTE')}
                                        icon={Clock}
                                        className="flex-1 text-amber-600 hover:bg-amber-50"
                                    >
                                        Remettre en attente
                                    </Button>
                                    <Button
                                        variant="accent"
                                        loading={loading}
                                        onClick={() => handleStatusChange(selectedIns._id, 'CONFIRMEE')}
                                        icon={CheckCircle2}
                                        className="flex-1"
                                    >
                                        Confirmer l'inscription
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default InscriptionList;
