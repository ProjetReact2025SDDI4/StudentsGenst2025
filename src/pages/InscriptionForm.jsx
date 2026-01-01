import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formationAPI, inscriptionAPI } from '../services/api';

const InscriptionForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formation, setFormation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        ville: '',
        dateNaissance: '',
        motivation: '',
        typeCandidat: 'PARTICULIER',
        entreprise: '',
        fonction: ''
    });

    useEffect(() => {
        const fetchFormation = async () => {
            try {
                const res = await formationAPI.getById(id);
                const formationData = res.data.data;
                setFormation(formationData);
                
                // Pré-configurer le type de candidat selon le type de formation
                if (formationData.type === 'ENTREPRISE') {
                    setFormData(prev => ({ ...prev, typeCandidat: 'ENTREPRISE' }));
                }
            } catch (err) {
                console.error('Erreur lors de la récupération de la formation', err);
            }
        };
        fetchFormation();
    }, [id]);

    const [files, setFiles] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            data.append('formationId', id);
            
            files.forEach(file => {
                data.append('documents', file);
            });

            await inscriptionAPI.create(data);
            setSuccess(true);
            setTimeout(() => navigate('/formations'), 3000);
        } catch (err) {
            console.error('Erreur lors de l\'inscription', err);
            alert(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    if (!formation) return <div className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-gray-300 italic animate-pulse">Sync en cours...</div>;

    return (
        <div className="bg-gradient-to-b from-white via-gray-50 to-white dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950 min-h-screen flex flex-col lg:flex-row italic">
            <div className="lg:w-1/3 bg-primary-600 p-12 lg:p-20 text-white flex flex-col justify-center sticky top-0 lg:h-screen overflow-hidden">
                <Link to={`/formations/${id}`} className="absolute top-8 left-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Retour
                </Link>

                <div className="relative z-10 animate-fade-in">
                    <h1 className="text-3xl lg:text-5xl font-black mb-8 leading-tight italic">Votre futur <span className="text-secondary-900 underline decoration-4 underline-offset-8">commence</span> ici.</h1>
                    <div className="space-y-6">
                        <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Programme Sélectionné</p>
                            <p className="text-xl font-bold italic">{formation.titre}</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-white/5 px-4 py-2 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest italic">{formation.nombreHeures} Heures</div>
                            <div className="bg-white/5 px-4 py-2 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest italic">{formation.ville}</div>
                        </div>
                    </div>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary-900 rounded-full blur-[100px] opacity-20"></div>
            </div>

            <div className="flex-1 p-8 lg:p-24 flex items-center justify-center">
                <div className="max-w-xl w-full">
                    {success ? (
                        <div className="bg-white border border-emerald-100 rounded-[3rem] p-16 text-center animate-slide-up shadow-2xl shadow-emerald-500/5">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-2xl font-black text-secondary-900 mb-2 italic">Inscription Enregistrée !</h2>
                            <p className="text-gray-400 font-medium italic">Préparons ensemble votre succès pédagogique.</p>
                            <div className="mt-12 flex items-center justify-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                                <p className="text-[10px] font-black text-secondary-900 uppercase tracking-widest">Redirection au catalogue...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/80 border border-gray-100 rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-primary-500/5 animate-slide-up">
                            <div className="mb-10">
                                <h2 className="text-2xl font-black text-secondary-900 mb-2 italic">Informations Candidat</h2>
                                <p className="text-gray-400 text-sm font-medium italic">Remplissez le formulaire sécurisé ci-dessous.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nom</label>
                                        <input type="text" name="nom" required className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none shadow-sm" value={formData.nom} onChange={handleChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Prénom</label>
                                        <input type="text" name="prenom" required className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none shadow-sm" value={formData.prenom} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email</label>
                                        <input type="email" name="email" required className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none shadow-sm" value={formData.email} onChange={handleChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Téléphone</label>
                                        <input type="tel" name="telephone" required className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none shadow-sm" value={formData.telephone} onChange={handleChange} />
                                    </div>
                                </div>

                                {formData.typeCandidat === 'ENTREPRISE' && (
                                    <div className="grid md:grid-cols-2 gap-8 animate-slide-up">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nom de l'Entreprise</label>
                                            <input type="text" name="entreprise" required className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none shadow-sm" value={formData.entreprise} onChange={handleChange} placeholder="Ex: FormationsGest" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Fonction / Poste</label>
                                            <input type="text" name="fonction" className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none shadow-sm" value={formData.fonction} onChange={handleChange} placeholder="Ex: Responsable RH" />
                                        </div>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Ville</label>
                                        <input type="text" name="ville" className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none shadow-sm" value={formData.ville} onChange={handleChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Date de Naissance</label>
                                        <input type="date" name="dateNaissance" className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none shadow-sm" value={formData.dateNaissance} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Motivation & Objectifs</label>
                                    <textarea name="motivation" rows="4" className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none shadow-sm placeholder:text-gray-200 italic" value={formData.motivation} onChange={handleChange} placeholder="Décrivez votre projet professionnel en quelques lignes..."></textarea>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Documents justificatifs (Optionnel)</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="w-full bg-white border-2 border-dashed border-gray-100 rounded-3xl p-8 text-center group-hover:border-primary-500 transition-all">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-all">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                            </div>
                                            <p className="text-[10px] font-black text-secondary-900 uppercase tracking-widest">
                                                {files.length > 0 ? `${files.length} fichier(s) sélectionné(s)` : 'Cliquez ou glissez vos documents'}
                                            </p>
                                            <p className="text-[9px] text-gray-400 mt-2 font-medium italic">CV, Diplômes, Attestations (Max 5 fichiers)</p>
                                        </div>
                                    </div>
                                    {files.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {files.map((file, idx) => (
                                                <div key={idx} className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-[9px] font-black uppercase flex items-center gap-2 italic">
                                                    <span className="max-w-[100px] truncate">{file.name}</span>
                                                    <button type="button" onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="hover:text-red-500 transition-colors">×</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" disabled={loading} className="w-full btn-primary py-5 text-sm font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary-500/20 active:scale-95 transition-all">
                                    {loading ? 'Soumission...' : 'Confirmer Inscription'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InscriptionForm;
