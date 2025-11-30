
import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ id, label, type, placeholder, value, onChange }) => {
  return (
    <div className="relative w-full">
      <label htmlFor={id} className="sr-only">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full bg-transparent border-b-2 border-brand-gold/30 focus:border-brand-gold text-brand-text placeholder-brand-text/50 px-2 py-3 transition-colors duration-300 focus:outline-none dark:border-dark-icon dark:focus:border-dark-accent dark:text-dark-text-soft dark:placeholder-dark-text-soft"
      />
    </div>
  );
};