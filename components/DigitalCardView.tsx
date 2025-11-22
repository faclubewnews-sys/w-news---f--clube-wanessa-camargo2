








import React, { useState, useRef, useEffect } from 'react';
import { User } from '../data/mockData';
import { PrimaryButton } from './PrimaryButton';

declare const html2canvas: any;

interface DigitalCardViewProps {
    user: User;
    onUpdateUser: (updatedFields: Partial<User>) => void;
}

export const DigitalCardView: React.FC<DigitalCardViewProps> = ({ user, onUpdateUser }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [profilePicSrc, setProfilePicSrc] = useState(user.profilePic);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if user prop changes
  useEffect(() => {
      setProfilePicSrc(user.profilePic);
  }, [user.profilePic]);

  const handleDownload = async () => {
    const cardElement = document.getElementById('digital-card');
    if (!cardElement) {
      console.error("Card element not found for download.");
      alert("Erro ao identificar o cartão para download.");
      return;
    }

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardElement, { 
        useCORS: true, 
        allowTaint: true,
        backgroundColor: null,
        scale: 4, // High resolution export
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `carteirinha-wnews-${user.cardId}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate card image:", error);
      alert("Ocorreu um erro ao gerar a imagem. Por favor, tente novamente.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePicSrc(result);
        // Save to persistent state
        onUpdateUser({ profilePic: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Brand Colors
  const brandGold = '#CDBA9A';

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full animate-fade-in">
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-hidden="true"
      />
      
      {/* Card Container */}
      <div className="w-full max-w-xl perspective-1000">
        <div 
          id="digital-card" 
          className="relative w-full aspect-[1.586] rounded-2xl overflow-hidden shadow-2xl font-montserrat bg-zinc-900 select-none transform transition-transform duration-500 hover:scale-[1.005]"
        >
          {/* 1. Background Image - Collage */}
          <img 
            src="https://i.ibb.co/nsFY5Z7v/580930255-18542360491037488-2395317763344905099-n.jpg" 
            alt="Background Collage"
            crossOrigin="anonymous" 
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{ 
                filter: 'saturate(0.4) brightness(0.9) contrast(0.8)', 
                opacity: 0.25 
            }} 
          />
          
          {/* 2. Color Overlay */}
          <div 
            className="absolute inset-0" 
            style={{ 
               background: 'linear-gradient(135deg, rgba(40, 15, 50, 0.45) 0%, rgba(15, 5, 25, 0.40) 100%)',
               mixBlendMode: 'normal'
            }}
          ></div>
          
          {/* Subtle noise/gradient for premium feel */}
           <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent opacity-50"></div>

          {/* 3. Content Grid - Completely Fluid Layout using Percentages */}
          <div className="absolute inset-0 p-[5%] flex flex-col justify-between z-20">
            
            {/* Header Row */}
            <div className="flex justify-between items-start w-full border-b border-white/10 pb-[2%]">
                <div className="flex flex-col">
                     <h1 
                      className="font-extrabold tracking-widest uppercase leading-none"
                      style={{ 
                          color: brandGold, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                          fontSize: 'container(5.5cqw)' // fallback handled via clamp below
                      }}
                    >
                      <span className="text-[clamp(16px,5cqw,32px)]">W NEWS</span>
                    </h1>
                </div>
                <div className="text-right flex flex-col justify-center h-full">
                    <p className="uppercase tracking-[0.2em] font-semibold text-white/90 drop-shadow-md text-[clamp(6px,1.8cqw,10px)]">
                        Fã Clube Oficial
                    </p>
                    <p className="uppercase tracking-[0.2em] font-light text-white/80 drop-shadow-md text-[clamp(6px,1.8cqw,10px)]">
                        Wanessa Camargo
                    </p>
                </div>
            </div>

            {/* Body Row - Fluid Positioning */}
            <div className="flex flex-row items-end justify-between w-full h-full pt-[4%] relative container-type-inline-size">
                
                {/* Left: Profile Photo */}
                <div 
                    className="relative rounded-xl overflow-hidden border-2 shadow-[0_4px_10px_rgba(0,0,0,0.5)] group cursor-pointer shrink-0 mr-[4%] bg-zinc-800"
                    style={{ 
                        borderColor: brandGold,
                        width: '24%',
                        aspectRatio: '3/4' 
                    }}
                    onClick={handlePhotoClick}
                >
                     <img 
                        src={profilePicSrc}
                        alt={user.name} 
                        crossOrigin="anonymous" 
                        className="w-full h-full object-cover"
                      />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <span className="text-white text-[8px] sm:text-xs font-medium">Alterar</span>
                      </div>
                </div>

                {/* Middle: Info - Padding Right protects against signature overlap */}
                <div 
                    className="flex flex-col justify-end pb-[1%] flex-1 gap-[3%] z-10 min-w-0 relative"
                    style={{ paddingRight: '30%' }}
                >
                     <div className="flex flex-col">
                        <p className="uppercase tracking-wider mb-0.5 font-bold opacity-90 text-[clamp(7px,1.5cqw,10px)]" style={{ color: brandGold, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Nome</p>
                        <p className="font-bold text-white leading-tight uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wide break-words text-[clamp(10px,3.5cqw,22px)]">
                            {user.name}
                        </p>
                     </div>
                     
                     <div className="flex gap-[10%] mt-[2%]">
                         <div>
                            <p className="uppercase tracking-wider mb-0.5 font-bold opacity-90 text-[clamp(7px,1.5cqw,10px)]" style={{ color: brandGold, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Nascimento</p>
                            <p className="font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-[clamp(9px,2.5cqw,14px)]">
                                {user.dob}
                            </p>
                         </div>
                         <div>
                            <p className="uppercase tracking-wider mb-0.5 font-bold opacity-90 text-[clamp(7px,1.5cqw,10px)]" style={{ color: brandGold, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>ID</p>
                            <p className="font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wider text-[clamp(9px,2.5cqw,14px)]">
                                {user.cardId.replace('WC-', '')}
                            </p>
                         </div>
                     </div>
                </div>

                {/* Right: Signature - Absolute fluid positioning */}
                <div 
                    className="absolute z-20 pointer-events-none"
                    style={{
                        bottom: '6%',
                        right: '4%',
                        width: '22%'
                    }}
                >
                     <img 
                        src="https://i.ibb.co/Y4R8xqy8/Design-sem-nome-13.png"
                        alt="Assinatura"
                        className="w-full h-auto"
                        style={{ 
                            filter: 'invert(1) brightness(2) contrast(1.2) drop-shadow(0 3px 3px rgba(0,0,0,0.9))'
                        }}
                    />
                </div>
            </div>
          </div>
          
          {/* Decorative Glows */}
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-gold/10 rounded-full blur-3xl pointer-events-none mix-blend-soft-light"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-3xl pointer-events-none mix-blend-soft-light"></div>

        </div>
      </div>

      <div className="mt-8 w-full max-w-sm text-center">
        <PrimaryButton onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? 'Gerando Carteirinha...' : 'Baixar Carteirinha'}
        </PrimaryButton>
        <p className="text-xs text-brand-text/60 dark:text-dark-text-soft/60 mt-4 px-4">
          Toque na foto para personalizar. A foto será atualizada automaticamente em seu perfil.
        </p>
      </div>
    </div>
  );
};
