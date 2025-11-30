import React, { useState, useMemo } from 'react';
import { User, ContactMessage, mockContactMessages, mockNotifications, Notification } from '../data/mockData';
import { PrimaryButton } from './PrimaryButton';

interface ContactUsManagementProps {
  currentUser: User;
}

const getStatusStyles = (status: ContactMessage['status']) => {
  switch(status) {
    case 'Não Lida': return 'bg-yellow-200 text-yellow-800';
    case 'Lida': return 'bg-blue-200 text-blue-800';
    case 'Respondida': return 'bg-green-200 text-green-800';
    default: return 'bg-gray-200 text-gray-800';
  }
};

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
        isActive
          ? 'bg-brand-text text-brand-bg-light dark:bg-dark-accent dark:text-dark-bg-main'
          : 'bg-brand-gold/10 text-brand-text/70 hover:bg-brand-gold/20 dark:bg-dark-icon/20 dark:text-dark-text-soft/70 dark:hover:bg-dark-icon/50'
      }`}
    >
      {label}
    </button>
);

export const ContactUsManagement: React.FC<ContactUsManagementProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState([...mockContactMessages]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'mine'>('all');

  const filteredAndSortedMessages = useMemo(() => {
    let filtered = messages;
    if (filter === 'unread') {
      filtered = messages.filter(m => m.status === 'Não Lida');
    } else if (filter === 'mine') {
      filtered = messages.filter(m => m.responderId === currentUser.id);
    }
    return filtered.sort((a, b) => new Date(b.timestampSent).getTime() - new Date(a.timestampSent).getTime());
  }, [messages, filter, currentUser.id]);

  const handleSelectMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setResponse('');
    setFeedback('');

    // Mark as read when opened, if not already read or responded
    if (message.status === 'Não Lida') {
      const updatedMessage = { ...message, status: 'Lida' as const };
      const index = mockContactMessages.findIndex(m => m.id === message.id);
      if (index !== -1) {
        mockContactMessages[index] = updatedMessage;
        setMessages([...mockContactMessages]);
      }
    }
  };

  const handleSendResponse = () => {
    if (!selectedMessage || !response.trim()) return;

    const updatedMessage: ContactMessage = {
      ...selectedMessage,
      status: 'Respondida',
      responseContent: response,
      responseTimestamp: new Date().toISOString(),
      responderId: currentUser.id,
      responderName: currentUser.name,
    };

    // Update main data source
    const index = mockContactMessages.findIndex(m => m.id === selectedMessage.id);
    if (index !== -1) {
      mockContactMessages[index] = updatedMessage;
    }

    // Send notification to user
    const notification: Notification = {
      id: `NOTIF-MSG-${Date.now()}`,
      title: 'Você recebeu uma resposta!',
      message: `Sua mensagem sobre "${selectedMessage.subject}" foi respondida pela administração.`,
      type: 'update',
      date: new Date().toISOString(),
      read: false,
      targetUserId: selectedMessage.senderId,
    };
    mockNotifications.unshift(notification);

    // Update UI
    setMessages([...mockContactMessages]);
    setFeedback('Resposta enviada com sucesso!');
    setTimeout(() => {
        setSelectedMessage(null);
        setFeedback('');
    }, 2000);
  };

  return (
    <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent mb-2">Gerenciador de Mensagens</h3>
      <p className="text-sm text-brand-text/70 dark:text-dark-text-soft/70 mb-4">Gerencie e responda as mensagens enviadas pelos membros.</p>
      
      <div className="flex gap-2 mb-4 pb-4 border-b border-brand-gold/20 dark:border-dark-icon/50">
        <FilterButton label="Todas" isActive={filter === 'all'} onClick={() => setFilter('all')} />
        <FilterButton label="Não Lidas" isActive={filter === 'unread'} onClick={() => setFilter('unread')} />
        <FilterButton label="Respondidas por Mim" isActive={filter === 'mine'} onClick={() => setFilter('mine')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="md:col-span-1 max-h-96 md:max-h-full overflow-y-auto pr-2 border-r border-brand-gold/10">
          <ul className="space-y-2">
            {filteredAndSortedMessages.map(msg => (
              <li key={msg.id}>
                <button
                  onClick={() => handleSelectMessage(msg)}
                  className={`w-full text-left p-3 rounded-lg transition-colors border-l-4 ${
                    selectedMessage?.id === msg.id 
                      ? 'bg-brand-text text-white dark:bg-dark-accent dark:text-dark-bg-main border-brand-accent'
                      : 'bg-brand-bg-light dark:bg-dark-bg-secondary/50 hover:bg-brand-gold/10 dark:hover:bg-dark-icon/20 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-sm truncate">{msg.senderName}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyles(msg.status)}`}>{msg.status}</span>
                  </div>
                  <p className={`text-xs opacity-80 mt-1 truncate ${selectedMessage?.id === msg.id ? 'text-white/80' : ''}`}>{msg.subject}</p>
                  <p className={`text-[10px] opacity-60 mt-2 ${selectedMessage?.id === msg.id ? 'text-white/60' : ''}`}>
                    {new Date(msg.timestampSent).toLocaleDateString()}
                  </p>
                </button>
              </li>
            ))}
             {filteredAndSortedMessages.length === 0 && (
                <p className="text-center text-sm text-brand-text/60 p-4">Nenhuma mensagem encontrada.</p>
            )}
          </ul>
        </div>

        {/* Message Detail & Reply */}
        <div className="md:col-span-2">
          {selectedMessage ? (
            <div className="animate-fade-in">
              <div className="border-b border-brand-gold/20 dark:border-dark-icon/50 pb-4 mb-4">
                <h4 className="text-lg font-bold">{selectedMessage.subject}</h4>
                <p className="text-sm">De: <span className="font-semibold">{selectedMessage.senderName}</span> ({selectedMessage.senderEmail})</p>
                <p className="text-xs text-brand-text/60">{new Date(selectedMessage.timestampSent).toLocaleString()}</p>
              </div>
              <div className="bg-brand-gold/5 dark:bg-dark-icon/10 p-4 rounded-md mb-6 max-h-40 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              
              {selectedMessage.status === 'Respondida' && selectedMessage.responseContent ? (
                <div>
                  <h5 className="font-bold mb-2">Sua Resposta:</h5>
                  <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{selectedMessage.responseContent}</p>
                    <p className="text-xs text-right mt-2 opacity-70">
                      Respondido por {selectedMessage.responderName} em {new Date(selectedMessage.responseTimestamp!).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="response" className="block text-sm font-semibold mb-2">Sua Resposta</label>
                  <textarea
                    id="response"
                    rows={5}
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent"
                    placeholder="Digite sua resposta aqui..."
                  />
                  <div className="mt-4 flex justify-end">
                    <PrimaryButton onClick={handleSendResponse} disabled={!response.trim()}>Enviar Resposta</PrimaryButton>
                  </div>
                   {feedback && <p className="text-green-600 text-sm text-right mt-2">{feedback}</p>}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-brand-text/60 dark:text-dark-text-soft/60">
              <p>Selecione uma mensagem para visualizar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};