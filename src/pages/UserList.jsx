import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useConfirm } from '../context/ConfirmContext';
import {
    Users,
    Search,
    UserPlus,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Trash2,
    Settings,
    Mail,
    Lock,
    X,
    Check,
    Download
} from 'lucide-react';
import Modal from '../components/Modal';
import { InputField, Button } from '../components/UIComponents';

/**
 * Page de gestion des utilisateurs
 * Utilise des modals pour la création et l'édition pour une UX fluide
 */
const UserList = () => {
    const confirm = useConfirm();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // États pour la Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' ou 'edit'
    const [selectedUser, setSelectedUser] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // État du formulaire
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        password: '',
        role: 'ASSISTANT'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await userAPI.getAll();
            setUsers(res.data.data);
        } catch (err) {
            console.error('Erreur chargement utilisateurs', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode, user = null) => {
        setModalMode(mode);
        if (mode === 'edit' && user) {
            setSelectedUser(user);
            setFormData({
                prenom: user.prenom,
                nom: user.nom,
                email: user.email,
                role: user.role,
                password: '' // On ne remplit pas le mot de passe en édition par sécurité
            });
        } else {
            setSelectedUser(null);
            setFormData({
                prenom: '',
                nom: '',
                email: '',
                password: '',
                role: 'ASSISTANT'
            });
        }
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (modalMode === 'create') {
                await userAPI.create(formData);
                console.log('Utilisateur créé');
            } else if (selectedUser) {
                await userAPI.update(selectedUser._id, formData);
                console.log('Utilisateur mis à jour');
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (err) {
            console.error('Erreur lors de l\'opération utilisateur', err);
            alert(err.response?.data?.message || 'Erreur lors de l\'opération');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Révoquer l\'accès ?',
            message: 'Cet utilisateur ne pourra plus se connecter à la plateforme. Ses données resteront archivées.',
            type: 'danger',
            confirmText: 'Révoquer l\'utilisateur'
        });

        if (isConfirmed) {
            try {
                await userAPI.delete(id);
                fetchUsers();
            } catch (err) {
                console.error('Erreur lors de la suppression', err);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'ADMIN': return { icon: ShieldAlert, bg: 'bg-red-50 text-red-600', label: 'Admin' };
            case 'ASSISTANT': return { icon: ShieldCheck, bg: 'bg-blue-50 text-blue-600', label: 'Assistant' };
            case 'FORMATEUR': return { icon: Shield, bg: 'bg-amber-50 text-amber-600', label: 'Formateur' };
            default: return { icon: Users, bg: 'bg-gray-50 text-gray-400', label: 'Membre' };
        }
    };

    const filteredUsers = users.filter(u =>
        `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToCsv = (rows, filename) => {
        if (!rows || rows.length === 0) return;
        const headers = Object.keys(rows[0]);
        const escapeValue = (value) => {
            if (value === null || value === undefined) return '""';
            const str = String(value).replace(/"/g, '""');
            return `"${str}"`;
        };
        const lines = [];
        lines.push(headers.map(escapeValue).join(';'));
        rows.forEach(row => {
            const line = headers.map(h => escapeValue(row[h])).join(';');
            lines.push(line);
        });
        const csvContent = lines.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExport = () => {
        if (filteredUsers.length === 0) return;
        const rows = filteredUsers.map(u => ({
            Prenom: u.prenom,
            Nom: u.nom,
            Email: u.email,
            Role: u.role
        }));
        exportToCsv(rows, 'utilisateurs.csv');
    };

    return (
        <div className="space-y-10 italic">
            {/* Header avec Barre de recherche */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tighter italic">Gestion Équipe.</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Gérez les accès administratifs et pédagogiques.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary-500/5 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleExport}
                        icon={Download}
                        className="whitespace-nowrap"
                    >
                        Exporter
                    </Button>
                    <Button onClick={() => handleOpenModal('create')} variant="primary" icon={UserPlus}>
                        Inviter
                    </Button>
                </div>
            </header>

            {/* Liste des utilisateurs (Cards) */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-50 rounded-[2.5rem] animate-pulse"></div>)
                ) : filteredUsers.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 italic">
                        <Users size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold">Aucun membre trouvé.</p>
                    </div>
                ) : (
                    filteredUsers.map((u) => {
                        const badge = getRoleBadge(u.role);
                        return (
                            <div key={u._id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative">
                                {/* Actions rapides au survol */}
                                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenModal('edit', u)} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-secondary-900 transition-colors shadow-sm"><Settings size={14} /></button>
                                    <button onClick={() => handleDelete(u._id)} className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 transition-colors shadow-sm"><Trash2 size={14} /></button>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-secondary-900 text-white rounded-2xl flex items-center justify-center text-xl font-black italic shadow-lg">
                                            {u.prenom[0]}{u.nom[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-secondary-900 truncate pr-16 capitalize">{u.prenom} {u.nom}</h3>
                                            <p className="text-[10px] font-bold text-gray-400 truncate italic">{u.email}</p>
                                        </div>
                                    </div>

                                    <div className={`w-fit flex items-center gap-2 px-4 py-1.5 rounded-full ${badge.bg}`}>
                                        <badge.icon size={12} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">{badge.label}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal Création / Édition */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'create' ? "Inviter un nouveau membre" : "Édition de l'utilisateur"}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <InputField label="Prénom" name="prenom" required value={formData.prenom} onChange={handleChange} placeholder="Sophie" />
                        <InputField label="Nom" name="nom" required value={formData.nom} onChange={handleChange} placeholder="Martin" />
                    </div>

                    <InputField label="Email" name="email" type="email" icon={Mail} required value={formData.email} onChange={handleChange} placeholder="sophie@example.com" />

                    {modalMode === 'create' && (
                        <InputField label="Mot de passe" name="password" type="password" icon={Lock} required value={formData.password} onChange={handleChange} placeholder="••••••••" />
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Rôle & Permissions</label>
                        <select
                            name="role"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none appearance-none"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="ASSISTANT">Assistant Administratif</option>
                            <option value="FORMATEUR">Expert Formateur</option>
                            <option value="ADMIN">Administrateur Système</option>
                        </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Annuler</Button>
                        <Button type="submit" variant="accent" loading={formLoading} className="flex-1">
                            {modalMode === 'create' ? 'Confirmer l\'invitation' : 'Mettre à jour'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UserList;
