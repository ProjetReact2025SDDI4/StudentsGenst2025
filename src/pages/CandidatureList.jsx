import React, { useState, useEffect } from 'react';
import { candidatureAPI } from '../services/api';
import {
    FileText,
    CheckCircle2,
    XCircle,
    Mail,
    Briefcase,
    Calendar,
    ChevronRight,
    Search,
    ExternalLink
} from 'lucide-react';

const CandidatureList = () => {
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCandidatures();
    }, []);

    const fetchCandidatures = async () => {
        try {
            const res = await candidatureAPI.getAll();
            setCandidatures(res.data.data);
        } catch (err) {
            console.error('Erreur chargement candidatures');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm('Valider cette candidature et créer un compte formateur ?')) return;
        try {
            await candidatureAPI.approve(id);
            alert('Candidature approuvée ! Compte créé.');
            fetchCandidatures();
        } catch (err) {
            alert('Erreur lors de la validation');
        }
    };

    const filteredCandidatures = candidatures.filter(c =>
        `${c.prenom} ${c.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.motsCles?.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="space-y-6">
        <div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse"></div>
        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-3xl animate-pulse"></div>)}
    </div>;

    return (
        <div className="space-y-10 italic">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tighter">Recrutements</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Gérez les nouveaux talents et validez les profils experts.</p>
                </div>
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un expert ou une compétence..."
                        className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="grid gap-6">
                {filteredCandidatures.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-gray-200">
                        <FileText size={48} className="mx-auto text-gray-100 mb-6" />
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Aucune candidature trouvée</p>
                    </div>
                ) : (
                    filteredCandidatures.map((c) => (
                        <div key={c._id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                            <div className="flex flex-col lg:flex-row justify-between gap-8 relative z-10">
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary-900 text-xl font-black italic border border-gray-100 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                            {c.prenom.charAt(0)}{c.nom.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-black text-secondary-900 group-hover:text-primary-600 transition-colors">{c.prenom} {c.nom}</h3>
                                                <span className={`px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase ${c.statut === 'EN_ATTENTE' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    {c.statut}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Mail size={12} /> {c.email}</span>
                                                <span className="flex items-center gap-1.5"><Briefcase size={12} /> {c.experience} ans d'XP</span>
                                                <span className="flex items-center gap-1.5"><Calendar size={12} /> Reçu le {new Date(c.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {c.motsCles?.map((tag, i) => (
                                            <span key={i} className="bg-gray-50 text-gray-400 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-gray-50 group-hover:border-primary-100 group-hover:text-primary-500 transition-all">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-row lg:flex-col justify-end gap-3 lg:border-l border-gray-50 lg:pl-8">
                                    {c.cv && (
                                        <a
                                            href={c.cv.startsWith('http') ? c.cv : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}/${c.cv}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-secondary-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all group"
                                        >
                                            <ExternalLink size={14} className="group-hover:rotate-12 transition-transform" />
                                            Document CV
                                        </a>
                                    )}
                                    <button
                                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-50 hover:text-primary-600 transition-all"
                                        onClick={() => alert(c.remarques || 'Aucune remarque')}
                                    >
                                        <FileText size={14} /> Note interne
                                    </button>
                                    {c.statut === 'EN_ATTENTE' && (
                                        <button
                                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all active:scale-95"
                                            onClick={() => handleApprove(c._id)}
                                        >
                                            <CheckCircle2 size={14} /> Approuver Profil
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CandidatureList;
