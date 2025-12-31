import React, { useState, useEffect } from 'react';
import { inscriptionAPI } from '../services/api';
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

/**
 * Registre des Inscriptions
 * Gestion du flux de stagiaires avec vue détaillée en Modal
 */
const InscriptionList = () => {
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
            console.error('Erreur chargement inscriptions');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetail = (ins) => {
        setSelectedIns(ins);
        setIsModalOpen(true);
    };

    const handleStatusChange = async (id, status) => {
        try {
            await inscriptionAPI.updateStatus(id, status);
            setIsModalOpen(false);
            fetchInscriptions();
        } catch (err) {
            alert('Erreur lors de la mise à jour');
        }
    };

    const filtered = inscriptions.filter(i =>
        `${i.prenom} ${i.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.formationId?.titre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <div className="flex gap-4 w-full md:w-auto">
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
                                                    <p className="text-[10px] font-bold text-gray-400">{i.email}</p>
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
                        <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-[2rem]">
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
                                    <p className="text-sm font-black text-secondary-900 flex items-center gap-2 italic"><Building2 size={16} /> Professionnel</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase italic">Inscrit le {new Date(selectedIns.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100 flex items-start gap-4 italic italic">
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
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default InscriptionList;
