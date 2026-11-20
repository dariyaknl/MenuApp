import React from 'react';

interface DormEatsLogoProps {
  size?: 'sm' | 'md';
}

export const DormEatsLogo: React.FC<DormEatsLogoProps> = ({ size = 'sm' }) => {
  const boxClass = size === 'sm' ? 'w-8 h-8 rounded-xl' : 'w-10 h-10 rounded-xl';
  const svgClass = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';

  return (
    <div
      className={`${boxClass} bg-white border border-[#EAE6F8] shadow-xs flex items-center justify-center shrink-0`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={svgClass}
        aria-hidden="true"
      >
        {/* Cloche dome */}
        <path
          d="M12 4.5C7.8 4.5 4.5 7.7 4.5 11.7H19.5C19.5 7.7 16.2 4.5 12 4.5Z"
          fill="#3F32E5"
        />
        <circle cx="12" cy="3.6" r="1.1" fill="#F55A31" />
        {/* Bowl / Tray base */}
        <path
          d="M3.5 13.5H20.5C20.1 16.8 17.3 19.2 12 19.2C6.7 19.2 3.9 16.8 3.5 13.5Z"
          fill="#F55A31"
        />
        <path
          d="M7.5 15.6H16.5"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
