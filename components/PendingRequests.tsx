import React, { useState, useMemo } from 'react';
import { User, mockUsers, saveUsersToStorage, mockNotifications, mockAuditLog, AuditLogEntry, Notification } from '../data/mockData';
import { PrimaryButton } from './PrimaryButton';

interface PendingRequestsProps {
  currentUser: User;
  onUpdate?: () => void; // Callback to refresh parent if needed
}

const fieldLabels: Record<string, string> = {
    name: "Nome Completo",
    dob: "Data de Nascimento",
    cpf: "CPF",
    rg: "RG",
    email: "E-mail",
    phone: "Telefone",
    zipCode: "CEP",
    street: "Rua",
    address: "Endereço",
    number: "Número",
    complement: "Complemento",
    city: "Cidade",
    state: "Estado",
    hasMetWanessa: "Conhece a Wanessa Pessoalmente?",
};

const DetailRow: React.FC<{ label: string, oldValue: any, newValue: any, isImage?: boolean }> = ({ label, oldValue, newValue, isImage }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-brand-gold/10 dark:border-dark-icon/20 items-center">
        <span className="text-xs font-semibold text-brand-text/70 dark:text-dark-text-soft/70 col-span-1">{label}</span>
        {isImage ? (
             <div className="col-span-1 flex flex-col items-center">
                 <span className="text-[10px] mb-1">Anterior</span>
                 <img src={oldValue} alt="Antigo" className="w-12 h-12 rounded-full object-cover opacity-50" />
             </div>
        ) : (
             <span className="text-sm text-gray-500 line-through col-span-1 truncate" title={oldValue}>{oldValue || 'Vazio'}</span>
        )}
        
        {isImage ? (
            <div className="col-span-1 flex flex-col items-center">
                 <span className="text-[10px] mb-1">Novo</span>
                 <img src={newValue} alt="Novo" className="w-16 h-16 rounded-full object-cover border-2 border-green-500" />
            </div>
        ) : (
            <span className="text-sm text-green-600 font-semibold col-span-1 truncate" title={newValue}>{newValue || 'Vazio'}</span>
        )}
    </div>
);

export const PendingRequests: React.FC<PendingRequestsProps> = ({ currentUser, onUpdate }) => {
    const [selectedRequest, setSelectedRequest] = useState<User | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    // Force a re-evaluation when we update local storage (basic trigger)
    const [refreshKey, setRefreshKey] = useState(0);

    const pendingUsers = useMemo(() => {
        return mockUsers.filter(u => u.pendingChanges && Object.keys(u.pendingChanges).length > 0);
    }, [refreshKey]);

    const canManage = currentUser.role === 'master';

    const handleApprove = () => {
        if (!selectedRequest || !selectedRequest.pendingChanges) return;

        const targetUserIndex = mockUsers.findIndex(u => u.id === selectedRequest.id);
        if (targetUserIndex === -1) return;

        // 1. Merge Changes
        const pending = selectedRequest.pendingChanges;
        const updatedUser = { ...mockUsers[targetUserIndex], ...pending };
        
        // 2. Clear Pending Flag
        updatedUser.pendingChanges = undefined;

        // 3. Save to Mock Data (Official Record)
        mockUsers[targetUserIndex] = updatedUser;
        saveUsersToStorage(mockUsers);

        // 4. AUDIT LOG
        const auditEntry: AuditLogEntry = {
            id: `AUDIT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            responsibleAdminId: currentUser.id,
            responsibleAdminName: currentUser.name,
            targetUserId: updatedUser.id,
            targetUserName: updatedUser.name,
            action: 'Aprovação de Alteração',
            details: `Alterações aprovadas: ${Object.keys(pending).join(', ')}`
        };
        mockAuditLog.push(auditEntry);

        // 5. PUSH NOTIFICATION (Simulated with Retry Logic)
        try {
            const pushNotification: Notification = {
                id: `NOT-${Date.now()}`,
                title: "Atualização de cadastro aprovada",
                message: "Sua alteração foi aprovada pela equipe do fã-clube. Verifique seu perfil para confirmar os dados.",
                type: 'update',
                date: new Date().toISOString(),
                read: false,
                targetUserId: updatedUser.id // Only sends to this specific user
            };
            // In a real scenario, we would await an API call here. 
            // If it failed, we would catch error and log it.
            mockNotifications.unshift(pushNotification);
        } catch (error) {
            console.error("Erro ao enviar push notification para o usuário:", error);
            // Logic to add to a retry queue would go here
        }

        // 6. Cleanup UI & Feedback
        setFeedbackMessage("Alteração aprovada com sucesso.");
        setTimeout(() => setFeedbackMessage(null), 3000);

        setSelectedRequest(null);
        setRefreshKey(prev => prev + 1);
        if (onUpdate) onUpdate();
        
        // Force reload to ensure global state (Header pics etc) updates if needed
        // In a real app, context would handle this, here we trigger App re-render via callback or simple refresh
        setTimeout(() => window.location.reload(), 1500); // Slight delay to let toast be seen
    };

    const handleReject = () => {
        if (!selectedRequest) return;

        const targetUserIndex = mockUsers.findIndex(u => u.id === selectedRequest.id);
        if (targetUserIndex === -1) return;

        // Just clear the pending flag without merging
        mockUsers[targetUserIndex].pendingChanges = undefined;
        saveUsersToStorage(mockUsers);

        setFeedbackMessage(`Solicitação de ${selectedRequest.name} rejeitada.`);
        setTimeout(() => setFeedbackMessage(null), 3000);

        setSelectedRequest(null);
        setRefreshKey(prev => prev + 1);
        if (onUpdate) onUpdate();
    };

    const renderChanges = (user: User) => {
        if (!user.pendingChanges) return null;
        const changes = [];
        for (const key in user.pendingChanges) {
            const label = fieldLabels[key] || key;
            if (key === 'socials') {
                 // @ts-ignore
                 const socialChanges = user.pendingChanges.socials;
                 if(socialChanges) {
                    for (const socialKey in socialChanges) {
                        changes.push(<DetailRow key={`social-${socialKey}`} label={`Social (${socialKey})`} oldValue={user.socials?.[socialKey as keyof typeof user.socials]} newValue={socialChanges[socialKey as keyof typeof socialChanges]} />);
                    }
                 }
            } else if (key === 'profilePic') {
                 changes.push(<DetailRow key={key} label="Foto de Perfil" oldValue={user.profilePic} newValue={user.pendingChanges.profilePic} isImage={true} />);
            } else {
                 // @ts-ignore
                 changes.push(<DetailRow key={key} label={label} oldValue={user[key as keyof User]} newValue={user.pendingChanges[key as keyof typeof user.pendingChanges]} />);
            }
        }
        return changes;
    };

    return (
        <div className="relative">
            {feedbackMessage && (
                 <div className="absolute top-0 left-0 right-0 z-10 bg-green-100 text-green-800 px-4 py-3 rounded-md text-sm font-bold shadow-md animate-fade-in flex items-center justify-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feedbackMessage}
                </div>
            )}

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
                                        {Object.keys(user.pendingChanges || {}).map(k => fieldLabels[k] || k).join(', ')}
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
                        <div className="grid grid-cols-3 gap-2 font-bold mb-2 text-sm border-b border-brand-gold/20 pb-2">
                            <span>Campo</span>
                            <span>Dado Atual</span>
                            <span>Dado Solicitado</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto pr-2">
                             {renderChanges(selectedRequest)}
                        </div>
                        {canManage && (
                             <div className="mt-6 flex justify-end gap-4">
                                 <button onClick={handleReject} className="px-4 py-2 rounded-md text-sm font-semibold bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200">Reprovar</button>
                                <PrimaryButton onClick={handleApprove}>Aprovar Alterações</PrimaryButton>
                            </div>
                        )}
                     </div>
                </div>
            )}
        </div>
    );
};