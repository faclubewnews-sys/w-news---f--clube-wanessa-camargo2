import React from 'react';

interface IconProps {
  className?: string;
}

// Refined Instagram Icon - Thinner lines, clean and simple
export const InstagramIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// Corrected Twitter/X Icon - Clean, geometric X
export const TwitterIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

// Updated Facebook Icon - Minimalist
export const FacebookIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

// Corrected TikTok Icon using a standard, accurate brand representation.
export const TiktokIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.88-1.59-1.93-2.2-4.42-1.8-6.83.39-2.4 1.91-4.48 3.78-5.91 1.9-1.43 4.24-2.19 6.62-2.22v4.02c-1.18.17-2.35.61-3.39 1.31-1.02.69-1.8 1.69-2.34 2.81-.53 1.11-.79 2.36-.78 3.58.01 1.23.38 2.45 1.11 3.48.99 1.34 2.65 2.13 4.35 1.95 1.7-.18 3.17-1.14 4.09-2.48.91-1.34 1.25-3.04 1.22-4.71-.02-2.88-.01-5.76-.01-8.64-.03-1.21-.43-2.4-1.11-3.39-.73-.99-1.79-1.64-2.98-1.85v-4.04c.01 0 .01 0 0 0z" />
    </svg>
);


export const SpotifyIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.183 14.225c-.2.315-.593.425-.908.225-2.618-1.608-5.88-1.96-9.715-1.073-.362.083-.72-.15-.803-.512s.15-.72.512-.803c4.218-.97 7.825-.57 10.76 1.24.315.2.425.593.225.908s-.593.425-.908.225zM17.5 13.15c-.25.398-.715.528-1.113.278-2.91-1.788-7.373-2.288-10.748-1.253-.442.125-.898-.125-.998-.567s.125-.898.567-.998c3.818-1.15 8.75-.59 12.048 1.49.398.25.528.715.278 1.113s-.715.528-1.113.278zm.11-3.29c-3.48-2.08-9.13-2.28-12.54.91-.5.26-.98 0-1.23-.5s0-.98.5-1.23c3.9-2.58 10.15-2.37 14.12.91.47.35.6.95.25 1.42s-.95.6-1.42.25z" />
  </svg>
);

export const YoutubeIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.582 6.186A2.483 2.483 0 0019.86 4.67C18.13 4 12 4 12 4s-6.13 0-7.86.67a2.483 2.483 0 00-1.722 1.516C2 7.915 2 12 2 12s0 4.085.418 5.814a2.483 2.483 0 001.722 1.516C5.87 20 12 20 12 20s6.13 0 7.86-.67a2.483 2.483 0 001.722-1.516C22 16.085 22 12 22 12s0-4.085-.418-5.814zM9.75 15.5V8.5L15.75 12 9.75 15.5z"/>
  </svg>
);

// Updated Last.fm icon - Stylized play button (line art)
export const LastfmIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M10 16V8l6 4-6 4z"></path>
    </svg>
);

export const WhatsAppIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.086l.001.004 4.971 4.971z"/>
    </svg>
);