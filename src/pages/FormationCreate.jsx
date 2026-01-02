import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formationAPI } from '../services/api';
import {
    BookOpen,
    Clock,
    Banknote,
    MapPin,
    List,
    Layers,
    CheckCircle2,
    ChevronLeft,
    Sparkles,
    Target,
    Zap,
    Image as ImageIcon,
    Upload
} from 'lucide-react';
import { InputField, TextAreaField, Button, SelectField } from '../components/UIComponents';

/**
 * Création de Formation - Version Premium
 * Utilise les nouveaux composants UI pour une cohérence totale
 */
const FormationCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        titre: '',
        cout: '',
        nombreHeures: '',
        categorie: '',
        ville: '',
        objectifs: '',
        programme: '',
        type: 'INDIVIDU',
        image: null
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'image' && formData[key]) {
                    data.append('image', formData[key]);
                } else if (key !== 'image') {
                    data.append(key, formData[key]);
                }
            });

            await formationAPI.create(data);
            alert('Formation publiée avec succès !');
            navigate('/admin/dashboard');
        } catch (err) {
            console.error('Erreur lors de la création', err);
            alert(err.response?.data?.message || 'Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 space-y-12 italic">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 border-b border-gray-100 pb-8 md:pb-10">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
                        <Sparkles size={12} /> Conception Académique
                    </div>
                    <h1 className="text-4xl font-black text-secondary-900 tracking-tighter italic">Nouveau Programme.</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1 italic">Définissez une formation d'élite pour le catalogue.</p>
                </div>
                <Button variant="secondary" onClick={() => navigate(-1)} icon={ChevronLeft}>Retour</Button>
            </header>

            <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-10 lg:gap-12">
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white rounded-[3rem] p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-sm space-y-8">
                        <h2 className="text-xl font-black text-secondary-900 flex items-center gap-3 italic">
                            <BookOpen className="text-primary-500" size={24} /> 01. Identité du Cursus
                        </h2>

                        <InputField
                            label="Titre de la Formation" name="titre" required
                            value={formData.titre} onChange={handleChange}
                            placeholder="ex: Masterclass React Architecture"
                        />

                        <div className="grid md:grid-cols-2 gap-6">
                            <SelectField
                                label="Type de Formation" name="type" required
                                value={formData.type} onChange={handleChange}
                                icon={Layers}
                                options={[
                                    { value: 'INDIVIDU', label: 'Particulier (Inter)' },
                                    { value: 'ENTREPRISE', label: 'Entreprise (Intra)' }
                                ]}
                            />
                            <InputField
                                label="Catégorie" name="categorie" required
                                value={formData.categorie} onChange={handleChange}
                                placeholder="ex: Développement Web"
                            />
                        </div>

                        <InputField
                            label="Ville / Lieu" name="ville" icon={MapPin} required
                            value={formData.ville} onChange={handleChange}
                            placeholder="ex: Paris / Remote"
                        />
                    </div>

                    <div className="bg-white rounded-[3rem] p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-sm space-y-8">
                        <h2 className="text-xl font-black text-secondary-900 flex items-center gap-3 italic">
                            <Target className="text-primary-500" size={24} /> 02. Objectifs & Programme
                        </h2>

                        <TextAreaField
                            label="Objectifs Pédagogiques (Un par ligne)" name="objectifs" required rows="4"
                            value={formData.objectifs} onChange={handleChange}
                            placeholder="Ce que l'apprenant sera capable de faire..."
                        />

                        <TextAreaField
                            label="Contenu du Programme" name="programme" rows="6"
                            value={formData.programme} onChange={handleChange}
                            placeholder="Détaillez le syllabus par modules..."
                        />
                    </div>
                    <div className="bg-white rounded-[3rem] p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-sm space-y-8">
                        <h2 className="text-xl font-black text-secondary-900 flex items-center gap-3 italic">
                            <ImageIcon className="text-primary-500" size={24} /> 03. Visuel de la Formation
                        </h2>
                        
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="relative aspect-video rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-100 hover:border-primary-300 transition-all overflow-hidden group"
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover object-center" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Upload className="text-white" size={32} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <Upload className="text-primary-500" size={24} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-black text-secondary-900 italic">Cliquez pour uploader une image</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">JPG, PNG ou WebP (Max. 5MB)</p>
                                    </div>
                                </>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                className="hidden" 
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="bg-secondary-900 rounded-[3rem] p-6 sm:p-8 lg:p-10 text-white shadow-2xl space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16"></div>

                        <h2 className="text-xl font-black italic relative z-10 flex items-center gap-2">
                            <Zap className="text-primary-500" size={20} /> Métriques
                        </h2>

                        <div className="space-y-6 relative z-10">
                            <InputField
                                label="Coût" name="cout" type="number" icon={Banknote} required
                                className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl py-4 pl-12 pr-6"
                                value={formData.cout} onChange={handleChange}
                            />
                            <InputField
                                label="Volume Horaire" name="nombreHeures" type="number" icon={Clock} required
                                className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-2xl py-4 pl-12 pr-6"
                                value={formData.nombreHeures} onChange={handleChange}
                            />
                        </div>

                        <div className="pt-6 border-t border-white/10 relative z-10 italic">
                            <p className="text-[10px] font-medium text-gray-500 leading-relaxed italic italic">En publiant ce programme, il sera immédiatement visible par les entreprises et les futurs stagiaires sur le catalogue public.</p>
                        </div>

                        <Button type="submit" variant="accent" loading={loading} className="w-full py-5 text-[11px] shadow-none relative z-10 italic italic">
                            Publier au Catalogue
                        </Button>
                    </div>

                    <div className="bg-gray-50 rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 flex items-center gap-4 italic italic">
                        <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Prêt pour la mise en ligne</p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FormationCreate;
