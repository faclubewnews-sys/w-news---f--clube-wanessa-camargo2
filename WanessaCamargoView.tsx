import React from 'react';
import { GeneratedCard } from './GeneratedCard';

// FIX: Add props to accept and pass down the theme
interface WanessaCamargoViewProps {
  theme: string;
}

export const WanessaCamargoView: React.FC<WanessaCamargoViewProps> = ({ theme }) => {
  return <GeneratedCard theme={theme} />;
};
