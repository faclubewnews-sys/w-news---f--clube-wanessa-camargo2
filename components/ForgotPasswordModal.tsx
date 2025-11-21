
import React, { useState } from 'react';
import { ButterflyIcon } from './ButterflyIcon';
import { PrimaryButton } from './PrimaryButton';
import { InputField } from './InputField';

interface ForgotPasswordModalProps {
    onClose: () => void;
    onSendLink: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose, onSendLink }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            onSendLink(email);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-brand-text/50 hover:text-brand-text dark:text-dark-text-soft/50 dark:hover:text-dark-text-soft"
                >
                    &times;
                </button>

                <div className="text-center mb-6">
                    <ButterflyIcon className="w-12 h-12 text-brand-gold dark:text-dark-accent mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-brand-text dark:text-dark-accent">Recuperar Senha</h2>
                    <p className="text-sm text-brand-text/70 dark:text-dark-text-soft mt-2">
                        Informe o e-mail cadastrado para receber o link de redefinição.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                        id="recovery-email"
                        label="E-mail cadastrado"
                        type="email"
                        placeholder="seu.email@exemplo.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    
                    <PrimaryButton type="submit">Enviar Link</PrimaryButton>
                </form>
            </div>
        </div>
    );
};
