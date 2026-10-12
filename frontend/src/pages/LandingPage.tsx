import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, Sparkles, Moon, Coffee, Heart } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  isLoggedIn: boolean;
}

const slides = [
  {
    tag: 'MORNING-AFTER RESET',
    headline: (
      <>
        Had a good night?<br />
        <span style={{ color: '#FF5A36' }}>Great. Don't clean it.</span>
        {' '}<span style={{ fontSize: '0.85em', color: '#FF5A36' }}>✌</span>
      </>
    ),
    subtext: 'While you sleep in, our trained reset crew collects every red cup, bags the bottles, boxes leftover food, and restores your space.',
    features: [
      { icon: Moon, title: 'Arrival by 7:00 AM', desc: 'Dispatched post-wrap up' },
      { icon: Sparkles, title: 'Zero Judgment', desc: 'Party aftermath specialists' },
      { icon: Coffee, title: 'Wake Up Fresh', desc: 'Spotless counters & floors' },
    ],
  },
  {
    tag: 'POST-HOSTING CARE',
    headline: (
      <>
        You hosted.<br />
        <span style={{ color: '#FF5A36' }}>We'll handle the rest.</span>
        {' '}<span style={{ fontSize: '0.85em', color: '#FF5A36' }}>♡</span>
      </>
    ),
    subtext: 'Your party was legendary. The aftermath shouldn’t be your headache. Complete home restoration before your first coffee.',
    features: [
      { icon: Sparkles, title: 'Trash & Bottles Out', desc: 'Disposed & recycled' },
      { icon: Heart, title: 'Food Boxed & Chilled', desc: 'Neatly organized in fridge' },
      { icon: ShieldCheck, title: 'Vetted & Verified', desc: 'Discreet background-checked team' },
    ],
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, isLoggedIn }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto switch slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'var(--color-cream)',
        position: 'relative',
        overflow: 'hidden',
        padding: '16px 20px 32px',
      }}
    >
      {/* Background ambient warm radial glow - NO background images */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 90, 54, 0.1) 0%, rgba(250, 247, 242, 0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '-15%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 234, 230, 0.6) 0%, rgba(250, 247, 242, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ─── Top Header (Clean Brand + Login Button Only, NO Navbar) ─── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10,
          paddingTop: '6px',
        }}
      >
        <BrandLogo size={24} />

        {!isLoggedIn ? (
          <button
            onClick={onLogin}
            style={{
              padding: '8px 18px',
              borderRadius: 9999,
              border: '1.5px solid #0F172A',
              backgroundColor: 'transparent',
              color: '#0F172A',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              letterSpacing: '0.2px',
              transition: 'all 0.2s ease',
            }}
          >
            Log in
          </button>
        ) : (
          <button
            onClick={onGetStarted}
            style={{
              padding: '8px 16px',
              borderRadius: 9999,
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Go to App →
          </button>
        )}
      </div>

      {/* ─── Center Hero Content ─── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          marginTop: '32px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Category Pill Tag */}
        <div>
          <span
            style={{
              display: 'inline-block',
              fontSize: '10.5px',
              fontWeight: 800,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: '#FF5A36',
              backgroundColor: '#FFE8E2',
              padding: '6px 14px',
              borderRadius: 9999,
            }}
          >
            ✦ {slide.tag}
          </span>
        </div>

        {/* Large Bold Headline */}
        <h1
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '34px',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: '1.18',
            letterSpacing: '-0.8px',
            margin: 0,
            minHeight: '84px',
          }}
        >
          {slide.headline}
        </h1>

        {/* Descriptive Subtext */}
        <p
          style={{
            fontSize: '14.5px',
            lineHeight: '1.55',
            color: '#555048',
            margin: 0,
            minHeight: '66px',
          }}
        >
          {slide.subtext}
        </p>

        {/* 3 Feature Value Props */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '8px',
          }}
        >
          {slide.features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#FFFFFF',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  border: '1px solid #ECE7DE',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '12px',
                    backgroundColor: '#FFF1ED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color="#FF5A36" strokeWidth={2.2} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {feat.title}
                  </h4>
                  <p style={{ fontSize: '11px', color: '#7E7972', margin: 0, marginTop: 2 }}>
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide Indicator Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: currentSlide === i ? 26 : 8,
                height: 8,
                borderRadius: 9999,
                backgroundColor: currentSlide === i ? '#FF5A36' : '#D9D3C7',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* ─── Bottom CTA Section ─── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          marginTop: 'auto',
        }}
      >
        <button
          onClick={onGetStarted}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #FF7253 0%, #FF5A36 100%)',
            color: '#FFFFFF',
            borderRadius: 9999,
            fontWeight: 800,
            fontSize: '15.5px',
            letterSpacing: '0.8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 10px 28px rgba(255, 90, 54, 0.38)',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          <span style={{ fontSize: '16px' }}>✦</span>
          <span>RESET MY SPACE</span>
          <span style={{ fontSize: '18px', fontWeight: 900 }}>→</span>
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#716C64',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          <Clock size={13} color="#716C64" />
          <span>Book in under 1 min · No cleanup supplies needed</span>
        </div>
      </div>
    </div>
  );
};
