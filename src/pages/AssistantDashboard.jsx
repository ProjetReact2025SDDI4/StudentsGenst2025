import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { planningAPI, inscriptionAPI, entrepriseAPI } from '../services/api';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Building2,
    TrendingUp,
    Clock,
    Plus,
    ArrowRight,
    Search,
    Filter,
    MoreHorizontal,
    Briefcase
} from 'lucide-react';

const AssistantDashboard = () => {
    const [stats, setStats] = useState({
        nextSessions: [],
        pendingInscriptions: [],
        totalEntreprises: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [planRes, insRes, entRes] = await Promise.all([
                    planningAPI.getAll(),
                    inscriptionAPI.getAll(),
                    entrepriseAPI.getAll()
                ]);

                setStats({
                    nextSessions: planRes.data.data.slice(0, 5),
                    pendingInscriptions: insRes.data.data.filter(i => i.statut === 'EN_ATTENTE').slice(0, 5),
                    totalEntreprises: entRes.data.data.length
                });
            } catch (err) {
                console.error('Erreur chargement dashboard assistant');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="space-y-10 animate-pulse">
            <div className="h-10 w-64 bg-gray-100 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-[2rem]"></div>)}
            </div>
            <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 h-96 bg-gray-100 rounded-[3rem]"></div>
                <div className="h-96 bg-gray-100 rounded-[3rem]"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 italic">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tighter italic">Espace Logistique.</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Coordonnez les ressources et gérez les flux académiques.</p>
                </div>
                <div className="flex gap-4">
                    <button className="p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-secondary-900 transition-all shadow-sm">
                        <Search size={20} />
                    </button>
                    <Link
                        to="/admin/plannings/create"
                        className="bg-secondary-900 text-white px-6 py-3.5 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
                    >
                        <Plus size={18} /> Nouvelle Session
                    </Link>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Inscriptions', value: stats.pendingInscriptions.length, icon: Users, color: 'text-primary-600', bg: 'bg-primary-50', trend: 'À traiter' },
                    { label: 'Sessions', value: stats.nextSessions.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Cette semaine' },
                    { label: 'Sociétés', value: stats.totalEntreprises, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Portfolio actif' },
                    { label: 'Performance', value: '94%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+12% ce mois' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex items-center justify-between">
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                            <h3 className="text-3xl font-black text-secondary-900 tracking-tighter italic">{stat.value}</h3>
                            <p className={`text-[8px] font-black uppercase tracking-widest ${stat.color}`}>{stat.trend}</p>
                        </div>
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Main Activities */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-secondary-900 rounded-xl text-white">
                                    <Clock size={20} />
                                </div>
                                <h2 className="text-xl font-black text-secondary-900 tracking-tighter italic">Prochaines Sessions</h2>
                            </div>
                            <Link to="/admin/plannings" className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline">Voir le planning complet</Link>
                        </div>

                        <div className="space-y-4">
                            {stats.nextSessions.map((session, i) => (
                                <div key={i} className="group p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-primary-100 hover:bg-white transition-all flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-secondary-900 shadow-sm transition-transform group-hover:scale-105">
                                            <span className="text-[9px] font-black uppercase">{new Date(session.dateDebut).toLocaleString('fr-FR', { month: 'short' })}</span>
                                            <span className="text-xl font-black leading-none">{new Date(session.dateDebut).getDate()}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black text-secondary-900 italic line-clamp-1">{session.formationId?.titre}</h4>
                                            <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary-500" /> {session.heureDebut}</span>
                                                <span className="flex items-center gap-1.5"><Briefcase size={12} className="text-primary-500" /> {session.formateurId?.userId?.prenom} {session.formateurId?.userId?.nom}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-3 text-gray-300 hover:text-secondary-900 transition-colors"><MoreHorizontal size={20} /></button>
                                </div>
                            ))}
                            {stats.nextSessions.length === 0 && (
                                <div className="py-20 text-center space-y-4">
                                    <Calendar size={48} className="mx-auto text-gray-100" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Aucune session programmée</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Flux Inscriptions */}
                <div className="space-y-10">
                    <div className="bg-secondary-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16"></div>
                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <h2 className="text-xl font-black italic">Flux Entrant</h2>
                            <span className="px-3 py-1 bg-primary-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{stats.pendingInscriptions.length} Nouveaux</span>
                        </div>

                        <div className="space-y-6 relative z-10">
                            {stats.pendingInscriptions.map((ins, i) => (
                                <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-secondary-900 font-black italic">
                                            {ins.prenom[0]}{ins.nom[0]}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-black truncate italic">{ins.nomComplet}</p>
                                            <p className="text-[9px] font-bold text-gray-500 truncate italic">Inscrit le {new Date(ins.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest line-clamp-1 italic italic mb-4">{ins.formationId?.titre}</p>
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-white text-secondary-900 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all">Valider</button>
                                        <button className="p-2 border border-white/10 rounded-lg text-white/40 hover:text-white transition-all"><ArrowRight size={14} /></button>
                                    </div>
                                </div>
                            ))}
                            {stats.pendingInscriptions.length === 0 && (
                                <div className="py-10 text-center opacity-30">
                                    <Users size={32} className="mx-auto mb-4" />
                                    <p className="text-[9px] font-black uppercase tracking-widest italic">File d'attente vide</p>
                                </div>
                            )}
                        </div>

                        <Link
                            to="/admin/inscriptions"
                            className="mt-10 w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all italic italic"
                        >
                            Accéder au Registre <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm italic text-sm">
                        <div className="flex items-center gap-3 mb-4 text-primary-600">
                            <TrendingUp size={20} />
                            <span className="font-black uppercase tracking-widest text-[10px]">Analyse Logistique</span>
                        </div>
                        <p className="text-secondary-600 font-medium leading-relaxed italic italic">Le taux de remplissage des sessions de ce mois est en hausse de <span className="text-secondary-900 font-black">18.5%</span>. Pensez à vérifier les disponibilités des salles pour les sessions bonus.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssistantDashboard;
