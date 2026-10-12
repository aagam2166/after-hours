import React, { useEffect, useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { bookingsApi, type BookingResponse } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import { BookingDetailModal } from '../components/modals/BookingDetailModal';

interface ResetsHistoryPageProps {
  onStartBooking: (pkgId?: string) => void;
  onRequireAuth: () => void;
}

const sampleBookings: BookingResponse[] = [
  {
    id: 'sample-1',
    userId: 'user-demo',
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
    id: 'sample-2',
    userId: 'user-demo',
    occasion: 'Dinner & Wine Night',
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

export const ResetsHistoryPage: React.FC<ResetsHistoryPageProps> = ({
  onStartBooking,
  onRequireAuth,
}) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setBookings(sampleBookings);
      return;
    }
    bookingsApi.getAll()
      .then((data) => {
        if (data && data.length > 0) {
          setBookings(data);
        } else {
          setBookings(sampleBookings);
        }
      })
      .catch((err) => {
        console.error('Failed to load past resets:', err);
        setBookings(sampleBookings);
      });
  }, [user]);

  const handleOpenDetails = (b: BookingResponse) => {
    setSelectedBooking(b);
    setIsDetailModalOpen(true);
  };

  return (
    <div style={{ padding: '16px 18px 80px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span
            style={{
              fontFamily: 'Caveat, cursive',
              color: '#FF7A59',
              fontSize: '16px',
              fontWeight: 700,
              display: 'block',
            }}
          >
            Good Nights Cleaner Mornings ♡
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px', margin: '2px 0 0' }}>
            My Resets
          </h1>
        </div>

        <button
          onClick={() => onStartBooking()}
          style={{
            padding: '10px 18px',
            backgroundColor: '#FF5A36',
            color: '#FFFFFF',
            borderRadius: 9999,
            fontSize: '13px',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 4px 14px rgba(255, 90, 54, 0.3)',
          }}
        >
          <Sparkles size={14} />
          <span>New Reset</span>
        </button>
      </div>

      {/* Guest Notice (if unauthenticated) */}
      {!user && (
        <div
          style={{
            backgroundColor: '#FFF4EE',
            borderRadius: 16,
            padding: '12px 14px',
            border: '1px solid #FFE0D3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Viewing Demo History
            </p>
            <p style={{ fontSize: '11px', color: '#7E7972', margin: '2px 0 0' }}>
              Log in to sync your verified receipts & bookings.
            </p>
          </div>
          <button
            onClick={onRequireAuth}
            style={{
              padding: '6px 14px',
              borderRadius: 9999,
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
            }}
          >
            Log In
          </button>
        </div>
      )}

      {/* List of Resets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bookings.map((b) => (
          <div
            key={b.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: '16px 18px',
              border: '1px solid #ECE7DE',
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    color: '#FF5A36',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                  }}
                >
                  {b.package?.displayName || 'Reset Service'}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '2px 0 0' }}>
                  {b.occasion || 'Gathering'}
                </h3>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 9px',
                  borderRadius: 9999,
                  backgroundColor: b.status === 'COMPLETED' ? '#EAF5EE' : '#FFF4EE',
                  color: b.status === 'COMPLETED' ? '#2D7A58' : '#FF5A36',
                }}
              >
                ✓ {b.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '12px', color: '#64748B' }}>
              <span>👥 {b.guestCount || 20} guests</span>
              <span>·</span>
              <span>🕒 {b.scheduledTime || '7:00 AM'}</span>
              <span>·</span>
              <span>📍 {b.address ? b.address.split(',')[0] : 'Paldi'}</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 10,
                borderTop: '1px solid #F0ECE4',
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>
                ₹{(b.total || 2999).toLocaleString('en-IN')}
              </span>

              <button
                onClick={() => handleOpenDetails(b)}
                style={{
                  padding: '7px 14px',
                  backgroundColor: '#FFF1ED',
                  color: '#FF5A36',
                  borderRadius: 9999,
                  fontSize: '12px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s ease',
                }}
              >
                <span>View Details</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Details Modal */}
      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        booking={selectedBooking}
        onRebook={(pkgId) => onStartBooking(pkgId)}
      />
    </div>
  );
};
