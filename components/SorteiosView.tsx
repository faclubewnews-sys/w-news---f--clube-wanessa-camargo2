import React, { useState, useEffect } from 'react';
import { User, mockGiveawayEntries, GiveawayEntry, mockUsers, mockNotifications, getCamarimStatus } from '../data/mockData';
import { PrimaryButton } from './PrimaryButton';

interface SorteiosViewProps {
  user: User;
}

type SorteioCategory = 'Plateias de programa' | 'Camarim' | 'Eventos';

interface CategoryOption {
  id: SorteioCategory;
  label: string;
  example: string;
  placeholder: string;
}

// Component to display the list of participants (Admin/Master only)
const ParticipantsList: React.FC = () => {
    const [entries, setEntries] = useState(mockGiveawayEntries);
    const [selectedEntry, setSelectedEntry] = useState<GiveawayEntry | null>(null);

    const DataRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
        <div className="flex flex-col pb-2 border-b border-brand-gold/10 dark:border-dark-icon/20 last:border-0">
            <span className="text-xs font-bold text-brand-text/50 dark:text-dark-text-soft/50 uppercase tracking-wider mb-0.5">{label}</span>
            <span className="text-sm font-medium text-brand-text dark:text-dark-text-soft">{value || '-'}</span>
        </div>
    );

    const getParticipantDetails = (userId: string) => mockUsers.find(u => u.id === userId);

    const handleDecision = (entry: GiveawayEntry, status: 'won' | 'lost') => {
        // 1. Update entry status
        const updatedEntry = { ...entry, status };
        
        // Update local state
        setEntries(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
        
        // Update mock data reference
        const index = mockGiveawayEntries.findIndex(e => e.id === entry.id);
        if (index !== -1) mockGiveawayEntries[index] = updatedEntry;

        // 2. Send Individual Notification
        const notificationTitle = status === 'won' ? 'Parabéns! Você ganhou o sorteio!' : 'Resultado do Sorteio';
        const notificationMessage = status === 'won' 
            ? `Você foi selecionado(a) no sorteio: ${entry.drawName} (${entry.category}). Entraremos em contato em breve!`
            : `O resultado do sorteio ${entry.drawName} já saiu. Infelizmente você не foi sorteado(a) desta vez. Continue participando!`;
        
        mockNotifications.unshift({
            id: `NOT-${Date.now()}`,
            title: notificationTitle,
            message: notificationMessage,
            type: 'result',
            date: new Date().toISOString(),
            read: false,
            targetUserId: entry.userId
        });
    };

    const togglePublicVisibility = (entry: GiveawayEntry) => {
        const newValue = !entry.isPublicWinner;
        const updatedEntry = { ...entry, isPublicWinner: newValue };
        
        setEntries(prev => prev.map(e => e.id === entry.id ? updatedEntry : e));
        
        const index = mockGiveawayEntries.findIndex(e => e.id === entry.id);
        if (index !== -1) mockGiveawayEntries[index] = updatedEntry;

        if (newValue) {
            // Optional: Automatically create a public announcement
             mockNotifications.unshift({
                id: `PUB-${Date.now()}`,
                title: 'Temos um Vencedor!',
                message: `O vencedor do sorteio ${entry.drawName} foi: ${entry.userName}! Parabéns!`,
                type: 'announcement',
                date: new Date().toISOString(),
                read: false,
                // No targetUserId means public
            });
        }
    };

    return (
        <div className="animate-fade-in">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-brand-text dark:text-dark-accent">Lista de Participantes</h3>
                <span className="text-xs font-semibold bg-brand-gold/20 dark:bg-dark-icon/20 px-3 py-1 rounded-full text-brand-text dark:text-dark-text-soft">
                    Total: {entries.length}
                </span>
             </div>

             {entries.length > 0 ? (
                <div className="overflow-x-auto bg-brand-bg-light/50 dark:bg-dark-bg-secondary/70 rounded-lg border border-brand-gold/10 dark:border-dark-icon/30">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-brand-gold/20 dark:border-dark-icon/50 bg-brand-gold/5 dark:bg-dark-icon/10">
                                <th className="p-3 text-sm font-bold text-brand-text dark:text-dark-accent">Participante</th>
                                <th className="p-3 text-sm font-bold text-brand-text dark:text-dark-accent hidden lg:table-cell">Documentos</th>
                                <th className="p-3 text-sm font-bold text-brand-text dark:text-dark-accent">Sorteio</th>
                                <th className="p-3 text-sm font-bold text-brand-text dark:text-dark-accent">Decisão</th>
                                <th className="p-3 text-sm font-bold text-brand-text dark:text-dark-accent text-right">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.slice().reverse().map((entry) => {
                                const user = getParticipantDetails(entry.userId);
                                const isDecided = entry.status === 'won' || entry.status === 'lost';

                                return (
                                    <tr key={entry.id} className="border-b border-brand-gold/10 dark:border-dark-icon/20 hover:bg-brand-gold/5 dark:hover:bg-dark-icon/10 transition-colors">
                                        <td className="p-3 align-top">
                                            <div className="flex items-center gap-3">
                                                {user && (
                                                    <img src={user.profilePic} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-brand-gold/30" />
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-brand-text dark:text-dark-text-soft">{entry.userName}</span>
                                                    <span className="text-xs text-brand-text/70 dark:text-dark-text-soft/70">ID: {entry.userCardId}</span>
                                                    <span className="lg:hidden text-xs text-brand-text/60 mt-1">CPF: {user?.cpf}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 align-top hidden lg:table-cell">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-brand-text/80 dark:text-dark-text-soft/80"><span className="font-semibold">CPF:</span> {user?.cpf}</span>
                                                <span className="text-xs text-brand-text/80 dark:text-dark-text-soft/80"><span className="font-semibold">RG:</span> {user?.rg}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 align-top">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-semibold text-brand-text dark:text-dark-text-soft">{entry.drawName}</span>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-text dark:text-dark-text-soft w-fit border border-brand-accent/20">
                                                    {entry.category}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-3 align-middle">
                                            {!isDecided ? (
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <button 
                                                        onClick={() => handleDecision(entry, 'won')}
                                                        className="px-3 py-1 text-xs font-bold bg-green-100 text-green-800 hover:bg-green-200 rounded-md border border-green-300 transition-colors"
                                                    >
                                                        Ganhou
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDecision(entry, 'lost')}
                                                        className="px-3 py-1 text-xs font-bold bg-red-100 text-red-800 hover:bg-red-200 rounded-md border border-red-300 transition-colors"
                                                    >
                                                        Não Ganhou
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-md text-center border ${entry.status === 'won' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                                                        {entry.status === 'won' ? 'Ganhador' : 'Não Ganhou'}
                                                    </span>
                                                    
                                                    {entry.status === 'won' && (
                                                        <label className="flex items-center gap-2 cursor-pointer group">
                                                            <div className="relative">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={!!entry.isPublicWinner} 
                                                                    onChange={() => togglePublicVisibility(entry)}
                                                                    className="sr-only"
                                                                />
                                                                <div className={`w-8 h-4 bg-gray-300 rounded-full shadow-inner transition-colors ${entry.isPublicWinner ? 'bg-brand-accent' : ''}`}></div>
                                                                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${entry.isPublicWinner ? 'transform translate-x-4' : ''}`}></div>
                                                            </div>
                                                            <span className="text-[10px] text-brand-text/70 dark:text-dark-text-soft/70 font-semibold group-hover:text-brand-gold transition-colors">
                                                                Mostrar público
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 align-middle text-right">
                                            <button 
                                                onClick={() => setSelectedEntry(entry)}
                                                className="text-xs font-bold uppercase tracking-wider text-brand-text/60 dark:text-dark-text-soft/60 hover:text-brand-accent dark:hover:text-dark-accent transition-colors"
                                            >
                                                Ver Mais
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
             ) : (
                 <div className="text-center py-10 bg-brand-bg-light/50 dark:bg-dark-bg-secondary/70 rounded-lg border border-brand-dashed border-brand-gold/30">
                     <p className="text-brand-text/60 dark:text-dark-text-soft/60">Nenhum participante inscrito até o momento.</p>
                 </div>
             )}

            {/* Detailed Modal */}
            {selectedEntry && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedEntry(null)}>
                    <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-brand-gold/20 dark:border-dark-icon/50 flex justify-between items-center sticky top-0 bg-brand-bg-light dark:bg-dark-bg-secondary z-10">
                            <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent">Detalhes da Inscrição</h3>
                            <button onClick={() => setSelectedEntry(null)} className="text-2xl text-brand-text/50 hover:text-brand-text dark:text-dark-text-soft/50 dark:hover:text-dark-text-soft">&times;</button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Sorteio Info Block */}
                            <div className="bg-brand-gold/10 dark:bg-dark-icon/10 rounded-lg p-4 border border-brand-gold/20 dark:border-dark-icon/30">
                                <h4 className="text-sm font-bold text-brand-text dark:text-dark-accent uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    Dados do Sorteio
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <DataRow label="Nome do Sorteio" value={selectedEntry.drawName} />
                                    <DataRow label="Categoria" value={selectedEntry.category} />
                                    <DataRow label="Data de Inscrição" value={new Date(selectedEntry.registrationDate).toLocaleString('pt-BR')} />
                                    <DataRow label="ID da Inscrição" value={selectedEntry.id} />
                                </div>
                            </div>

                            {/* User Info Block */}
                            {(() => {
                                const user = getParticipantDetails(selectedEntry.userId);
                                if (!user) return <p>Usuário не encontrado.</p>;
                                
                                return (
                                    <div className="space-y-4">
                                         <h4 className="text-sm font-bold text-brand-text dark:text-dark-accent uppercase tracking-wider flex items-center gap-2 border-b border-brand-gold/20 dark:border-dark-icon/30 pb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                            Dados do Participante
                                        </h4>

                                        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                                            <img src={user.profilePic} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-brand-bg-light dark:border-dark-bg-secondary shadow-md" />
                                            <div className="flex-1 w-full">
                                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                                    <DataRow label="Nome Completo" value={user.name} />
                                                    <DataRow label="ID / Carteirinha" value={user.cardId} />
                                                    <DataRow label="CPF" value={user.cpf} />
                                                    <DataRow label="RG" value={user.rg} />
                                                    <DataRow label="Data de Nascimento" value={user.dob} />
                                                    <DataRow label="E-mail" value={user.email} />
                                                    <DataRow label="Telefone" value={user.phone} />
                                                    <DataRow label="Cidade / Estado" value={`${user.city} - ${user.state}`} />
                                                    <DataRow label="Endereço" value={user.address} />
                                                 </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                        
                        <div className="p-6 border-t border-brand-gold/20 dark:border-dark-icon/50 bg-brand-bg-light/50 dark:bg-dark-bg-secondary/50 mt-auto rounded-b-2xl flex justify-end">
                            <button 
                                onClick={() => setSelectedEntry(null)}
                                className="px-6 py-2 bg-brand-text text-brand-bg-light dark:bg-dark-accent dark:text-dark-bg-main font-bold rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export const SorteiosView: React.FC<SorteiosViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'list'>('register');
  const [selectedCategory, setSelectedCategory] = useState<SorteioCategory | ''>('');
  const [drawName, setDrawName] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  // FIX: Explicitly type the state to allow releaseDate to be optional, matching the return type of getCamarimStatus.
  const [camarimStatus, setCamarimStatus] = useState<{ isBlocked: boolean; releaseDate?: string }>({ isBlocked: false, releaseDate: '' });

  const isAdminOrMaster = user.role === 'admin' || user.role === 'master';

  useEffect(() => {
    if (selectedCategory === 'Camarim') {
      const status = getCamarimStatus(user);
      setCamarimStatus(status);
    } else {
      setCamarimStatus({ isBlocked: false, releaseDate: '' });
    }
  }, [selectedCategory, user]);


  const categories: CategoryOption[] = [
    { 
      id: 'Plateias de programa', 
      label: 'Plateias de Programa', 
      example: 'Exemplo: Programa Domingão',
      placeholder: 'Ex.: Programa Domingão'
    },
    { 
      id: 'Camarim', 
      label: 'Camarim', 
      example: 'Exemplo: Show na Audio',
      placeholder: 'Ex.: Show na Audio'
    },
    { 
      id: 'Eventos', 
      label: 'Eventos', 
      example: 'Exemplo: Festa de lançamento de CD',
      placeholder: 'Ex.: Festa de lançamento de CD'
    }
  ];

  const activeCategoryData = categories.find(c => c.id === selectedCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !drawName.trim() || camarimStatus.isBlocked) return;
    
    // Create new entry and push to mock data
    const newEntry: GiveawayEntry = {
        id: `ENTRY-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        userCardId: user.cardId,
        category: selectedCategory,
        drawName: drawName,
        registrationDate: new Date().toISOString(),
        status: 'pending'
    };
    mockGiveawayEntries.push(newEntry);

    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      setDrawName('');
      setSelectedCategory('');
    }, 3000);
  };

  const DataField: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-xs font-bold text-brand-text/60 dark:text-dark-text-soft/60 uppercase tracking-wider mb-1">{label}</span>
      <div className="w-full bg-brand-gold/10 dark:bg-dark-icon/10 border-b border-brand-gold/30 dark:border-dark-icon px-2 py-2 text-brand-text dark:text-dark-text-soft font-medium rounded-t-sm truncate">
        {value || '-'}
      </div>
    </div>
  );

  return (
    <div className="bg-brand-bg-light/30 dark:bg-dark-bg-secondary/30 backdrop-blur-sm rounded-lg shadow-lg p-6 animate-fade-in">
      <div className="border-b border-brand-gold/20 dark:border-dark-icon/50 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-brand-text dark:text-dark-accent">Sorteios</h2>
            <p className="text-sm text-brand-text/70 dark:text-dark-text-soft">Participe das experiências exclusivas do fã clube.</p>
        </div>
        
        {isAdminOrMaster && (
            <div className="flex p-1 bg-brand-bg-light/50 dark:bg-dark-bg-secondary/80 rounded-lg border border-brand-gold/20 dark:border-dark-icon/30">
                <button 
                    onClick={() => setActiveTab('register')}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'register' ? 'bg-brand-text text-white dark:bg-dark-accent dark:text-dark-bg-main shadow-sm' : 'text-brand-text/70 dark:text-dark-text-soft hover:bg-brand-gold/10'}`}
                >
                    Inscrição
                </button>
                <button 
                    onClick={() => setActiveTab('list')}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'list' ? 'bg-brand-text text-white dark:bg-dark-accent dark:text-dark-bg-main shadow-sm' : 'text-brand-text/70 dark:text-dark-text-soft hover:bg-brand-gold/10'}`}
                >
                    Participantes do Sorteio
                </button>
            </div>
        )}
      </div>

      {activeTab === 'list' && isAdminOrMaster ? (
          <ParticipantsList />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Category Selector */}
            <div>
                <label className="block text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-3">Categoria do Sorteio</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-4 rounded-lg border transition-all duration-300 flex flex-col items-start text-left h-full ${
                                selectedCategory === category.id
                                    ? 'bg-brand-text text-brand-bg-light border-brand-text dark:bg-dark-accent dark:text-dark-bg-main dark:border-dark-accent shadow-md transform scale-[1.02]'
                                    : 'bg-brand-bg-light/50 dark:bg-dark-bg-secondary/50 text-brand-text dark:text-dark-text-soft border-brand-gold/30 dark:border-dark-icon hover:border-brand-gold hover:bg-brand-gold/10 dark:hover:bg-dark-icon/20'
                            }`}
                        >
                            <span className="font-bold text-sm mb-1">{category.label}</span>
                            <span className={`text-xs ${selectedCategory === category.id ? 'text-brand-bg-light/80 dark:text-dark-bg-main/80' : 'text-brand-text/60 dark:text-dark-text-soft/60'}`}>
                                {category.example}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. Camarim Warning */}
            {selectedCategory === 'Camarim' && (
              camarimStatus.isBlocked ? (
                <div className="p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r-md animate-fade-in">
                    <div className="flex gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        <div>
                            <p className="text-sm font-bold text-red-800 dark:text-red-200">Inscrição Bloqueada</p>
                            <p className="text-sm text-red-800/80 dark:text-red-200/80 mt-1">
                                Você не pode se inscrever em sorteios de camarim no momento. Sua elegibilidade será restaurada em <span className="font-bold">{camarimStatus.releaseDate}</span>.
                            </p>
                        </div>
                    </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-md animate-fade-in">
                    <div className="flex gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <p className="text-sm font-bold text-yellow-800 dark:text-yellow-200">Atenção</p>
                            <p className="text-sm text-yellow-800/80 dark:text-yellow-200/80 mt-1">
                                Caso você seja o vencedor deste sorteio de Camarim, você ficará bloqueado por <span className="font-bold">6 meses</span> para participar de novos sorteios de Camarim.
                            </p>
                        </div>
                    </div>
                </div>
              )
            )}

            {/* 3. Draw Name Input */}
            <div>
                <label htmlFor="drawName" className="block text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1">Nome do Sorteio</label>
                <input 
                    id="drawName"
                    type="text"
                    value={drawName}
                    onChange={(e) => setDrawName(e.target.value)}
                    placeholder={activeCategoryData ? activeCategoryData.placeholder : "Selecione uma categoria primeiro"}
                    disabled={!selectedCategory || camarimStatus.isBlocked}
                    className="w-full bg-transparent border-b-2 border-brand-gold/30 focus:border-brand-gold text-brand-text placeholder-brand-text/50 px-2 py-3 transition-colors duration-300 focus:outline-none dark:border-dark-icon dark:focus:border-dark-accent dark:text-dark-text-soft dark:placeholder-dark-text-soft disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                />
            </div>

            {/* 4. User Data (Read Only) */}
            <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary/70 rounded-lg p-6 border border-brand-gold/10 dark:border-dark-icon/30">
                <h3 className="text-lg font-bold text-brand-text dark:text-dark-accent mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Seus Dados de Inscrição
                </h3>
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                        <img 
                            src={user.profilePic} 
                            alt={user.name} 
                            className="w-28 h-28 rounded-full object-cover border-4 border-brand-bg-light dark:border-dark-bg-secondary shadow-md"
                        />
                    </div>
                    <div className="flex-grow w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <DataField label="Nome Completo" value={user.name} />
                        </div>
                        <DataField label="Data de Nascimento" value={user.dob} />
                        <DataField label="Número da Carteirinha / ID" value={user.cardId} />
                        
                        <DataField label="CPF" value={user.cpf} />
                        <DataField label="RG" value={user.rg} />
                        
                        <DataField label="E-mail" value={user.email} />
                        <DataField label="Telefone" value={user.phone} />
                        
                        <div className="sm:col-span-2">
                            <DataField label="Cidade / Estado" value={`${user.city} - ${user.state}`} />
                        </div>
                    </div>
                </div>
                <p className="text-xs text-center md:text-right mt-4 text-brand-text/50 dark:text-dark-text-soft/50 italic">
                    * Dados obtidos automaticamente do seu perfil.
                </p>
            </div>

            {/* 5. Submit Button */}
            <div className="pt-4">
                <PrimaryButton type="submit" disabled={!selectedCategory || !drawName.trim() || camarimStatus.isBlocked}>
                    Confirmar Participação
                </PrimaryButton>
            </div>
        </form>
      )}

       {showConfirmation && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl z-50 animate-bounce font-semibold">
                Participação confirmada com sucesso! Boa sorte!
            </div>
        )}

    </div>
  );
};