import React, { useState } from 'react';
import { User, mockUsers } from '../data/mockData';
import { UserCard } from './UserCard';
import { BirthdayCalendar } from './BirthdayCalendar';
import { PendingRequests } from './PendingRequests';
import { CamarimControl } from './CamarimControl';
import { MembersList } from './MembersList';
import { ContactUsManagement } from './ContactUsManagement';

interface ManagementDashboardProps {
  currentUser: User;
}

type ActiveView = 'meus-dados' | 'pendencias' | 'membros' | 'camarim' | 'mensagens';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
      isActive
        ? 'bg-brand-text text-brand-bg-light dark:bg-dark-accent dark:text-dark-bg-main'
        : 'text-brand-text/70 hover:bg-brand-gold/20 dark:text-dark-text-soft/70 dark:hover:bg-dark-icon/50'
    }`}
  >
    {label}
  </button>
);


const DailyBirthdays: React.FC = () => {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;

    const birthdayMembers = mockUsers.filter(user => {
        const [day, month, year] = user.dob.split('/').map(Number);
        return day === todayDay && month === todayMonth;
    });

    return (
     <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-brand-text dark:text-dark-accent mb-4">Aniversariantes do Dia</h3>
        {birthdayMembers.length > 0 ? (
            <ul className="space-y-3">
                {birthdayMembers.map(member => {
                    const birthYear = parseInt(member.dob.split('/')[2]);
                    const age = today.getFullYear() - birthYear;
                    return (
                     <li key={member.id} className="flex items-center gap-3">
                        <img src={member.profilePic} alt={member.name} className="w-10 h-10 rounded-full object-cover"/>
                        <div>
                            <p className="font-semibold">{member.name}</p>
                            <p className="text-xs text-brand-text/70 dark:text-dark-text-soft/70">Completa {age} anos</p>
                        </div>
                    </li>
                )})}
            </ul>
        ) : (
             <p className="text-sm text-brand-text/80 dark:text-dark-text-soft">Nenhum aniversariante hoje.</p>
        )}
     </div>
    )
}


export const ManagementDashboard: React.FC<ManagementDashboardProps> = ({ currentUser }) => {
  const [activeView, setActiveView] = useState<ActiveView>('meus-dados');

  const renderActiveView = () => {
    switch (activeView) {
      case 'meus-dados':
        return <UserCard user={currentUser} currentUser={currentUser} />;
      case 'pendencias':
        return <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6"><PendingRequests currentUser={currentUser} /></div>;
      case 'membros':
        return <MembersList currentUser={currentUser} />;
      case 'camarim':
        return <CamarimControl currentUser={currentUser} />;
      case 'mensagens':
        return <ContactUsManagement currentUser={currentUser} />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary rounded-lg shadow-md p-2 flex flex-wrap gap-2">
          <TabButton label="Meus Dados" isActive={activeView === 'meus-dados'} onClick={() => setActiveView('meus-dados')} />
          <TabButton label="Pendências" isActive={activeView === 'pendencias'} onClick={() => setActiveView('pendencias')} />
          <TabButton label="Membros Cadastrados" isActive={activeView === 'membros'} onClick={() => setActiveView('membros')} />
          <TabButton label="Controle de Camarim" isActive={activeView === 'camarim'} onClick={() => setActiveView('camarim')} />
          <TabButton label="Mensagens" isActive={activeView === 'mensagens'} onClick={() => setActiveView('mensagens')} />
        </div>
        <div>{renderActiveView()}</div>
      </div>
      <div className="space-y-6">
        <DailyBirthdays />
        <BirthdayCalendar users={mockUsers} />
      </div>
    </div>
  );
};