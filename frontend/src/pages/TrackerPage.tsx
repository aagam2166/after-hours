import React, { useState } from 'react';
import { ArrowLeft, Check, Phone, MessageSquare, Copy, Navigation, RefreshCw } from 'lucide-react';
import { bookingsApi, type BookingResponse } from '../api/bookings';

interface TrackerPageProps {
  booking: BookingResponse | null;
  onBack: () => void;
  onRefreshBooking: () => void;
  onOpenRating: () => void;
  onOpenSupport: () => void;
  onOpenIssueModal: () => void;
}

export const TrackerPage: React.FC<TrackerPageProps> = ({
  booking,
  onBack,
  onRefreshBooking,
  onOpenRating,
  onOpenSupport,
  onOpenIssueModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);

  if (!booking) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'var(--color-peach)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px',
        }}>
          <Navigation size={28} color="var(--color-coral)" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: 8 }}>
          No Active Reset Right Now
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
          When you book an After Hours crew, you can track live dispatch, view your Arrival PIN, and monitor completion here.
        </p>
        <button
          onClick={onBack}
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--color-coral)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          Book a Reset Now
        </button>
      </div>
    );
  }

  const arrivalPin = booking.arrivalPin || '4821';

  const copyPin = () => {
    navigator.clipboard.writeText(arrivalPin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { key: 'CONFIRMED', title: 'Booking confirmed', desc: "Your reset is booked. We'll keep you updated." },
    { key: 'CREW_ASSIGNED', title: 'Team assigned', desc: 'Your crew is ready.' },
    { key: 'CREW_ON_THE_WAY', title: 'On the way', desc: 'Your team is heading to your location.' },
    { key: 'RESET_IN_PROGRESS', title: 'Reset in progress', desc: 'Restoration is underway. Wake up to clean serenity.' },
    { key: 'COMPLETED', title: 'All done', desc: 'Your space is fully restored, ready for tomorrow.' },
  ];

  const statusOrder = ['DRAFT', 'CONFIRMED', 'CREW_ASSIGNED', 'CREW_ON_THE_WAY', 'CREW_ARRIVED', 'RESET_IN_PROGRESS', 'COMPLETED'];
  const currentIndex = statusOrder.indexOf(booking.status);

  // Status simulation handler
  const handleSimulateStatus = async (nextStatus: string) => {
    setSimulating(true);
    try {
      await bookingsApi.updateStatus(booking.id, nextStatus);
      await onRefreshBooking();
      if (nextStatus === 'COMPLETED') {
        onOpenRating();
      }
    } catch (err) {
      console.error('Failed to simulate status:', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div style={{ padding: '24px 24px 80px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      {/* Top Bar with Back */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--color-navy)',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <span style={{
          fontFamily: 'var(--font-hand)',
          color: 'var(--color-coral)',
          fontSize: '18px',
          fontWeight: 700,
        }}>
          Safe nights, smoother resets. ♡
        </span>
      </div>

      {/* Main Title & Status Pill */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 800,
          color: 'var(--color-navy)',
          letterSpacing: '-0.5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          <span>YOUR RESET</span>
          <span style={{ color: 'var(--color-coral)' }}>✦</span>
        </h1>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: booking.status === 'COMPLETED' ? 'var(--color-sage-bg)' : 'var(--color-peach)',
          color: booking.status === 'COMPLETED' ? 'var(--color-sage)' : 'var(--color-coral)',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          fontSize: '12px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginTop: 8,
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: booking.status === 'COMPLETED' ? 'var(--color-sage)' : 'var(--color-coral)',
            animation: booking.status !== 'COMPLETED' ? 'pulse 2s infinite' : 'none',
          }} />
          <span>{booking.status.replace(/_/g, ' ')}</span>
        </div>
      </div>

      {/* Grid for Desktop: 2-column if wide */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Left Column: Details & PIN Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Booking Overview Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--color-coral)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {booking.package?.displayName || 'Reset Service'}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', marginTop: 2 }}>
                  {booking.occasion || 'Private Gathering'}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {booking.guestCount || 20} guests • {booking.scheduledTime || 'Late Night'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)' }}>
                  ₹{(booking.total || 1999).toLocaleString()}
                </span>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: booking.paymentStatus === 'PAID' ? 'var(--color-sage)' : 'var(--color-coral)',
                }}>
                  ● {booking.paymentStatus === 'PAID' ? 'PAID' : 'PAY AFTER RESET'}
                </p>
              </div>
            </div>

            <div style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              backgroundColor: 'var(--color-cream)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
            }}>
              📍 {booking.address || 'Saved Address'}
            </div>
          </div>

          {/* Secure Entry PIN Card */}
          <div style={{
            backgroundColor: '#FFF8F5',
            borderRadius: '24px',
            padding: '22px',
            border: '1.5px solid #F6D6CC',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'center',
            position: 'relative',
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--color-coral)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              SECURE DOOR ENTRY
            </span>
            <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-navy)', marginTop: 2 }}>
              Your Arrival PIN
            </h4>

            {/* 4 Digit Boxes */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              margin: '16px 0',
            }}>
              {arrivalPin.split('').map((char, i) => (
                <div
                  key={i}
                  style={{
                    width: 48,
                    height: 54,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1.5px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 800,
                    color: 'var(--color-navy)',
                    boxShadow: '0 2px 6px rgba(17, 26, 53, 0.06)',
                  }}
                >
                  {char}
                </div>
              ))}
            </div>

            <button
              onClick={copyPin}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--color-navy)',
                border: '1px solid var(--color-border)',
                marginBottom: 10,
              }}
            >
              <Copy size={13} color="var(--color-coral)" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy PIN'}</span>
            </button>

            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              Share this PIN only when the crew arrives outside your door.
            </p>
          </div>

          {/* Crew Info Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '18px 20px',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'var(--color-navy)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '15px',
              }}>
                AH
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-navy)' }}>
                  After Hours Crew ✦
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-sage)', fontWeight: 600 }}>
                  ✓ Background Checked & Verified
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={onOpenSupport}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-peach)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Message Crew"
              >
                <MessageSquare size={16} color="var(--color-coral)" />
              </button>
              <button
                onClick={onOpenSupport}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-peach)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Call Dispatcher"
              >
                <Phone size={16} color="var(--color-coral)" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Status Stepper & Simulation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Stepper Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: 20 }}>
              Live Reset Journey
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
              {steps.map((st, i) => {
                const stepIdx = statusOrder.indexOf(st.key);
                const isPassed = currentIndex >= stepIdx;
                const isCurrent = booking.status === st.key;

                return (
                  <div key={st.key} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative' }}>
                    {/* Circle icon */}
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: isPassed ? (isCurrent ? 'var(--color-coral)' : 'var(--color-sage)') : '#F1ECE4',
                      color: isPassed ? '#FFFFFF' : '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 800,
                      flexShrink: 0,
                      zIndex: 2,
                    }}>
                      {isPassed ? <Check size={14} strokeWidth={3} /> : i + 1}
                    </div>

                    {/* Step details */}
                    <div>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: isPassed ? 'var(--color-navy)' : 'var(--color-text-muted)',
                      }}>
                        {st.title}
                      </h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: 2, lineHeight: 1.3 }}>
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Support & Report Issue buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={onOpenSupport}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--color-navy)',
              }}
            >
              Need Support?
            </button>
            <button
              onClick={onOpenIssueModal}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: 'var(--color-peach)',
                border: '1px solid #F6D6CC',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--color-coral)',
              }}
            >
              Report an Issue
            </button>
          </div>

          {/* Interactive Simulation / Test Bar */}
          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '20px',
            padding: '16px',
            border: '1px solid #E2E8F0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                Crew Simulation (Backend Demo)
              </span>
              {simulating && <RefreshCw size={12} className="spin" />}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {statusOrder.slice(1).map((st) => (
                <button
                  key={st}
                  onClick={() => handleSimulateStatus(st)}
                  disabled={simulating}
                  style={{
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    backgroundColor: booking.status === st ? 'var(--color-navy)' : '#FFFFFF',
                    color: booking.status === st ? '#FFFFFF' : '#334155',
                    border: '1px solid #CBD5E1',
                    cursor: 'pointer',
                  }}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
