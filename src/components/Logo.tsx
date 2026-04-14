import React from 'react';

export default function Logo({ className = "w-8 h-8", strokeWidth = 6 }: { className?: string, strokeWidth?: number }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Hand-drawn style circle with gap and tapering */}
      <path 
        d="M78.5 21.5C88.5 31.5 93.5 44.5 93.5 58.5C93.5 82.5 74.5 93.5 50.5 93.5C26.5 93.5 7.5 82.5 7.5 58.5C7.5 34.5 26.5 13.5 50.5 13.5C61.5 13.5 71.5 17.5 78.5 23.5" 
        stroke="currentColor" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="opacity-90"
      />
      {/* Sigma Symbol - Even more precise 1:1 recreation */}
      <path 
        d="M38 34H62V42L50 50L62 58V66H38V60H54L44 50L54 40H38V34Z" 
        fill="currentColor" 
      />
    </svg>
  );
}
