import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidatureAPI } from '../services/api';
import {
    User,
    Mail,
    Briefcase,
    FileText,
    Upload,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

const CandidatureForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cvFile, setCvFile] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        motsCles: '',
        experience: '',
        remarques: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setCvFile(e.target.files[0]);
    };

    const handleDocumentsChange = (e) => {
        const files = Array.from(e.target.files || []);
        setDocuments(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (cvFile) data.append('cv', cvFile);
            documents.forEach(file => data.append('documents', file));

            await candidatureAPI.create(data);
            alert('Candidature envoyée avec succès ! Notre équipe reviendra vers vous.');
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de l\'envoi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white italic">
            <div className="relative pt-28 pb-16">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-xl">
                        <Sparkles size={14} className="text-primary-500" /> Rejoignez le Réseau d'Experts
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-secondary-900 tracking-tighter italic">
                        Postulez comme <span className="text-primary-600">Formateur</span>.
                    </h1>
                    <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto italic">
                        Partagez votre expertise et accompagnez la montée en compétences des professionnels de demain.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-20">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-xl space-y-12 italic"
                >
                    <div className="space-y-10">
                        <div className="space-y-8">
                            <h2 className="text-xl font-black text-secondary-900 flex items-center gap-3 italic">
                                <User className="text-primary-500" size={24} /> 01. Informations Personnelles
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Prénom</label>
                                    <input
                                        type="text" name="prenom" required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                                        placeholder="ex: Sophie"
                                        value={formData.prenom} onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nom de famille</label>
                                    <input
                                        type="text" name="nom" required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                                        placeholder="ex: Martin"
                                        value={formData.nom} onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Adresse Email Professionnelle</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={18} />
                                        <input
                                            type="email" name="email" required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                                            placeholder="sophie.martin@expert.com"
                                            value={formData.email} onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Téléphone</label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="text" name="telephone" required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                                            placeholder="+33 6 00 00 00 00"
                                            value={formData.telephone} onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Expertise */}
                        <div className="space-y-8">
                            <h2 className="text-xl font-black text-secondary-900 flex items-center gap-3 italic">
                                <Briefcase className="text-primary-500" size={24} /> 02. Expertise Technique
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Années d'Expérience</label>
                                    <input
                                        type="number" name="experience" required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                                        placeholder="ex: 8"
                                        value={formData.experience} onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Compétences Clés (séparées par des virgules)</label>
                                    <input
                                        type="text" name="motsCles" required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                                        placeholder="ex: React, Node.js, Agilité, Cloud..."
                                        value={formData.motsCles} onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Présentation & Parcours</label>
                                <textarea
                                    name="remarques" rows="4"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none resize-none"
                                    placeholder="Décrivez brièvement votre parcours et vos motivations..."
                                    value={formData.remarques} onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>

                        {/* Section 3: Documents */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-8">
                                <h2 className="text-xl font-black text-secondary-900 flex items-center gap-3 italic">
                                    <Upload className="text-primary-500" size={24} /> 03. Curriculum Vitae
                                </h2>
                                <div className="relative group">
                                    <input
                                        type="file" accept=".pdf,.doc,.docx" required
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                    <div className={`w-full border-4 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300
                                        ${cvFile ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-gray-50 bg-gray-50 group-hover:bg-primary-50 group-hover:border-primary-100 text-gray-400'}`}>
                                        {cvFile ? (
                                            <div className="space-y-2">
                                                <CheckCircle2 size={48} className="mx-auto" />
                                                <p className="text-sm font-black uppercase tracking-widest">{cvFile.name}</p>
                                                <p className="text-[10px] font-medium italic">Fichier prêt pour l'envoi</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <Upload size={48} className="mx-auto opacity-20" />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black uppercase tracking-widest text-secondary-900">Cliquez ou glissez votre CV</p>
                                                    <p className="text-xs font-medium italic italic">Formats acceptés : PDF, Word (Max 5Mo)</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h2 className="text-xl font-black text-secondary-900 flex items-center gap-3 italic">
                                    <FileText className="text-primary-500" size={24} /> 04. Autres Documents
                                </h2>
                                <div className="relative group">
                                    <input
                                        type="file" multiple accept=".pdf,.doc,.docx,.jpg,.png"
                                        onChange={handleDocumentsChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                    <div className={`w-full border-4 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300
                                        ${documents.length > 0 ? 'border-emerald-100 bg-emerald-50 text-emerald-600' : 'border-gray-50 bg-gray-50 group-hover:bg-primary-50 group-hover:border-primary-100 text-gray-400'}`}>
                                        {documents.length > 0 ? (
                                            <div className="space-y-2">
                                                <CheckCircle2 size={48} className="mx-auto" />
                                                <p className="text-sm font-black uppercase tracking-widest">{documents.length} fichier(s) sélectionné(s)</p>
                                                <p className="text-[10px] font-medium italic">Certificats, Lettre de motivation, etc.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <Upload size={48} className="mx-auto opacity-20" />
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black uppercase tracking-widest text-secondary-900">Ajouter des pièces jointes</p>
                                                    <p className="text-xs font-medium italic italic">Certificats, Attestations, etc. (Max 5 fichiers)</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 flex flex-col sm:flex-row gap-6">
                        <button
                            type="button" onClick={() => navigate(-1)}
                            className="flex-1 px-8 py-5 bg-gray-50 text-gray-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:text-secondary-900 transition-all flex items-center justify-center gap-3 italic"
                        >
                            <ChevronLeft size={18} /> Annuler
                        </button>
                        <button
                            type="submit" disabled={loading}
                            className="flex-[2] px-8 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all transform active:scale-[0.98] shadow-2xl shadow-primary-500/20 flex items-center justify-center gap-3 italic"
                        >
                            {loading ? 'Traitement...' : 'Soumettre ma Candidature'}
                            {!loading && <ChevronRight size={18} />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CandidatureForm;
