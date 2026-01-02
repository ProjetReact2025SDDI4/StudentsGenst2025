import React, { useState, useEffect } from 'react';
import { formateurAPI } from '../services/api';
import {
    Users,
    Search,
    Mail,
    Phone,
    Briefcase,
    Award,
    FileText,
    CheckCircle2,
    MoreHorizontal,
    ExternalLink,
    MapPin,
    Star
} from 'lucide-react';

/**
 * Gestion des Formateurs (Experts)
 * Interface Analytics & Networking
 */
const FormateurList = () => {
    const [formateurs, setFormateurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFormateurs();
    }, []);

    const fetchFormateurs = async () => {
        setLoading(true);
        try {
            const res = await formateurAPI.getAll();
            setFormateurs(res.data.data);
        } catch (err) {
            console.error('Erreur chargement formateurs', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = formateurs.filter(f =>
        `${f.userId?.prenom} ${f.userId?.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="animate-slide-up">
                    <h1 className="text-4xl font-black text-secondary-900 tracking-tight italic">
                        Corps <span className="text-primary-600">Enseignant.</span>
                    </h1>
                    <p className="text-gray-400 text-sm font-medium mt-2">Experts certifiés et intervenants spécialisés.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <div className="relative flex-1 md:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher un expert..."
                            className="w-full bg-white border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary-500/5 shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-gray-50 rounded-3xl animate-pulse"></div>)
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-24 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 italic">
                        <Users size={40} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold">Aucun expert répertorié.</p>
                    </div>
                ) : (
                    filtered.map((f, idx) => (
                        <div
                            key={f._id}
                            className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col animate-slide-up"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-secondary-900 text-white rounded-xl flex items-center justify-center text-lg font-black italic shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    {f.userId?.prenom[0]}{f.userId?.nom[0]}
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-600 rounded-lg">
                                    <Star size={10} className="fill-primary-600" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Sénior</span>
                                </div>
                            </div>

                            <div className="space-y-1 mb-6">
                                <h3 className="text-lg font-black text-secondary-900 truncate italic capitalize">
                                    {f.userId?.prenom} {f.userId?.nom}
                                </h3>
                                <p className="text-[9px] font-bold text-primary-600 uppercase tracking-widest flex items-center gap-2 italic">
                                    <Briefcase size={10} /> {f.specialites?.[0] || 'Consultant Expert'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-gray-50">
                            <div className="space-y-1">
                                <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest">Expérience</p>
                                <p className="text-[10px] font-bold text-secondary-900 italic">
                                    {typeof f.experience === 'number' && f.experience > 0
                                        ? `${f.experience} an${f.experience > 1 ? 's' : ''}`
                                        : 'Non spécifiée'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest">Localisation</p>
                                <p className="text-[10px] font-bold text-secondary-900 italic truncate">
                                    Non spécifiée
                                </p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 truncate">
                                    <Mail size={14} className="text-gray-200" /> {f.userId?.email}
                                </div>
                            </div>

                            <div className="mt-auto pt-4 flex justify-between items-center">
                                {f.cv ? (
                                    <a
                                        href={f.cv}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-secondary-400 hover:text-primary-600 transition-colors italic"
                                    >
                                        <FileText size={14} /> Portfolio (CV)
                                    </a>
                                ) : (
                                    <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-300 cursor-not-allowed italic">
                                        <FileText size={14} /> CV non disponible
                                    </span>
                                )}
                                <button className="p-2 text-gray-200 hover:text-secondary-900 transition-colors">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FormateurList;
