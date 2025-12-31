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
            console.error('Erreur chargement formateurs');
        } finally {
            setLoading(false);
        }
    };

    const filtered = formateurs.filter(f =>
        `${f.userId?.prenom} ${f.userId?.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 italic">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tighter italic">Corps Enseignant.</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Experts certifiés et intervenants spécialisés.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un expert..."
                            className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary-500/5 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-72 bg-gray-50 rounded-[3rem] animate-pulse"></div>)
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 italic">
                        <Users size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold">Aucun expert répertorié.</p>
                    </div>
                ) : (
                    filtered.map((f, idx) => (
                        <div key={f._id} className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className="w-16 h-16 bg-gradient-to-br from-secondary-900 to-black text-white rounded-[1.5rem] flex items-center justify-center text-2xl font-black italic shadow-xl">
                                        {f.userId?.prenom[0]}{f.userId?.nom[0]}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-xl">
                                        <Star size={12} className="fill-primary-600" />
                                        <span className="text-[9px] font-black uppercase">Sénior</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-secondary-900 tracking-tight italic capitalize leading-none">{f.userId?.prenom} {f.userId?.nom}</h3>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-3 flex items-center gap-2 italic">
                                        <Briefcase size={12} /> {f.specialites?.join(', ') || 'Consultant Expert'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 italic">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Expérience</p>
                                        <p className="text-xs font-bold text-secondary-900 italic">12+ années</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Localisation</p>
                                        <p className="text-xs font-bold text-secondary-900 italic">Paris / Lyon</p>
                                    </div>
                                </div>

                                <div className="space-y-3 italic">
                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                        <Mail size={16} className="text-gray-200" /> {f.userId?.email}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-gray-50 flex justify-between items-center italic">
                                <a
                                    href={f.cv} target="_blank" rel="noreferrer"
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-secondary-900 transition-colors italic"
                                >
                                    <FileText size={16} /> Portfolio (CV)
                                </a>
                                <button className="p-3 text-gray-300 hover:text-secondary-900 transition-colors"><MoreHorizontal size={20} /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FormateurList;
