import React from 'react';

interface BrandLogoProps {
  size?: number;
  light?: boolean;
}

/**
 * Renders the real After Hours logo from /after-hours-logo.png.
 * `size` controls the height in px.
 * `light` inverts for dark backgrounds.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 32, light = false }) => {
  return (
    <img
      src="/after-hours-logo.png"
      alt="After Hours"
      style={{
        height: size,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
        filter: light ? 'brightness(0) invert(1)' : 'none',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
      draggable={false}
    />
  );
};
