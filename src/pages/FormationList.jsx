import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formationAPI } from '../services/api';
import {
    Search,
    Filter,
    Clock,
    MapPin,
    Euro,
    ArrowRight,
    BookOpen,
    Star,
    Sparkles
} from 'lucide-react';

const FormationList = () => {
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        fetchFormations();
    }, []);

    const fetchFormations = async () => {
        try {
            const res = await formationAPI.getAll();
            setFormations(res.data.data);
        } catch (err) {
            console.error('Erreur chargement formations');
        } finally {
            setLoading(false);
        }
    };

    const categories = [...new Set(formations.map(f => f.categorie))];

    const filteredFormations = formations.filter(f =>
        (f.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.categorie.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (categoryFilter === '' || f.categorie === categoryFilter)
    );

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-20 space-y-12 animate-pulse">
            <div className="h-40 bg-gray-100 rounded-[3rem]"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 bg-gray-100 rounded-[2.5rem]"></div>)}
            </div>
        </div>
    );

    return (
        <div className="bg-white min-h-screen italic">
            {/* Premium Header */}
            <div className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[500px] bg-gradient-to-b from-primary-50/50 to-transparent rounded-full blur-3xl opacity-50 -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-widest animate-fade-in shadow-sm italic">
                        <Sparkles size={14} /> Explorez l'Excellence
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-secondary-900 tracking-tighter animate-slide-up italic">
                        Catalogue des <span className="text-primary-600">Formations</span>.
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-gray-400 font-medium animate-slide-up italic delay-100">
                        Propulsez votre carrière avec nos programmes certifiants conçus par des experts du secteur.
                    </p>

                    {/* Search & Filter Bar */}
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 p-3 bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 animate-slide-up delay-200">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Quelle compétence souhaitez-vous acquérir ?"
                                className="w-full py-4 pl-16 pr-6 bg-gray-50/50 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-bold text-secondary-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="md:w-64 relative group">
                            <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                            <select
                                className="w-full py-4 pl-16 pr-6 bg-gray-50/50 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-bold text-secondary-900 appearance-none"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">Toutes catégories</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Formations Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredFormations.map((f, idx) => (
                        <div key={f._id} className="group flex flex-col bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-slide-up italic" style={{ animationDelay: `${idx * 100}ms` }}>
                            {/* Card Header/Thumbnail Placeholder */}
                            <div className="relative h-64 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-12">
                                    <BookOpen size={80} className="text-white opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-secondary-900/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest text-secondary-900 shadow-xl italic">
                                    {f.categorie}
                                </div>
                                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-white italic">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-white" />)}
                                        <span className="text-[10px] font-black ml-1">(4.9)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest">
                                        <Clock size={12} /> {f.nombreHeures}h
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="flex-1 p-10 space-y-6">
                                <h3 className="text-2xl font-black text-secondary-900 group-hover:text-primary-600 transition-colors leading-tight line-clamp-2 italic italic">
                                    {f.titre}
                                </h3>
                                <p className="text-sm font-medium text-gray-400 line-clamp-3 leading-relaxed italic italic">
                                    {f.objectifs || "Maîtrisez les outils les plus demandés du marché avec une approche pratique et orientée projet."}
                                </p>

                                <div className="flex flex-wrap gap-4 text-xs font-black text-gray-500 uppercase tracking-widest pt-4 border-t border-gray-50 italic">
                                    <span className="flex items-center gap-2 italic"><MapPin size={14} className="text-primary-500" /> {f.ville}</span>
                                    <span className="flex items-center gap-2 italic"><Euro size={14} className="text-primary-500" /> {f.cout}</span>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="p-10 pt-0 flex italic font-bold">
                                <Link
                                    to={`/formations/${f._id}`}
                                    className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gray-50 group-hover:bg-secondary-900 text-secondary-900 group-hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 italic italic"
                                >
                                    Découvrir le cursus
                                    <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 italic">
                <div className="bg-secondary-900 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600 rounded-full blur-[120px] opacity-10 -ml-48 -mt-48"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-10 -mr-48 -mb-48"></div>

                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic">
                            Prêt à Transformer votre <span className="text-primary-500">Avenir</span> ?
                        </h2>
                        <p className="max-w-xl mx-auto text-gray-400 font-medium italic">
                            Nos conseillers sont à votre disposition pour définir le parcours le plus adapté à vos ambitions professionnelles.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4 italic">
                            <Link to="/candidature" className="px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary-500/20 italic italic">
                                Rejoindre les Experts
                            </Link>
                            <a href="#contact" className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all italic italic">
                                Contactez-nous
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormationList;
