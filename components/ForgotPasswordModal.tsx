


import React from 'react';
import { ButterflyIcon } from './ButterflyIcon';
import { PrimaryButton } from './PrimaryButton';

interface ForgotPasswordModalProps {
    onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-brand-text/50 hover:text-brand-text dark:text-dark-text-soft/50 dark:hover:text-dark-text-soft"
                >
                    &times;
                </button>

                <div className="text-center">
                    <ButterflyIcon className="w-12 h-12 text-brand-gold dark:text-dark-accent mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-brand-text dark:text-dark-accent mb-4">Recuperar Acesso</h2>
                    
                    <div className="bg-brand-gold/10 dark:bg-dark-icon/10 p-6 rounded-lg mb-6">
                        <p className="text-brand-text dark:text-dark-text-soft font-medium leading-relaxed">
                            Para redefinir sua senha e recuperar o acesso à sua conta, por favor, entre em contato diretamente com o <span className="font-bold text-brand-accent dark:text-dark-accent">Presidente do Fã Clube</span>.
                        </p>
                        <p className="text-sm text-brand-text/70 dark:text-dark-text-soft/70 mt-4">
                            Essa medida de segurança garante a proteção dos dados de todos os membros oficiais.
                        </p>
                    </div>

                    <PrimaryButton onClick={onClose}>Entendi</PrimaryButton>
                </div>
            </div>
        </div>
    );
};