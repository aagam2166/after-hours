import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../components/common/BrandLogo';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  isLoggedIn: boolean;
}

/**
 * After Hours — Splash Landing Page
 *
 * Matches the PDF Page 1 design exactly:
 * - Cream (#FFF9F3) background
 * - Decorative sparkles (✦) scattered above the logo
 * - Large centered AFTER HOURS logo
 * - "Host the memories." in navy
 * - "Leave the aftermath to us." in coral
 * - Organic peach blob in the bottom-left
 * - Handwritten "Good Nights Cleaner Mornings" in coral (Caveat font)
 * - Subtle decorative organic line
 */
export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, isLoggedIn }) => {
  const [visible, setVisible] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // Staggered entrance animations
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setLogoVisible(true), 400);
    const t3 = setTimeout(() => setTextVisible(true), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF9F3',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={onGetStarted}
    >
      {/* ═══ DECORATIVE ELEMENTS ═══ */}

      {/* Soft peach organic blob — bottom left */}
      <svg
        viewBox="0 0 400 300"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 'clamp(280px, 45vw, 500px)',
          height: 'auto',
          opacity: visible ? 0.7 : 0,
          transition: 'opacity 1.2s ease',
          pointerEvents: 'none',
        }}
      >
        <path
          d="M0 300 C 30 180, 80 120, 160 140 C 240 160, 200 80, 280 60 C 320 50, 360 100, 400 80 L 400 300 Z"
          fill="#FFE8DE"
        />
        <path
          d="M0 300 C 50 220, 100 180, 180 200 C 260 220, 220 140, 310 120 C 350 110, 380 160, 400 140 L 400 300 Z"
          fill="#FFDDD0"
          opacity="0.4"
        />
      </svg>

      {/* Organic thin decorative line — bottom area */}
      <svg
        viewBox="0 0 500 200"
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '5%',
          width: 'clamp(200px, 35vw, 400px)',
          height: 'auto',
          opacity: visible ? 0.3 : 0,
          transition: 'opacity 1.5s ease 0.5s',
          pointerEvents: 'none',
        }}
      >
        <path
          d="M 0 150 C 80 100, 150 180, 250 120 C 350 60, 400 140, 500 100"
          stroke="#FFB9A6"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      {/* ═══ SPARKLES ═══ */}

      {/* Top center sparkle — 4-point star */}
      <svg
        viewBox="0 0 24 24"
        style={{
          position: 'absolute',
          top: '14%',
          left: '55%',
          width: 22,
          height: 22,
          opacity: visible ? 0.35 : 0,
          transition: 'opacity 0.8s ease 0.3s',
          pointerEvents: 'none',
        }}
      >
        <path
          d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
          fill="#E8C9A8"
        />
      </svg>

      {/* Upper-right sparkle — smaller */}
      <svg
        viewBox="0 0 16 16"
        style={{
          position: 'absolute',
          top: '11%',
          left: '62%',
          width: 12,
          height: 12,
          opacity: visible ? 0.25 : 0,
          transition: 'opacity 0.8s ease 0.5s',
          pointerEvents: 'none',
        }}
      >
        <path
          d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z"
          fill="#D4B896"
        />
      </svg>

      {/* Another small sparkle upper-left area */}
      <svg
        viewBox="0 0 16 16"
        style={{
          position: 'absolute',
          top: '18%',
          left: '42%',
          width: 10,
          height: 10,
          opacity: visible ? 0.2 : 0,
          transition: 'opacity 0.8s ease 0.7s',
          pointerEvents: 'none',
        }}
      >
        <path
          d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z"
          fill="#D4B896"
        />
      </svg>

      {/* ═══ CENTERED CONTENT ═══ */}

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 480,
          padding: '0 24px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            opacity: logoVisible ? 1 : 0,
            transform: logoVisible ? 'scale(1)' : 'scale(0.85)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            marginBottom: 32,
          }}
        >
          <BrandLogo size={220} />
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: textVisible ? 1 : 0,
            transform: textVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              fontWeight: 500,
              color: '#111A35',
              lineHeight: 1.5,
              margin: 0,
              letterSpacing: '0.2px',
            }}
          >
            Host the memories.
          </p>
          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'clamp(16px, 2.2vw, 20px)',
              fontWeight: 700,
              color: '#FF6B4A',
              lineHeight: 1.5,
              margin: 0,
              letterSpacing: '0.2px',
            }}
          >
            Leave the aftermath to us.
          </p>
        </div>
      </div>

      {/* ═══ HANDWRITTEN NOTE — bottom right ═══ */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(40px, 8vh, 80px)',
          right: 'clamp(24px, 6vw, 60px)',
          zIndex: 10,
          opacity: textVisible ? 0.75 : 0,
          transform: textVisible ? 'rotate(-4deg)' : 'rotate(-4deg) translateY(10px)',
          transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 'clamp(16px, 2.5vw, 22px)',
            fontWeight: 600,
            color: '#FF6B4A',
            lineHeight: 1.35,
            margin: 0,
            textAlign: 'right',
          }}
        >
          Good Nights<br />
          Cleaner<br />
          Mornings
        </p>
        {/* Small heart accent */}
        <span
          style={{
            display: 'block',
            textAlign: 'right',
            fontSize: 'clamp(12px, 1.5vw, 16px)',
            color: '#FF6B4A',
            marginTop: 2,
          }}
        >
          ♡
        </span>
      </div>

      {/* ═══ LOGIN/ENTER HINT — very subtle at bottom ═══ */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          opacity: textVisible ? 0.6 : 0,
          transition: 'opacity 0.8s ease 0.6s',
        }}
      >
        <span
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 12,
            fontWeight: 600,
            color: '#A89E94',
            letterSpacing: '0.4px',
          }}
        >
          Tap anywhere to continue
        </span>
      </div>

      {/* Top-right login link for returning users */}
      {!isLoggedIn && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLogin();
          }}
          style={{
            position: 'absolute',
            top: 20,
            right: 24,
            zIndex: 20,
            background: 'none',
            border: '1.5px solid #D4CCC2',
            borderRadius: 9999,
            padding: '7px 18px',
            fontSize: 12,
            fontWeight: 700,
            color: '#111A35',
            cursor: 'pointer',
            opacity: textVisible ? 1 : 0,
            transition: 'opacity 0.5s ease 0.8s',
            letterSpacing: '0.3px',
          }}
        >
          Log in
        </button>
      )}

      {isLoggedIn && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onGetStarted();
          }}
          style={{
            position: 'absolute',
            top: 20,
            right: 24,
            zIndex: 20,
            background: '#111A35',
            border: 'none',
            borderRadius: 9999,
            padding: '8px 18px',
            fontSize: 12,
            fontWeight: 700,
            color: '#FFFFFF',
            cursor: 'pointer',
            opacity: textVisible ? 1 : 0,
            transition: 'opacity 0.5s ease 0.8s',
          }}
        >
          Go to App →
        </button>
      )}

      {/* ═══ SPARKLE ANIMATION KEYFRAMES ═══ */}
      <style>{`
        @keyframes ah-sparkle-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
};
