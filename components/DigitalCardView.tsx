
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

  // Sync state if user prop changes (e.g. update from another component)
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

  // Helper to resize images
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
            // Compress to 70% quality JPEG to save storage space
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          };
          img.onerror = (err) => reject(err);
        };
        reader.onerror = (error) => reject(error);
      });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
          const resizedImage = await resizeImage(file);
          setProfilePicSrc(resizedImage);
          // Immediate global update for photo
          // This call triggers updateUserInStorage in App.tsx, ensuring persistence
          onUpdateUser({ profilePic: resizedImage });
          alert("Foto atualizada com sucesso em todos os seus perfis.");
      } catch (error) {
          console.error("Erro ao processar imagem", error);
          alert("Não foi possível salvar a imagem. Tente um arquivo menor.");
      }
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
      
      {/* Card Container - Responsive Wrapper */}
      <div className="w-full max-w-xl shadow-2xl rounded-2xl overflow-hidden">
        {/* Aspect Ratio Container (1.586 is standard credit card ratio) */}
        <div 
          id="digital-card" 
          className="relative w-full"
          style={{ paddingBottom: '63.05%' }} 
        >
            {/* Absolute Content Layer */}
            <div className="absolute inset-0 bg-zinc-900 select-none overflow-hidden">
              {/* 1. Background Image */}
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
              
              {/* 3. Content Wrapper - Using percentages for absolute positioning */}
              <div className="absolute inset-0 p-[5%] font-montserrat flex flex-col justify-between">
                  
                  {/* Top Header */}
                  <div className="flex justify-between items-start border-b border-white/10 pb-[2%]">
                      <div>
                           <h1 
                            className="font-extrabold tracking-widest uppercase leading-none"
                            style={{ 
                                color: brandGold, 
                                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                                fontSize: '5cqw' // Fallback handled via container queries if supported, otherwise simple percentage estimation logic below
                            }}
                          >
                            <span style={{ fontSize: 'clamp(16px, 5vw, 32px)' }}>W NEWS</span>
                          </h1>
                      </div>
                      <div className="text-right">
                          <p className="uppercase tracking-[0.2em] font-semibold text-white/90 drop-shadow-md" style={{ fontSize: 'clamp(8px, 1.8vw, 12px)' }}>
                              Fã Clube Oficial
                          </p>
                          <p className="uppercase tracking-[0.2em] font-light text-white/80 drop-shadow-md" style={{ fontSize: 'clamp(8px, 1.8vw, 12px)' }}>
                              Wanessa Camargo
                          </p>
                      </div>
                  </div>

                  {/* Main Content Body */}
                  <div className="flex flex-row items-end justify-between flex-1 mt-[2%] mb-[3%] relative">
                      
                      {/* Photo Area */}
                      <div 
                          className="relative h-[75%] w-[28%] aspect-[3/4] rounded-xl overflow-hidden border-2 shadow-md bg-zinc-800 group cursor-pointer self-center z-30"
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
                               <span className="text-white font-medium" style={{ fontSize: 'clamp(10px, 2vw, 14px)' }}>Alterar</span>
                            </div>
                      </div>

                      {/* Text Info Area */}
                      <div className="flex flex-col justify-end h-full flex-1 ml-[5%] relative z-20 pb-2">
                           {/* Name */}
                           <div className="mb-[4%] pr-[20%]">
                              <p className="uppercase tracking-wider font-bold opacity-90" style={{ color: brandGold, fontSize: 'clamp(8px, 1.5vw, 12px)', marginBottom: '0.5%' }}>Nome</p>
                              <p className="font-bold text-white leading-none uppercase drop-shadow-md tracking-wide break-words line-clamp-2" style={{ fontSize: 'clamp(12px, 3.2vw, 24px)' }}>
                                  {user.name}
                              </p>
                           </div>

                           {/* Info Row */}
                           <div className="flex gap-[10%]">
                               <div>
                                  <p className="uppercase tracking-wider font-bold opacity-90" style={{ color: brandGold, fontSize: 'clamp(8px, 1.5vw, 12px)', marginBottom: '0.5%' }}>Nascimento</p>
                                  <p className="font-medium text-white drop-shadow-md" style={{ fontSize: 'clamp(10px, 2.5vw, 16px)' }}>
                                      {user.dob}
                                  </p>
                               </div>
                               <div>
                                  <p className="uppercase tracking-wider font-bold opacity-90" style={{ color: brandGold, fontSize: 'clamp(8px, 1.5vw, 12px)', marginBottom: '0.5%' }}>ID</p>
                                  <p className="font-medium text-white drop-shadow-md tracking-wider" style={{ fontSize: 'clamp(10px, 2.5vw, 16px)' }}>
                                      {user.cardId.replace('WC-', '')}
                                  </p>
                               </div>
                           </div>
                      </div>

                      {/* Signature Area (Bottom Right) - Adjusted Z-Index to 10 to ensure it stays BEHIND text (z-20) */}
                      <div className="absolute bottom-[-5%] right-[-2%] w-[30%] opacity-80 pointer-events-none z-10">
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
            </div>
        </div>
      </div>

      <div className="mt-8 w-full max-w-sm text-center">
        <PrimaryButton onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? 'Gerando Carteirinha...' : 'Baixar Carteirinha'}
        </PrimaryButton>
        <p className="text-xs text-brand-text/60 dark:text-dark-text-soft/60 mt-4 px-4">
          Toque na foto para alterar. A foto será atualizada automaticamente em seu perfil e para toda a comunidade.
        </p>
      </div>
    </div>
  );
};
