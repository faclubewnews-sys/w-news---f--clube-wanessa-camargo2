import React, { useMemo } from 'react';
import { User, mockCamarimWinners, getCamarimStatus } from '../data/mockData';
import { CamarimControl } from './CamarimControl';

const Section: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary/70 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4 border-b border-brand-gold/20 dark:border-dark-icon/50 pb-3">
            <h3 className="text-xl font-bold text-brand-text dark:text-dark-accent">{title}</h3>
        </div>
        {children}
    </div>
);

const MemberCamarimView: React.FC<{ user: User }> = ({ user }) => {
    const userHistory = useMemo(() => {
        return mockCamarimWinners
            .filter(w => w.winnerId === user.id)
            .sort((a, b) => new Date(b.drawDate).getTime() - new Date(a.drawDate).getTime());
    }, [user.id]);

    const eligibilityStatus = getCamarimStatus(user);

    return (
        <Section title="Meu Histórico de Camarim">
             <div className="bg-brand-gold/10 dark:bg-dark-icon/20 p-4 rounded-lg mb-6">
                <h4 className="font-bold text-brand-text dark:text-dark-accent">Status de Elegibilidade</h4>
                {!eligibilityStatus.isBlocked ? (
                     <p className="text-green-600 font-semibold mt-1">Apto a participar dos próximos sorteios.</p>
                ) : (
                    <div>
                        <p className="text-red-600 font-semibold mt-1">Você está temporariamente indisponível para novos sorteios de camarim.</p>
                        <p className="text-sm text-brand-text/80 dark:text-dark-text-soft">Liberado novamente a partir de: <span className="font-bold">{eligibilityStatus.releaseDate}</span></p>
                    </div>
                )}
            </div>
            
            <h4 className="font-bold text-brand-text dark:text-dark-accent mb-3">Histórico de Sorteios Ganhos</h4>
            {userHistory.length > 0 ? (
                <ul className="space-y-4">
                    {userHistory.map(win => (
                        <li key={win.id} className="border-b border-brand-gold/20 dark:border-dark-icon/50 pb-3">
                            <p className="font-semibold">Data do Sorteio: {new Date(win.drawDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                            {win.observations && <p className="text-sm text-brand-text/80 dark:text-dark-text-soft mt-1">Observações: {win.observations}</p>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-brand-text/80 dark:text-dark-text-soft">Você ainda não ganhou nenhum sorteio de camarim.</p>
            )}
        </Section>
    );
};

interface CamarimViewProps {
  user: User;
}

export const CamarimView: React.FC<CamarimViewProps> = ({ user }) => {
  if (user.role === 'admin' || user.role === 'master') {
    return <CamarimControl currentUser={user} />;
  }
  return <MemberCamarimView user={user} />;
};