import React from 'react';
import { User, MapPin, Clock, HelpCircle, AlertCircle, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MePageProps {
  onOpenAuth: () => void;
  onOpenPincode: () => void;
  onGoToHistory: () => void;
  onGoToHelp: () => void;
  onOpenIssueModal: () => void;
  currentCity: string;
  currentPincode: string;
}

export const MePage: React.FC<MePageProps> = ({
  onOpenAuth,
  onOpenPincode,
  onGoToHistory,
  onGoToHelp,
  onOpenIssueModal,
  currentCity,
  currentPincode,
}) => {
  const { user, logout } = useAuth();

  return (
    <div
      style={{
        padding: '16px 18px 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        backgroundColor: 'var(--color-cream)',
      }}
    >
      {/* ─── Profile Header Card ─── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '22px 18px',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
          border: '1px solid #ECE7DE',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: '#FFE8E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <User size={28} color="#FF5A36" strokeWidth={2.2} />
        </div>

        <div style={{ flex: 1 }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Host +91 {user.mobile.slice(-10)}
                </h3>
                <span
                  title="Verified Host"
                  style={{
                    backgroundColor: '#EAF5EE',
                    color: '#2D7A58',
                    padding: '2px 8px',
                    borderRadius: 9999,
                    fontSize: '10px',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <ShieldCheck size={11} /> Verified
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#7E7972', margin: '4px 0 0' }}>
                Account Active · After Hours Member
              </p>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Guest Explorer
              </h3>
              <p style={{ fontSize: '12px', color: '#7E7972', margin: '4px 0 0' }}>
                Log in to track resets & save locations
              </p>
            </>
          )}
        </div>

        {!user && (
          <button
            onClick={onOpenAuth}
            style={{
              padding: '8px 14px',
              borderRadius: 9999,
              backgroundColor: '#FF5A36',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 4px 12px rgba(255, 90, 54, 0.25)',
            }}
          >
            Log In
          </button>
        )}
      </div>

      {/* ─── Location & Service Area ─── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '16px 18px',
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
            marginBottom: '12px',
          }}
        >
          ACTIVE SERVICE LOCATION
        </p>
        <div
          onClick={onOpenPincode}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '12px',
                backgroundColor: '#F5F3EF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MapPin size={18} color="#0F172A" />
            </div>
            <div>
              <h4 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {currentCity} ({currentPincode})
              </h4>
              <p style={{ fontSize: '11.5px', color: '#2D7A58', fontWeight: 700, margin: '2px 0 0' }}>
                ✓ Serviceable Area
              </p>
            </div>
          </div>
          <ChevronRight size={16} color="#94A3B8" />
        </div>
      </div>

      {/* ─── Quick Actions & Settings ─── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
          border: '1px solid #ECE7DE',
          overflow: 'hidden',
        }}
      >
        <div
          onClick={onGoToHistory}
          style={{
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderBottom: '1px solid #F0ECE4',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Clock size={18} color="#FF5A36" />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
              My Resets History
            </span>
          </div>
          <ChevronRight size={16} color="#94A3B8" />
        </div>

        <div
          onClick={onGoToHelp}
          style={{
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderBottom: '1px solid #F0ECE4',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <HelpCircle size={18} color="#0F172A" />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
              Help & FAQs
            </span>
          </div>
          <ChevronRight size={16} color="#94A3B8" />
        </div>

        <div
          onClick={onOpenIssueModal}
          style={{
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderBottom: user ? '1px solid #F0ECE4' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertCircle size={18} color="#0F172A" />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
              Report an Issue
            </span>
          </div>
          <ChevronRight size={16} color="#94A3B8" />
        </div>

        {user && (
          <div
            onClick={logout}
            style={{
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <LogOut size={18} color="#EF4444" />
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#EF4444' }}>
                Log Out
              </span>
            </div>
            <ChevronRight size={16} color="#EF4444" />
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <p style={{ fontSize: '11px', color: '#8C877F' }}>
          After Hours v1.0 · Morning-After Home Reset
        </p>
      </div>
    </div>
  );
};
