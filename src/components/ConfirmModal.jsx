import React, { useEffect } from 'react';
import { X, AlertTriangle, Info, AlertCircle } from 'lucide-react';

/**
 * Composant de confirmation global
 */
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type }) => {
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const icons = {
        danger: <AlertCircle className="text-red-500" size={32} />,
        warning: <AlertTriangle className="text-amber-500" size={32} />,
        info: <Info className="text-blue-500" size={32} />
    };

    const buttonStyles = {
        danger: "bg-red-500 hover:bg-red-600 shadow-red-200",
        warning: "bg-amber-500 hover:bg-amber-600 shadow-amber-200",
        info: "bg-blue-500 hover:bg-blue-600 shadow-blue-200"
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 italic">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-secondary-900/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up p-10 space-y-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-3xl bg-gray-50 mb-2`}>
                        {icons[type] || icons.danger}
                    </div>
                    <h3 className="text-2xl font-black text-secondary-900 tracking-tighter italic">{title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-8 py-4 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${buttonStyles[type] || buttonStyles.danger}`}
                    >
                        {confirmText}
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-300"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default ConfirmModal;
