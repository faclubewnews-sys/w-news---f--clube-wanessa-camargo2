import React from 'react';
import { PrimaryButton } from './PrimaryButton';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, userName }) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = (e.currentTarget.elements.namedItem('subject') as HTMLInputElement).value;
    const message = (e.currentTarget.elements.namedItem('message') as HTMLTextAreaElement).value;
    
    const body = `Enviado por: ${userName}\n\n${message}`;
    
    window.location.href = `mailto:faclubewnews@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-8 w-full max-w-lg relative transition-transform transform scale-95 duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isOpen ? 'scale(1)' : 'scale(0.95)' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-text/50 hover:text-brand-gold dark:text-dark-text-soft/50 dark:hover:text-dark-accent">&times;</button>
        <h2 className="text-2xl font-bold text-brand-text dark:text-dark-accent mb-6">Fale Conosco</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Seu Nome</label>
            <input
              id="name"
              type="text"
              value={userName}
              readOnly
              className="w-full bg-brand-bg-dark/30 dark:bg-dark-bg-main/50 border border-brand-gold/30 dark:border-dark-icon rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="subject" className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Assunto</label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:focus:ring-dark-accent"
              placeholder="Sobre o que você quer falar?"
            />
          </div>
           <div>
            <label htmlFor="message" className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Mensagem</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:focus:ring-dark-accent"
              placeholder="Digite sua mensagem aqui..."
            />
          </div>
          <div className="mt-4">
            <PrimaryButton type="submit">Enviar Mensagem</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};
