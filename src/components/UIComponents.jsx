import React from 'react';

/**
 * Composant de champ de saisie réutilisable
 */
export const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-2 group">
        {label && <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>}
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={18} />}
            <input
                {...props}
                className={`w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 ${Icon ? 'pl-12' : 'px-6'} pr-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none`}
            />
        </div>
    </div>
);

/**
 * Composant de zone de texte réutilisable
 */
export const TextAreaField = ({ label, icon: Icon, ...props }) => (
    <div className="space-y-2 group">
        {label && <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>}
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-4 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={18} />}
            <textarea
                {...props}
                className={`w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 ${Icon ? 'pl-12' : 'px-6'} pr-6 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none resize-none`}
            />
        </div>
    </div>
);

/**
 * Composant de sélection réutilisable
 */
export const SelectField = ({ label, icon: Icon, options, ...props }) => (
    <div className="space-y-2 group">
        {label && <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>}
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-500 transition-colors" size={18} />}
            <select
                {...props}
                className={`w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 ${Icon ? 'pl-12' : 'px-6'} pr-10 text-sm font-bold text-secondary-900 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none appearance-none`}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
            </div>
        </div>
    </div>
);

/**
 * Composant de bouton premium
 */
export const Button = ({ children, variant = 'primary', loading, icon: Icon, ...props }) => {
    const variants = {
        primary: 'bg-secondary-900 hover:bg-black text-white shadow-xl shadow-gray-200',
        secondary: 'bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-secondary-900',
        accent: 'bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-500/20'
    };

    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all transform active:scale-95 flex items-center justify-center gap-3 ${variants[variant]} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            {Icon && <Icon size={18} />}
            {loading ? 'Traitement...' : children}
        </button>
    );
};
