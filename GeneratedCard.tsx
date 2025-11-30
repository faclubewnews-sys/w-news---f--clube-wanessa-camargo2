
import React from 'react';

// FIX: Add props to accept theme from parent component
interface GeneratedCardProps {
    theme: string;
}

// Função para formatar o nome: "Heitor Pinheiro Lima" -> "HEITOR P. LIMA"
const formatNameForCard = (name: string): string => {
    if (!name) return '';
    const words = name.toUpperCase().split(' ').filter(Boolean);

    if (words.length >= 3) {
        const firstName = words[0];
        const middleInitial = words[1].charAt(0);
        const lastName = words[words.length - 1];
        return `${firstName} ${middleInitial}. ${lastName}`;
    }
    
    return words.join(' ');
};

const DataField = ({ label, value, valueClassName = '' }: { label: string, value: string, valueClassName?: string }) => (
    <div>
        <p className="uppercase tracking-wider font-medium opacity-90 font-montserrat" style={{ color: '#CDBA9A', fontSize: 'clamp(8px, 1.4vw, 11px)', marginBottom: '2px' }}>
            {label}
        </p>
        <p 
            className={`font-semibold uppercase ${valueClassName} font-montserrat`} 
            style={{ 
                color: '#F3EEE6',
                fontSize: 'clamp(14px, 2.5vw, 20px)',
                textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                lineHeight: 1.2,
                letterSpacing: '0.4px',
            }}>
            {value}
        </p>
    </div>
);

export const GeneratedCard: React.FC<GeneratedCardProps> = ({ theme }) => {
    // Dados estáticos da Wanessa para visualização
    const wanessaData = {
        name: 'Wanessa Godói Camargo',
        dob: '28/12/1982',
        id: 'WC-001-OFFICIAL',
        profilePic: 'https://i.ibb.co/hR5vX8P/Wanessa-Camargo.jpg' // Placeholder image if needed, or keeping structure consistent
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto animate-fade-in">
             <div className="text-center mb-4">
                <h2 className="text-2xl font-light text-brand-text dark:text-dark-accent">Carteirinha Oficial</h2>
                <p className="text-sm text-brand-text/60 dark:text-dark-text-soft/60">Exemplo da carteirinha oficial do fã clube.</p>
            </div>

            <div className="w-full shadow-2xl rounded-2xl overflow-hidden transform transition-transform hover:scale-[1.01] duration-500">
                <div 
                    className="relative w-full aspect-[1000/630]"
                >
                    <div className="absolute inset-0 bg-zinc-900 select-none font-sans">
                        {/* Background */}
                        <img 
                            src="https://i.ibb.co/nsFY5Z7v/580930255-18542360491037488-2395317763344905099-n.jpg" 
                            alt="Background Collage"
                            className="absolute inset-0 w-full h-full object-cover object-top"
                            style={{ 
                                filter: 'saturate(0.5) brightness(1.0) contrast(0.9)', 
                                opacity: 0.25 
                            }} 
                        />
                        <div 
                            className="absolute inset-0" 
                            style={{ 
                                background: 'linear-gradient(135deg, rgba(40, 15, 50, 0.45) 0%, rgba(15, 5, 25, 0.40) 100%)',
                            }}
                        ></div>
                        
                         {/* Content Container - FLEX COLUMN TO PREVENT OVERLAP */}
                        <div className="relative p-[6%] flex flex-col h-full z-10 justify-between">
                            
                             {/* TOP GROUP: Header + User Info */}
                             <div className="flex flex-col gap-[4%] min-h-0 flex-1">
                                {/* Header */}
                                <div className="flex justify-between items-start border-b border-white/10 pb-[2%] mb-[3%]">
                                    <div>
                                        <h1 
                                            className="font-semibold tracking-widest uppercase leading-none font-montserrat"
                                            style={{ 
                                                color: '#CDBA9A', 
                                                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                                                fontSize: 'clamp(16px, 4.2vw, 34px)' 
                                            }}
                                        >
                                            W NEWS
                                        </h1>
                                    </div>
                                    <div className="text-right">
                                        <p className="uppercase tracking-[0.2em] font-semibold text-white/90 drop-shadow-md font-montserrat" style={{ fontSize: 'clamp(8px, 1.7vw, 13px)' }}>
                                            Fã Clube Oficial
                                        </p>
                                        <p className="uppercase tracking-[0.2em] font-light text-white/80 drop-shadow-md font-montserrat" style={{ fontSize: 'clamp(8px, 1.7vw, 13px)' }}>
                                            Wanessa Camargo
                                        </p>
                                    </div>
                                </div>

                                {/* Middle Content: Photo + Info */}
                                <div className="flex items-start gap-[6%]">
                                    {/* Photo Container */}
                                    <div 
                                        className="relative w-[35%] aspect-[3/4] rounded-xl overflow-hidden shadow-md bg-zinc-800/30 border-2 flex items-center justify-center flex-shrink-0 transform -translate-y-4"
                                        style={{ borderColor: 'rgba(220, 200, 162, 0.8)', borderRadius: '12px' }}
                                    >
                                        <img 
                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Wanessa_Camargo_2024.jpg/800px-Wanessa_Camargo_2024.jpg" 
                                            alt="Wanessa Camargo" 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>

                                    {/* Info Block */}
                                    <div className="flex-1 flex flex-col gap-[clamp(10px,2vh,20px)] justify-center py-1">
                                        <DataField label="Nome" value={formatNameForCard(wanessaData.name)} />
                                        <DataField label="Nascimento" value={wanessaData.dob} />
                                        <DataField label="ID" value={wanessaData.id} valueClassName="tracking-wider" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Signature Container */}
                            <div className="flex-shrink-0 h-20 w-full flex justify-center items-center px-4">
                                {/* This is the "signature-box" with defined constraints */}
                                <div className="w-full max-w-xs h-full overflow-hidden flex items-center justify-center">
                                    <img
                                        src="https://i.ibb.co/XxrJv7My/Design-sem-nome-14.png"
                                        alt="Assinatura"
                                        className="w-full h-full object-contain" 
                                        style={{
                                            filter: 'brightness(0) invert(1) drop-shadow(0px 1px 8px rgba(255, 255, 255, 0.8))',
                                            opacity: 1,
                                        }}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
