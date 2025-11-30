import React from 'react';
import { ButterflyIcon } from './ButterflyIcon';
import { User } from '../data/mockData';
import { HomeIcon, UserCircleIcon, ShieldIcon, StarIcon, TicketIcon, ChatBubbleIcon } from './icons/UiIcons';
import { ActiveView } from './Dashboard';

interface SidebarProps {
  user: User;
  onNavigate: (view: ActiveView) => void;
  onContactClick: () => void;
  activeView: ActiveView;
}

// Reusable component to ensure consistent styling for all sidebar navigation items.
const SidebarItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive: boolean;
}> = ({ icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`w-full text-sm font-semibold flex items-center gap-3 transition-colors rounded-md py-2 px-3 ${
      isActive
        ? 'bg-brand-gold/10 text-brand-accent dark:bg-dark-accent/20 dark:text-dark-accent'
        : 'text-brand-text/80 hover:bg-brand-gold/10 hover:text-brand-accent dark:text-dark-text-soft/80 dark:hover:bg-dark-icon/20 dark:hover:text-dark-accent'
    }`}
    aria-label={label}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span className="whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>
  </button>
);


export const Sidebar: React.FC<SidebarProps> = ({ user, onNavigate, onContactClick, activeView }) => {
  const isAdminOrMaster = user.role === 'master' || user.role === 'admin';

  return (
    <aside className="w-64 bg-brand-bg-light/50 dark:bg-dark-bg-secondary/70 p-6 hidden lg:flex flex-col gap-8 h-screen sticky top-0 border-r border-brand-gold/20 dark:border-dark-icon/50">
      <div className="flex items-center gap-3">
        <ButterflyIcon className="w-8 h-8 text-brand-gold dark:text-dark-accent" />
        <h2 className="font-bold text-xl text-brand-text dark:text-dark-accent">W News</h2>
      </div>

      <nav className="flex flex-col gap-3">
        <SidebarItem icon={<HomeIcon className="w-5 h-5" />} label="Início" onClick={() => onNavigate('home')} isActive={activeView === 'home'} />
        <SidebarItem icon={<UserCircleIcon className="w-5 h-5" />} label="Meu Perfil" onClick={() => onNavigate('profile')} isActive={activeView === 'profile'} />
        
        {isAdminOrMaster ? (
          <SidebarItem icon={<ChatBubbleIcon className="w-5 h-5" />} label="Mensagens" onClick={() => onNavigate('messageManager')}  isActive={activeView === 'messageManager'} />
        ) : (
          <SidebarItem icon={<ChatBubbleIcon className="w-5 h-5" />} label="Minhas Mensagens" onClick={() => onNavigate('contactHistory')} isActive={activeView === 'contactHistory'} />
        )}

        {isAdminOrMaster && (
            <SidebarItem icon={<ShieldIcon className="w-5 h-5" />} label="Administração" onClick={() => onNavigate('management')} isActive={activeView === 'management'} />
        )}
      </nav>

      <div className="border-t border-brand-gold/20 dark:border-dark-icon/50 my-2"></div>

      <nav className="flex flex-col gap-3">
        <SidebarItem icon={<TicketIcon className="w-5 h-5" />} label="Sorteios" onClick={() => onNavigate('sorteios')} isActive={activeView === 'sorteios'} />
        <SidebarItem icon={<StarIcon className="w-5 h-5" />} label="Wanessa Camargo" onClick={() => onNavigate('wanessa')} isActive={activeView === 'wanessa'} />
      </nav>

      <div className="mt-auto">
         <button onClick={onContactClick} className="w-full text-center text-sm font-semibold text-brand-text/80 hover:text-brand-gold dark:text-dark-text-soft dark:hover:text-dark-accent transition-colors duration-300">
            Fale Conosco
          </button>
      </div>

    </aside>
  );
};