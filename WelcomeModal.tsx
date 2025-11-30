import React from 'react';
import { ButterflyIcon } from './ButterflyIcon';
import { PrimaryButton } from './PrimaryButton';

interface WelcomeModalProps {
    onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in text-center">
                <ButterflyIcon className="w-16 h-16 text-brand-gold dark:text-dark-accent mx-auto mb-4 animate-subtle-pulse" />
                <h2 className="text-2xl font-bold text-brand-text dark:text-dark-accent mb-4">Bem-vindo(a) ao W News!</h2>
                <p className="text-brand-text/80 dark:text-dark-text-soft leading-relaxed mb-6">
                    Estamos felizes em ter você conosco. A partir de agora, você terá acesso à comunidade, comunicação, notificações e poderá participar das ações oficiais seguindo as regras e prazos estabelecidos.
                </p>
                <PrimaryButton onClick={onClose}>
                    Continuar
                </PrimaryButton>
            </div>
        </div>
    );
};
