import React, { useState, useMemo } from 'react';
import { User, mockUsers } from '../data/mockData';
import { PrimaryButton } from './PrimaryButton';

interface PendingRequestsProps {
  currentUser: User;
}

const DetailRow: React.FC<{ label: string, oldValue: any, newValue: any }> = ({ label, oldValue, newValue }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-brand-gold/10 dark:border-dark-icon/20">
        <span className="text-xs font-semibold text-brand-text/70 dark:text-dark-text-soft/70 col-span-1">{label}</span>
        <span className="text-sm text-gray-500 line-through col-span-1">{oldValue || 'Vazio'}</span>
        <span className="text-sm text-green-600 font-semibold col-span-1">{newValue || 'Vazio'}</span>
    </div>
);

export const PendingRequests: React.FC<PendingRequestsProps> = ({ currentUser }) => {
    const [selectedRequest, setSelectedRequest] = useState<User | null>(null);

    const pendingUsers = useMemo(() => {
        return mockUsers.filter(u => u.pendingChanges && Object.keys(u.pendingChanges).length > 0);
    }, []);

    const canManage = currentUser.role === 'master';

    const renderChanges = (user: User) => {
        if (!user.pendingChanges) return null;
        const changes = [];
        for (const key in user.pendingChanges) {
            if (key === 'socials') {
                 const socialChanges = user.pendingChanges.socials;
                 if(socialChanges) {
                    for (const socialKey in socialChanges) {
                        changes.push(<DetailRow key={`social-${socialKey}`} label={`Social (${socialKey})`} oldValue={user.socials?.[socialKey as keyof typeof user.socials]} newValue={socialChanges[socialKey as keyof typeof socialChanges]} />);
                    }
                 }
            } else {
                 changes.push(<DetailRow key={key} label={key} oldValue={user[key as keyof User]} newValue={user.pendingChanges[key as keyof typeof user.pendingChanges]} />);
            }
        }
        return changes;
    };

    return (
        <div>
            <h3 className="text-lg font-bold text-brand-text dark:text-dark-accent mb-4">Solicitações Pendentes</h3>
            {pendingUsers.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                         <thead>
                          <tr className="border-b border-brand-gold/30 dark:border-dark-icon">
                            <th className="p-3">Nome</th>
                            <th className="p-3 hidden md:table-cell">Campos Alterados</th>
                            <th className="p-3">Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                            {pendingUsers.map(user => (
                                <tr key={user.id} className="border-b border-brand-gold/20 dark:border-dark-icon/50">
                                    <td className="p-3 font-medium flex items-center gap-3">
                                        <img src={user.profilePic} className="w-8 h-8 rounded-full object-cover" alt={user.name}/>
                                        {user.name}
                                    </td>
                                    <td className="p-3 text-xs text-brand-text/80 dark:text-dark-text-soft hidden md:table-cell">
                                        {Object.keys(user.pendingChanges || {}).join(', ')}
                                    </td>
                                    <td className="p-3">
                                        <button onClick={() => setSelectedRequest(user)} className="text-sm font-semibold text-brand-accent dark:text-dark-accent hover:underline">
                                            {canManage ? 'Analisar' : 'Visualizar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-sm text-brand-text/80 dark:text-dark-text-soft">Nenhuma solicitação pendente no momento.</p>
            )}

            {selectedRequest && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedRequest(null)}>
                     <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent mb-4">Analisar Alteração</h3>
                        <div className="grid grid-cols-3 gap-2 font-bold mb-2 text-sm">
                            <span>Campo</span>
                            <span>Dado Atual</span>
                            <span>Dado Solicitado</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto pr-2">
                             {renderChanges(selectedRequest)}
                        </div>
                        {canManage && (
                             <div className="mt-6 flex justify-end gap-4">
                                 <button onClick={() => setSelectedRequest(null)} className="px-4 py-2 rounded-md text-sm font-semibold bg-gray-200 dark:bg-gray-600 hover:opacity-80">Reprovar</button>
                                <PrimaryButton onClick={() => setSelectedRequest(null)}>Aprovar</PrimaryButton>
                            </div>
                        )}
                     </div>
                </div>
            )}
        </div>
    );
};
