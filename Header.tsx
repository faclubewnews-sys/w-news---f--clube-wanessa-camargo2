

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, mockNotifications } from '../data/mockData';
import { ButterflyIcon } from './ButterflyIcon';
import { BellIcon } from './icons/UiIcons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  theme: string;
  onToggleTheme: () => void;
  onContactClick: () => void;
}

const getRoleName = (user: User): string => {
  if (user.subtitle) {
    return user.subtitle;
  }
  switch (user.role) {
    case 'master': return 'Presidente';
    case 'admin': return 'Vice-Presidente';
    case 'assistant': return 'Assistente';
    case 'member': return 'Membro';
    default: return '';
  }
};

export const Header: React.FC<HeaderProps> = ({ user, onLogout, theme, onToggleTheme, onContactClick }) => {
  // Using mockNotifications directly here for simplicity, in a real app this would come from a context or api
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Filter notifications: Global (no targetUserId) OR targeted to this user
  const userNotifications = useMemo(() => {
    return notifications.filter(n => !n.targetUserId || n.targetUserId === user.id)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [notifications, user.id]);

  const unreadCount = userNotifications.filter(n => !n.read).length;

  // Update local state when mock data changes (polling simulation for the sake of this demo)
  useEffect(() => {
      const interval = setInterval(() => {
          setNotifications([...mockNotifications]);
      }, 1000);
      return () => clearInterval(interval);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };
  
  const markAllAsRead = () => {
      // In a real app, send to API. Here, mutate mock.
      mockNotifications.forEach(n => {
          if (!n.targetUserId || n.targetUserId === user.id) {
              n.read = true;
          }
      });
      setNotifications([...mockNotifications]);
  };

  const getIconColor = (type: string) => {
      switch(type) {
          case 'result': return 'text-green-500';
          case 'warning': return 'text-red-500';
          case 'announcement': return 'text-blue-500';
          default: return 'text-brand-gold';
      }
  };

  return (
    <header className="bg-brand-bg-light/30 dark:bg-dark-bg-secondary/30 backdrop-blur-lg p-4 flex justify-between items-center border-b border-brand-gold/20 dark:border-dark-icon/50 sticky top-0 z-10 h-[70px]">
      <div className="flex items-center gap-4">
        <ButterflyIcon className="w-8 h-8 text-brand-gold dark:text-dark-accent" />
        <div>
          <h1 className="font-bold text-lg text-brand-text dark:text-dark-accent">{user.name}</h1>
          <p className="text-xs text-brand-text/70 dark:text-dark-text-soft">{getRoleName(user)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        
        {/* Notifications Bell */}
         <div className="relative" ref={notificationRef}>
            <button 
                onClick={handleNotificationClick}
                className="p-2 rounded-full text-brand-text/80 dark:text-dark-text-soft hover:bg-brand-gold/20 dark:hover:bg-dark-icon/50 transition-colors relative focus:outline-none"
                aria-label="Notificações"
            >
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-brand-bg-light dark:border-dark-bg-secondary">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-brand-bg-light dark:bg-dark-bg-secondary rounded-xl shadow-2xl border border-brand-gold/20 dark:border-dark-icon/50 overflow-hidden z-50">
                    <div className="p-4 border-b border-brand-gold/10 dark:border-dark-icon/30 flex justify-between items-center bg-brand-gold/5 dark:bg-dark-icon/10">
                        <h3 className="font-bold text-brand-text dark:text-dark-accent text-sm">Notificações</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-xs text-brand-accent dark:text-dark-accent hover:underline font-semibold">
                                Marcar todas como lidas
                            </button>
                        )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {userNotifications.length > 0 ? (
                            <ul>
                                {userNotifications.map(notification => (
                                    <li key={notification.id} className={`p-4 border-b border-brand-gold/10 dark:border-dark-icon/20 hover:bg-brand-gold/5 dark:hover:bg-dark-icon/10 transition-colors ${!notification.read ? 'bg-brand-gold/5 dark:bg-dark-icon/5' : ''}`}>
                                        <div className="flex gap-3">
                                            <div className={`mt-1 flex-shrink-0 ${getIconColor(notification.type)}`}>
                                                <div className="w-2 h-2 rounded-full bg-current"></div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-sm font-bold text-brand-text dark:text-dark-text-soft ${!notification.read ? 'text-brand-text dark:text-white' : ''}`}>{notification.title}</h4>
                                                <p className="text-xs text-brand-text/70 dark:text-dark-text-soft/70 mt-1">{notification.message}</p>
                                                
                                                {notification.link && (
                                                  <a href={notification.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs font-bold text-brand-accent dark:text-dark-accent hover:underline">
                                                    Acessar Link &rarr;
                                                  </a>
                                                )}

                                                <span className="text-[10px] text-brand-text/50 dark:text-dark-text-soft/50 mt-2 block">
                                                    {new Date(notification.date).toLocaleDateString()} às {new Date(notification.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-8 text-center text-brand-text/60 dark:text-dark-text-soft/60 text-sm">
                                Nenhuma notificação no momento.
                            </div>
                        )}
                    </div>
                    <div className="p-2 bg-brand-bg-light/50 dark:bg-dark-bg-secondary/50 text-center border-t border-brand-gold/10 dark:border-dark-icon/30">
                        <button className="text-xs font-semibold text-brand-text/70 dark:text-dark-text-soft/70 hover:text-brand-gold dark:hover:text-dark-accent">Ver histórico completo</button>
                    </div>
                </div>
            )}
         </div>

        <button
          onClick={onContactClick}
          className="hidden sm:block text-sm font-semibold text-brand-text/80 hover:text-brand-gold dark:text-dark-text-soft dark:hover:text-dark-accent transition-colors duration-300"
        >
          Fale Conosco
        </button>
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full text-brand-gold dark:text-dark-accent hover:bg-brand-bg-dark/50 dark:hover:bg-dark-icon transition-colors duration-300"
          aria-label={`Mudar para o tema ${theme === 'light' ? 'escuro' : 'claro'}`}
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>
        <button 
          onClick={onLogout} 
          className="text-sm font-semibold text-brand-text/80 hover:text-brand-gold dark:text-dark-text-soft dark:hover:text-dark-accent transition-colors duration-300"
        >
          Sair
        </button>
      </div>
    </header>
  );
};