import React, { useState, useMemo } from 'react';
import { User, mockUsers, mockAuditLog, AuditLogEntry, TEMP_PASSWORD, updateUserInStorage, saveUsersToStorage } from '../data/mockData';
import { UserCard } from './UserCard';
import { PrimaryButton } from './PrimaryButton';
import { AddMemberModal } from './AddMemberModal';

interface MembersListProps {
  currentUser: User;
}

const getStatusStyles = (status: User['status']) => {
    switch(status) {
        case 'Ativo': return 'bg-green-200 text-green-800';
        case 'Pendente': return 'bg-yellow-200 text-yellow-800';
        case 'Desativado': return 'bg-red-200 text-red-800';
        default: return 'bg-gray-200 text-gray-800';
    }
}

const FilterInput: React.FC<{ value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string }> = ({ value, onChange, placeholder }) => (
    <input 
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent text-sm"
    />
);

const FilterSelect: React.FC<{ value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }> = ({ value, onChange, children }) => (
     <select 
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent text-sm"
    >
        {children}
    </select>
);

const roleNames: { [key in User['role']]: string } = {
    member: 'Membro',
    admin: 'Administrativo',
    master: 'Presidente',
    assistant: 'Assistente',
};

export const MembersList: React.FC<MembersListProps> = ({ currentUser }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [metWanessaFilter, setMetWanessaFilter] = useState('');
    
    // State for the new Add Member modal
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

    // State to force list refresh after updates
    const [refreshKey, setRefreshKey] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    const [isHierarchyModalOpen, setHierarchyModalOpen] = useState(false);
    const [showHierarchyConfirm, setShowHierarchyConfirm] = useState(false);
    const [newRole, setNewRole] = useState<User['role']>('member');
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [userHistory, setUserHistory] = useState<AuditLogEntry[]>([]);


    const { uniqueCities, uniqueStates } = useMemo(() => {
        const cities = new Set<string>();
        const states = new Set<string>();
        mockUsers.forEach(user => {
            if (user.city) cities.add(user.city);
            if (user.state) states.add(user.state);
        });
        return { 
            uniqueCities: Array.from(cities).sort(), 
            uniqueStates: Array.from(states).sort()
        };
    }, [refreshKey]); // Refresh filters when data changes

    const filteredUsers = useMemo(() => {
        return mockUsers.filter(user => {
            if (user.role === 'master') return false; // Master cannot be managed from this list
            
            const matchesSearch = searchTerm === '' || 
                                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  user.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCity = cityFilter === '' || user.city === cityFilter;
            const matchesState = stateFilter === '' || user.state === stateFilter;
            const matchesStatus = statusFilter === '' || user.status === statusFilter;
            const matchesMetWanessa = metWanessaFilter === '' || user.hasMetWanessa === metWanessaFilter;
            
            return matchesSearch && matchesCity && matchesState && matchesStatus && matchesMetWanessa;
        });
    }, [searchTerm, cityFilter, stateFilter, statusFilter, metWanessaFilter, refreshKey]);

    const showFeedback = (message: string) => {
        setFeedbackMessage(message);
        setTimeout(() => setFeedbackMessage(null), 3000);
    }

    const handleOpenHierarchyModal = () => {
        if (selectedUser) {
            setNewRole(selectedUser.role);
            setHierarchyModalOpen(true);
        }
    };
    
    const handleConfirmHierarchyChange = () => {
        if (!selectedUser || !newRole || selectedUser.role === newRole) {
            setShowHierarchyConfirm(false);
            setHierarchyModalOpen(false);
            return;
        }

        const updatedUser = { ...selectedUser, role: newRole };
        updateUserInStorage(updatedUser);

        const logEntry: AuditLogEntry = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toISOString(),
            responsibleAdminId: currentUser.id,
            responsibleAdminName: currentUser.name,
            targetUserId: selectedUser.id,
            targetUserName: selectedUser.name,
            action: 'Alteração de Hierarquia',
            details: `Cargo alterado de ${roleNames[selectedUser.role]} para ${roleNames[newRole]}.`
        };
        mockAuditLog.push(logEntry);
        
        showFeedback("Hierarquia alterada com sucesso.");
        setRefreshKey(prev => prev + 1);
        setShowHierarchyConfirm(false);
        setHierarchyModalOpen(false);
        setSelectedUser(updatedUser);
    };

    const handleResetPassword = () => {
        if (!selectedUser) return;
        
        const updatedUser = {
            ...selectedUser,
            password: TEMP_PASSWORD,
            mustChangePassword: true,
            resetToken: undefined
        };
        updateUserInStorage(updatedUser);
        
        const logEntry: AuditLogEntry = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toISOString(),
            responsibleAdminId: currentUser.id,
            responsibleAdminName: currentUser.name,
            targetUserId: selectedUser.id,
            targetUserName: selectedUser.name,
            action: 'Reset de Senha',
            details: `Senha redefinida para padrão e troca obrigatória ativada.`
        };
        mockAuditLog.push(logEntry);

        showFeedback(`Senha de ${selectedUser.name} redefinida para: ${TEMP_PASSWORD}`);
        setShowResetConfirm(false);
        setRefreshKey(prev => prev + 1);
        setSelectedUser(updatedUser);
    };

    const handleBlockUser = () => {
        if (!selectedUser) return;

        const newStatus = selectedUser.status === 'Desativado' ? 'Ativo' : 'Desativado';
        const updatedUser = { ...selectedUser, status: newStatus };
        updateUserInStorage(updatedUser);

        mockAuditLog.push({
            id: `LOG-${Date.now()}`, timestamp: new Date().toISOString(), responsibleAdminId: currentUser.id,
            responsibleAdminName: currentUser.name, targetUserId: selectedUser.id, targetUserName: selectedUser.name,
            action: 'Bloqueio de Acesso', details: `Status alterado para ${newStatus}.`
        });

        showFeedback(`Acesso de ${selectedUser.name} foi ${newStatus === 'Desativado' ? 'bloqueado' : 'reativado'}.`);
        setShowBlockConfirm(false);
        setRefreshKey(prev => prev + 1);
        setSelectedUser(updatedUser);
    };

    const handleDeleteUser = () => {
        if (!selectedUser) return;
        
        const index = mockUsers.findIndex(u => u.id === selectedUser.id);
        if (index > -1) {
            const deletedName = mockUsers[index].name;
            mockUsers.splice(index, 1);
            saveUsersToStorage(mockUsers);

            mockAuditLog.push({
                id: `LOG-${Date.now()}`, timestamp: new Date().toISOString(), responsibleAdminId: currentUser.id,
                responsibleAdminName: currentUser.name, targetUserId: selectedUser.id, targetUserName: deletedName,
                action: 'Exclusão de Membro', details: `Membro ${deletedName} foi permanentemente excluído.`
            });

            showFeedback(`Membro ${deletedName} excluído com sucesso.`);
            setShowDeleteConfirm(false);
            setRefreshKey(prev => prev + 1);
            setSelectedUser(null);
        }
    };
    
    const handleViewHistory = () => {
        if (!selectedUser) return;
        const history = mockAuditLog.filter(log => log.targetUserId === selectedUser.id);
        setUserHistory(history);
        setShowHistoryModal(true);
    };


    const handleUserUpdate = (updatedFields: Partial<User>) => {
        if (!selectedUser) return;

        const updatedUser = { ...selectedUser, ...updatedFields };
        updateUserInStorage(updatedUser);
        
        setSelectedUser(updatedUser);
        setRefreshKey(prev => prev + 1);
    };

    const handleMemberAdded = () => {
        showFeedback("Novo membro adicionado com sucesso!");
        setIsAddMemberModalOpen(false);
        setRefreshKey(prev => prev + 1);
    }

    const canManage = currentUser.role === 'master' || currentUser.role === 'admin';

    return (
        <>
            <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary rounded-lg shadow-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                    <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent">Membros Cadastrados</h3>
                    {canManage && (
                        <div className="w-full sm:w-auto">
                            <PrimaryButton onClick={() => setIsAddMemberModalOpen(true)}>Adicionar Membro</PrimaryButton>
                        </div>
                    )}
                </div>
                
                {feedbackMessage && (
                     <div className="mb-4 bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm font-semibold shadow-sm animate-fade-in text-center">
                        {feedbackMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <FilterInput value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar por Nome ou ID..." />
                    <FilterSelect value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
                        <option value="">Todas as Cidades</option>
                        {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
                    </FilterSelect>
                    <FilterSelect value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
                        <option value="">Todos os Estados</option>
                        {uniqueStates.map(state => <option key={state} value={state}>{state}</option>)}
                    </FilterSelect>
                    <FilterSelect value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">Todos os Status</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Desativado">Desativado</option>
                    </FilterSelect>
                    {canManage && (
                         <FilterSelect value={metWanessaFilter} onChange={e => setMetWanessaFilter(e.target.value)}>
                            <option value="">Conhece a Wanessa?</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </FilterSelect>
                    )}
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="border-b border-brand-gold/30 dark:border-dark-icon">
                            <th className="p-3">Nome</th>
                            <th className="p-3 hidden lg:table-cell">ID</th>
                            <th className="p-3 hidden md:table-cell">Cidade/Estado</th>
                            <th className="p-3 hidden sm:table-cell">Status</th>
                            <th className="p-3">Ação</th>
                        </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="border-b border-brand-gold/20 dark:border-dark-icon/50 hover:bg-brand-gold/10 dark:hover:bg-dark-icon/20">
                                    <td className="p-3 font-medium flex items-center gap-3">
                                        <img src={user.profilePic} className="w-8 h-8 rounded-full object-cover" alt={user.name}/>
                                        <div className="flex flex-col">
                                            <span>{user.name}</span>
                                            <span className="lg:hidden text-xs text-brand-text/60 dark:text-dark-text-soft/60">{user.id}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 text-brand-text/80 dark:text-dark-text-soft hidden lg:table-cell">{user.id}</td>
                                    <td className="p-3 text-brand-text/80 dark:text-dark-text-soft hidden md:table-cell">{user.city}, {user.state}</td>
                                    <td className="p-3 hidden sm:table-cell">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button onClick={() => setSelectedUser(user)} className="text-sm font-semibold text-brand-accent dark:text-dark-accent hover:underline">
                                            Ver Ficha
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {canManage && (
                <AddMemberModal 
                    isOpen={isAddMemberModalOpen} 
                    onClose={() => setIsAddMemberModalOpen(false)}
                    onMemberAdded={handleMemberAdded}
                />
            )}


            {selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
                     <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl w-full max-w-4xl relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-brand-text/50 hover:text-brand-gold dark:text-dark-text-soft/50 dark:hover:text-dark-text-soft text-3xl z-10">&times;</button>
                        <div className="max-h-[80vh] overflow-y-auto p-8">
                            <UserCard 
                                user={selectedUser} 
                                currentUser={currentUser} 
                                onUpdateUser={handleUserUpdate}
                            />

                             {canManage && (
                                <div className="mt-8 pt-6 border-t border-brand-gold/20 dark:border-dark-icon/50">
                                    <h4 className="text-xl font-bold text-brand-text dark:text-dark-accent mb-4">Ações Administrativas</h4>
                                    <div className="flex flex-wrap gap-4">
                                        <PrimaryButton onClick={() => setShowResetConfirm(true)}>Redefinir Senha</PrimaryButton>

                                        {currentUser.role === 'master' && (
                                            <PrimaryButton onClick={handleOpenHierarchyModal}>Alterar Hierarquia</PrimaryButton>
                                        )}
                                        
                                        <button onClick={() => setShowBlockConfirm(true)} className="px-4 py-2 rounded-md text-sm font-semibold bg-yellow-500 text-white hover:bg-yellow-600">
                                            {selectedUser.status === 'Desativado' ? 'Reativar Acesso' : 'Bloquear Acesso'}
                                        </button>
                                        <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2 rounded-md text-sm font-semibold bg-red-500 text-white hover:bg-red-600">Excluir Membro</button>
                                        <button onClick={handleViewHistory} className="px-4 py-2 rounded-md text-sm font-semibold text-gray-700 dark:text-gray-300 hover:underline">Ver Histórico</button>
                                    </div>
                                </div>
                             )}
                        </div>
                     </div>
                </div>
            )}

            {isHierarchyModalOpen && selectedUser && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={() => setHierarchyModalOpen(false)}>
                     <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent mb-4">Alterar Hierarquia</h3>
                        <div className="space-y-3 text-sm">
                           <p><span className="font-semibold">Nome:</span> {selectedUser.name}</p>
                           <p><span className="font-semibold">Cargo Atual:</span> {roleNames[selectedUser.role]}</p>
                        </div>
                        <div className="mt-4">
                             <label htmlFor="new-role" className="block text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1">Nova Hierarquia</label>
                            <select 
                                id="new-role"
                                value={newRole}
                                onChange={e => setNewRole(e.target.value as User['role'])}
                                className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent"
                            >
                                <option value="member">Membro</option>
                                <option value="assistant">Assistente</option>
                                <option value="admin">Administrativo</option>
                            </select>
                        </div>
                         <div className="mt-6 flex justify-end gap-4">
                            <button onClick={() => setHierarchyModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                            <PrimaryButton onClick={() => setShowHierarchyConfirm(true)} >Alterar</PrimaryButton>
                        </div>
                     </div>
                 </div>
            )}

             {showHierarchyConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[70] p-4" onClick={() => setShowHierarchyConfirm(false)}>
                     <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-brand-text dark:text-dark-accent mb-2">Confirmação Necessária</h3>
                        <p className="text-sm text-brand-text/80 dark:text-dark-text-soft mb-6">Tem certeza de que deseja alterar o nível de acesso deste usuário?</p>
                        <div className="flex justify-center gap-4">
                             <button onClick={() => setShowHierarchyConfirm(false)} className="px-6 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                             <PrimaryButton onClick={handleConfirmHierarchyChange}>Confirmar</PrimaryButton>
                        </div>
                     </div>
                </div>
             )}

             {showResetConfirm && selectedUser && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[70] p-4" onClick={() => setShowResetConfirm(false)}>
                     <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-brand-text dark:text-dark-accent mb-2">Resetar Senha?</h3>
                        <p className="text-sm text-brand-text/80 dark:text-dark-text-soft mb-6">A senha de <strong>{selectedUser.name}</strong> será redefinida para <strong>{TEMP_PASSWORD}</strong> e o usuário será obrigado a trocá-la no próximo acesso.</p>
                        <div className="flex justify-center gap-4">
                             <button onClick={() => setShowResetConfirm(false)} className="px-6 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                             <PrimaryButton onClick={handleResetPassword}>Confirmar Reset</PrimaryButton>
                        </div>
                     </div>
                </div>
             )}

             {showBlockConfirm && selectedUser && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[70] p-4" onClick={() => setShowBlockConfirm(false)}>
                     <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-yellow-600 mb-2">Bloquear/Reativar Acesso?</h3>
                        <p className="text-sm text-brand-text/80 dark:text-dark-text-soft mb-6">Você está prestes a alterar o status de <strong>{selectedUser.name}</strong> para <strong>{selectedUser.status === 'Desativado' ? 'Ativo' : 'Desativado'}</strong>.</p>
                        <div className="flex justify-center gap-4">
                             <button onClick={() => setShowBlockConfirm(false)} className="px-6 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                             <button onClick={handleBlockUser} className="px-6 py-2 rounded-md text-sm font-semibold bg-yellow-500 text-white hover:bg-yellow-600">Confirmar</button>
                        </div>
                     </div>
                </div>
             )}

             {showDeleteConfirm && selectedUser && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[70] p-4" onClick={() => setShowDeleteConfirm(false)}>
                     <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-red-600 mb-2">Excluir Membro?</h3>
                        <p className="text-sm text-brand-text/80 dark:text-dark-text-soft mb-6">Esta ação é <strong>permanente</strong> e не pode ser desfeita. Tem certeza de que deseja excluir <strong>{selectedUser.name}</strong>?</p>
                        <div className="flex justify-center gap-4">
                             <button onClick={() => setShowDeleteConfirm(false)} className="px-6 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                             <button onClick={handleDeleteUser} className="px-6 py-2 rounded-md text-sm font-semibold bg-red-500 text-white hover:bg-red-600">Excluir Permanentemente</button>
                        </div>
                     </div>
                </div>
             )}

             {showHistoryModal && selectedUser && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={() => setShowHistoryModal(false)}>
                     <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent mb-4">Histórico de Ações - {selectedUser.name}</h3>
                         <div className="max-h-96 overflow-y-auto pr-2">
                             {userHistory.length > 0 ? (
                                 <ul className="space-y-3">
                                     {userHistory.map(log => (
                                         <li key={log.id} className="p-3 bg-brand-gold/5 dark:bg-dark-icon/10 rounded-md border-l-4 border-brand-gold">
                                            <p className="font-bold">{log.action}</p>
                                            <p className="text-sm text-brand-text/80 dark:text-dark-text-soft">{log.details}</p>
                                            <p className="text-xs text-brand-text/60 dark:text-dark-text-soft/60 mt-1">
                                                Por: {log.responsibleAdminName} em {new Date(log.timestamp).toLocaleString()}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                             ) : (
                                <p className="text-center text-sm text-brand-text/70 dark:text-dark-text-soft/70 p-4">Nenhuma ação registrada para este usuário.</p>
                             )}
                         </div>
                         <div className="mt-6 flex justify-end">
                            <PrimaryButton onClick={() => setShowHistoryModal(false)}>Fechar</PrimaryButton>
                        </div>
                     </div>
                 </div>
             )}
        </>
    );
};