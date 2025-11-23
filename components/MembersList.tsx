
import React, { useState, useMemo } from 'react';
import { User, mockUsers, mockAuditLog, AuditLogEntry, TEMP_PASSWORD, updateUserInStorage } from '../data/mockData';
import { UserCard } from './UserCard';
import { PrimaryButton } from './PrimaryButton';

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
    master: 'Presidente'
};

export const MembersList: React.FC<MembersListProps> = ({ currentUser }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    // State to force list refresh after updates
    const [refreshKey, setRefreshKey] = useState(0);

    const [isHierarchyModalOpen, setHierarchyModalOpen] = useState(false);
    const [showHierarchyConfirm, setShowHierarchyConfirm] = useState(false);
    const [newRole, setNewRole] = useState<User['role']>('member');
    const [showResetConfirm, setShowResetConfirm] = useState(false);


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
            
            return matchesSearch && matchesCity && matchesState && matchesStatus;
        });
    }, [searchTerm, cityFilter, stateFilter, statusFilter, refreshKey]);

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

        const targetUserIndex = mockUsers.findIndex(u => u.id === selectedUser.id);
        if (targetUserIndex !== -1) {
            const updatedUser = { ...mockUsers[targetUserIndex], role: newRole };
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
            setRefreshKey(prev => prev + 1);
        }

        setShowHierarchyConfirm(false);
        setHierarchyModalOpen(false);
        if (selectedUser) {
             const updated = mockUsers.find(u => u.id === selectedUser.id);
             if (updated) setSelectedUser({...updated});
        }
    };

    const handleResetPassword = () => {
        if (!selectedUser) return;
        
        const targetUserIndex = mockUsers.findIndex(u => u.id === selectedUser.id);
        if (targetUserIndex !== -1) {
            // Updated to use the correct persistent storage function
            const updatedUser = {
                ...mockUsers[targetUserIndex],
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
                action: 'Reset de Senha Administrativo',
                details: `Senha redefinida para padrão (${TEMP_PASSWORD}) e troca obrigatória ativada.`
            };
            mockAuditLog.push(logEntry);

            alert(`Senha redefinida com sucesso para: ${TEMP_PASSWORD}`);
            setShowResetConfirm(false);
            setRefreshKey(prev => prev + 1);
        }
    };

    // New Handler to save edits from UserCard
    const handleUserUpdate = (updatedFields: Partial<User>) => {
        if (!selectedUser) return;

        const targetIndex = mockUsers.findIndex(u => u.id === selectedUser.id);
        if (targetIndex !== -1) {
            // Master editing another user: direct update
            // We merge the current mockUser with updatedFields
            const updatedUser = { ...mockUsers[targetIndex], ...updatedFields };
            updateUserInStorage(updatedUser);
            
            // Update local selected user state to reflect changes in the modal immediately
            setSelectedUser(updatedUser);
            
            // Force list refresh
            setRefreshKey(prev => prev + 1);
        }
    };

    const canManage = currentUser.role === 'master' || currentUser.role === 'admin';

    return (
        <>
            <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary rounded-lg shadow-lg p-4 sm:p-6">
                <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent mb-4">Membros Cadastrados</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

                             <div className="mt-8 pt-6 border-t border-brand-gold/20 dark:border-dark-icon/50">
                                <h4 className="text-xl font-bold text-brand-text dark:text-dark-accent mb-4">Ações Administrativas</h4>
                                <div className="flex flex-wrap gap-4">
                                     {/* Reset Password - Master AND Admin */}
                                     {canManage && (
                                        <PrimaryButton onClick={() => setShowResetConfirm(true)}>Redefinir Senha</PrimaryButton>
                                     )}

                                     {/* Hierarchy - Master Only */}
                                     {currentUser.role === 'master' && (
                                        <PrimaryButton onClick={handleOpenHierarchyModal}>Alterar Hierarquia</PrimaryButton>
                                     )}

                                     {/* Management Actions - Master AND Admin */}
                                     {canManage && (
                                        <>
                                            <button className="px-4 py-2 rounded-md text-sm font-semibold bg-yellow-500 text-white hover:bg-yellow-600">Bloquear Acesso</button>
                                            <button className="px-4 py-2 rounded-md text-sm font-semibold bg-red-500 text-white hover:bg-red-600">Excluir Membro</button>
                                            <button className="px-4 py-2 rounded-md text-sm font-semibold text-gray-700 dark:text-gray-300 hover:underline">Ver Histórico</button>
                                        </>
                                     )}
                                </div>
                            </div>
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
                           <p><span className="font-semibold">ID:</span> {selectedUser.id}</p>
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
                        <p className="text-sm text-brand-text/80 dark:text-dark-text-soft mb-6">
                            Tem certeza de que deseja alterar o nível de acesso deste usuário?
                            Essa ação só pode ser feita pelo Presidente (Acesso Master).
                        </p>
                        <div className="flex justify-center gap-4">
                             <button onClick={() => setShowHierarchyConfirm(false)} className="px-6 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                             <PrimaryButton onClick={handleConfirmHierarchyChange}>Confirmar</PrimaryButton>
                        </div>
                     </div>
                </div>
             )}

             {/* Reset Password Confirmation Modal */}
             {showResetConfirm && selectedUser && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[70] p-4" onClick={() => setShowResetConfirm(false)}>
                     <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-brand-text dark:text-dark-accent mb-2">Resetar Senha?</h3>
                        <p className="text-sm text-brand-text/80 dark:text-dark-text-soft mb-6">
                            A senha de <strong>{selectedUser.name}</strong> será redefinida para o padrão (<strong>{TEMP_PASSWORD}</strong>) e o usuário será obrigado a trocá-la no próximo acesso.
                        </p>
                        <div className="flex justify-center gap-4">
                             <button onClick={() => setShowResetConfirm(false)} className="px-6 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                             <PrimaryButton onClick={handleResetPassword}>Confirmar Reset</PrimaryButton>
                        </div>
                     </div>
                </div>
             )}
        </>
    );
};
