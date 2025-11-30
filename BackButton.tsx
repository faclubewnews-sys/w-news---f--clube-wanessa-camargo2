import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 text-sm font-semibold text-brand-text/80 hover:text-brand-gold dark:text-dark-text-soft dark:hover:text-dark-accent transition-colors duration-300 ${className}`}
      aria-label="Voltar para a tela anterior"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Voltar
    </button>
  );
};
