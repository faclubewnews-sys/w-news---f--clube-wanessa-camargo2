import React from 'react';
import { PrimaryButton } from './PrimaryButton';

interface TermsScreenProps {
    onAccept: () => void;
}

const termsText = `
TERMO OFICIAL DE ASSOCIAÇÃO E FUNCIONAMENTO – FÃ-CLUBE W NEWS

Seja muito bem-vindo ao W News, fã-clube oficial dedicado à celebração, apoio e divulgação do trabalho de Wanessa Camargo!
Ao fazer parte desta comunidade, você passa a integrar um grupo organizado, ético e comprometido com o respeito, transparência e união entre os fãs e a Equipe Wanessa.

Este termo reúne todas as regras, benefícios, procedimentos e responsabilidades dos membros, garantindo uma convivência harmoniosa e justa para todos.

1. PRINCÍPIOS E CONVIVÊNCIA

Os fã-clubes oficiais são liderados por presidentes e vice-presidentes que, assim como você, são fãs da Wanessa.
Cabe a essa liderança administrar o grupo e definir normas que sempre priorizem:

Respeito e educação com a Wanessa;

Respeito e alinhamento com a Equipe Wanessa;

Respeito, empatia e cordialidade entre os membros;

Ambiente saudável e colaborativo para todos.

Caso algum comportamento, regra ou atitude de membro ou liderança não esteja em conformidade com estes princípios, o fã deverá comunicar a Equipe Wanessa para análise.
Se identificado qualquer descumprimento grave, medidas poderão ser aplicadas, incluindo advertência, suspensão, expulsão ou desligamento do fã-clube, conforme a gravidade.

2. VANTAGENS DO MEMBRO ASSOCIADO W NEWS

Ao participar do fã-clube, o membro tem direito a:

Participar dos sorteios oficiais de camarim, quando houver disponibilidade por parte da Equipe Wanessa.

Receber notícias, atualizações e comunicados oficiais por meio das redes do fã-clube.

Participar de promoções exclusivas, quando realizadas.

Interagir com fãs de várias regiões, fortalecendo laços e amizades.

Dar sugestões, opinar e participar ativamente nas atividades internas do fã-clube.

Importante: Para usufruir das vantagens, o membro deve cumprir as regras, prazos e manter seus dados atualizados.

3. PROCEDIMENTO OFICIAL DE CAMARIM

O camarim é uma ação organizada exclusivamente pela Equipe Wanessa, seguindo critérios de respeito, justiça e transparência.

Etapas oficiais:

Verificação da Equipe Wanessa:
Confirmação inicial se haverá camarim no show.

Aviso ao fã-clube:
Presidente ou vice notifica o grupo oficial.

Confirmação dos interessados:
Membros informam se desejam participar.
Liderança envia dados oficiais (Nome completo + RG + Telefone com DDD).

Validação dos dados:
Equipe verifica prazos e elegibilidade.

Sorteio oficial:
Realizado exclusivamente pela Equipe Wanessa, com a presença online de presidentes de fã-clubes oficiais.

Diretrizes adicionais:

Dados fora do prazo são desconsiderados.

Solicitações enviadas diretamente por fãs à equipe não são válidas.

Fãs que nunca conheceram a Wanessa têm prioridade.

Após participar do camarim, entra em período de espera.

Ausência no show não recupera vaga utilizada.

4. CADASTROS, ALTERAÇÕES E DESLIGAMENTOS

Durante a semana de show/evento, não realizamos cadastros, alterações ou desligamentos.

Dados devem estar atualizados antes dos prazos.

Dados incorretos ou duplicados podem impedir participação.

Caso liderança esteja inativa, a equipe deve ser informada.

5. DEVERES DO MEMBRO

O membro deve:

Respeitar regras e orientações;

Ser cordial;

Ser colaborativo;

Manter dados atualizados;

Seguir redes oficiais da Wanessa e do fã-clube.

6. PROIBIÇÕES

É proibido:

Enviar conteúdos impróprios;

Utilizar palavras ofensivas;

Criar conflitos;

Desrespeitar membros ou fã-clubes parceiros.

Consequências: advertência, suspensão ou expulsão.

7. CANAIS OFICIAIS

Instagram: @faclubewnews
Twitter: @faclubewnews
Facebook: faclubewnews
WhatsApp: Grupo membros W News e Grupo GQ
E-mail: faclubewnews@gmail.com

8. ALTERAÇÕES DO TERMO

As regras podem ser atualizadas mediante aviso prévio.

Agradecemos por fazer parte desta comunidade tão especial.
Com respeito, união e transparência, seguimos juntos celebrando a trajetória da nossa Wanessa!

Equipe Wanessa – Representação: Heitor Lima (Presidente)
`;

export const TermsScreen: React.FC<TermsScreenProps> = ({ onAccept }) => {
    return (
        <div className="min-h-screen w-full bg-brand-bg-light dark:bg-dark-bg-main flex flex-col items-center justify-center p-4">
             <main className="w-full max-w-3xl bg-white/80 dark:bg-dark-bg-secondary/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
                <h1 className="text-2xl font-bold text-brand-text dark:text-dark-accent mb-4 text-center">Termo Oficial de Associação</h1>
                
                <div className="flex-1 overflow-y-auto pr-4 text-brand-text/80 dark:text-dark-text-soft/80 text-sm leading-relaxed">
                    <pre className="whitespace-pre-wrap font-sans">
                        {termsText.trim()}
                    </pre>
                </div>

                <div className="mt-6 pt-6 border-t border-brand-gold/20 dark:border-dark-icon/50">
                    <PrimaryButton onClick={onAccept}>
                        ACEITO E CONCORDO COM O TERMO
                    </PrimaryButton>
                </div>
            </main>
        </div>
    );
};