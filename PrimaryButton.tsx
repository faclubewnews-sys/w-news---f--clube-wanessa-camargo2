
import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, onClick, type = 'button', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full mt-4 bg-brand-text text-brand-bg-light font-bold py-3 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-opacity-50 transition-all duration-300 ease-in-out dark:bg-dark-accent dark:text-dark-bg-main dark:focus:ring-dark-accent ${
        disabled 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:shadow-brand-accent/40 hover:bg-brand-accent transform hover:-translate-y-1 dark:hover:brightness-110'
      }`}
    >
      {children}
    </button>
  );
};
