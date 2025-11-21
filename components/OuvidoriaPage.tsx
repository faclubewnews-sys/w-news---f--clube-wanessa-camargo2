import React, { useState, useMemo } from 'react';
import { User, mockOuvidoriaTickets, OuvidoriaTicket, OuvidoriaMessage, OuvidoriaTicketType } from '../data/mockData';
import { PrimaryButton } from './PrimaryButton';

// OUVVIDORIA - MEMBER VIEW

const OuvidoriaMemberView: React.FC<{ user: User }> = ({ user }) => {
    const [myTickets, setMyTickets] = useState(() => mockOuvidoriaTickets.filter(t => t.memberId === user.id));
    const [selectedTicket, setSelectedTicket] = useState<OuvidoriaTicket | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState<OuvidoriaTicketType>('Sugestão');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmitNewTicket = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;

        const newTicket: OuvidoriaTicket = {
            id: `OUV-${Date.now()}`,
            memberId: user.id,
            subject,
            type,
            createdAt: new Date().toISOString(),
            status: 'Pendente',
            messages: [{
                id: `MSG-${Date.now()}`,
                author: 'member',
                text: message,
                timestamp: new Date().toISOString()
            }]
        };
        
        mockOuvidoriaTickets.unshift(newTicket); // Add to global mock data
        setMyTickets(prev => [newTicket, ...prev]);
        
        setIsCreating(false);
        setSubject('');
        setMessage('');
        setType('Sugestão');
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
    };

    const getStatusStyles = (status: OuvidoriaTicket['status']) => {
        switch(status) {
            case 'Pendente': return 'bg-yellow-200 text-yellow-800';
            case 'Respondida': return 'bg-blue-200 text-blue-800';
            case 'Resolvida': return 'bg-green-200 text-green-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <div className="bg-brand-bg-light/30 dark:bg-dark-bg-secondary/30 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <div className="border-b border-brand-gold/20 dark:border-dark-icon/50 pb-4 mb-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-brand-text dark:text-dark-accent">Ouvidoria</h2>
                    <p className="text-sm text-brand-text/70 dark:text-dark-text-soft">Seu canal para sugestões, feedbacks, elogios, dúvidas e reclamações.</p>
                </div>
                <PrimaryButton onClick={() => setIsCreating(true)}>Nova Mensagem</PrimaryButton>
            </div>
            
             <ul className="space-y-3">
                {myTickets.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(ticket => (
                     <li key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="p-4 bg-brand-bg-light/50 dark:bg-dark-bg-secondary/70 rounded-lg cursor-pointer hover:bg-brand-gold/20 dark:hover:bg-dark-icon/50 transition-colors">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-brand-text dark:text-dark-text-soft">{ticket.subject}</p>
                                <p className="text-xs text-brand-text/70 dark:text-dark-text-soft/70">Enviado em: {new Date(ticket.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(ticket.status)}`}>{ticket.status}</span>
                        </div>
                    </li>
                ))}
            </ul>
            
            {(isCreating || selectedTicket) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setIsCreating(false); setSelectedTicket(null); }}>
                    <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent mb-4">{isCreating ? 'Enviar Nova Mensagem' : selectedTicket?.subject}</h3>
                        
                        {isCreating ? (
                            <form onSubmit={handleSubmitNewTicket} className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Tipo de Mensagem</label>
                                    <select value={type} onChange={e => setType(e.target.value as OuvidoriaTicketType)} required className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent">
                                        <option>Sugestão</option>
                                        <option>Reclamação</option>
                                        <option>Elogio</option>
                                        <option>Dúvida</option>
                                        <option>Outro</option>
                                    </select>
                                </div>
                                 <div>
                                    <label className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Assunto</label>
                                    <input type="text" placeholder="Assunto" value={subject} onChange={e => setSubject(e.target.value)} required className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent"/>
                                 </div>
                                <div>
                                    <label className="text-sm font-semibold text-brand-text/80 dark:text-dark-text-soft/80 mb-1 block">Mensagem</label>
                                    <textarea placeholder="Sua mensagem..." value={message} onChange={e => setMessage(e.target.value)} rows={5} required className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent"></textarea>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Cancelar</button>
                                    <PrimaryButton type="submit">Enviar</PrimaryButton>
                                </div>
                            </form>
                        ) : (
                             <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {selectedTicket?.messages.map(msg => (
                                    <div key={msg.id} className={`p-3 rounded-lg w-fit max-w-[85%] ${msg.author === 'member' ? 'bg-brand-gold/20 dark:bg-dark-icon/30 ml-auto' : 'bg-brand-bg-dark/30 dark:bg-dark-bg-main/50'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className="text-xs text-right mt-1 opacity-60">{msg.author === 'member' ? 'Você' : 'Ouvidoria'} - {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
             {showConfirmation && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
                    Mensagem enviada com sucesso!
                </div>
            )}
        </div>
    );
};


// OUVVIDORIA - ADMIN VIEW

const OuvidoriaAdminView: React.FC = () => {
    const [tickets, setTickets] = useState<OuvidoriaTicket[]>(mockOuvidoriaTickets);
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedTicket, setSelectedTicket] = useState<OuvidoriaTicket | null>(null);
    const [replyText, setReplyText] = useState('');

    const filteredTickets = useMemo(() => {
        return tickets
            .filter(t => statusFilter === '' || t.status === statusFilter)
            .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [tickets, statusFilter]);
    
    const handleReply = () => {
        if (!selectedTicket || !replyText.trim()) return;
        const newMessage: OuvidoriaMessage = {
            id: `MSG-ADMIN-${Date.now()}`,
            author: 'admin',
            text: replyText,
            timestamp: new Date().toISOString()
        };
        const updatedTicket = { ...selectedTicket, messages: [...selectedTicket.messages, newMessage], status: 'Respondida' as const };
        
        const updatedTickets = tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t);
        setTickets(updatedTickets);
        // FIX: Cannot assign to an import. Mutate the array instead.
        const ticketIndex = mockOuvidoriaTickets.findIndex(t => t.id === updatedTicket.id);
        if (ticketIndex !== -1) {
            mockOuvidoriaTickets[ticketIndex] = updatedTicket;
        }
        setSelectedTicket(updatedTicket);
        setReplyText('');
    };

    const handleStatusChange = (status: OuvidoriaTicket['status']) => {
        if (!selectedTicket) return;
        const updatedTicket = { ...selectedTicket, status };
        const updatedTickets = tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t);
        setTickets(updatedTickets);
        // FIX: Cannot assign to an import. Mutate the array instead.
        const ticketIndex = mockOuvidoriaTickets.findIndex(t => t.id === updatedTicket.id);
        if (ticketIndex !== -1) {
            mockOuvidoriaTickets[ticketIndex] = updatedTicket;
        }
        setSelectedTicket(updatedTicket);
    }
    
    return (
        <div className="bg-brand-bg-light/30 dark:bg-dark-bg-secondary/30 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <div className="border-b border-brand-gold/20 dark:border-dark-icon/50 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-brand-text dark:text-dark-accent">Ouvidoria - Painel Administrativo</h2>
                 <select onChange={e => setStatusFilter(e.target.value)} className="mt-2 bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent text-sm">
                    <option value="">Todos os Status</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Respondida">Respondida</option>
                    <option value="Resolvida">Resolvida</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-brand-gold/30 dark:border-dark-icon">
                            <th className="p-3">Assunto</th>
                            <th className="p-3 hidden sm:table-cell">Tipo</th>
                            <th className="p-3 hidden md:table-cell">Data</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.map(ticket => (
                            <tr key={ticket.id} className="border-b border-brand-gold/20 dark:border-dark-icon/50">
                                <td className="p-3 font-semibold">{ticket.subject}</td>
                                <td className="p-3 text-sm hidden sm:table-cell">{ticket.type}</td>
                                <td className="p-3 text-sm hidden md:table-cell">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                <td className="p-3 text-sm">{ticket.status}</td>
                                <td className="p-3">
                                    <button onClick={() => setSelectedTicket(ticket)} className="text-sm font-semibold text-brand-accent dark:text-dark-accent hover:underline">Ver/Responder</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {selectedTicket && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTicket(null)}>
                    <div className="bg-brand-bg-light dark:bg-dark-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent mb-4">{selectedTicket.subject}</h3>
                        <div className="space-y-4 max-h-72 overflow-y-auto mb-4 p-2 bg-brand-bg-dark/20 dark:bg-dark-bg-main/30 rounded-md">
                            {selectedTicket.messages.map(msg => (
                                <div key={msg.id} className={`p-3 rounded-lg w-fit max-w-[85%] ${msg.author === 'member' ? 'bg-brand-gold/20 dark:bg-dark-icon/30' : 'bg-blue-200/50 dark:bg-blue-900/50 ml-auto'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 border-t border-brand-gold/20 dark:border-dark-icon/50 pt-4">
                             <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Digite sua resposta..." rows={4} className="w-full bg-transparent border border-brand-gold/30 dark:border-dark-icon rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-brand-gold dark:focus:ring-dark-accent"></textarea>
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    {selectedTicket.status !== 'Resolvida' &&
                                        <button onClick={() => handleStatusChange('Resolvida')} className="px-3 py-1 text-xs font-semibold rounded-md bg-green-200 text-green-800 hover:opacity-80">Marcar como Resolvida</button>
                                    }
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setSelectedTicket(null)} className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Fechar</button>
                                    <PrimaryButton onClick={handleReply}>Enviar Resposta</PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// MAIN PAGE COMPONENT
interface OuvidoriaPageProps {
  user: User;
}

export const OuvidoriaPage: React.FC<OuvidoriaPageProps> = ({ user }) => {
    if (user.role === 'master' || user.role === 'admin') {
        return <OuvidoriaAdminView />;
    }
    return <OuvidoriaMemberView user={user} />;
};
