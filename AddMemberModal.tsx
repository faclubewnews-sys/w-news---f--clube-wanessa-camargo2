import React, { useState } from 'react';
import { User, addUserToStorage } from '../data/mockData';
import { PrimaryButton } from './PrimaryButton';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded: () => void;
}

const FormInput: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
}> = ({ id, label, value, onChange, type = 'text', required = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1">{label}</label>
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent"
        />
    </div>
);

const initialFormData = {
    name: '', dob: '', cpf: '', rg: '', email: '', phone: '',
    zipCode: '', street: '', number: '', complement: '', city: '', state: '',
    instagram: '', facebook: '', twitter: '', tiktok: '', lastfm: ''
};

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onMemberAdded }) => {
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newUser: Omit<User, 'id' | 'password' | 'mustChangePassword' | 'status' | 'cardId' | 'registrationDate' | 'profilePic' | 'role'> = {
            name: formData.name,
            dob: formData.dob,
            cpf: formData.cpf,
            rg: formData.rg,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.street}, ${formData.number}`, // For legacy compatibility
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            zipCode: formData.zipCode,
            city: formData.city,
            state: formData.state,
            socials: {
                instagram: formData.instagram,
                twitter: formData.twitter,
                facebook: formData.facebook,
                tiktok: formData.tiktok,
                lastfm: formData.lastfm,
            },
        };

        // This function will handle ID, temp password, etc.
        addUserToStorage(newUser as any); // Cast because role is missing, but will be added by default
        
        setFormData(initialFormData); // Reset form
        onMemberAdded();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl w-full max-w-3xl relative" 
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-brand-text/50 hover:text-brand-gold dark:text-dark-text-soft/50 dark:hover:text-dark-text-soft text-3xl z-10">&times;</button>
                <div className="max-h-[85vh] overflow-y-auto p-8">
                    <h2 className="text-2xl font-bold text-brand-text dark:text-dark-accent mb-6">Adicionar Novo Membro</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Dados Pessoais */}
                        <section>
                            <h3 className="text-lg font-semibold border-b border-brand-gold/20 pb-2 mb-4">Dados Pessoais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput id="name" label="Nome Completo" value={formData.name} onChange={handleChange} required />
                                <FormInput id="dob" label="Data de Nascimento" value={formData.dob} onChange={handleChange} required />
                                <FormInput id="cpf" label="CPF" value={formData.cpf} onChange={handleChange} required />
                                <FormInput id="rg" label="RG" value={formData.rg} onChange={handleChange} required />
                                <FormInput id="email" label="E-mail de Cadastro" value={formData.email} onChange={handleChange} type="email" required />
                                <FormInput id="phone" label="Telefone" value={formData.phone} onChange={handleChange} required />
                            </div>
                        </section>

                        {/* Endereço */}
                        <section>
                            <h3 className="text-lg font-semibold border-b border-brand-gold/20 pb-2 mb-4">Endereço Completo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                <div className="md:col-span-2"><FormInput id="zipCode" label="CEP" value={formData.zipCode} onChange={handleChange} required /></div>
                                <div className="md:col-span-4"><FormInput id="street" label="Rua" value={formData.street} onChange={handleChange} required /></div>
                                <div className="md:col-span-2"><FormInput id="number" label="Número" value={formData.number} onChange={handleChange} required /></div>
                                <div className="md:col-span-4"><FormInput id="complement" label="Complemento" value={formData.complement} onChange={handleChange} /></div>
                                <div className="md:col-span-4"><FormInput id="city" label="Cidade" value={formData.city} onChange={handleChange} required /></div>
                                <div className="md:col-span-2"><FormInput id="state" label="Estado" value={formData.state} onChange={handleChange} required /></div>
                            </div>
                        </section>

                        {/* Redes Sociais */}
                        <section>
                            <h3 className="text-lg font-semibold border-b border-brand-gold/20 pb-2 mb-4">Redes Sociais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput id="instagram" label="Instagram" value={formData.instagram} onChange={handleChange} />
                                <FormInput id="facebook" label="Facebook" value={formData.facebook} onChange={handleChange} />
                                <FormInput id="twitter" label="Twitter/X" value={formData.twitter} onChange={handleChange} />
                                <FormInput id="tiktok" label="TikTok" value={formData.tiktok} onChange={handleChange} />
                                <FormInput id="lastfm" label="Last.fm" value={formData.lastfm} onChange={handleChange} />
                            </div>
                        </section>
                        
                        <div className="pt-4 flex justify-end">
                            <PrimaryButton type="submit">Cadastrar Membro</PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};