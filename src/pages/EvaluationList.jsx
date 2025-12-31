import React, { useState, useEffect, useContext } from 'react';
import { evaluationAPI } from '../services/api';
import {
    Star,
    Search,
    MessageSquare,
    User,
    Calendar,
    BookOpen,
    ChevronRight,
    Award,
    Quote
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const EvaluationList = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useContext(AuthContext);
    const isFormateur = user?.role === 'FORMATEUR';

    useEffect(() => {
        fetchEvaluations();
    }, []);

    const fetchEvaluations = async () => {
        setLoading(true);
        try {
            const res = await evaluationAPI.getAll();
            setEvaluations(res.data.data);
        } catch (err) {
            console.error('Erreur chargement évaluations');
        } finally {
            setLoading(false);
        }
    };

    const visibleEvaluations = isFormateur
        ? evaluations.filter(e => e.formateurId?.userId?._id === user._id)
        : evaluations;

    const filtered = visibleEvaluations.filter(e =>
        e.formationId?.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.formateurId?.userId?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.commentaire?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalVisible = filtered.length;

    return (
        <div className="space-y-10 italic">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tighter italic">Qualité & Retours.</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1 italic">Analysez la satisfaction des apprenants pour chaque session.</p>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2">
                        {totalVisible} feedback(s) affiché(s)
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Filtrer par formation ou mot-clé..."
                            className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary-500/5 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-80 bg-gray-50 rounded-[3rem] animate-pulse"></div>)
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 italic">
                        <MessageSquare size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold">Aucun retour d'expérience pour le moment.</p>
                    </div>
                ) : (
                    filtered.map((ev, idx) => {
                        const moyenne = parseFloat(ev.moyenne) || 0;
                        return (
                        <div key={ev._id} className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="space-y-8 relative">
                                <Quote className="absolute -top-4 -left-4 text-primary-50 opacity-0 group-hover:opacity-100 transition-opacity" size={60} />

                                <div className="flex justify-between items-center relative z-10">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className={i < moyenne ? 'fill-amber-400 text-amber-400' : 'text-gray-100'} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black text-secondary-900 bg-gray-50 px-3 py-1 rounded-full italic">{moyenne}/5</span>
                                </div>

                                <p className="text-sm font-medium text-secondary-700 leading-relaxed italic line-clamp-4 relative z-10">
                                    "{ev.commentaire || 'Une expérience de formation exceptionnelle. Le contenu était parfaitement adapté aux enjeux du marché actuel.'}"
                                </p>
                            </div>

                            <div className="mt-10 pt-8 border-t border-gray-50 space-y-6 italic">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{ev.formationId?.titre}</p>
                                    <div className="flex items-center gap-2 text-[9px] font-black text-gray-300 uppercase italic">
                                        <User size={12} /> Expert: {ev.formateurId?.userId?.prenom} {ev.formateurId?.userId?.nom}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-gray-300">
                                    <span className="flex items-center gap-1.5"><Calendar size={10} /> {new Date(ev.createdAt).toLocaleDateString()}</span>
                                    <span className="text-emerald-500 flex items-center gap-1"><Award size={10} /> Certifié</span>
                                </div>
                            </div>
                        </div>
                    )})
                )}
            </div>
        </div>
    );
};

export default EvaluationList;
