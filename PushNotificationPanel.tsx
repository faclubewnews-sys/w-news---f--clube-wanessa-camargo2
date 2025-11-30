
import React, { useState } from 'react';
import { PrimaryButton } from './PrimaryButton';
import { mockNotifications, Notification } from '../data/mockData';

export const PushNotificationPanel: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newNotification: Notification = {
      id: `NOT-${Date.now()}`,
      title,
      message,
      link: link.trim() || undefined,
      type: 'announcement',
      date: new Date().toISOString(),
      read: false,
    };

    // In a real app, this would be an API call to send to all devices
    mockNotifications.unshift(newNotification);

    setSuccess(true);
    setTitle('');
    setMessage('');
    setLink('');

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary/70 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4 border-b border-brand-gold/20 dark:border-dark-icon/50 pb-2">
             <div className="p-2 rounded-full bg-brand-accent/10 text-brand-accent dark:text-dark-accent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
             </div>
             <h3 className="text-lg font-bold text-brand-text dark:text-dark-accent">Enviar Push Notification</h3>
        </div>
      
      <form onSubmit={handleSendPush} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Título do Push</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Novidade Exclusiva!"
            className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent"
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Mensagem</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite o texto da notificação..."
            rows={3}
            className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Link (Opcional)</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent"
          />
        </div>

        <div className="flex justify-end">
            <div className="w-full sm:w-auto">
                 <PrimaryButton type="submit">Enviar Push</PrimaryButton>
            </div>
        </div>
      </form>

      {success && (
        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md text-sm font-semibold text-center animate-pulse">
          Notificação enviada com sucesso para todos os membros!
        </div>
      )}
    </div>
  );
};
