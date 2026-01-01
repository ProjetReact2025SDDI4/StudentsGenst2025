import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formationAPI } from '../services/api';
import {
    BookOpen,
    Users,
    Award,
    CheckCircle,
    ArrowRight,
    Play,
    Star,
    Sparkles,
    ShieldCheck,
    Globe,
} from 'lucide-react';

const Home = () => {
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormations = async () => {
            try {
                const response = await formationAPI.getAll();
                // On prend les 4 dernières formations
                setFormations(response.data.data.slice(0, 4));
            } catch (err) {
                console.error('Erreur chargement formations', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFormations();
    }, []);

    return (
        <div className="bg-gradient-to-b from-white via-gray-50 to-white dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950 min-h-screen italic">
            <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-[120px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-10 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/5 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-[0.25em] italic">
                                <Sparkles size={14} /> Leadership & Innovation
                            </div>

                            <h1 className="text-6xl lg:text-8xl font-black text-secondary-900 leading-[0.9] tracking-tighter italic">
                                Érigez Votre <br />
                                <span className="text-primary-600 underline decoration-primary-200 decoration-8 underline-offset-4">Expertise</span>.
                            </h1>

                            <p className="max-w-xl mx-auto lg:mx-0 text-xl text-gray-400 font-medium leading-relaxed italic">
                                Des cursus d'excellence pour transformer vos ambitions en succès tangibles.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
                                <Link to="/formations" className="group px-10 py-5 bg-secondary-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 transition-all hover:bg-black active:scale-95">
                                    Découvrir le Catalogue
                                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                                <Link to="/candidature" className="px-10 py-5 bg-white border border-gray-100 text-secondary-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-gray-50 flex items-center justify-center gap-3">
                                    <Play size={16} className="fill-current text-primary-600" /> Devenir Formateur
                                </Link>
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-xl animate-fade-in delay-200">
                            <div className="relative group">
                                <div className="absolute -inset-8 bg-primary-600/5 rounded-[4rem] blur-[80px] dark:bg-primary-900/10"></div>
                                <div className="relative aspect-[4/5] bg-gray-50 dark:bg-secondary-900 rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-secondary-800">
                                    <img
                                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                        alt="Professional Training"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/40 via-transparent to-transparent"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-32 italic">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex justify-between items-end mb-16">
                        <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase text-primary-600 tracking-[0.3em] italic">Excellence</div>
                            <h2 className="text-4xl lg:text-5xl font-black text-secondary-900 italic">Programmes Phares.</h2>
                        </div>
                        <Link to="/formations" className="group flex items-center gap-2 text-xs font-black uppercase text-secondary-900 border-b-2 border-secondary-900 pb-2 hover:text-primary-600 hover:border-primary-600 transition-all italic">
                            Voir plus <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ? (
                            [1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-gray-50 dark:bg-secondary-900 rounded-[2.5rem] animate-pulse"></div>)
                        ) : (
                            formations.map((f, idx) => (
                                <Link key={f._id} to={`/formations/${f._id}`} className="group bg-white dark:bg-secondary-900 rounded-[2.5rem] border border-gray-100 dark:border-secondary-800 hover:shadow-2xl transition-all p-4 animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className="aspect-square bg-gray-100 dark:bg-secondary-800 rounded-[2rem] relative overflow-hidden mb-6">
                                        {f.image ? (
                                            <img
                                                src={f.image}
                                                alt={f.titre}
                                                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                                                <Award size={56} className="text-white/40 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-secondary-900/5 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-black text-secondary-900 line-clamp-2 leading-tight italic group-hover:text-primary-600 transition-colors">{f.titre}</h3>
                                        <div className="flex justify-between items-center text-[9px] font-black text-gray-300 uppercase tracking-widest pt-4 border-t border-gray-50 italic">
                                            <span>{f.nombreHeures} Heures</span>
                                            <span className="text-secondary-900">{f.cout} DH</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
