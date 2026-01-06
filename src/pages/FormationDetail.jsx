import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formationAPI } from '../services/api';

const FormationDetail = () => {
    const { slug } = useParams();
    const [formation, setFormation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormation = async () => {
            try {
                const response = await formationAPI.getBySlug(slug);
                setFormation(response.data.data);
            } catch (err) {
                console.error('Erreur API', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFormation();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Chargement du cursus...</p>
        </div>
    );

    if (!formation) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-black text-secondary-900 mb-4 opacity-10">404</h1>
            <p className="text-gray-500 font-bold mb-8 italic">Le cursus demandé n'est plus disponible ou a été déplacé.</p>
            <Link to="/formations" className="btn-primary py-3 px-8 text-sm">Retourner au catalogue</Link>
        </div>
    );

    return (
        <div className="bg-white dark:bg-secondary-950 min-h-screen py-10">
            <div className="max-w-6xl mx-auto px-6">
                {/* Slim Breadcrumb */}
                <nav className="mb-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">Accueil</Link>
                    <span>/</span>
                    <Link to="/formations" className="hover:text-primary-600 dark:hover:text-primary-400">Catalogue</Link>
                    <span>/</span>
                    <span className="text-secondary-900 dark:text-gray-100 truncate max-w-[200px]">{formation.titre}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Main Content */}
                    <div className="flex-[1.5] animate-fade-in">
                        {formation.image && (
                            <div className="mb-12 rounded-[3rem] overflow-hidden aspect-[21/9] shadow-2xl">
                                <img 
                                    src={formation.image} 
                                    alt={formation.titre} 
                                    className="w-full h-full object-cover object-center" 
                                />
                            </div>
                        )}
                        <header className="mb-12">
                            <div className="flex gap-3 mb-6">
                                <span className="bg-secondary-900 text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">{formation.categorie}</span>
                                <span className={`border-2 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest ${formation.type === 'INDIVIDU' ? 'border-emerald-500 text-emerald-600' : 'border-amber-500 text-amber-600'}`}>
                                    {formation.type}
                                </span>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-black text-secondary-900 dark:text-gray-50 leading-tight mb-6 capitalize">{formation.titre.toLowerCase()}</h1>
                            <div className="flex gap-10">
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 dark:text-gray-500 uppercase tracking-tighter mb-1">Durée totale</p>
                                    <p className="text-lg font-black text-secondary-800 dark:text-gray-100 italic">{formation.nombreHeures} heures</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 dark:text-gray-500 uppercase tracking-tighter mb-1">Localisation</p>
                                    <p className="text-lg font-black text-secondary-800 dark:text-gray-100 italic">{formation.ville}</p>
                                </div>
                            </div>
                        </header>

                        <div className="space-y-12">
                            <section>
                                <h2 className="text-xs font-black text-primary-600 uppercase tracking-[0.2em] mb-4">Objectifs du programme</h2>
                                <p className="text-gray-600 dark:text-gray-200 leading-relaxed font-medium lg:text-lg italic">
                                    {formation.objectifs}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xs font-black text-primary-600 uppercase tracking-[0.2em] mb-4">Structure d'enseignement</h2>
                                <div className="bg-gray-50/50 dark:bg-secondary-900 rounded-3xl p-8 lg:p-12 border border-gray-100 dark:border-secondary-800 italic">
                                    <div className="text-gray-700 dark:text-gray-100 whitespace-pre-line leading-[1.8] font-medium selection:bg-primary-100">
                                        {formation.programme}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Compact Sidebar Action */}
                    <div className="flex-1 lg:max-w-xs animate-slide-up">
                        <div className="card p-8 border-none bg-gray-900 text-white shadow-2xl sticky top-28">
                            <div className="mb-8">
                                <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-2">Investissement</p>
                                <p className="text-5xl font-black tracking-tighter">{formation.cout} DH</p>
                                <p className="text-[10px] opacity-40 font-bold mt-1 uppercase">Exonéré de TVA (Formation Pro)</p>
                            </div>

                            <div className="space-y-3">
                                <Link 
                                    to={`/inscription/${formation.slug}`} 
                                    className="btn-primary w-full py-4 text-center text-sm uppercase tracking-widest shadow-lg shadow-primary-500/20"
                                >
                                    {formation.type === 'INDIVIDU' ? 'S\'inscrire' : 'S\'inscrire (Entreprise)'}
                                </Link>
                                <button className="w-full text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest py-4 transition-colors">Télécharger le Syllabus PDF</button>
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/10 space-y-4 opacity-80">
                                <div className="flex items-start gap-4">
                                    <div className="w-5 h-5 bg-emerald-500/20 text-emerald-400 flex items-center justify-center rounded shrink-0">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    </div>
                                    <p className="text-[11px] font-bold leading-tight">Accès immédiat au support numérique</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-5 h-5 bg-emerald-500/20 text-emerald-400 flex items-center justify-center rounded shrink-0">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    </div>
                                    <p className="text-[11px] font-bold leading-tight">Passage de certification inclus</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormationDetail;
