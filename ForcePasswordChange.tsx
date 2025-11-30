
import React, { useState } from 'react';
import { ButterflyIcon } from './ButterflyIcon';
import { PrimaryButton } from './PrimaryButton';
import { User } from '../data/mockData';

interface ForcePasswordChangeProps {
    user: User;
    onPasswordChanged: (newPassword: string) => void;
    onCancel: () => void;
}

export const ForcePasswordChange: React.FC<ForcePasswordChangeProps> = ({ user, onPasswordChanged, onCancel }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const validatePassword = (pwd: string) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(pwd);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        if (!validatePassword(newPassword)) {
            setError('A senha deve ter no mínimo 8 caracteres, contendo letra maiúscula, minúscula, número e caractere especial.');
            return;
        }

        onPasswordChanged(newPassword);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
                <div className="text-center mb-6">
                    <ButterflyIcon className="w-12 h-12 text-brand-gold dark:text-dark-accent mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-brand-text dark:text-dark-accent">Alteração de Senha Obrigatória</h2>
                    <p className="text-sm text-brand-text/70 dark:text-dark-text-soft mt-2">
                        Olá, {user.name}. Por segurança, você precisa definir uma nova senha pessoal para continuar.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1">Nova Senha</label>
                        <input 
                            type="password" 
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1">Confirmar Nova Senha</label>
                        <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent"
                            required
                        />
                    </div>
                    
                    <div className="text-xs text-brand-text/60 dark:text-dark-text-soft/60 bg-brand-gold/10 dark:bg-dark-icon/10 p-3 rounded-md">
                        Requisitos: Mínimo 8 caracteres, letra maiúscula, minúscula, número e símbolo (Ex: @, #, !).
                    </div>

                    {error && <p className="text-sm text-red-600 dark:text-red-400 font-semibold">{error}</p>}

                    <div className="pt-2">
                        <PrimaryButton type="submit">Salvar Nova Senha</PrimaryButton>
                    </div>
                    <button type="button" onClick={onCancel} className="w-full text-center text-sm text-brand-text/50 hover:text-brand-text dark:text-dark-text-soft/50 dark:hover:text-dark-text-soft mt-4">
                        Cancelar Login
                    </button>
                </form>
            </div>
        </div>
    );
};
