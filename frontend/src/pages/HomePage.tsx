import React, { useState, useEffect } from 'react';
import {
  Clock,
  ArrowRight,
  ClipboardList,
  Calendar,
  Home as HomeIcon,
} from 'lucide-react';
import { bookingsApi, type BookingResponse } from '../api/bookings';
import { BookingDetailModal } from '../components/modals/BookingDetailModal';

interface HomePageProps {
  onStartBooking: (pkgId?: string) => void;
  activeBooking: BookingResponse | null;
  onViewTracker: () => void;
  onViewAllResets?: () => void;
}

const defaultMockResets: BookingResponse[] = [
  {
    id: 'past-home-1',
    userId: 'demo',
    occasion: 'Saturday Night Bash',
    guestCount: 28,
    selectedServices: ['TRASH', 'LEFTOVER_FOOD', 'DECORATIONS', 'FURNITURE_MESS', 'CLEANING'],
    packageId: 'full-reset',
    package: {
      id: 'full-reset',
      name: 'FULL_RESET' as any,
      displayName: 'Full Reset',
      tagline: 'We handle everything.',
      description: 'Complete home restoration before morning brunch.',
      basePrice: 2999,
      services: ['TRASH', 'LEFTOVER_FOOD', 'DECORATIONS', 'FURNITURE_MESS', 'CLEANING'],
      sortOrder: 3,
      minGuests: 1,
      maxGuests: 200,
    },
    scheduledDate: '2026-10-11T00:00:00.000Z',
    scheduledTime: '07:00',
    address: 'Flat 402, Riverside Elegance, Paldi, Ahmedabad',
    pincode: '380006',
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    total: 2999,
    createdAt: '2026-10-11T01:00:00.000Z',
    updatedAt: '2026-10-11T09:00:00.000Z',
  },
  {
    id: 'past-home-2',
    userId: 'demo',
    occasion: 'Dinner & Drinks Night',
    guestCount: 14,
    selectedServices: ['TRASH', 'LEFTOVER_FOOD', 'CLEANING'],
    packageId: 'quick-reset',
    package: {
      id: 'quick-reset',
      name: 'QUICK_RESET' as any,
      displayName: 'Quick Reset',
      tagline: 'For the essentials.',
      description: 'Trash out, space cleared. The basics done fast.',
      basePrice: 1499,
      services: ['TRASH', 'LEFTOVER_FOOD', 'CLEANING'],
      sortOrder: 1,
      minGuests: 1,
      maxGuests: 100,
    },
    scheduledDate: '2026-10-04T00:00:00.000Z',
    scheduledTime: '09:00',
    address: 'Bungalow 12, Bodakdev, Ahmedabad',
    pincode: '380054',
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    total: 1499,
    createdAt: '2026-10-04T01:00:00.000Z',
    updatedAt: '2026-10-04T10:30:00.000Z',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  onStartBooking,
  activeBooking,
  onViewTracker,
  onViewAllResets,
}) => {
  const [pastResets, setPastResets] = useState<BookingResponse[]>(defaultMockResets);
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<BookingResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch real user bookings if any
  useEffect(() => {
    bookingsApi.getAll()
      .then((data) => {
        if (data && data.length > 0) {
          const completed = data.filter((b) => b.status === 'COMPLETED');
          if (completed.length > 0) {
            setPastResets(completed);
          }
        }
      })
      .catch(() => {
        // Fallback to sample resets
      });
  }, []);

  const openDetails = (b: BookingResponse) => {
    setSelectedBookingForModal(b);
    setIsDetailOpen(true);
  };

  return (
    <div
      style={{
        padding: '12px 16px 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: 'var(--color-cream)',
      }}
    >
      {/* Active Booking Banner (if ongoing) */}
      {activeBooking && activeBooking.status !== 'COMPLETED' && (
        <div
          onClick={onViewTracker}
          style={{
            backgroundColor: '#0F172A',
            borderRadius: '18px',
            padding: '14px 16px',
            color: '#FFFFFF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 8px #10B981',
              }}
            />
            <div>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94A3B8', fontWeight: 700 }}>
                Active Reset in Progress
              </p>
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginTop: 2 }}>
                Status: {activeBooking.status.replace(/_/g, ' ')}
              </h4>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '12px',
              fontWeight: 700,
              color: '#FF5A36',
            }}
          >
            <span>Track</span>
            <ArrowRight size={14} />
          </div>
        </div>
      )}

      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          borderRadius: '26px',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #FFF6EF 0%, #FFF0E5 40%, #F8F3EC 100%)',
          boxShadow: '0 2px 14px rgba(15, 23, 42, 0.04)',
          border: '1px solid #EFEAE0',
          padding: '24px 20px 20px',
        }}
      >
        {/* Ambient decorative blobs — pure CSS, no images */}
        <div style={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,90,54,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,90,54,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Floating icon cluster — top-right corner */}
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          pointerEvents: 'none',
        }}>
          {/* Balloon */}
          <img src="/icons/balloon.png" alt="" style={{ width: 36, height: 36, objectFit: 'contain', opacity: 0.85, transform: 'rotate(8deg)' }} />
          {/* Champagne */}
          <img src="/icons/champagne.png" alt="" style={{ width: 32, height: 32, objectFit: 'contain', opacity: 0.8, transform: 'rotate(-6deg)', alignSelf: 'flex-end' }} />
          {/* Magic wand */}
          <img src="/icons/magic-wand.png" alt="" style={{ width: 30, height: 30, objectFit: 'contain', opacity: 0.75, transform: 'rotate(12deg)' }} />
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Handwritten headline */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
            <h1
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '46px',
                fontWeight: 700,
                color: '#0F172A',
                lineHeight: '0.95',
                margin: 0,
                transform: 'rotate(-2deg)',
              }}
            >
              Hosting<br />tonight?
            </h1>
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: -24,
                color: '#FF5A36',
                fontSize: '24px',
                fontWeight: 900,
                transform: 'rotate(15deg)',
              }}
            >
              //
            </span>
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '15px',
              fontWeight: 700,
              color: '#0F172A',
              lineHeight: '1.4',
              marginBottom: 18,
              maxWidth: '220px',
            }}
          >
            Leave tomorrow morning to us.{' '}
            <span style={{ color: '#FF5A36', fontSize: '17px', fontWeight: 900 }}>♡</span>
          </p>

          {/* 4 Service Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'CLEAN', icon: '/icons/recycle-bin.png' },
              { label: 'PACK', icon: '/icons/leftovers.png' },
              { label: 'REMOVE', icon: '/icons/balloon.png' },
              { label: 'RESET', icon: '/icons/couch.png' },
            ].map((pill) => (
              <div
                key={pill.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  backgroundColor: 'rgba(255,255,255,0.65)',
                  borderRadius: 14,
                  padding: '6px 8px',
                  border: '1px solid rgba(255,90,54,0.12)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <img src={pill.icon} alt={pill.label} style={{ width: 18, height: 18, objectFit: 'contain' }} />
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#0F172A', letterSpacing: '0.4px' }}>
                  {pill.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => onStartBooking()}
            style={{
              width: '100%',
              padding: '15px 22px',
              background: 'linear-gradient(135deg, #FF7253 0%, #FF5A36 100%)',
              color: '#FFFFFF',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '15px',
              letterSpacing: '0.8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 24px rgba(255, 90, 54, 0.35)',
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
              justifyContent: 'center',
              gap: 5,
              marginTop: '8px',
              color: '#716C64',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            <Clock size={13} color="#716C64" />
            <span>Book in under 1 min</span>
          </div>
        </div>
      </div>

      {/* ─── HOW IT WORKS Section ─────────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '22px',
          padding: '18px 16px',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
          border: '1px solid #ECE7DE',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '1px',
            color: '#8C877F',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          HOW IT WORKS
        </p>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          {/* Step 1 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  backgroundColor: '#FFF1ED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ClipboardList size={22} color="#FF5A36" strokeWidth={2.2} />
              </div>
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -4,
                  width: 17,
                  height: 17,
                  borderRadius: '50%',
                  backgroundColor: '#FF5A36',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                1
              </span>
            </div>
            <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', marginTop: 10, lineHeight: 1.2 }}>
              Pick a reset
            </h4>
            <p style={{ fontSize: '10.5px', color: '#7E7972', marginTop: 4, lineHeight: 1.3, maxWidth: 95 }}>
              Choose the service that fits your party.
            </p>
          </div>

          {/* Connector Line 1 */}
          <div
            style={{
              width: 24,
              height: 1,
              borderTop: '1px dashed #D9D3C7',
              marginTop: 23,
            }}
          />

          {/* Step 2 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  backgroundColor: '#FFF1ED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Calendar size={22} color="#FF5A36" strokeWidth={2.2} />
              </div>
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -4,
                  width: 17,
                  height: 17,
                  borderRadius: '50%',
                  backgroundColor: '#FF5A36',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                2
              </span>
            </div>
            <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', marginTop: 10, lineHeight: 1.2 }}>
              Choose a time
            </h4>
            <p style={{ fontSize: '10.5px', color: '#7E7972', marginTop: 4, lineHeight: 1.3, maxWidth: 95 }}>
              Pick a date & time that works for you.
            </p>
          </div>

          {/* Connector Line 2 */}
          <div
            style={{
              width: 24,
              height: 1,
              borderTop: '1px dashed #D9D3C7',
              marginTop: 23,
            }}
          />

          {/* Step 3 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  backgroundColor: '#FFF1ED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HomeIcon size={22} color="#FF5A36" strokeWidth={2.2} />
              </div>
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -4,
                  width: 17,
                  height: 17,
                  borderRadius: '50%',
                  backgroundColor: '#FF5A36',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                3
              </span>
            </div>
            <h4 style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', marginTop: 10, lineHeight: 1.2 }}>
              Wake up to a fresh space
            </h4>
            <p style={{ fontSize: '10.5px', color: '#7E7972', marginTop: 4, lineHeight: 1.3, maxWidth: 95 }}>
              We handle the rest while you relax.
            </p>
          </div>
        </div>
      </div>

      {/* ─── PAST RESETS Section (Between HOW IT WORKS and WHAT WE HANDLE) ─── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '22px',
          padding: '18px 16px',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
          border: '1px solid #ECE7DE',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '1px',
                color: '#8C877F',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              PAST RESETS
            </p>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
              Recent aftermath turnarounds
            </p>
          </div>

          {onViewAllResets && (
            <button
              onClick={onViewAllResets}
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#FF5A36',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <span>See all</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pastResets.map((b) => (
            <div
              key={b.id}
              style={{
                backgroundColor: '#FAF7F2',
                borderRadius: '16px',
                padding: '14px',
                border: '1px solid #EFEAE0',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {b.occasion || 'Private Gathering'}
                  </h4>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0' }}>
                    {b.package?.displayName || 'Full Reset'} · ₹{(b.total || 2999).toLocaleString('en-IN')}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    backgroundColor: '#EAF5EE',
                    color: '#2D7A58',
                  }}
                >
                  ✓ COMPLETED
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #EAE5DC' }}>
                <span style={{ fontSize: '11.5px', color: '#7E7972' }}>
                  {b.address ? b.address.split(',')[0] : 'Paldi, Ahmedabad'}
                </span>
                <button
                  onClick={() => openDetails(b)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 9999,
                    backgroundColor: '#FFF1ED',
                    color: '#FF5A36',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>View Details</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── WHAT WE HANDLE Section ──────────────────────────────── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '22px',
          padding: '18px 16px',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
          border: '1px solid #ECE7DE',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '1px',
            color: '#8C877F',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          WHAT WE HANDLE
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* 1. Waste */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#F5F3EF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/icons/recycle-bin.png"
                alt="Waste"
                style={{ width: 24, height: 24, objectFit: 'contain' }}
              />
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#555048' }}>
              Waste
            </span>
          </div>

          {/* 2. Leftovers */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#F5F3EF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/icons/leftovers.png"
                alt="Leftovers"
                style={{ width: 24, height: 24, objectFit: 'contain' }}
              />
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#555048' }}>
              Leftovers
            </span>
          </div>

          {/* 3. Decorations */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#F5F3EF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/icons/balloon.png"
                alt="Decorations"
                style={{ width: 24, height: 24, objectFit: 'contain' }}
              />
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#555048' }}>
              Decorations
            </span>
          </div>

          {/* 4. Furniture */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#F5F3EF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/icons/couch.png"
                alt="Furniture"
                style={{ width: 24, height: 24, objectFit: 'contain' }}
              />
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#555048' }}>
              Furniture
            </span>
          </div>

          {/* 5. Cleaning */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#F5F3EF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/icons/cleaning.png"
                alt="Cleaning"
                style={{ width: 24, height: 24, objectFit: 'contain' }}
              />
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#555048' }}>
              Cleaning
            </span>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      <BookingDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        booking={selectedBookingForModal}
        onRebook={(pkgId) => onStartBooking(pkgId)}
      />
    </div>
  );
};
