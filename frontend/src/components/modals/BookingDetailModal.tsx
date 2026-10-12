import React from 'react';
import { X, Check, MapPin, Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import type { BookingResponse } from '../../api/bookings';

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingResponse | null;
  onRebook?: (pkgId?: string) => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  isOpen,
  onClose,
  booking,
  onRebook,
}) => {
  if (!isOpen || !booking) return null;

  const totalFormatted = (booking.total || 2999).toLocaleString('en-IN');
  const services = booking.selectedServices && booking.selectedServices.length > 0
    ? booking.selectedServices
    : ['TRASH', 'LEFTOVER_FOOD', 'DECORATIONS', 'FURNITURE_MESS', 'CLEANING'];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '26px',
          width: '100%',
          maxWidth: '440px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          border: '1px solid #ECE7DE',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          padding: '24px 20px',
          fontFamily: 'Manrope, sans-serif',
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#FF5A36', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              ✦ RESET RECEIPT & DETAILS
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#F5F3EF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Occasion & Status Banner */}
        <div
          style={{
            backgroundColor: '#FAF7F2',
            borderRadius: '18px',
            padding: '16px',
            border: '1px solid #EFEAE0',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#2D7A58',
                  backgroundColor: '#EAF5EE',
                  padding: '3px 8px',
                  borderRadius: 9999,
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: 6,
                }}
              >
                ✓ {booking.status.replace(/_/g, ' ')}
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {booking.occasion || 'Private Gathering'}
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0' }}>
                {booking.package?.displayName || 'Full Reset'}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A' }}>
                ₹{totalFormatted}
              </span>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#2D7A58', margin: '2px 0 0' }}>
                PAID IN FULL
              </p>
            </div>
          </div>
        </div>

        {/* Assigned Crew Specialist */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '12px 14px',
            border: '1px solid #ECE7DE',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: '#FFE8E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#FF5A36',
              fontSize: '16px',
              flexShrink: 0,
            }}
          >
            RK
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Ramesh Kumar
              </h4>
              <span style={{ fontSize: '11px', color: '#2D7A58', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                <ShieldCheck size={13} /> Verified
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0' }}>
              ⭐ 4.9 Rating (142 resets completed)
            </p>
          </div>
        </div>

        {/* Schedule & Location Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '13px', color: '#0F172A' }}>
            <Calendar size={16} color="#FF5A36" />
            <span style={{ fontWeight: 600 }}>
              {booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Sun, 11 Oct'} at {booking.scheduledTime || '7:00 AM'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '13px', color: '#0F172A' }}>
            <MapPin size={16} color="#FF5A36" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontWeight: 600 }}>
              {booking.address || 'Flat 402, Paldi, Ahmedabad'}
            </span>
          </div>
        </div>

        {/* Handled Tasks Checklist */}
        <div style={{ marginBottom: 18 }}>
          <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#8C877F', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10 }}>
            SERVICES COMPLETED
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {services.map((svc) => (
              <div
                key={svc}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: '#F5F3EF',
                  padding: '8px 10px',
                  borderRadius: 12,
                }}
              >
                <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#2D7A58', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={11} color="#FFFFFF" strokeWidth={3} />
                </div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A' }}>
                  {svc.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
          <button
            onClick={() => {
              onClose();
              if (onRebook) onRebook(booking.packageId);
            }}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #FF7253 0%, #FF5A36 100%)',
              color: '#FFFFFF',
              borderRadius: 9999,
              fontWeight: 800,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 6px 18px rgba(255, 90, 54, 0.35)',
            }}
          >
            <Sparkles size={16} />
            <span>Re-Book This Reset</span>
          </button>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: '#F5F3EF',
              color: '#0F172A',
              borderRadius: 9999,
              fontWeight: 700,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
