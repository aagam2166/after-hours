import React from 'react';

interface BrandLogoProps {
  size?: number;
  light?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 32, light = false }) => {
  const textColor = light ? '#FFFFFF' : '#0F172A';
  const orange = '#FF5A36';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, userSelect: 'none' }}>
      <svg
        width={size * 1.5}
        height={size * 1.2}
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Sunburst rays above A */}
        <line x1="8" y1="12" x2="14" y2="18" stroke={orange} strokeWidth="3" strokeLinecap="round" />
        <line x1="16" y1="6" x2="16" y2="14" stroke={orange} strokeWidth="3" strokeLinecap="round" />
        <line x1="24" y1="12" x2="18" y2="18" stroke={orange} strokeWidth="3" strokeLinecap="round" />

        {/* AFTER */}
        <text
          x="12"
          y="42"
          fontFamily="Manrope, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="30"
          fill={textColor}
          letterSpacing="1"
        >
          AFTER
        </text>

        {/* Sparkle inside A */}
        <path
          d="M 23 29 Q 25 31 27 31 Q 25 31 23 33 Q 23 31 21 31 Q 23 31 23 29 Z"
          fill={orange}
        />

        {/* HOURS */}
        <text
          x="12"
          y="72"
          fontFamily="Manrope, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="30"
          fill={textColor}
          letterSpacing="1.5"
        >
          H<tspan fill={orange}>✦</tspan>URS
        </text>
      </svg>
    </div>
  );
};
