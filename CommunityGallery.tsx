
import React, { useState, useMemo } from 'react';
import { User, refreshUsersFromStorage } from '../data/mockData';
import { ButterflyIcon } from './ButterflyIcon';
import { PrimaryButton } from './PrimaryButton';

interface CommunityGalleryProps {
  currentUser: User;
  lastUpdate?: number;
}

export const CommunityGallery: React.FC<CommunityGalleryProps> = ({ currentUser, lastUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  // Filter logic: Active members only, apply search
  // CRITICAL: We re-fetch users from storage whenever lastUpdate changes to get the fresh photos
  const activeMembers = useMemo(() => {
    // Force a fresh read from the "database" to simulate real-time fetch
    const currentUsers = refreshUsersFromStorage();
    
    return currentUsers.filter(user => {
      if (user.status !== 'Ativo') return false;
      
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = selectedCity ? user.city === selectedCity : true;

      return matchesSearch && matchesCity;
    });
  }, [searchTerm, selectedCity, lastUpdate]);

  const uniqueCities = useMemo(() => {
    const currentUsers = refreshUsersFromStorage();
    const cities = new Set(currentUsers.filter(u => u.status === 'Ativo').map(u => u.city));
    return Array.from(cities).sort();
  }, [lastUpdate]);

  return (
    <div className="w-full mt-10 animate-fade-in">
        <div className="text-center mb-8">
            <h3 className="text-2xl font-light text-brand-text dark:text-dark-accent flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-brand-gold/50"></span>
                Nossa Comunidade
                <span className="h-px w-8 bg-brand-gold/50"></span>
            </h3>
            <p className="text-sm text-brand-text/60 dark:text-dark-text-soft/60 mt-2">
                Conheça os membros oficiais do W News
            </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 max-w-2xl mx-auto px-4">
            <input 
                type="text" 
                placeholder="Buscar membro..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-brand-bg-light/50 dark:bg-dark-bg-secondary/50 border border-brand-gold/30 dark:border-dark-icon rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-gold text-sm text-brand-text dark:text-dark-text-soft placeholder-brand-text/40"
            />
            <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full sm:w-48 bg-brand-bg-light/50 dark:bg-dark-bg-secondary/50 border border-brand-gold/30 dark:border-dark-icon rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-brand-gold text-sm text-brand-text dark:text-dark-text-soft"
            >
                <option value="">Todas as Cidades</option>
                {uniqueCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                ))}
            </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 px-4 pb-10">
            {activeMembers.map(member => (
                <div 
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className="group bg-brand-bg-light/30 dark:bg-dark-bg-secondary/30 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:bg-brand-bg-light/60 dark:hover:bg-dark-bg-secondary/60 transition-all duration-300 border border-transparent hover:border-brand-gold/20 transform hover:-translate-y-1"
                >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3">
                         <img 
                            src={member.profilePic} 
                            alt={member.name} 
                            className="w-full h-full rounded-full object-cover shadow-md ring-2 ring-brand-gold/30 dark:ring-dark-accent/30 group-hover:ring-brand-gold group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-brand-bg-light dark:bg-dark-bg-secondary rounded-full flex items-center justify-center shadow-sm border border-brand-gold/20">
                            <ButterflyIcon className="w-3 h-3 text-brand-gold dark:text-dark-accent" />
                        </div>
                    </div>
                    <h4 className="font-bold text-sm text-brand-text dark:text-dark-text-soft line-clamp-1 w-full" title={member.name}>
                        {member.name.split(' ')[0]} {member.name.split(' ').slice(-1)}
                    </h4>
                    <p className="text-xs text-brand-text/60 dark:text-dark-text-soft/60 mt-1 mb-2">
                        {member.city}, {member.state}
                    </p>
                    <div className="mt-auto pt-2 border-t border-brand-gold/10 w-full">
                        <span className="text-[10px] font-mono text-brand-gold dark:text-dark-accent uppercase tracking-widest">
                            {member.cardId}
                        </span>
                    </div>
                </div>
            ))}
        </div>

        {activeMembers.length === 0 && (
            <div className="text-center py-10 opacity-60">
                <p>Nenhum membro encontrado com esses filtros.</p>
            </div>
        )}

        {/* View Only Modal */}
        {selectedMember && (
             <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedMember(null)}>
                <div 
                    className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-fade-in flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setSelectedMember(null)} 
                        className="absolute top-4 right-4 text-brand-text/40 hover:text-brand-text dark:text-dark-text-soft/40 dark:hover:text-dark-text-soft transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <div className="w-32 h-32 rounded-full p-1 border-2 border-brand-gold dark:border-dark-accent mb-4 shadow-lg">
                        <img 
                            src={selectedMember.profilePic} 
                            alt={selectedMember.name} 
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>

                    <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent text-center leading-tight mb-1">
                        {selectedMember.name}
                    </h3>
                    <p className="text-brand-accent dark:text-dark-text-soft text-sm font-medium mb-6">
                        Membro Oficial
                    </p>

                    <div className="w-full space-y-4 bg-brand-bg-light/50 dark:bg-dark-bg-main/30 rounded-xl p-4 border border-brand-gold/10">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-brand-text/50 uppercase tracking-wider">ID</span>
                            <span className="text-sm font-mono font-semibold text-brand-text dark:text-dark-text-soft">{selectedMember.cardId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-brand-text/50 uppercase tracking-wider">Local</span>
                            <span className="text-sm font-medium text-brand-text dark:text-dark-text-soft text-right">{selectedMember.city}, {selectedMember.state}</span>
                        </div>
                        <div className="flex justify-between items-center">
                             <span className="text-xs font-bold text-brand-text/50 uppercase tracking-wider">Membro desde</span>
                             <span className="text-sm font-medium text-brand-text dark:text-dark-text-soft">{new Date(selectedMember.registrationDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                    </div>

                    {/* Admin Only Action */}
                    {(currentUser.role === 'master' || currentUser.role === 'admin') && (
                        <div className="mt-6 w-full">
                            <button className="w-full py-2 text-xs font-bold uppercase tracking-wider text-brand-text/40 border border-brand-text/20 rounded-lg hover:bg-brand-text hover:text-brand-bg-light transition-all">
                                Acessar Ficha Completa (Admin)
                            </button>
                        </div>
                    )}
                </div>
             </div>
        )}
    </div>
  );
};
