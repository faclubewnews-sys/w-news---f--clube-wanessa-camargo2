



import React from 'react';
import { User, mockUsers } from '../data/mockData';
import { ActiveView } from './Dashboard';
import { UserCircleIcon, CardIcon, StarIcon, ShieldIcon, OuvidoriaIcon, TicketIcon, MegaphoneIcon } from './icons/UiIcons';
import { WhatsAppIcon, InstagramIcon, TwitterIcon, FacebookIcon, TiktokIcon } from './icons/SocialIcons';
import { ButterflyIcon } from './ButterflyIcon';
import { CommunityGallery } from './CommunityGallery';

interface HomeProps {
    user: User;
    onNavigate: (view: ActiveView) => void;
    onContactClick: () => void;
    theme: string;
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick} 
    className="flex flex-col items-center justify-center gap-3 p-4 bg-brand-bg-light/50 dark:bg-dark-bg-secondary/70 backdrop-blur-sm rounded-xl shadow-lg hover:bg-brand-gold/20 dark:hover:bg-dark-icon/50 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-gold dark:focus:ring-dark-accent"
    aria-label={`Acessar ${label}`}
  >
    <div className="w-10 h-10 text-brand-accent dark:text-dark-accent">{icon}</div>
    <span className="font-semibold text-sm text-brand-text dark:text-dark-text-soft">{label}</span>
  </button>
);

export const Home: React.FC<HomeProps> = ({ user, onNavigate, onContactClick, theme }) => {
    const logoShadow = theme === 'light' 
        ? 'drop-shadow(0 8px 20px rgba(176, 137, 104, 0.2))' // Warm shadow using brand-accent
        : 'drop-shadow(0 8px 25px rgba(203, 161, 83, 0.25))'; // Gold glow using dark-accent

    const president = mockUsers.find(u => u.role === 'master');
    const vicePresident = mockUsers.find(u => u.role === 'admin');
    const canManage = user.role === 'master' || user.role === 'admin';

    const socialLinks = [
        { href: 'https://www.instagram.com/faclubewnews/', icon: <InstagramIcon className="w-6 h-6" />, label: 'Instagram' },
        { href: 'https://x.com/faclubewnews', icon: <TwitterIcon className="w-6 h-6" />, label: 'X (Twitter)' },
        { href: 'https://www.facebook.com/faclubewnews', icon: <FacebookIcon className="w-6 h-6" />, label: 'Facebook' },
        { href: 'https://www.tiktok.com/@faclubewnews', icon: <TiktokIcon className="w-6 h-6" />, label: 'TikTok' },
    ];

    return (
        <div className="flex flex-col items-center justify-start w-full h-full p-4 pt-4 md:pt-6 text-center">
            <img 
                src="https://i.ibb.co/nNk9s3Q7/Design-sem-nome-9.png" 
                alt="Logo W News" 
                className="w-64 md:w-80 mb-3 object-contain"
                style={{ filter: logoShadow }}
            />
            <h2 className="text-xl font-light text-brand-text dark:text-dark-text-soft mb-6">
                Seja bem-vindo(a) ao fã clube W News!
            </h2>
            
            <div className="w-full max-w-3xl mx-auto my-6 p-4 bg-brand-bg-light/20 dark:bg-dark-bg-secondary/20 rounded-xl backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-brand-text dark:text-dark-accent mb-4">Presidência W News</h3>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10">
                    {president && (
                        <div className="flex items-center gap-4">
                            <img src={president.profilePic} alt={president.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-gold/50 dark:ring-dark-accent/50"/>
                            <div>
                                <p className="font-bold text-brand-text dark:text-dark-text-soft text-left">{president.name}</p>
                                <p className="text-sm text-brand-text/70 dark:text-dark-text-soft text-left">Presidente</p>
                                {president.whatsapp && (
                                    <a href={president.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 font-semibold mt-1 hover:underline">
                                        <WhatsAppIcon className="w-4 h-4" /> Contato
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                    {vicePresident && (
                        <div className="flex items-center gap-4">
                            <img src={vicePresident.profilePic} alt={vicePresident.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-gold/50 dark:ring-dark-accent/50"/>
                            <div>
                                <p className="font-bold text-brand-text dark:text-dark-text-soft text-left">{vicePresident.name}</p>
                                <p className="text-sm text-brand-text/70 dark:text-dark-text-soft text-left">Vice-Presidente</p>
                                {vicePresident.whatsapp && (
                                    <a href={vicePresident.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-green-700 dark:text-green-400 font-semibold mt-1 hover:underline">
                                        <WhatsAppIcon className="w-4 h-4" /> Contato
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-2xl">
                <NavItem icon={<UserCircleIcon />} label="Meu Perfil" onClick={() => onNavigate('profile')} />
                <NavItem icon={<CardIcon />} label="Minha Carteirinha" onClick={() => onNavigate('card')} />
                <NavItem icon={<TicketIcon />} label="Sorteios" onClick={() => onNavigate('sorteios')} />
                <NavItem icon={<StarIcon />} label="Camarim" onClick={() => onNavigate('camarim')} />
                <NavItem icon={<ButterflyIcon />} label="Wanessa Camargo" onClick={() => onNavigate('wanessa')} />
                <NavItem icon={<OuvidoriaIcon />} label="Ouvidoria" onClick={() => onNavigate('ouvidoria')} />
                {canManage && (
                    <>
                        <NavItem icon={<MegaphoneIcon />} label="Envio de Push" onClick={() => onNavigate('push')} />
                        <NavItem icon={<ShieldIcon />} label="Administração" onClick={() => onNavigate('management')} />
                    </>
                )}
            </div>

            {/* New Community Gallery Section */}
            <CommunityGallery currentUser={user} />

            <div className="w-full max-w-2xl mt-10 p-4 rounded-xl bg-brand-bg-light/50 dark:bg-dark-bg-secondary/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 transition-colors duration-300 shadow-lg">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-text/60 dark:text-dark-text-soft/60">
                    Siga nossas Redes Oficiais
                </h3>
                <div className="flex items-center gap-8">
                     {socialLinks.map((link) => (
                        <a 
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-text/70 dark:text-dark-text-soft/70 hover:text-brand-accent dark:hover:text-dark-accent hover:scale-110 transition-all duration-300 p-2"
                            aria-label={link.label}
                            title={link.label}
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};
