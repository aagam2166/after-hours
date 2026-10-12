import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { BottomNav, type TabType } from './components/layout/BottomNav';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { BookingWizardPage } from './pages/BookingWizardPage';
import { TrackerPage } from './pages/TrackerPage';
import { ResetsHistoryPage } from './pages/ResetsHistoryPage';
import { HelpSupportPage } from './pages/HelpSupportPage';
import { AuthModal } from './components/modals/AuthModal';
import { PincodeModal } from './components/modals/PincodeModal';
import { RatingModal } from './components/modals/RatingModal';
import { IssueModal } from './components/modals/IssueModal';
import { bookingsApi, type BookingResponse } from './api/bookings';

import { MePage } from './pages/MePage';

const MainApp: React.FC = () => {
  const { user, logout, isLoading } = useAuth();

  // Screen state: 'landing' | tab name
  const [view, setView] = useState<'landing' | TabType>('landing');
  const [activeBooking, setActiveBooking] = useState<BookingResponse | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>(undefined);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPincodeOpen, setIsPincodeOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Dev panel
  const [devPanelOpen, setDevPanelOpen] = useState(false);

  // Location state
  const [currentPincode, setCurrentPincode] = useState('380006'); // Ahmedabad Paldi default
  const [currentCity, setCurrentCity] = useState('Ahmedabad');

  // When user logs in and we're still on landing, go to home
  useEffect(() => {
    if (!isLoading && user && view === 'landing') {
      setView('home');
    }
  }, [user, isLoading]);

  // Load user's latest active booking
  const loadLatestBooking = async () => {
    if (!user) {
      setActiveBooking(null);
      return;
    }
    try {
      const list = await bookingsApi.getAll();
      if (list && list.length > 0) {
        const inProgress = list.find((b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');
        setActiveBooking(inProgress || list[0]);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    }
  };

  useEffect(() => {
    loadLatestBooking();
  }, [user]);

  const goToTab = (tab: TabType) => {
    setView(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartBooking = (pkgId?: string) => {
    setSelectedPackageId(pkgId);
    goToTab('book');
  };

  const handleBookingConfirmed = (newBooking: BookingResponse) => {
    setActiveBooking(newBooking);
    goToTab('tracker');
  };

  const handleLandingCTA = () => {
    if (user) {
      goToTab('home');
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    loadLatestBooking();
    goToTab('home');
  };

  if (view === 'landing') {
    return (
      <>
        <LandingPage
          onGetStarted={handleLandingCTA}
          onLogin={() => setIsAuthOpen(true)}
          isLoggedIn={Boolean(user)}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />

        {/* Dev floating button */}
        <button
          onClick={() => setDevPanelOpen((p) => !p)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: '#0F172A',
            color: '#F8FAFC',
            border: '1px solid #334155',
            borderRadius: 12,
            padding: '8px 14px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          🛠 Dev
        </button>
        {devPanelOpen && <DevPanel onClose={() => setDevPanelOpen(false)} onLoginSuccess={handleAuthSuccess} onSkip={() => goToTab('home')} />}
      </>
    );
  }

  const activeTab = view as TabType;

  return (
    <>
      <Header
        onSelectTab={(tab) => goToTab(tab)}
        onOpenPincodeModal={() => setIsPincodeOpen(true)}
        currentCity={currentCity}
        onOpenNotifications={() => {
          setNotificationMsg(
            activeBooking && activeBooking.status !== 'COMPLETED'
              ? `Reset update: Status is ${activeBooking.status.replace(/_/g, ' ')}`
              : 'No new alerts. Your scheduled resets will notify you here.'
          );
        }}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'home' && (
          <HomePage
            onStartBooking={handleStartBooking}
            activeBooking={activeBooking}
            onViewTracker={() => goToTab('tracker')}
            onViewAllResets={() => goToTab('resets')}
          />
        )}

        {activeTab === 'resets' && (
          activeBooking && activeBooking.status !== 'COMPLETED' ? (
            <TrackerPage
              booking={activeBooking}
              onBack={() => goToTab('home')}
              onRefreshBooking={loadLatestBooking}
              onOpenRating={() => setIsRatingOpen(true)}
              onOpenSupport={() => goToTab('help')}
              onOpenIssueModal={() => setIsIssueOpen(true)}
            />
          ) : (
            <ResetsHistoryPage
              onStartBooking={handleStartBooking}
              onRequireAuth={() => setIsAuthOpen(true)}
            />
          )
        )}

        {activeTab === 'me' && (
          <MePage
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenPincode={() => setIsPincodeOpen(true)}
            onGoToHistory={() => goToTab('resets')}
            onGoToHelp={() => goToTab('help')}
            onOpenIssueModal={() => setIsIssueOpen(true)}
            currentCity={currentCity}
            currentPincode={currentPincode}
          />
        )}

        {activeTab === 'book' && (
          <BookingWizardPage
            initialPackageId={selectedPackageId}
            currentPincode={currentPincode}
            onCancel={() => goToTab('home')}
            onBookingConfirmed={handleBookingConfirmed}
            onRequireAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === 'tracker' && (
          <TrackerPage
            booking={activeBooking}
            onBack={() => goToTab('home')}
            onRefreshBooking={loadLatestBooking}
            onOpenRating={() => setIsRatingOpen(true)}
            onOpenSupport={() => goToTab('help')}
            onOpenIssueModal={() => setIsIssueOpen(true)}
          />
        )}

        {activeTab === 'help' && (
          <HelpSupportPage
            onBack={() => goToTab('home')}
            onOpenIssueModal={() => setIsIssueOpen(true)}
          />
        )}
      </main>

      {/* 3-Item Bottom Nav */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => goToTab(tab)}
      />

      {/* Notification Toast Modal */}
      {notificationMsg && (
        <div
          onClick={() => setNotificationMsg(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10001,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: '20px 22px',
              maxWidth: 320,
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔔</div>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
              Notifications
            </h4>
            <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.4, marginBottom: 16 }}>
              {notificationMsg}
            </p>
            <button
              onClick={() => setNotificationMsg(null)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 9999,
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <PincodeModal
        isOpen={isPincodeOpen}
        onClose={() => setIsPincodeOpen(false)}
        currentPincode={currentPincode}
        onSelectPincode={(pin, city) => {
          setCurrentPincode(pin);
          setCurrentCity(city);
        }}
      />

      <RatingModal
        isOpen={isRatingOpen}
        bookingId={activeBooking?.id}
        onClose={() => setIsRatingOpen(false)}
        onRated={() => loadLatestBooking()}
      />

      <IssueModal
        isOpen={isIssueOpen}
        bookingId={activeBooking?.id}
        onClose={() => setIsIssueOpen(false)}
      />

      {/* Dev floating button */}
      <button
        onClick={() => setDevPanelOpen((p) => !p)}
        title="Developer Panel"
        style={{
          position: 'fixed',
          bottom: 74,
          right: 20,
          zIndex: 9999,
          background: '#0F172A',
          color: '#F8FAFC',
          border: '1px solid #334155',
          borderRadius: 12,
          padding: '8px 14px',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        🛠 Dev
      </button>
      {devPanelOpen && (
        <DevPanel
          onClose={() => setDevPanelOpen(false)}
          onLoginSuccess={handleAuthSuccess}
          onSkip={() => { setDevPanelOpen(false); }}
          extraActions={[
            { label: '→ Landing', onClick: () => { setView('landing'); setDevPanelOpen(false); } },
            { label: '→ Home', onClick: () => { goToTab('home'); setDevPanelOpen(false); } },
            { label: '→ Resets', onClick: () => { goToTab('resets'); setDevPanelOpen(false); } },
            { label: '→ Me', onClick: () => { goToTab('me'); setDevPanelOpen(false); } },
            { label: '→ Book Wizard', onClick: () => { goToTab('book'); setDevPanelOpen(false); } },
            { label: '→ Tracker', onClick: () => { goToTab('tracker'); setDevPanelOpen(false); } },
            { label: '→ Help', onClick: () => { goToTab('help'); setDevPanelOpen(false); } },
            { label: '🔐 Auth Modal', onClick: () => { setIsAuthOpen(true); setDevPanelOpen(false); } },
            { label: '📍 Pincode Modal', onClick: () => { setIsPincodeOpen(true); setDevPanelOpen(false); } },
            ...(user ? [{ label: '🚪 Logout', onClick: () => { logout(); setView('landing'); setDevPanelOpen(false); } }] : []),
          ]}
        />
      )}
    </>
  );
};

// ─── Floating Developer Panel ─────────────────────────────────────────────────
interface DevAction { label: string; onClick: () => void; }
interface DevPanelProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  onSkip?: () => void;
  extraActions?: DevAction[];
}

const DevPanel: React.FC<DevPanelProps> = ({ onClose, onLoginSuccess, onSkip, extraActions = [] }) => {
  const { sendOtp, verifyOtp, user } = useAuth();
  const [status, setStatus] = useState<string>('');

  const quickLogin = async () => {
    setStatus('⚡ Logging in...');
    try {
      const res = await sendOtp('9876543210');
      const otp = res.mockCode || '1234';
      const ok = await verifyOtp('9876543210', otp);
      if (ok) {
        setStatus('✅ Logged in!');
        setTimeout(() => { onClose(); onLoginSuccess(); }, 600);
      } else {
        setStatus('❌ Login failed');
      }
    } catch (e: any) {
      setStatus(`❌ ${e?.message || 'Error'}`);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 68,
        right: 24,
        zIndex: 10000,
        background: '#0F172A',
        border: '1px solid #334155',
        borderRadius: 16,
        padding: '16px 18px',
        minWidth: 240,
        boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
        color: '#F8FAFC',
        fontFamily: 'Manrope, sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontWeight: 800, fontSize: 13 }}>🛠 Developer Panel</span>
        <button onClick={onClose} style={{ color: '#94A3B8', fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>×</button>
      </div>

      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 10 }}>
        {user ? `✅ Logged in: ${user.mobile}` : '⚪ Not logged in'}
      </div>

      {/* Quick Login */}
      {!user && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
          <button
            onClick={quickLogin}
            style={{
              width: '100%',
              padding: '9px 12px',
              background: '#FF6B4A',
              color: '#fff',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 12,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ⚡ Quick Login (9876543210 / 1234)
          </button>
          {onSkip && (
            <button
              onClick={() => {
                onClose();
                onSkip();
              }}
              style={{
                width: '100%',
                padding: '7px 10px',
                background: '#334155',
                color: '#CBD5E1',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 11,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              👀 Skip to Home
            </button>
          )}
        </div>
      )}

      {status && (
        <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 8, textAlign: 'center' }}>{status}</div>
      )}

      {/* Navigation shortcuts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {extraActions.map(({ label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            style={{
              padding: '7px 10px',
              background: '#1E293B',
              color: '#CBD5E1',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 11,
              border: '1px solid #334155',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12, fontSize: 10, color: '#475569', textAlign: 'center' }}>
        Mock OTP: 1234 · Backend: :4000 · Frontend: :5173
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
