import React, { useState } from 'react';
import { X } from 'lucide-react';
import { bookingsApi } from '../../api/bookings';

interface RatingModalProps {
  isOpen: boolean;
  bookingId?: string;
  onClose: () => void;
  onRated?: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  bookingId,
  onClose,
  onRated,
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(4);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const ratingOptions = [
    { score: 1, label: 'Not great' as const, emoji: '😞' },
    { score: 2, label: 'Okay' as const, emoji: '😐' },
    { score: 3, label: 'Good' as const, emoji: '🙂' },
    { score: 4, label: 'Great' as const, emoji: '😍' },
    { score: 5, label: 'Amazing' as const, emoji: '🤩' },
  ];

  const currentOption = ratingOptions.find((r) => r.score === selectedRating) || ratingOptions[3];

  const handleSubmit = async () => {
    if (!bookingId) {
      onClose();
      return;
    }
    setSubmitting(true);
    try {
      await bookingsApi.rate(bookingId, {
        score: selectedRating,
        label: currentOption.label,
        feedback: feedback.trim() || undefined,
      });
      if (onRated) onRated();
      onClose();
    } catch (err) {
      console.error('Failed to submit rating:', err);
      onClose();
    } finally {
      setSubmitting(false);
    }
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
        maxWidth: '420px',
        backgroundColor: '#FFFFFF',
        borderRadius: '28px',
        padding: '28px 24px',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        textAlign: 'center',
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

        <span style={{
          fontFamily: 'var(--font-hand)',
          color: 'var(--color-coral)',
          fontSize: '20px',
          fontWeight: 700,
          display: 'block',
          marginBottom: 4,
        }}>
          You party. We handle the rest. ♡
        </span>

        <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-navy)', letterSpacing: '-0.5px' }}>
          Worth the sleep-in?
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: 4, marginBottom: 24 }}>
          How'd our reset crew do tonight?
        </p>

        {/* 5 Emoji faces */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 8,
          marginBottom: 24,
        }}>
          {ratingOptions.map((opt) => {
            const isSelected = selectedRating === opt.score;
            return (
              <button
                key={opt.score}
                type="button"
                onClick={() => setSelectedRating(opt.score)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 8px',
                  borderRadius: '16px',
                  backgroundColor: isSelected ? 'var(--color-peach)' : 'transparent',
                  border: isSelected ? '1.5px solid #F6D6CC' : '1px solid transparent',
                  transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  flex: 1,
                }}
              >
                <span style={{ fontSize: '28px' }}>{opt.emoji}</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: isSelected ? 800 : 500,
                  color: isSelected ? 'var(--color-navy)' : 'var(--color-text-muted)',
                  whiteSpace: 'nowrap',
                }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Comment box */}
        <div style={{ textAlign: 'left', marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 6 }}>
            Anything we should know? <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(Optional)</span>
          </label>
          <div style={{
            position: 'relative',
            border: '1.5px solid var(--color-border)',
            borderRadius: '16px',
            backgroundColor: 'var(--color-cream)',
            padding: '12px',
          }}>
            <textarea
              maxLength={300}
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="The kitchen was spotless! Loved how you boxed the leftover pizza..."
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                resize: 'none',
                fontSize: '13px',
                color: 'var(--color-navy)',
                lineHeight: 1.4,
              }}
            />
            <div style={{
              textAlign: 'right',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              marginTop: 4,
            }}>
              {feedback.length}/300
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: 'var(--color-coral)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '15px',
            boxShadow: 'var(--shadow-float)',
          }}
        >
          {submitting ? 'Submitting...' : 'DONE →'}
        </button>

        <p style={{
          marginTop: 14,
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-hand)',
          fontSize: '14px',
        }}>
          Clean spaces. Brighter tomorrows. ♡
        </p>
      </div>
    </div>
  );
};
