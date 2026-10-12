import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface IssueModalProps {
  isOpen: boolean;
  bookingId?: string;
  onClose: () => void;
}

export const IssueModal: React.FC<IssueModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedIssue, setSelectedIssue] = useState('Cleaning issue');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const issueTypes = [
    'Cleaning issue',
    'Item misplaced',
    'Damage concern',
    'Missing item',
    'Food packing issue',
    'Other issue',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(17, 26, 53, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#FFFFFF',
        borderRadius: '28px',
        padding: '28px 24px',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
      }}>
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

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'var(--color-sage-bg)',
              color: 'var(--color-sage)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: 8 }}>
              Report Received
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              Our operations supervisor will review this and contact you immediately to make things right.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <span style={{
              fontFamily: 'var(--font-hand)',
              color: 'var(--color-coral)',
              fontSize: '18px',
              fontWeight: 700,
            }}>
              We're here to fix it. ♡
            </span>

            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-navy)', marginTop: 2, marginBottom: 6 }}>
              Report an issue
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: 18 }}>
              Let us know what went wrong and our dispatch team will sort it out.
            </p>

            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 8 }}>
              What's the issue?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 18 }}>
              {issueTypes.map((type) => {
                const isSelected = selectedIssue === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedIssue(type)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: isSelected ? 700 : 500,
                      backgroundColor: isSelected ? 'var(--color-peach)' : 'var(--color-cream)',
                      border: isSelected ? '1.5px solid #F6D6CC' : '1px solid var(--color-border)',
                      color: isSelected ? 'var(--color-navy)' : 'var(--color-text-muted)',
                      textAlign: 'left',
                    }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 6 }}>
              Tell us more
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--color-cream)',
                fontSize: '13px',
                resize: 'none',
                marginBottom: 20,
              }}
              required
            />

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: 'var(--color-coral)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '14px',
                boxShadow: 'var(--shadow-float)',
              }}
            >
              Submit Issue →
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
