import React, { useState } from 'react';
import { User, mockUsers, mockCamarimWinners, CamarimWinner } from '../data/mockData';
import { PrimaryButton } from './PrimaryButton';

interface CamarimControlProps {
  currentUser: User;
}

const getEligibilityDate = (drawDate: string) => {
    const date = new Date(drawDate);
    date.setMonth(date.getMonth() + 6);
    return date;
};

export const CamarimControl: React.FC<CamarimControlProps> = ({ currentUser }) => {
    const [winners] = useState<CamarimWinner[]>(mockCamarimWinners);
    const canManage = currentUser.role === 'master';
    const canRegister = currentUser.role === 'master' || currentUser.role === 'admin';

    return (
        <div className="space-y-6">
            {canRegister && (
                 <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent mb-4">Registrar Ganhador de Camarim</h3>
                    <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                             <label htmlFor="member-select" className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Selecionar Membro</label>
                            <select id="member-select" className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:focus:ring-dark-accent">
                                {mockUsers.filter(u => u.role === 'member').map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="draw-date" className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Data do Sorteio</label>
                            <input type="date" id="draw-date" className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:focus:ring-dark-accent" />
                        </div>
                        <div className="sm:col-span-2">
                             <label htmlFor="observations" className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Observações</label>
                             <textarea id="observations" rows={3} className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:focus:ring-dark-accent"></textarea>
                        </div>
                         <div className="sm:col-span-2 flex justify-end">
                            <PrimaryButton type="submit">Registrar</PrimaryButton>
                        </div>
                    </form>
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
                                <th className="p-3">Status</th>
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
                                        <td className="p-3 text-sm hidden sm:table-cell">{new Date(winner.drawDate).toLocaleDateString('pt-BR')}</td>
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
        </div>
    );
};