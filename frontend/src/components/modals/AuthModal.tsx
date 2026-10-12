import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { sendOtp, verifyOtp } = useAuth();
  const [mobile, setMobile] = useState('9876543210');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [loading, setLoading] = useState(false);
  const [mockCodeHint, setMockCodeHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devLoading, setDevLoading] = useState(false);

  if (!isOpen) return null;

  // ⚡ DEV QUICK LOGIN: sends OTP then immediately verifies with mock code
  const handleDevQuickLogin = async () => {
    setError(null);
    setDevLoading(true);
    try {
      const res = await sendOtp('9876543210');
      const otp = res.mockCode || '1234';
      const success = await verifyOtp('9876543210', otp);
      if (success) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError('Dev login failed — check backend is running');
      }
    } catch (err: any) {
      setError(err?.message || 'Dev login failed');
    } finally {
      setDevLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await sendOtp(mobile);
      if (res.mockCode) {
        setMockCodeHint(res.mockCode);
        setCode(res.mockCode); // Auto-fill for seamless dev testing
      }
      setStep('OTP');
    } catch (err: any) {
      setError(err?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const success = await verifyOtp(mobile, code);
      if (success) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setError('Invalid OTP code');
      }
    } catch (err: any) {
      setError(err?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            color: 'var(--color-text-muted)',
            padding: 4,
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <img
            src="/after-hours-logo.png"
            alt="After Hours"
            style={{ height: '36px', marginBottom: '8px', objectFit: 'contain' }}
          />
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)' }}>
            {step === 'MOBILE' ? 'Welcome to After Hours' : 'Verify Mobile'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {step === 'MOBILE'
              ? 'Enter your mobile number to book your reset crew.'
              : `Enter the 4-digit code sent to +91 ${mobile}`}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: '#FEE2E2',
            color: '#B91C1C',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            marginBottom: '14px',
          }}>
            {error}
          </div>
        )}

        {step === 'MOBILE' ? (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-navy)', marginBottom: 6 }}>
                Mobile Number
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                backgroundColor: 'var(--color-cream)',
              }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)', marginRight: 8 }}>+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: '15px',
                    fontWeight: 600,
                    width: '100%',
                    color: 'var(--color-navy)',
                  }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || mobile.length < 10}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'var(--color-coral)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading || mobile.length < 10 ? 0.7 : 1,
              }}
            >
              {loading ? 'Sending OTP...' : (
                <>
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: 16 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-navy)' }}>
                  4-Digit OTP
                </label>
                {mockCodeHint && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--color-sage)',
                    backgroundColor: 'var(--color-sage-bg)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    Mock Code: {mockCodeHint}
                  </span>
                )}
              </div>

              <input
                type="text"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="1234"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  letterSpacing: '12px',
                  fontSize: '22px',
                  fontWeight: 800,
                  padding: '12px',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-cream)',
                  color: 'var(--color-navy)',
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 4}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'var(--color-navy)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading || code.length !== 4 ? 0.7 : 1,
              }}
            >
              {loading ? 'Verifying...' : (
                <>
                  <ShieldCheck size={18} />
                  <span>Verify & Proceed</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('MOBILE')}
              style={{
                display: 'block',
                width: '100%',
                marginTop: 12,
                fontSize: '12px',
                color: 'var(--color-text-muted)',
                textAlign: 'center',
              }}
            >
              Change Mobile Number
            </button>
          </form>
        )}

        {/* ─── DEV QUICK LOGIN BANNER ──────────────────── */}
        <div style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px dashed #E7E0D9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', color: '#94A3B8', textTransform: 'uppercase' }}>
            🛠 Dev Mode
          </span>
          <button
            type="button"
            onClick={handleDevQuickLogin}
            disabled={devLoading}
            style={{
              width: '100%',
              padding: '11px 14px',
              backgroundColor: devLoading ? '#E2E8F0' : '#0F172A',
              color: '#F8FAFC',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              border: '1px solid #1E293B',
              cursor: devLoading ? 'wait' : 'pointer',
              transition: 'opacity 0.15s',
            }}
          >
            {devLoading ? '⚡ Signing in...' : '⚡ Quick Login as Test User'}
          </button>
          <p style={{ fontSize: '10px', color: '#94A3B8', textAlign: 'center', lineHeight: 1.4 }}>
            Phone: 9876543210 · OTP: 1234 (mock mode)
          </p>
        </div>
      </div>
    </div>
  );
};
