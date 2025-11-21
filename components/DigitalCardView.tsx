
import React, { useState, useRef } from 'react';
import { User } from '../data/mockData';
import { PrimaryButton } from './PrimaryButton';

declare const html2canvas: any;

export const DigitalCardView: React.FC<{ user: User }> = ({ user }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [profilePicSrc, setProfilePicSrc] = useState(user.profilePic);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        scale: 4, 
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
        setProfilePicSrc(e.target?.result as string);
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
          className="relative w-full aspect-[1.586] rounded-2xl overflow-hidden shadow-2xl font-montserrat bg-zinc-900 select-none transform transition-transform duration-500 hover:scale-[1.01]"
        >
          {/* 1. Background Image - Collage - Adjusted for transparency and softness */}
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
          
          {/* 2. Stronger Dark/Deep-Purple Overlay (30-45%) */}
          <div 
            className="absolute inset-0" 
            style={{ 
               background: 'linear-gradient(135deg, rgba(40, 15, 50, 0.45) 0%, rgba(15, 5, 25, 0.40) 100%)',
               mixBlendMode: 'normal'
            }}
          ></div>
          
          {/* Subtle noise/gradient for premium feel */}
           <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent opacity-50"></div>

          {/* 3. Content Grid */}
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-20">
            
            {/* Header */}
            <div className="flex justify-between items-start w-full border-b border-white/10 pb-3">
                <div className="flex flex-col">
                     <h1 
                      className="text-3xl sm:text-4xl font-extrabold tracking-widest uppercase leading-none"
                      style={{ color: brandGold, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                    >
                      W NEWS
                    </h1>
                </div>
                <div className="text-right flex flex-col justify-center h-full">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-white/90 drop-shadow-md">
                        Fã Clube Oficial
                    </p>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-light text-white/80 drop-shadow-md">
                        Wanessa Camargo
                    </p>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-row items-end justify-between w-full h-full pt-5 relative">
                
                {/* Left: Profile Photo */}
                <div 
                    className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden border-2 shadow-[0_4px_10px_rgba(0,0,0,0.5)] group cursor-pointer transition-transform transform hover:scale-[1.02] shrink-0 mr-5 bg-zinc-800"
                    style={{ borderColor: brandGold }}
                    onClick={handlePhotoClick}
                >
                     <img 
                        src={profilePicSrc}
                        alt={user.name} 
                        crossOrigin="anonymous" 
                        className="w-full h-full object-cover"
                      />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <span className="text-white text-xs font-medium">Alterar</span>
                      </div>
                </div>

                {/* Middle: Info */}
                <div className="flex flex-col justify-end pb-1 flex-1 gap-3 z-10 min-w-0">
                     <div className="flex flex-col">
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5 font-bold opacity-90" style={{ color: brandGold, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Nome</p>
                        <p className="text-base sm:text-xl font-bold text-white leading-tight uppercase truncate drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wide">
                            {user.name}
                        </p>
                     </div>
                     
                     <div className="flex gap-6">
                         <div>
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5 font-bold opacity-90" style={{ color: brandGold, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Nascimento</p>
                            <p className="text-xs sm:text-sm font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                                {user.dob}
                            </p>
                         </div>
                         <div>
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider mb-0.5 font-bold opacity-90" style={{ color: brandGold, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>ID</p>
                            <p className="text-xs sm:text-sm font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wider">
                                {user.cardId.replace('WC-', '')}
                            </p>
                         </div>
                     </div>
                </div>

                {/* Right: Signature */}
                <div className="absolute bottom-[-8px] right-[-8px] z-30">
                     <img 
                        src="https://i.ibb.co/Y4R8xqy8/Design-sem-nome-13.png"
                        alt="Assinatura"
                        className="w-28 sm:w-40 opacity-100"
                        style={{ 
                            filter: 'invert(1) brightness(2) contrast(1.2) drop-shadow(0 3px 3px rgba(0,0,0,0.9))'
                        }}
                    />
                </div>
            </div>
          </div>
          
          {/* Decorative Glows */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none mix-blend-soft-light"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-purple-900/20 rounded-full blur-3xl pointer-events-none mix-blend-soft-light"></div>

        </div>
      </div>

      <div className="mt-8 w-full max-w-sm text-center">
        <PrimaryButton onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? 'Gerando Carteirinha...' : 'Baixar Carteirinha'}
        </PrimaryButton>
        <p className="text-xs text-brand-text/60 dark:text-dark-text-soft/60 mt-4 px-4">
          Toque na foto para personalizar. A imagem é gerada em alta qualidade.
        </p>
      </div>
    </div>
  );
};
