import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const ConfirmContext = createContext();

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
};

export const ConfirmProvider = ({ children }) => {
    const [config, setConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        confirmText: 'Confirmer',
        cancelText: 'Annuler',
        type: 'danger' // 'danger', 'warning', 'info'
    });

    const confirm = useCallback(({ title, message, onConfirm, confirmText = 'Confirmer', cancelText = 'Annuler', type = 'danger' }) => {
        return new Promise((resolve) => {
            setConfig({
                isOpen: true,
                title,
                message,
                onConfirm: () => {
                    onConfirm?.();
                    resolve(true);
                    setConfig(prev => ({ ...prev, isOpen: false }));
                },
                confirmText,
                cancelText,
                type
            });
        });
    }, []);

    const close = useCallback(() => {
        setConfig(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <ConfirmModal
                isOpen={config.isOpen}
                onClose={close}
                onConfirm={config.onConfirm}
                title={config.title}
                message={config.message}
                confirmText={config.confirmText}
                cancelText={config.cancelText}
                type={config.type}
            />
        </ConfirmContext.Provider>
    );
};
