import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { evaluationAPI } from '../services/api';

const EvaluationForm = () => {
    const { formationId, formateurId } = useParams();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [scores, setScores] = useState({
        notePedagogie: 5,
        maitriseSujet: 5,
        support: 5,
        rythme: 5
    });

    const [commentaire, setCommentaire] = useState('');

    const handleScoreChange = (critere, value) => {
        setScores({ ...scores, [critere]: parseInt(value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await evaluationAPI.submit({
                formationId,
                formateurId,
                ...scores,
                commentaire
            });
            setSuccess(true);
            setTimeout(() => navigate('/'), 4000);
        } catch (err) {
            alert('Erreur lors de l\'envoi de l\'évaluation');
        } finally {
            setLoading(false);
        }
    };

    const StarRating = ({ critere, label }) => (
        <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 italic">{label}</label>
            <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleScoreChange(critere, star)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-300 ${scores[critere] >= star
                            ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20 scale-110'
                            : 'bg-white border border-gray-100 text-gray-300 hover:border-primary-200'
                            }`}
                    >
                        {star}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50/50 min-h-screen py-20 flex items-center justify-center italic">
            <div className="max-w-2xl w-full px-6">
                {success ? (
                    <div className="bg-white rounded-[3rem] p-16 text-center shadow-2xl shadow-primary-600/5 animate-slide-up border border-gray-100">
                        <div className="text-6xl mb-8 animate-bounce">✨</div>
                        <h2 className="text-3xl font-black text-secondary-900 mb-4 italic">Feedback Précieux.</h2>
                        <p className="text-gray-400 font-medium italic mb-10">Votre avis nous aide à maintenir l'excellence académique de nos programmes.</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-ping"></span>
                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary-900">Retour à l'accueil...</p>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <header className="text-center mb-16">
                            <h1 className="text-3xl font-black text-secondary-900 mb-2 italic tracking-tighter">Évaluation de <span className="text-primary-600">Performance</span>.</h1>
                            <p className="text-gray-400 text-sm font-medium italic">Participez à l'amélioration de nos cursus pédagogiques.</p>
                        </header>

                        <div className="bg-white rounded-[3rem] p-10 lg:p-16 border border-gray-100 shadow-2xl shadow-secondary-900/5">
                            <form onSubmit={handleSubmit} className="space-y-12">
                                <div className="grid sm:grid-cols-2 gap-12">
                                    <StarRating critere="notePedagogie" label="Pédagogie & Écoute" />
                                    <StarRating critere="maitriseSujet" label="Expertise Technique" />
                                    <StarRating critere="support" label="Qualité du Support" />
                                    <StarRating critere="rythme" label="Gestion & Logistique" />
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-50">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 italic">Témoignage Libre</label>
                                    <textarea
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-[2rem] py-6 px-8 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all outline-none italic placeholder:text-gray-200"
                                        rows="4"
                                        placeholder="Un commentaire sur cette expérience ?"
                                        value={commentaire}
                                        onChange={(e) => setCommentaire(e.target.value)}
                                    ></textarea>
                                </div>

                                <button type="submit" disabled={loading} className="w-full btn-primary py-5 text-xs font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary-500/20 active:scale-95 transition-all">
                                    {loading ? 'Traitement...' : 'Soumettre mon avis'}
                                </button>
                            </form>
                        </div>

                        <footer className="mt-12 text-center">
                            <Link to="/" className="text-[10px] font-black text-gray-300 hover:text-primary-500 uppercase tracking-widest transition-colors italic">Quitter sans évaluer</Link>
                        </footer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EvaluationForm;
