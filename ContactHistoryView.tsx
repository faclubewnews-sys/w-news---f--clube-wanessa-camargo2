import React, { useState, useMemo } from 'react';
import { User, ContactMessage, mockContactMessages } from '../data/mockData';
import { ChatBubbleIcon } from './icons/UiIcons';

interface ContactHistoryViewProps {
  user: User;
}

export const ContactHistoryView: React.FC<ContactHistoryViewProps> = ({ user }) => {
  const [openMessageId, setOpenMessageId] = useState<string | null>(null);

  const userMessages = useMemo(() => {
    return mockContactMessages
      .filter(msg => msg.senderId === user.id)
      .sort((a, b) => new Date(b.timestampSent).getTime() - new Date(a.timestampSent).getTime());
  }, [user.id]);

  const toggleMessage = (id: string) => {
    setOpenMessageId(prevId => (prevId === id ? null : id));
  };

  const getStatusInfo = (status: ContactMessage['status']): { text: string; color: string } => {
    switch (status) {
      case 'Não Lida':
        return { text: 'Enviada', color: 'bg-gray-400' };
      case 'Lida':
        return { text: 'Visualizada', color: 'bg-blue-500' };
      case 'Respondida':
        return { text: 'Respondida', color: 'bg-green-500' };
      default:
        return { text: 'Status Desconhecido', color: 'bg-gray-400' };
    }
  };

  return (
    <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary/70 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6 border-b border-brand-gold/20 dark:border-dark-icon/50 pb-4">
        <ChatBubbleIcon className="w-8 h-8 text-brand-accent dark:text-dark-accent" />
        <div>
          <h2 className="text-2xl font-bold text-brand-text dark:text-dark-accent">Minhas Mensagens</h2>
          <p className="text-sm text-brand-text/70 dark:text-dark-text-soft">Histórico de suas conversas com a administração.</p>
        </div>
      </div>

      {userMessages.length > 0 ? (
        <div className="space-y-3">
          {userMessages.map(msg => {
            const statusInfo = getStatusInfo(msg.status);
            const isOpen = openMessageId === msg.id;
            return (
              <div key={msg.id} className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-lg border border-brand-gold/20 dark:border-dark-icon/30 overflow-hidden">
                <button
                  onClick={() => toggleMessage(msg.id)}
                  className="w-full p-4 flex justify-between items-center text-left hover:bg-brand-gold/5 dark:hover:bg-dark-icon/10"
                >
                  <div>
                    <p className="font-bold text-brand-text dark:text-dark-text-soft">{msg.subject}</p>
                    <p className="text-xs text-brand-text/60 dark:text-dark-text-soft/60">
                      Enviado em: {new Date(msg.timestampSent).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full text-white ${statusInfo.color}`}>
                      <div className="w-2 h-2 rounded-full bg-white/80"></div>
                      {statusInfo.text}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {isOpen && (
                  <div className="p-4 border-t border-brand-gold/10 dark:border-dark-icon/20 bg-brand-gold/5 dark:bg-dark-icon/5 animate-fade-in">
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2 text-brand-text/80 dark:text-dark-text-soft/80">Sua Mensagem:</h4>
                      <p className="text-sm text-brand-text dark:text-dark-text-soft whitespace-pre-wrap bg-white/50 dark:bg-dark-bg-main/30 p-3 rounded-md">{msg.message}</p>
                    </div>
                    
                    {msg.status === 'Respondida' && msg.responseContent && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-brand-text/80 dark:text-dark-text-soft/80">Resposta da Administração:</h4>
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-md">
                          <p className="text-sm text-green-800 dark:text-green-200 whitespace-pre-wrap">{msg.responseContent}</p>
                          <p className="text-xs text-right mt-2 text-green-800/70 dark:text-green-200/70">
                            Respondido por {msg.responderName} em {new Date(msg.responseTimestamp!).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-brand-text/60 dark:text-dark-text-soft/60">Você ainda não enviou nenhuma mensagem.</p>
        </div>
      )}
    </div>
  );
};
