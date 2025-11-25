
import React from 'react';
import { ButterflyIcon } from './ButterflyIcon';
import { User } from '../data/mockData';
import { HomeIcon, UserCircleIcon, ShieldIcon, StarIcon, TicketIcon } from './icons/UiIcons';

interface SidebarProps {
  user: User;
  onNavigate: (view: 'home' | 'profile' | 'management' | 'wanessa' | 'sorteios') => void;
  onContactClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onNavigate, onContactClick }) => {
  return (
    <aside className="w-64 bg-brand-bg-light/50 dark:bg-dark-bg-secondary/70 p-6 hidden lg:flex flex-col gap-8 h-screen sticky top-0 border-r border-brand-gold/20 dark:border-dark-icon/50">
      <div className="flex items-center gap-3">
        <ButterflyIcon className="w-8 h-8 text-brand-gold dark:text-dark-accent" />
        <h2 className="font-bold text-xl text-brand-text dark:text-dark-accent">W News</h2>
      </div>

      <nav className="flex flex-col gap-3">
         <button onClick={() => onNavigate('home')} className="text-sm font-semibold flex items-center gap-3 hover:text-brand-gold dark:hover:text-dark-accent transition-colors">
            <HomeIcon className="w-5 h-5" /> Início
        </button>
        <button onClick={() => onNavigate('profile')} className="text-sm font-semibold flex items-center gap-3 hover:text-brand-gold dark:hover:text-dark-accent transition-colors">
            <UserCircleIcon className="w-5 h-5" /> Meu Perfil
        </button>
        {(user.role === 'master' || user.role === 'admin') && (
            <button onClick={() => onNavigate('management')} className="text-sm font-semibold flex items-center gap-3 hover:text-brand-gold dark:hover:text-dark-accent transition-colors">
                <ShieldIcon className="w-5 h-5" /> Administração
            </button>
        )}
      </nav>

      <div className="border-t border-brand-gold/20 dark:border-dark-icon/50 my-2"></div>

      <nav className="flex flex-col gap-3">
        <button onClick={() => onNavigate('sorteios')} className="text-sm font-semibold flex items-center gap-3 hover:text-brand-gold dark:hover:text-dark-accent transition-colors">
            <TicketIcon className="w-5 h-5" /> Sorteios
        </button>
         <button onClick={() => onNavigate('wanessa')} className="text-sm font-semibold flex items-center gap-3 hover:text-brand-gold dark:hover:text-dark-accent transition-colors">
            <StarIcon className="w-5 h-5" /> Wanessa Camargo
        </button>
      </nav>

      <div className="mt-auto">
         <button onClick={onContactClick} className="w-full text-center text-sm font-semibold text-brand-text/80 hover:text-brand-gold dark:text-dark-text-soft dark:hover:text-dark-accent transition-colors duration-300">
            Fale Conosco
          </button>
      </div>

    </aside>
  );
};
