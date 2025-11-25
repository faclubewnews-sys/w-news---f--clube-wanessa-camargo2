import React, { useState, useEffect } from 'react';
import { User, mockNotifications } from '../data/mockData';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { UserCard } from './UserCard';
import { ManagementDashboard } from './ManagementDashboard';
import { Home } from './Home';
import { DigitalCardView } from './DigitalCardView';
import { CamarimView } from './CamarimView';
import { BackButton } from './BackButton';
import { WanessaCamargoView } from './WanessaCamargoView';
import { SorteiosView } from './SorteiosView';
import { PushNotificationPanel } from './PushNotificationPanel';
import { MandatoryNotifications } from './MandatoryNotifications';


interface DashboardProps {
  user: User;
  onLogout: () => void;
  theme: string;
  onToggleTheme: () => void;
  onContactClick: () => void;
  onUserUpdate: (updatedFields: Partial<User>) => void;
  lastUpdate: number;
}

export type ActiveView = 'home' | 'profile' | 'management' | 'card' | 'camarim' | 'wanessa' | 'sorteios' | 'push';

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, theme, onToggleTheme, onContactClick, onUserUpdate, lastUpdate }) => {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [blockingNotifications, setBlockingNotifications] = useState<typeof mockNotifications>([]);

  // Check for mandatory notifications on mount if user is a member
  useEffect(() => {
    if (user.role === 'member') {
      const unread = mockNotifications.filter(n => 
        !n.read && (!n.targetUserId || n.targetUserId === user.id)
      );
      // Sort by date desc
      unread.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setBlockingNotifications(unread);
    }
  }, [user]);

  const handleMarkAsRead = (id: string) => {
    // Update mock data
    const notification = mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
    // Update local blocking state
    setBlockingNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    // Update mock data
    blockingNotifications.forEach(bn => {
       const n = mockNotifications.find(mn => mn.id === bn.id);
       if (n) n.read = true;
    });
    // Clear local blocking state
    setBlockingNotifications([]);
  };
  
  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
  };

  // If there are blocking notifications, render the mandatory screen
  if (blockingNotifications.length > 0) {
    return (
      <MandatoryNotifications 
        notifications={blockingNotifications} 
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    );
  }

  const renderContent = () => {
    const handleGoBack = () => setActiveView('home');

    if (activeView === 'home') {
      return <Home user={user} onNavigate={handleNavigate} onContactClick={onContactClick} theme={theme} lastUpdate={lastUpdate} />;
    }

    let viewComponent;
    switch (activeView) {
      case 'profile':
        viewComponent = <UserCard user={user} currentUser={user} onUpdateUser={onUserUpdate} />;
        break;
      case 'card':
        viewComponent = <DigitalCardView user={user} onUpdateUser={onUserUpdate} />;
        break;
      case 'camarim':
        viewComponent = <CamarimView user={user} />;
        break;
      case 'wanessa':
        viewComponent = <WanessaCamargoView />;
        break;
      case 'sorteios':
        viewComponent = <SorteiosView user={user} />;
        break;
      case 'push':
        if (user.role === 'master' || user.role === 'admin') {
            viewComponent = <PushNotificationPanel />;
        } else {
             setActiveView('home');
             return null;
        }
        break;
      case 'management':
         if (user.role === 'master' || user.role === 'admin') {
            viewComponent = <ManagementDashboard currentUser={user} />;
         } else {
            // Fallback for unauthorized access attempt, just go home
            setActiveView('home');
            return null;
         }
         break;
      default:
        // Should not happen, but as a fallback, go home
        setActiveView('home');
        return null;
    }

    return (
      <div>
        <div className="mb-6">
          <BackButton onClick={handleGoBack} />
        </div>
        {viewComponent}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-brand-text dark:text-dark-text-soft">
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <img 
          src="https://i.ibb.co/nsFY5Z7v/580930255-18542360491037488-2395317763344905099-n.jpg" 
          alt="" 
          className="w-full h-full object-cover opacity-40 dark:opacity-50" 
        />
        <div className="absolute inset-0 bg-brand-bg-light/80 dark:bg-dark-bg-main/90"></div>
      </div>

      <Header 
        user={user} 
        onLogout={onLogout} 
        onToggleTheme={onToggleTheme} 
        theme={theme}
        onContactClick={onContactClick} 
      />
      <div className="flex">
        <Sidebar 
          user={user}
          onNavigate={handleNavigate} 
          onContactClick={onContactClick} 
        />
        <div className="flex-1 flex flex-col" style={{ height: 'calc(100vh - 70px)' }}>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-12 overflow-y-auto">
              {renderContent()}
            </main>
            <footer className="text-center p-4 text-xs text-brand-text/50 dark:text-dark-text-soft/50">
                W News Fã Clube Oficial
            </footer>
        </div>
      </div>
    </div>
  );
};
