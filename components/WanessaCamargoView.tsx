
import React from 'react';
import { InstagramIcon, TwitterIcon, FacebookIcon, TiktokIcon } from './icons/SocialIcons';
import { GlobeAltIcon, ShoppingCartIcon } from './icons/UiIcons';

// Links updated with official URLs
const links = {
    facebook: 'https://www.facebook.com/wanessaoficial',
    instagram: 'https://www.instagram.com/wanessa/',
    twitter: 'https://x.com/WanessaCamargo',
    tiktok: 'https://www.tiktok.com/@wanessacamargoreal',
    website: 'https://wanessacamargo.com.br/',
    store: 'https://wanessacamargo.com.br/loja/'
};

const Section: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div>
        <h3 className="md:col-span-2 text-lg font-semibold text-brand-text dark:text-dark-text-soft mb-2">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);


const InfoLink: React.FC<{href: string, icon: React.ReactNode, label: string}> = ({href, icon, label}) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center gap-4 p-4 bg-brand-bg-light/50 dark:bg-dark-bg-secondary/70 rounded-lg hover:bg-brand-gold/20 dark:hover:bg-dark-icon/50 transition-all duration-300 transform hover:scale-105"
      aria-label={`Visitar ${label}`}
    >
        <div className="w-8 h-8 text-brand-accent dark:text-dark-accent flex-shrink-0">{icon}</div>
        <span className="font-semibold text-brand-text dark:text-dark-text-soft">{label}</span>
    </a>
);

export const WanessaCamargoView: React.FC = () => {
  return (
    <div className="bg-brand-bg-light/30 dark:bg-dark-bg-secondary/30 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <div className="border-b border-brand-gold/20 dark:border-dark-icon/50 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-brand-text dark:text-dark-accent">Wanessa Camargo</h2>
            <p className="text-sm text-brand-text/70 dark:text-dark-text-soft">Oficial</p>
        </div>
        
        <div className="space-y-8">
            <Section title="Redes Sociais">
                <InfoLink href={links.instagram} icon={<InstagramIcon />} label="Instagram" />
                <InfoLink href={links.facebook} icon={<FacebookIcon />} label="Facebook" />
                <InfoLink href={links.twitter} icon={<TwitterIcon />} label="Twitter / X" />
                <InfoLink href={links.tiktok} icon={<TiktokIcon />} label="TikTok" />
            </Section>

            <Section title="Links Oficiais">
                <InfoLink href={links.website} icon={<GlobeAltIcon />} label="Site Oficial" />
                <InfoLink href={links.store} icon={<ShoppingCartIcon />} label="Loja Online" />
            </Section>
        </div>
    </div>
  );
};
