import React, { useState, useEffect } from 'react';
import { entrepriseAPI } from '../services/api';
import { useConfirm } from '../context/ConfirmContext';
import {
    Building2,
    Search,
    Plus,
    Mail,
    Phone,
    Globe,
    MapPin,
    Briefcase,
    Settings,
    Trash2,
    CheckCircle2
} from 'lucide-react';
import Modal from '../components/Modal';
import { InputField, Button } from '../components/UIComponents';

/**
 * Gestion des Entreprises Partenaires
 * UX Premium avec Modals pour le CRUD
 */
const EntrepriseList = () => {
    const confirm = useConfirm();
    const [entreprises, setEntreprises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedId, setSelectedId] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    // FormData
    const [formData, setFormData] = useState({
        nom: '',
        secteurActivite: '',
        adresse: '',
        email: '',
        telephone: '',
        siteWeb: ''
    });

    useEffect(() => {
        fetchEntreprises();
    }, []);

    const fetchEntreprises = async () => {
        setLoading(true);
        try {
            const res = await entrepriseAPI.getAll();
            setEntreprises(res.data.data);
        } catch (err) {
            console.error('Erreur chargement entreprises', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (mode, ent = null) => {
        setModalMode(mode);
        if (mode === 'edit' && ent) {
            setSelectedId(ent._id);
            setFormData({
                nom: ent.nom,
                secteurActivite: ent.secteurActivite || '',
                adresse: ent.adresse || '',
                email: ent.email || '',
                telephone: ent.telephone || '',
                siteWeb: ent.siteWeb || ''
            });
        } else {
            setSelectedId(null);
            setFormData({
                nom: '',
                secteurActivite: '',
                adresse: '',
                email: '',
                telephone: '',
                siteWeb: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (modalMode === 'create') {
                await entrepriseAPI.create(formData);
            } else {
                await entrepriseAPI.update(selectedId, formData);
            }
            setIsModalOpen(false);
            fetchEntreprises();
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement', err);
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Supprimer le compte client ?',
            message: 'Toutes les informations relatives à cette entreprise seront archivées. Les inscriptions en cours ne seront pas annulées automatiquement.',
            type: 'danger',
            confirmText: 'Confirmer la suppression'
        });

        if (isConfirmed) {
            try {
                await entrepriseAPI.delete(id);
                fetchEntreprises();
            } catch (err) {
                console.error('Erreur suppression', err);
                alert('Erreur suppression');
            }
        }
    };

    const filtered = entreprises.filter(e =>
        e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.secteurActivite?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 italic">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary-900 tracking-tighter italic">Sociétés Clientes.</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Gérez le portefeuille d'entreprises et leurs formations groupées.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher une société..."
                            className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary-500/5 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => handleOpenModal('create')} variant="primary" icon={Plus}>Ajouter</Button>
                </div>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-50 rounded-[3rem] animate-pulse"></div>)
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 italic">
                        <Building2 size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-bold">Aucune entreprise répertoriée.</p>
                    </div>
                ) : (
                    filtered.map((ent) => (
                        <div key={ent._id} className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative flex flex-col justify-between">
                            <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenModal('edit', ent)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-secondary-900 transition-all"><Settings size={16} /></button>
                                <button onClick={() => handleDelete(ent._id)} className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary-600 italic">
                                        <Briefcase size={12} /> {ent.secteurActivite || 'Secteur Indéfini'}
                                    </div>
                                    <h3 className="text-2xl font-black text-secondary-900 tracking-tight italic">{ent.nom}</h3>
                                </div>

                                <div className="space-y-3 italic">
                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                        <Mail size={16} className="text-gray-200" /> {ent.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                        <Phone size={16} className="text-gray-200" /> {ent.telephone}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                        <MapPin size={16} className="text-gray-200" /> {ent.adresse}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-gray-50 flex justify-between items-center">
                                <a
                                    href={ent.siteWeb} target="_blank" rel="noreferrer"
                                    className="text-[9px] font-black uppercase tracking-widest text-secondary-400 hover:text-primary-600 flex items-center gap-2 transition-colors"
                                >
                                    <Globe size={14} /> Site Officiel
                                </a>
                                <div className="flex items-center gap-1.5 text-emerald-500">
                                    <CheckCircle2 size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Actif</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal CRUD */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'create' ? "Nouvelle Entreprise" : "Édition de la structure"}
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    <InputField label="Dénomination Sociale" name="nom" required value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} placeholder="ex: Tech Solutions SA" />

                    <div className="grid sm:grid-cols-2 gap-6">
                        <InputField label="Secteur" name="secteurActivite" value={formData.secteurActivite} onChange={e => setFormData({ ...formData, secteurActivite: e.target.value })} placeholder="ex: Industrie" />
                        <InputField label="Téléphone" name="telephone" icon={Phone} value={formData.telephone} onChange={e => setFormData({ ...formData, telephone: e.target.value })} placeholder="+33..." />
                    </div>

                    <InputField label="Adresse Email Corporate" name="email" type="email" icon={Mail} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="contact@entreprise.com" />
                    <InputField label="Siège Social (Adresse)" name="adresse" icon={MapPin} value={formData.adresse} onChange={e => setFormData({ ...formData, adresse: e.target.value })} placeholder="Rue de la Paix, Paris" />
                    <InputField label="Site Web" name="siteWeb" icon={Globe} value={formData.siteWeb} onChange={e => setFormData({ ...formData, siteWeb: e.target.value })} placeholder="https://..." />

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Fermer</Button>
                        <Button type="submit" variant="accent" loading={formLoading} className="flex-1">
                            {modalMode === 'create' ? 'Enregistrer' : 'Sauvegarder'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EntrepriseList;
