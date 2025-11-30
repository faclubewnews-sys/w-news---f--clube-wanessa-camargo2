
import React from 'react';
import { Notification } from '../data/mockData';
import { ButterflyIcon } from './ButterflyIcon';
import { PrimaryButton } from './PrimaryButton';
import { BellIcon } from './icons/UiIcons';

interface MandatoryNotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const MandatoryNotifications: React.FC<MandatoryNotificationsProps> = ({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead 
}) => {
  return (
    <div className="min-h-screen w-full bg-brand-bg-light dark:bg-dark-bg-main flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.ibb.co/nsFY5Z7v/580930255-18542360491037488-2395317763344905099-n.jpg" 
          alt="" 
          className="w-full h-full object-cover opacity-20 dark:opacity-10 blur-sm" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-bg-light/90 to-brand-bg-light/95 dark:from-dark-bg-main/90 dark:to-dark-bg-main/95"></div>
      </div>

      <div className="z-10 w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <ButterflyIcon className="w-16 h-16 text-brand-gold dark:text-dark-accent mx-auto mb-4 animate-subtle-pulse" />
          <h1 className="text-3xl font-bold text-brand-text dark:text-dark-accent mb-2">
            Avisos Importantes
          </h1>
          <p className="text-brand-text/70 dark:text-dark-text-soft max-w-md mx-auto">
            Para continuar acessando o fã clube, por favor, leia as notificações pendentes abaixo.
          </p>
        </div>

        <div className="bg-white/50 dark:bg-dark-bg-secondary/50 backdrop-blur-md rounded-2xl shadow-2xl border border-brand-gold/20 dark:border-dark-icon/30 overflow-hidden">
          <div className="p-6 border-b border-brand-gold/10 dark:border-dark-icon/20 flex justify-between items-center bg-brand-gold/5 dark:bg-dark-icon/5">
            <div className="flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-brand-text dark:text-dark-text-soft" />
              <span className="font-bold text-brand-text dark:text-dark-text-soft">
                {notifications.length} {notifications.length === 1 ? 'Nova Notificação' : 'Novas Notificações'}
              </span>
            </div>
            {notifications.length > 1 && (
              <button 
                onClick={onMarkAllAsRead}
                className="text-sm font-bold text-brand-accent dark:text-dark-accent hover:underline"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className="bg-brand-bg-light dark:bg-dark-bg-main rounded-xl p-5 border-l-4 border-brand-accent dark:border-dark-accent shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-brand-text dark:text-dark-accent">
                    {notification.title}
                  </h3>
                  <span className="text-xs font-medium text-brand-text/50 dark:text-dark-text-soft/50 whitespace-nowrap ml-2">
                    {new Date(notification.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                <p className="text-brand-text/80 dark:text-dark-text-soft mb-4 leading-relaxed">
                  {notification.message}
                </p>

                {notification.link && (
                  <a 
                    href={notification.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block mb-4 text-sm font-bold text-brand-accent dark:text-dark-accent hover:underline"
                  >
                    Acessar Conteúdo Externo &rarr;
                  </a>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-text text-white dark:bg-dark-accent dark:text-dark-bg-main rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Marcar como lida
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-center text-xs text-brand-text/40 dark:text-dark-text-soft/40 mt-6">
          W News Fã Clube Oficial &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};
