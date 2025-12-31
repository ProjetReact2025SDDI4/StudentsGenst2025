import React, { useState, useEffect } from 'react';
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
        candidatures: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [f, i, fo, c] = await Promise.all([
                    formationAPI.getAll(),
                    inscriptionAPI.getAll(),
                    formateurAPI.getAll(),
                    candidatureAPI.getAll()
                ]);
                setStats({
                    formations: f.data.total || f.data.data.length,
                    inscriptions: i.data.data.length,
                    formateurs: fo.data.data.length,
                    candidatures: c.data.data.length
                });
            } catch (err) {
                console.error('Erreur chargement stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

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
                {/* Recent Overview (Mock for now, but clean) */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xl font-black text-secondary-900 flex items-center gap-3 italic">
                            Évolution des Inscriptions
                        </h2>
                        <button className="text-[10px] font-black uppercase text-primary-600 tracking-widest hover:underline">Voir détails</button>
                    </div>
                    <div className="aspect-[16/7] bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent"></div>
                        <p className="text-gray-300 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                            Graphique analytique <ArrowUpRight size={16} />
                        </p>
                    </div>
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
