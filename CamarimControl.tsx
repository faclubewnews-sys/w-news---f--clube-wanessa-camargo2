
import React, { useState, useMemo, useEffect } from 'react';
import { User, mockUsers, mockCamarimWinners, CamarimWinner, getCamarimStatus, updateUserInStorage, mockNotifications, Notification } from '../data/mockData';
import { PrimaryButton } from './PrimaryButton';

interface CamarimControlProps {
  currentUser: User;
}

// Modal for Master to manage manual blocks
const ManageBlockModal: React.FC<{
    user: User;
    onClose: () => void;
    onSave: () => void;
}> = ({ user, onClose, onSave }) => {
    const [isBlocked, setIsBlocked] = useState(!!user.camarimManualBlock);
    const [startDate, setStartDate] = useState(user.camarimManualBlock?.startDate || new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(user.camarimManualBlock?.endDate || '');

    useEffect(() => {
        if (isBlocked && startDate) {
            const start = new Date(startDate + 'T00:00:00');
            start.setMonth(start.getMonth() + 6);
            setEndDate(start.toISOString().split('T')[0]);
        } else {
            setEndDate('');
        }
    }, [isBlocked, startDate]);

    const handleSave = () => {
        const updatedBlock = isBlocked
            ? { camarimManualBlock: { startDate, endDate } }
            : { camarimManualBlock: undefined };
            
        updateUserInStorage({ ...user, ...updatedBlock });
        onSave();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent mb-4">Gerenciar Bloqueio de Camarim</h3>
                <p className="mb-6 text-sm">Gerenciando bloqueio para: <span className="font-bold">{user.name}</span></p>

                <div className="space-y-6">
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-brand-bg-dark/5 rounded-lg">
                        <div className="relative">
                            <input type="checkbox" checked={isBlocked} onChange={() => setIsBlocked(!isBlocked)} className="sr-only" />
                            <div className={`w-10 h-6 rounded-full shadow-inner transition-colors ${isBlocked ? 'bg-brand-accent' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isBlocked ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                        <span className="font-semibold text-brand-text dark:text-dark-text-soft">Bloquear para novos sorteios de camarim</span>
                    </label>

                    {isBlocked && (
                        <div className="animate-fade-in space-y-4 p-4 border border-brand-gold/20 rounded-lg">
                             <div>
                                <label htmlFor="start-date" className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Data de Início do Bloqueio</label>
                                <input 
                                    type="date" 
                                    id="start-date" 
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:focus:ring-dark-accent" 
                                />
                            </div>
                             <div>
                                <p className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Fim do Bloqueio (Calculado)</p>
                                <p className="p-2 bg-brand-gold/10 rounded-md font-mono">{endDate ? new Date(endDate + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                    <PrimaryButton onClick={handleSave} disabled={isBlocked && !startDate}>Salvar Alterações</PrimaryButton>
                </div>
            </div>
        </div>
    );
};


export const CamarimControl: React.FC<CamarimControlProps> = ({ currentUser }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // State for the registration form
    const [selectedWinnerId, setSelectedWinnerId] = useState('');
    const [drawDate, setDrawDate] = useState('');
    const [observations, setObservations] = useState('');
    const [registrationFeedback, setRegistrationFeedback] = useState<string | null>(null);
    
    const canManage = currentUser.role === 'master';
    const canRegister = currentUser.role === 'master' || currentUser.role === 'admin';

    const allMembers = useMemo(() => {
        return mockUsers.filter(u => u.role === 'member' || u.role === 'admin');
    }, [refreshKey]);

    const winners = useMemo(() => {
        return [...mockCamarimWinners];
    }, [refreshKey]);
    
    const membersForSelect = useMemo(() => mockUsers.filter(u => u.role === 'member'), []);

    useEffect(() => {
        if (membersForSelect.length > 0 && !selectedWinnerId) {
            setSelectedWinnerId(membersForSelect[0].id);
        }
    }, [membersForSelect, selectedWinnerId]);
    
    const handleRegisterWinner = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedWinnerId || !drawDate) {
            alert("Por favor, selecione um membro e a data do sorteio.");
            return;
        }

        const winner = mockUsers.find(u => u.id === selectedWinnerId);
        if (!winner) {
            alert("Membro selecionado não encontrado.");
            return;
        }

        const newWinnerEntry: CamarimWinner = {
            id: `CAMARIM-${Date.now()}`,
            winnerId: winner.id,
            winnerName: winner.name,
            winnerProfilePic: winner.profilePic,
            drawDate: drawDate,
            registeredBy: currentUser.id,
            observations: observations,
        };

        mockCamarimWinners.push(newWinnerEntry);

        const winNotification: Notification = {
            id: `NOT-WIN-${Date.now()}`,
            title: "Parabéns! Você ganhou um sorteio de Camarim!",
            message: `Você foi o ganhador(a) do camarim do dia ${new Date(drawDate + 'T00:00:00').toLocaleDateString('pt-BR')}. Em breve entraremos em contato com mais detalhes.`,
            type: 'result',
            date: new Date().toISOString(),
            read: false,
            targetUserId: winner.id,
        };
        mockNotifications.unshift(winNotification);

        setRegistrationFeedback(`${winner.name} foi registrado(a) como ganhador(a) com sucesso!`);
        setTimeout(() => setRegistrationFeedback(null), 4000);

        setDrawDate('');
        setObservations('');
        if (membersForSelect.length > 0) {
            setSelectedWinnerId(membersForSelect[0].id);
        }
        setRefreshKey(k => k + 1);
    };


    const getEligibilityDate = (drawDate: string) => {
        const date = new Date(drawDate);
        date.setMonth(date.getMonth() + 6);
        return date;
    };

    return (
        <div className="space-y-6">
            {/* Master Only: Member Block Management */}
            {canManage && (
                 <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent mb-4">Gerenciamento de Bloqueio de Membros</h3>
                     <div className="overflow-x-auto">
                         <table className="w-full text-left">
                             <thead>
                                 <tr className="border-b border-brand-gold/30 dark:border-dark-icon">
                                     <th className="p-3">Membro</th>
                                     <th className="p-3">Status de Elegibilidade</th>
                                     <th className="p-3 hidden sm:table-cell">Início do Bloqueio</th>
                                     <th className="p-3">Ação</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {allMembers.map(member => {
                                     const status = getCamarimStatus(member);
                                     const manualBlockStart = member.camarimManualBlock?.startDate 
                                        ? new Date(member.camarimManualBlock.startDate + 'T00:00:00').toLocaleDateString('pt-BR') 
                                        : 'N/A';
                                     
                                     return (
                                        <tr key={member.id} className="border-b border-brand-gold/20 dark:border-dark-icon/50">
                                            <td className="p-3 font-medium flex items-center gap-3">
                                                <img src={member.profilePic} className="w-8 h-8 rounded-full object-cover" alt={member.name}/>
                                                {member.name}
                                            </td>
                                            <td className="p-3 text-sm">
                                                {status.isBlocked ? (
                                                    <span className="text-red-600 font-semibold">Bloqueado até {status.releaseDate}</span>
                                                ) : (
                                                    <span className="text-green-600 font-semibold">Elegível</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-sm font-mono hidden sm:table-cell">{manualBlockStart}</td>
                                            <td className="p-3">
                                                <button onClick={() => setSelectedUser(member)} className="text-sm font-semibold text-brand-accent dark:text-dark-accent hover:underline">
                                                    Gerenciar
                                                </button>
                                            </td>
                                        </tr>
                                     )
                                 })}
                             </tbody>
                         </table>
                     </div>
                 </div>
            )}

            {canRegister && (
                 <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent mb-4">Registrar Ganhador de Camarim</h3>
                    <form onSubmit={handleRegisterWinner} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                             <label htmlFor="member-select" className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Selecionar Membro</label>
                            <select 
                                id="member-select" 
                                value={selectedWinnerId}
                                onChange={e => setSelectedWinnerId(e.target.value)}
                                className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:focus:ring-dark-accent"
                            >
                                {membersForSelect.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="draw-date" className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Data do Sorteio</label>
                            <input 
                                type="date" 
                                id="draw-date" 
                                value={drawDate}
                                onChange={e => setDrawDate(e.target.value)}
                                required
                                className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:focus:ring-dark-accent" 
                            />
                        </div>
                        <div className="sm:col-span-2">
                             <label htmlFor="observations" className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Observações</label>
                             <textarea 
                                id="observations" 
                                rows={3} 
                                value={observations}
                                onChange={e => setObservations(e.target.value)}
                                className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:focus:ring-dark-accent"
                             ></textarea>
                        </div>
                         <div className="sm:col-span-2 flex justify-end">
                            <PrimaryButton type="submit">Registrar</PrimaryButton>
                        </div>
                    </form>
                    {registrationFeedback && (
                         <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md text-sm font-semibold text-center animate-fade-in">
                            {registrationFeedback}
                        </div>
                    )}
                </div>
            )}
           
            <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent mb-4">Histórico de Ganhadores</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-brand-gold/30 dark:border-dark-icon">
                                <th className="p-3">Ganhador</th>
                                <th className="p-3 hidden sm:table-cell">Data Sorteio</th>
                                <th className="p-3">Status Bloqueio Automático</th>
                                {canManage && <th className="p-3">Ação</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {winners.sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime()).map(winner => {
                                const eligibilityDate = getEligibilityDate(winner.drawDate);
                                const isBlocked = new Date() < eligibilityDate;
                                return (
                                    <tr key={winner.id} className="border-b border-brand-gold/20 dark:border-dark-icon/50">
                                        <td className="p-3 font-medium flex items-center gap-3">
                                            <img src={winner.winnerProfilePic} className="w-8 h-8 rounded-full object-cover" alt={winner.winnerName}/>
                                            {winner.winnerName}
                                        </td>
                                        <td className="p-3 text-sm hidden sm:table-cell">{new Date(winner.drawDate  + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                                        <td className="p-3 text-sm">
                                            {isBlocked ? (
                                                <span className="text-red-600 font-semibold">Bloqueado até {eligibilityDate.toLocaleDateString('pt-BR')}</span>
                                            ) : (
                                                <span className="text-green-600 font-semibold">Elegível</span>
                                            )}
                                        </td>
                                        {canManage && (
                                             <td className="p-3">
                                                <button className="text-xs font-semibold text-red-500 hover:underline">Excluir</button>
                                            </td>
                                        )}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUser && <ManageBlockModal user={selectedUser} onClose={() => setSelectedUser(null)} onSave={() => setRefreshKey(k => k + 1)} />}
        </div>
    );
};
