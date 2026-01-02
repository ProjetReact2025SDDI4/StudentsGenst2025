import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { planningAPI, inscriptionAPI, entrepriseAPI } from '../services/api';
import { useConfirm } from '../context/ConfirmContext';
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
    const confirm = useConfirm();
    const [stats, setStats] = useState({
        nextSessions: [],
        pendingInscriptions: [],
        totalEntreprises: 0,
        evolutionInscriptions: []
    });
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [planRes, insRes, entRes, evolRes] = await Promise.all([
                planningAPI.getAll(),
                inscriptionAPI.getAll(),
                entrepriseAPI.getAll(),
                inscriptionAPI.getEvolutionStats({ months: 6 })
            ]);

            const allSessions = planRes.data.data || [];
            const upcoming = allSessions
                .filter(p => new Date(p.dateDebut) >= new Date())
                .sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut))
                .slice(0, 5);

            const evolution = evolRes.data.data || [];

            setStats({
                nextSessions: upcoming,
                pendingInscriptions: insRes.data.data.filter(i => i.statut === 'EN_ATTENTE').slice(0, 5),
                totalEntreprises: entRes.data.data.length,
                evolutionInscriptions: evolution
            });
        } catch (err) {
            console.error('Erreur chargement dashboard assistant', err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickValidate = async (inscription) => {
        const isConfirmed = await confirm({
            title: 'Valider cette inscription ?',
            message: `Confirmer le dossier de ${inscription.nomComplet} pour "${inscription.formationId?.titre}" ?`,
            type: 'info',
            confirmText: 'Valider l\'inscription'
        });

        if (!isConfirmed) return;

        try {
            await inscriptionAPI.updateStatus(inscription._id, 'CONFIRMEE');
            await fetchDashboardData();
        } catch (err) {
            console.error('Erreur validation rapide inscription', err);
            alert('Erreur lors de la validation de l\'inscription');
        }
    };

    const evolutionData = stats.evolutionInscriptions || [];
    const maxTotal = evolutionData.reduce((max, p) => Math.max(max, p.total), 0);

    if (loading) 
        return (
        <div className="space-y-10 animate-pulse">
            <div className="h-10 w-40 sm:w-64 bg-gray-100 rounded-lg"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 sm:h-32 bg-gray-100 rounded-[2rem]"></div>)}
            </div>
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
                <div className="lg:col-span-2 h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-[3rem]"></div>
                <div className="h-64 sm:h-80 lg:h-96 bg-gray-100 rounded-[3rem]"></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 italic">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tighter italic">Espace Logistique.</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Coordonnez les ressources et gérez les flux académiques.</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto justify-start md:justify-end">
                    <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-secondary-900 transition-all shadow-sm">
                        <Search size={20} />
                    </button>
                    <Link
                        to="/admin/plannings"
                        className="flex-1 md:flex-none justify-center bg-secondary-900 text-white px-4 sm:px-6 py-3 rounded-2xl flex items-center gap-2 sm:gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95 text-center"
                    >
                        <Calendar size={18} /> Voir le Planning
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Inscriptions', value: stats.pendingInscriptions.length, icon: Users, color: 'text-primary-600', bg: 'bg-primary-50', trend: 'À traiter' },
                    { label: 'Sessions', value: stats.nextSessions.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Cette semaine' },
                    { label: 'Sociétés', value: stats.totalEntreprises, icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Portfolio actif' },
                    { label: 'Performance', value: '94%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+12% ce mois' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 sm:p-7 lg:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex items-center justify-between">
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

            <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white rounded-[3rem] p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
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
                                <div key={i} className="group p-5 sm:p-6 bg-gray-50/50 rounded-3xl border border-transparent hover:border-primary-100 hover:bg-white transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-between">
                                    <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1 min-w-0">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-secondary-900 shadow-sm transition-transform group-hover:scale-105">
                                            <span className="text-[9px] font-black uppercase">{new Date(session.dateDebut).toLocaleString('fr-FR', { month: 'short' })}</span>
                                            <span className="text-xl font-black leading-none">{new Date(session.dateDebut).getDate()}</span>
                                        </div>
                                        <div className="space-y-1 min-w-0">
                                            <h4 className="text-sm font-black text-secondary-900 italic line-clamp-2 sm:line-clamp-1">{session.formationId?.titre}</h4>
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary-500" /> {session.heureDebut}</span>
                                                <span className="flex items-center gap-1.5"><Briefcase size={12} className="text-primary-500" /> {session.formateurId?.userId?.prenom} {session.formateurId?.userId?.nom}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="self-end sm:self-auto mt-1 sm:mt-0 p-2 sm:p-3 text-gray-300 hover:text-secondary-900 transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
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

                    <div className="bg-white rounded-[3rem] p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-secondary-900 tracking-tighter italic">Évolution des Inscriptions</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Vue synthétique des derniers mois</p>
                                </div>
                            </div>
                            {selectedPeriod && (
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        Détails {selectedPeriod.month.toString().padStart(2, '0')}/{selectedPeriod.year}
                                    </p>
                                    <p className="text-sm font-black text-secondary-900">
                                        {selectedPeriod.total} inscriptions
                                    </p>
                                </div>
                            )}
                        </div>

                        {evolutionData.length === 0 ? (
                            <div className="py-16 text-center text-gray-300 text-xs font-black uppercase tracking-[0.25em]">
                                Pas encore de données suffisantes
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="overflow-x-auto pb-2">
                                    <div className="flex items-end gap-4 h-56 min-w-max">
                                    {evolutionData.map(period => {
                                        const isActive = selectedPeriod && selectedPeriod.period === period.period;
                                        const total = period.total || 0;
                                        const baseHeight = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
                                        const barHeight = total === 0 ? 0 : 20 + (baseHeight * 0.8);

                                        const enAttenteRatio = total > 0 ? (period.EN_ATTENTE / total) * 100 : 0;
                                        const confirmeeRatio = total > 0 ? (period.CONFIRMEE / total) * 100 : 0;
                                        const termineeRatio = total > 0 ? (period.TERMINEE / total) * 100 : 0;
                                        const annuleeRatio = total > 0 ? (period.ANNULEE / total) * 100 : 0;

                                        return (
                                            <button
                                                key={period.period}
                                                type="button"
                                                onClick={() => setSelectedPeriod(period)}
                                                className="flex flex-col items-center gap-3 flex-1 group"
                                            >
                                                <div className="w-full flex-1 flex items-end justify-center">
                                                    <div
                                                        className={`w-6 sm:w-8 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex flex-col justify-end transition-all duration-300 ${isActive ? 'border-primary-300 shadow-lg shadow-primary-100 scale-[1.05]' : 'group-hover:shadow-md group-hover:scale-[1.02]'}`}
                                                        style={{ height: `${barHeight}%` }}
                                                    >
                                                        {total > 0 && (
                                                            <>
                                                                <div
                                                                    className="bg-amber-400"
                                                                    style={{ height: `${enAttenteRatio}%` }}
                                                                />
                                                                <div
                                                                    className="bg-emerald-500"
                                                                    style={{ height: `${confirmeeRatio}%` }}
                                                                />
                                                                <div
                                                                    className="bg-secondary-900"
                                                                    style={{ height: `${termineeRatio}%` }}
                                                                />
                                                                <div
                                                                    className="bg-gray-300"
                                                                    style={{ height: `${annuleeRatio}%` }}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-1 text-center">
                                                    <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-secondary-900' : 'text-gray-400'}`}>
                                                        {new Date(period.year, period.month - 1, 1).toLocaleString('fr-FR', { month: 'short' })}
                                                    </p>
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                        {total} doss.
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex items-center gap-1.5">
                                                <span className="w-3 h-3 rounded-full bg-amber-400" /> En attente
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Confirmées
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <span className="w-3 h-3 rounded-full bg-secondary-900" /> Terminées
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <span className="w-3 h-3 rounded-full bg-gray-300" /> Annulées
                                            </span>
                                        </div>
                                        <div className="text-[9px] font-black text-primary-600 uppercase tracking-widest">
                                            Vue analytique • 6 derniers mois
                                        </div>
                                    </div>
                                    {selectedPeriod && (
                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex flex-wrap gap-3">
                                            <span>En attente: {selectedPeriod.EN_ATTENTE}</span>
                                            <span>Confirmées: {selectedPeriod.CONFIRMEE}</span>
                                            <span>Terminées: {selectedPeriod.TERMINEE}</span>
                                            <span>Annulées: {selectedPeriod.ANNULEE}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="bg-secondary-900 rounded-[3rem] p-6 sm:p-8 lg:p-10 text-white shadow-2xl relative overflow-hidden">
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
                                    <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest line-clamp-2 sm:line-clamp-1 italic italic mb-4">{ins.formationId?.titre}</p>
                                    <div className="flex gap-2">
                                        <button
                                            className="flex-1 bg-white text-secondary-900 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all"
                                            onClick={() => handleQuickValidate(ins)}
                                        >
                                            Valider
                                        </button>
                                        <Link
                                            to="/admin/inscriptions"
                                            className="p-2 border border-white/10 rounded-lg text-white/40 hover:text-white transition-all flex items-center justify-center"
                                        >
                                            <ArrowRight size={14} />
                                        </Link>
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

                    <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-sm italic text-sm">
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
