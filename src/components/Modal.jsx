import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Composant Modal réutilisable
 * @param {boolean} isOpen - État d'ouverture de la modal
 * @param {function} onClose - Fonction de fermeture
 * @param {string} title - Titre de la modal
 * @param {React.ReactNode} children - Contenu de la modal
 */
const Modal = ({ isOpen, onClose, title, children }) => {
    // Empêcher le scroll du body quand la modal est ouverte
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 italic">
            {/* Backdrop avec flou premium */}
            <div
                className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-xl font-black text-secondary-900 tracking-tighter italic">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-secondary-900"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body (scrollable) */}
                <div className="px-8 py-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
