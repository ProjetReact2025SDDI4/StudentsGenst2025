import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { planningAPI, evaluationAPI } from '../services/api';
import {
    Calendar,
    Star,
    Clock,
    MapPin,
    BookOpen,
    MessageSquare,
    ArrowRight,
    Download,
    Award,
    Zap,
    Users,
    ChevronRight,
    TrendingUp
} from 'lucide-react';

const FormateurDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalSessions: 0,
        averageRating: 0,
        nextSession: null,
        recentEvaluations: [],
        evaluationCount: 0,
        averages: {
            pedagogie: 0,
            rythme: 0,
            support: 0,
            maitriseSujet: 0
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormateurData = async () => {
            if (!user || user.role !== 'FORMATEUR') return;

            try {
                const plansRes = await planningAPI.getAll();
                const mySessions = plansRes.data.data.filter(p => p.formateurId?.userId?._id === user._id);
                // Tri par date pour avoir la prochaine session
                mySessions.sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut));

                const evalRes = await evaluationAPI.getAll();
                const myEvals = evalRes.data.data.filter(e => e.formateurId?.userId?._id === user._id);

                const evaluationCount = myEvals.length;

                let averages = {
                    pedagogie: 0,
                    rythme: 0,
                    support: 0,
                    maitriseSujet: 0
                };

                let averageRating = 0;

                if (evaluationCount > 0) {
                    const totals = myEvals.reduce(
                        (acc, curr) => ({
                            pedagogie: acc.pedagogie + (curr.notePedagogie || 0),
                            rythme: acc.rythme + (curr.rythme || 0),
                            support: acc.support + (curr.support || 0),
                            maitriseSujet: acc.maitriseSujet + (curr.maitriseSujet || 0)
                        }),
                        { pedagogie: 0, rythme: 0, support: 0, maitriseSujet: 0 }
                    );

                    averages = {
                        pedagogie: totals.pedagogie / evaluationCount,
                        rythme: totals.rythme / evaluationCount,
                        support: totals.support / evaluationCount,
                        maitriseSujet: totals.maitriseSujet / evaluationCount
                    };

                    averageRating = (averages.pedagogie + averages.rythme + averages.support + averages.maitriseSujet) / 4;
                }

                setStats({
                    totalSessions: mySessions.length,
                    averageRating,
                    nextSession: mySessions.find(s => new Date(s.dateDebut) >= new Date()) || mySessions[0],
                    recentEvaluations: myEvals.slice(0, 3),
                    evaluationCount,
                    averages
                });
            } catch (err) {
                console.error('Erreur dashboard formateur');
            } finally {
                setLoading(false);
            }
        };
        fetchFormateurData();
    }, [user]);

    if (loading) return (
        <div className="space-y-10 animate-pulse italic">
            <div className="h-12 w-64 bg-gray-100 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-[2rem]"></div>)}
            </div>
            <div className="h-96 bg-gray-100 rounded-[3rem]"></div>
        </div>
    );

    return (
        <div className="space-y-10 italic">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
                        <Zap size={12} /> Expert Certifié
                    </div>
                    <h1 className="text-4xl font-black text-secondary-900 tracking-tighter italic">
                        Heureux de vous revoir, <span className="text-primary-600 underline decoration-primary-200 underline-offset-8 decoration-4">{user.prenom}</span>.
                    </h1>
                </div>
                <div className="flex gap-12 text-center">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Score Qualité</p>
                        <div className="flex items-center gap-1 justify-center">
                            <Star size={16} className="fill-amber-400 text-amber-400" />
                            <span className="text-2xl font-black text-secondary-900">{stats.averageRating.toFixed(1)}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sessions Actives</p>
                        <p className="text-2xl font-black text-secondary-900">{stats.totalSessions}</p>
                    </div>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Main: Next Session Focus */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-secondary-900 rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full blur-[140px] opacity-10 -mr-48 -mt-48 transition-all hover:opacity-20 animate-pulse"></div>

                        <div className="relative z-10 space-y-12">
                            <div className="flex justify-between items-center">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500 italic">Prochaine Masterclass</h2>
                                <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors hover:bg-white/10 cursor-pointer italic italic">Calendrier <ChevronRight size={12} className="inline ml-1" /></span>
                            </div>

                            {stats.nextSession ? (
                                <div className="space-y-10">
                                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter italic leading-tight">{stats.nextSession.formationId?.titre}</h3>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-white/5">
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Date</p>
                                            <p className="font-bold flex items-center gap-2"><Calendar size={14} className="text-primary-500" /> {new Date(stats.nextSession.dateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Horaire</p>
                                            <p className="font-bold flex items-center gap-2"><Clock size={14} className="text-primary-500" /> {stats.nextSession.heureDebut}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Lieu</p>
                                            <p className="font-bold flex items-center gap-2"><MapPin size={14} className="text-primary-500" /> {stats.nextSession.lieu || 'Paris Centre'}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Client</p>
                                            <p className="font-bold flex items-center gap-2"><Users size={14} className="text-primary-500" /> {stats.nextSession.entrepriseId?.nom || 'Individuels'}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 italic italic">
                                        <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-primary-500/20 italic italic">Démarrer la Session</button>
                                        <button className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic italic">Documents de Bord</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 text-center opacity-40">
                                    <Calendar size={48} className="mx-auto mb-6" />
                                    <p className="text-sm font-black italic">Aucune session assignée pour le moment.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Feedback History */}
                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-xl font-black text-secondary-900 tracking-tighter italic flex items-center gap-3">
                                <MessageSquare className="text-primary-500" size={24} /> Feedbacks Étudiants
                            </h2>
                            <Link to="/formateur/evaluations" className="text-[10px] font-black text-gray-400 hover:text-secondary-900 uppercase tracking-widest transition-colors font-bold italic">Tout voir</Link>
                        </div>

                        <div className="space-y-6">
                            {stats.recentEvaluations.map((ev, i) => (
                                <div key={i} className="p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-primary-100 hover:bg-white transition-all italic">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, s) => {
                                                const moyenne = parseFloat(ev.moyenne) || 0;
                                                return (
                                                    <Star
                                                        key={s}
                                                        size={12}
                                                        className={s < moyenne ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">{new Date(ev.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs font-medium text-secondary-700 leading-relaxed italic line-clamp-2">"{ev.commentaire || 'Cours extrêmement clair et structuré. L\'expert maîtrise parfaitement son sujet.'}"</p>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest">{ev.formationId?.titre}</span>
                                        <button className="text-[9px] font-black text-secondary-900 flex items-center gap-1 hover:text-primary-600 transition-colors">Détails <ArrowRight size={10} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Tools & Profile */}
                <div className="space-y-10">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8">
                        <div className="text-center space-y-4">
                            <div className="w-24 h-24 bg-secondary-900 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black italic mx-auto shadow-2xl">
                                {user.prenom[0]}{user.nom[0]}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-secondary-900 italic">{user.prenom} {user.nom}</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Senior Technical Trainer</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-gray-50 italic">
                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-primary-50 rounded-2xl transition-all group">
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary-900 group-hover:text-primary-600 transition-colors">Émargements Mobiles</span>
                                <Download size={16} className="text-gray-300 group-hover:text-primary-500 transition-transform group-hover:translate-y-1" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-primary-50 rounded-2xl transition-all group">
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary-900 group-hover:text-primary-600 transition-colors">Supports de Cours</span>
                                <BookOpen size={16} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-primary-50 rounded-2xl transition-all group">
                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary-900 group-hover:text-primary-600 transition-colors">Espace Certification</span>
                                <Award size={16} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-primary-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-primary-500/20 italic italic">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp size={24} />
                            <h3 className="text-lg font-black italic">Objectifs Annuels</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                    <span>Satisfaction</span>
                                    <span>{((stats.averageRating / 5) * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(stats.averageRating / 5) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                    <span>Volume Horaire</span>
                                    <span>72%</span>
                                </div>
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-white/60 transition-all duration-1000" style={{ width: '72%' }}></div>
                                </div>
                            </div>
                        </div>
                        <p className="mt-10 text-[10px] font-medium text-white/70 italic italic leading-relaxed">Continuez sur cette lancée ! Vous êtes dans le top 5% des formateurs les mieux notés ce trimestre.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormateurDashboard;
