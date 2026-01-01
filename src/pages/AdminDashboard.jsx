import { useState, useEffect } from 'react';
import { formationAPI, inscriptionAPI, formateurAPI, candidatureAPI } from '../services/api';
import {
    Users,
    BookOpen,
    ClipboardList,
    FileUser,
    ArrowUpRight,
    TrendingUp,
    Clock
} from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        formations: 0,
        inscriptions: 0,
        formateurs: 0,
        candidatures: 0,
        evolutionInscriptions: []
    });
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [f, i, fo, c, evolRes] = await Promise.all([
                    formationAPI.getAll(),
                    inscriptionAPI.getAll(),
                    formateurAPI.getAll(),
                    candidatureAPI.getAll(),
                    inscriptionAPI.getEvolutionStats({ months: 6 })
                ]);
                setStats({
                    formations: f.data.total || f.data.data.length,
                    inscriptions: i.data.data.length,
                    formateurs: fo.data.data.length,
                    candidatures: c.data.data.length,
                    evolutionInscriptions: evolRes.data.data || []
                });
            } catch (err) {
                console.error('Erreur chargement stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const evolutionData = stats.evolutionInscriptions || [];
    const maxTotal = evolutionData.reduce((max, p) => Math.max(max, p.total), 0);

    const statCards = [
        { label: 'Programmes', value: stats.formations, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Apprenants', value: stats.inscriptions, icon: ClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Experts', value: stats.formateurs, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Candidats', value: stats.candidatures, icon: FileUser, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    if (loading) return <div className="animate-pulse space-y-8">
        <div className="h-12 w-64 bg-gray-100 rounded-xl"></div>
        <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl"></div>)}
        </div>
    </div>;

    return (
        <div className="space-y-10 italic">
            {/* Header section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tighter">Tableau de Bord</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Analyse globale de votre centre de formation.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white p-2 px-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <span className="text-[10px] font-black text-secondary-900 uppercase tracking-widest">Dernière mise à jour: Live</span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl transition-transform group-hover:scale-110`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="p-1 px-2 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg flex items-center gap-1">
                                <TrendingUp size={10} /> +12%
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</h3>
                            <p className="text-4xl font-black text-secondary-900 tracking-tighter italic">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xl font-black text-secondary-900 flex items-center gap-3 italic">
                            Évolution des Inscriptions
                        </h2>
                        {selectedPeriod && (
                            <div className="text-right space-y-1">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                    {selectedPeriod.month.toString().padStart(2, '0')}/{selectedPeriod.year}
                                </p>
                                <p className="text-xs font-black text-secondary-900">
                                    {selectedPeriod.total} inscriptions
                                </p>
                            </div>
                        )}
                    </div>
                    {evolutionData.length === 0 ? (
                        <div className="aspect-[16/7] bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden">
                            <p className="text-gray-300 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                                Aucune donnée suffisante pour le moment
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-end gap-4 h-56">
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

                {/* Status Card */}
                <div className="bg-secondary-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
                    <h2 className="text-xl font-black mb-10 relative z-10 italic">Performance Cloud</h2>
                    <div className="space-y-8 relative z-10">
                        {[
                            { label: 'Cloudinary Stockage', value: 85, color: 'bg-primary-500' },
                            { label: 'Atlas DB Latency', value: 12, color: 'bg-emerald-400' },
                            { label: 'Uptime Système', value: 99, color: 'bg-blue-400' }
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.label}</span>
                                    <span className="text-xs font-bold text-white">{item.value}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                                        style={{ width: `${item.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        <div className="pt-8 mt-4 border-t border-white/5 opacity-50">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-2">Statut de la base</p>
                            <p className="text-xs font-medium text-emerald-400">Opérationnel (In-Memory Fallback Active)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
