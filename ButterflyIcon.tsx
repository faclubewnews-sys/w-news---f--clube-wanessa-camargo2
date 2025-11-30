import React from 'react';

interface ButterflyIconProps {
  className?: string;
}

export const ButterflyIcon: React.FC<ButterflyIconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="butterflyIconTitle"
    >
      <title id="butterflyIconTitle">Silhueta de uma borboleta dourada delicada</title>
      
      {/* 
        A delicate butterfly resembling a soft 'X' shape.
        - Top wings are larger and sweep gently upwards.
        - Bottom wings are smaller and open to the sides.
        - The structure is delicate, symmetrical, and recognizable.
      */}
      <g>
        {/* Top Wings */}
        <path d="M50,45 C 5,15, 20,60, 50,55 Z" /> {/* Left Top Wing */}
        <path d="M50,45 C 95,15, 80,60, 50,55 Z" /> {/* Right Top Wing */}

        {/* Bottom Wings */}
        <path d="M50,56 C 25,60, 25,85, 50,70 Z" /> {/* Left Bottom Wing */}
        <path d="M50,56 C 75,60, 75,85, 50,70 Z" /> {/* Right Bottom Wing */}

        {/* Body */}
        <path d="M50,40 C50.75,50, 50.75,65, 50,70 C49.25,65, 49.25,50, 50,40 Z" />

        {/* Antennae */}
        <path 
          d="M50,40 C45,33 40,33 38,28" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M50,40 C55,33 60,33 62,28" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />
      </g>
    </svg>
  );
};