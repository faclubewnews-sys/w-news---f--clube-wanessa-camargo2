
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../data/mockData';
import { PrimaryButton } from './PrimaryButton';

declare const html2canvas: any;

interface DigitalCardViewProps {
    user: User;
    onUpdateUser: (updatedFields: Partial<User>) => void;
}

// New name formatting function: "Heitor Pinheiro Lima" -> "HEITOR P. LIMA"
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

export const DigitalCardView: React.FC<DigitalCardViewProps> = ({ user, onUpdateUser }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    
    // Logic to handle potential photo changes without saving immediately
    const [displayPhoto, setDisplayPhoto] = useState(user.profilePic);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setDisplayPhoto(user.profilePic);
    }, [user.profilePic]);

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 600;
              const MAX_HEIGHT = 600;
              let width = img.width;
              let height = img.height;
  
              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }
  
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = (err) => reject(err);
          };
          reader.onerror = (error) => reject(error);
        });
    };
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const resizedImage = await resizeImage(file);
                setDisplayPhoto(resizedImage);
                onUpdateUser({ profilePic: resizedImage }); // This saves immediately
            } catch (error) {
                console.error("Erro ao processar imagem", error);
                alert("Não foi possível processar a imagem. Tente outra.");
            }
        }
    };
    
    const downloadCard = () => {
        if (cardRef.current) {
            setIsDownloading(true);
            html2canvas(cardRef.current, { 
                backgroundColor: null,
                scale: 3, // Higher scale for better quality
                useCORS: true,
                logging: false,
             }).then((canvas: any) => {
                const link = document.createElement('a');
                link.download = `carteirinha-wnews-${user.id}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                setIsDownloading(false);
            }).catch((err: any) => {
                console.error("html2canvas error:", err);
                setIsDownloading(false);
            });
        }
    };

    return (
         <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto animate-fade-in">
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                aria-hidden="true"
            />
            <div className="text-center">
                <h2 className="text-2xl font-light text-brand-text dark:text-dark-accent">Sua Carteirinha Digital</h2>
                <p className="text-sm text-brand-text/60 dark:text-dark-text-soft/60">Clique na sua foto para alterá-la. Use o botão abaixo para baixar.</p>
            </div>
            
            <div 
                ref={cardRef}
                className="w-full shadow-2xl rounded-2xl overflow-hidden"
            >
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
                                        onClick={handlePhotoClick}
                                        className="relative w-[35%] aspect-[3/4] rounded-xl overflow-hidden shadow-md bg-zinc-800/30 border-2 flex items-center justify-center cursor-pointer group flex-shrink-0 transform -translate-y-4"
                                        style={{ borderColor: 'rgba(220, 200, 162, 0.8)', borderRadius: '12px' }}
                                    >
                                        <img src={displayPhoto} alt={`Foto de ${user.name}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                    </div>

                                    {/* Info Block */}
                                    <div className="flex-1 flex flex-col gap-[clamp(10px,2vh,20px)] justify-center py-1">
                                        <DataField label="Nome" value={formatNameForCard(user.name)} />
                                        <DataField label="Nascimento" value={user.dob} />
                                        <DataField label="ID" value={user.cardId} valueClassName="tracking-wider" />
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
            
             <div className="w-full max-w-sm">
                <PrimaryButton onClick={downloadCard} disabled={isDownloading}>
                    {isDownloading ? 'Baixando...' : 'Baixar Carteirinha'}
                </PrimaryButton>
            </div>
        </div>
    );
};
