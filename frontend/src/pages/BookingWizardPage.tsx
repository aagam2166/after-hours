import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  Camera,
  Building,
  Building2,
  Home,
  Tent,
  HelpCircle,
  Edit2,
  Plus,
  Users,
  Cake,
  Utensils,
  PartyPopper,
  Heart,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BrandLogo } from '../components/common/BrandLogo';
import { packagesApi, type PackageItem } from '../api/packages';
import { bookingsApi, type BookingResponse } from '../api/bookings';
import { useAuth } from '../context/AuthContext';

interface BookingWizardPageProps {
  initialPackageId?: string;
  onCancel: () => void;
  onBookingConfirmed: (booking: BookingResponse) => void;
  onRequireAuth: () => void;
  currentPincode: string;
}

export const BookingWizardPage: React.FC<BookingWizardPageProps> = ({
  initialPackageId,
  onCancel,
  onBookingConfirmed,
  onRequireAuth,
  currentPincode,
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ─── Wizard Answers State ──────────────────────────────────────────
  // 1. Occasion
  const [occasion, setOccasion] = useState<string>('Birthday');

  // 2. Guest Count
  const [guestTier, setGuestTier] = useState<string>('1 - 30');
  const [customGuests, setCustomGuests] = useState<number>(20);

  // 3. Space Size
  const [spaceSize, setSpaceSize] = useState<string>('Small apartment');

  // 5. Chores / What's waiting
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'TRASH',
    'LEFTOVER_FOOD',
    'DECORATIONS',
    'GIFTS_AND_STUFF',
    'FURNITURE_MESS',
    'CLEANING',
  ]);
  const [isEverythingSelected, setIsEverythingSelected] = useState(true);

  // 6. Selected Package
  const [selectedPackageId, setSelectedPackageId] = useState<string>(initialPackageId || '');
  const [showAllPackages, setShowAllPackages] = useState(false);

  // 7. Time & Slot
  const [selectedDateMode, setSelectedDateMode] = useState<'tonight' | 'tomorrow'>('tomorrow');
  const [scheduledTime, setScheduledTime] = useState<string>('07:00');

  // 8. Location & Address in Ahmedabad
  const [selectedArea, setSelectedArea] = useState('Paldi');
  const [pincode, setPincode] = useState(currentPincode || '380006');
  const [flatNumber, setFlatNumber] = useState('Flat 402, Block B');
  const [building, setBuilding] = useState('Riverside Elegance, Paldi');
  const [landmark, setLandmark] = useState('Near NID Ground');

  // 9. Anything we should know
  const [quietProtocol, setQuietProtocol] = useState(true);
  const [petStatus, setPetStatus] = useState<'none' | 'friendly' | 'kept_in_room'>('none');
  const [foodNotes, setFoodNotes] = useState('Food boxes in fridge, please don’t discard sealed alcohol');
  const [doNotTouch, setDoNotTouch] = useState('Record player on side table');

  // Load packages from backend
  useEffect(() => {
    packagesApi.getAll().then((data) => {
      setPackages(data);
      if (!selectedPackageId && data.length > 0) {
        const full = data.find((p) => p.name === 'FULL_RESET') || data[0];
        setSelectedPackageId(full.id);
      }
    });
  }, []);

  // Compute recommended package based on chores and space
  const getRecommendedPackage = () => {
    if (!packages || packages.length === 0) return null;
    if (isEverythingSelected || selectedServices.length >= 5 || spaceSize === 'Venue' || spaceSize === 'Bungalow') {
      return packages.find((p) => p.name === 'FULL_RESET') || packages[0];
    }
    if (selectedServices.length >= 3) {
      return packages.find((p) => p.name === 'CUSTOM_RESET') || packages[0];
    }
    return packages.find((p) => p.name === 'QUICK_RESET') || packages[0];
  };

  const activePackage = packages.find((p) => p.id === selectedPackageId) || getRecommendedPackage();

  // Price estimate calculation
  const calculateTotal = () => {
    const base = activePackage ? activePackage.basePrice : 2999;
    const guestCountNum = guestTier === 'Custom' ? customGuests : guestTier === '61 - 100' ? 80 : guestTier === '31 - 60' ? 45 : 20;
    const guestExtra = guestCountNum > 30 ? (guestCountNum - 30) * 35 : 0;
    const spaceExtra = spaceSize === 'Bungalow' ? 500 : spaceSize === 'Venue' ? 800 : spaceSize === 'Large apartment' ? 300 : 0;
    const lateNightFee = scheduledTime === '23:30' || scheduledTime === '01:00' ? 250 : 0;
    return base + guestExtra + spaceExtra + lateNightFee;
  };

  const showComingSoon = (msg = '📸 Photo upload is coming soon! You can skip this step.') => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const nextStep = () => {
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    if (step === 1) {
      onCancel();
    } else {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      onRequireAuth();
      return;
    }

    setSubmitting(true);
    try {
      const scheduledDate = new Date();
      if (selectedDateMode === 'tomorrow') {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }
      const dateStr = scheduledDate.toISOString().split('T')[0];

      const guestCountNum = guestTier === 'Custom' ? customGuests : guestTier === '61 - 100' ? 80 : guestTier === '31 - 60' ? 45 : 20;

      // 1. Create draft
      const draft = await bookingsApi.createDraft();

      // 2. Update draft with comprehensive answers
      await bookingsApi.updateDraft(draft.id, {
        occasion,
        guestCount: guestCountNum,
        selectedServices,
        packageId: activePackage?.id || selectedPackageId,
        scheduledDate: dateStr,
        scheduledTime,
        address: `${flatNumber}, ${building}, ${selectedArea}, Ahmedabad`,
        pincode,
        accessInstructions: quietProtocol ? 'Quiet entry requested (do not ring bell, WhatsApp upon arrival)' : undefined,
        foodPackingNotes: `${foodNotes}. Pets: ${petStatus}`,
        doNotTouchItems: doNotTouch ? [doNotTouch] : [],
      });

      // 3. Confirm booking
      const confirmed = await bookingsApi.confirm(draft.id);

      // 4. Confetti & complete
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF5A36', '#0F172A', '#FFE8E2', '#2D7A58'],
      });

      onBookingConfirmed(confirmed);
    } catch (err: any) {
      setToastMessage(err?.message || 'Failed to confirm booking. Please try again.');
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle chore in Step 5
  const toggleChore = (serviceKey: string) => {
    if (selectedServices.includes(serviceKey)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== serviceKey));
        setIsEverythingSelected(false);
      }
    } else {
      const next = [...selectedServices, serviceKey];
      setSelectedServices(next);
      if (next.length >= 6) {
        setIsEverythingSelected(true);
      }
    }
  };

  // Toggle everything in Step 5
  const toggleAllChores = () => {
    if (isEverythingSelected) {
      setSelectedServices(['TRASH', 'LEFTOVER_FOOD']);
      setIsEverythingSelected(false);
    } else {
      setSelectedServices(['TRASH', 'LEFTOVER_FOOD', 'DECORATIONS', 'GIFTS_AND_STUFF', 'FURNITURE_MESS', 'CLEANING']);
      setIsEverythingSelected(true);
    }
  };

  return (
    <div
      style={{
        padding: '12px 18px 80px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        backgroundColor: 'var(--color-cream)',
        position: 'relative',
      }}
    >
      {/* ─── Top Header: Back Arrow, BrandLogo, Progress Indicator ─── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={prevStep}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #ECE7DE',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} color="#0F172A" />
        </button>

        <div onClick={onCancel} style={{ cursor: 'pointer' }}>
          <BrandLogo size={22} />
        </div>

        {/* 5-dot Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {[1, 2, 3, 4, 5].map((dotIdx) => {
            const isCompleted = Math.ceil((step / 10) * 5) >= dotIdx;
            return (
              <div
                key={dotIdx}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#FF5A36' : '#E2DDD6',
                  transition: 'background-color 0.25s ease',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          PAGE 1: "What were you celebrating?" (Image 1) - Clean vector icons
      ══════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ textAlign: 'right', marginBottom: 2 }}>
            <span style={{ fontFamily: 'Caveat, cursive', color: '#FF7A59', fontSize: 15, fontWeight: 700 }}>
              One step closer to a stress-free tomorrow ♡
            </span>
          </div>

          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: '#8C877F', textTransform: 'uppercase' }}>
              LET'S DO THIS ✨
            </span>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%', marginTop: 4 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', lineHeight: 1.15, letterSpacing: '-0.5px', margin: 0 }}>
                What were you<br />celebrating?
              </h1>
              <span style={{ position: 'absolute', top: 28, left: 242, color: '#FF5A36', fontSize: 24, fontWeight: 900, transform: 'rotate(15deg)' }}>
                //
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#716C64', marginTop: 8 }}>
              Pick the vibe. We’ll handle what’s left.
            </p>
          </div>

          {/* 6 Clean Vector Vibe Cards (No messy cropped image borders) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[
              { id: 'Birthday', label: 'Birthday', icon: Cake, bg: '#FFF4EE', color: '#FF5A36' },
              { id: 'Dinner Party', label: 'Dinner Party', icon: Utensils, bg: '#FAF8F5', color: '#B45309' },
              { id: 'House Party', label: 'House Party', icon: PartyPopper, bg: '#F0F8F4', color: '#2D7A58' },
              { id: 'Anniversary', label: 'Anniversary', icon: Heart, bg: '#FFF3F3', color: '#E11D48' },
              { id: 'Festival', label: 'Festival', icon: Sparkles, bg: '#FFF9EB', color: '#D97706' },
              { id: 'Something else', label: 'Something else', icon: HelpCircle, bg: '#F5F2FC', color: '#7C3AED' },
            ].map((vibe) => {
              const isSelected = occasion === vibe.id;
              const Icon = vibe.icon;
              return (
                <div
                  key={vibe.id}
                  onClick={() => setOccasion(vibe.id)}
                  style={{
                    backgroundColor: vibe.bg,
                    borderRadius: 20,
                    padding: '20px 14px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: isSelected ? '2.5px solid #FF5A36' : '1px solid rgba(0,0,0,0.05)',
                    boxShadow: isSelected ? '0 6px 18px rgba(255, 90, 54, 0.2)' : '0 1px 4px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                  >
                    <Icon size={26} color={vibe.color} strokeWidth={2.2} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                    {vibe.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Next Button */}
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={nextStep}
              style={{
                width: '100%',
                padding: '15px 22px',
                background: 'linear-gradient(135deg, #FF7253 0%, #FF5A36 100%)',
                color: '#FFFFFF',
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: 0.8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 8px 24px rgba(255, 90, 54, 0.35)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span>Next</span>
              <span>→</span>
            </button>

            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <span style={{ fontFamily: 'Caveat, cursive', color: '#FF7A59', fontSize: 14, fontWeight: 700 }}>
                Good Parties Brighter Tomorrows ♡
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          PAGE 2: "How many people showed up?" (Image 2) - Clean vector UI, NO photo
      ══════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ textAlign: 'left', marginBottom: 2 }}>
            <span style={{ fontFamily: 'Caveat, cursive', color: '#FF7A59', fontSize: 15, fontWeight: 700 }}>
              Bigger Nights Brighter Mornings ♡
            </span>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', lineHeight: 1.15, letterSpacing: '-0.5px', margin: 0 }}>
                How many<br />people showed up?
              </h1>
              <span style={{ position: 'absolute', top: 38, left: 246, color: '#FF5A36', fontSize: 24, fontWeight: 900, transform: 'rotate(15deg)' }}>
                //
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#716C64', marginTop: 8 }}>
              More guests, more to sort. We’ll handle it.
            </p>
          </div>

          {/* Clean Guest Visualizer Card (Zero photo mess) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '24px 20px',
              marginBottom: 20,
              border: '1px solid #ECE7DE',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                backgroundColor: '#FFF1ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={26} color="#FF5A36" strokeWidth={2.2} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {guestTier === 'Custom' ? `${customGuests} Guests Expected` : `${guestTier} Guests Expected`}
            </h3>
            <p style={{ fontSize: 12.5, color: '#64748B', margin: 0, maxWidth: 280 }}>
              We scale our reset specialist crew and equipment to handle your exact party volume.
            </p>
          </div>

          {/* 4 Guest Range Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
            {[
              { id: '1 - 30', line1: '1 – 30', line2: 'people' },
              { id: '31 - 60', line1: '31 – 60', line2: 'people' },
              { id: '61 - 100', line1: '61 – 100', line2: 'people' },
              { id: 'Custom', line1: 'Custom', line2: '(type)', hasIcon: true },
            ].map((tier) => {
              const isSelected = guestTier === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setGuestTier(tier.id)}
                  style={{
                    backgroundColor: isSelected ? '#FFF4EE' : '#FFFFFF',
                    border: isSelected ? '2px solid #FF5A36' : '1px solid #ECE7DE',
                    borderRadius: 18,
                    padding: '14px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 14px rgba(255, 90, 54, 0.18)' : '0 1px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  {tier.hasIcon && <Edit2 size={13} color="#0F172A" style={{ marginBottom: 4 }} />}
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', textAlign: 'center' }}>
                    {tier.line1}
                  </span>
                  <span style={{ fontSize: 11, color: '#7E7972', marginTop: 2, textAlign: 'center' }}>
                    {tier.line2}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Custom guest count input if opened */}
          {guestTier === 'Custom' && (
            <div style={{ marginBottom: 20, padding: 14, backgroundColor: '#FFFFFF', borderRadius: 16, border: '1px solid #ECE7DE' }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: 6 }}>
                Exact guest count:
              </label>
              <input
                type="number"
                value={customGuests}
                onChange={(e) => setCustomGuests(parseInt(e.target.value) || 1)}
                min={1}
                max={500}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: '1.5px solid #FF5A36',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>
          )}

          {/* Next Button */}
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={nextStep}
              style={{
                width: '100%',
                padding: '15px 22px',
                background: 'linear-gradient(135deg, #FF7253 0%, #FF5A36 100%)',
                color: '#FFFFFF',
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: 0.8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 8px 24px rgba(255, 90, 54, 0.35)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span>Next</span>
              <span>→</span>
            </button>

            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <span style={{ fontFamily: 'Caveat, cursive', color: '#FF7A59', fontSize: 14, fontWeight: 700 }}>
                Same House New Mornings ♡
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          PAGE 3: "How much space are we resetting?" (Image 3) - Clean vector cards
      ══════════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ textAlign: 'left', marginBottom: 2 }}>
            <span style={{ fontFamily: 'Caveat, cursive', color: '#FF7A59', fontSize: 15, fontWeight: 700 }}>
              Same Spaces Brighter Tomorrows ♡
            </span>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', lineHeight: 1.15, letterSpacing: '-0.5px', margin: 0 }}>
                How much space<br />are we resetting?
              </h1>
              <span style={{ position: 'absolute', top: 38, left: 260, color: '#FF5A36', fontSize: 24, fontWeight: 900, transform: 'rotate(15deg)' }}>
                //
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#716C64', marginTop: 8 }}>
              This helps us send the right team and equipment.
            </p>
          </div>

          {/* 4 Space Size Grid Cards (Clean vector icons) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            {[
              { id: 'Small apartment', label: 'Small apartment', desc: '1 - 2 BHK or studio', icon: Building },
              { id: 'Large apartment', label: 'Large apartment', desc: '3+ BHK or duplex', icon: Building2 },
              { id: 'Bungalow', label: 'Bungalow', desc: 'Independent house / villa', icon: Home },
              { id: 'Venue', label: 'Venue', desc: 'Party hall, terrace or lawn', icon: Tent },
            ].map((sp) => {
              const isSelected = spaceSize === sp.id;
              const Icon = sp.icon;
              return (
                <div
                  key={sp.id}
                  onClick={() => setSpaceSize(sp.id)}
                  style={{
                    backgroundColor: isSelected ? '#FFF4EE' : '#FFFFFF',
                    border: isSelected ? '2.5px solid #FF5A36' : '1px solid #ECE7DE',
                    borderRadius: 20,
                    padding: '20px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 6px 18px rgba(255, 90, 54, 0.18)' : '0 1px 4px rgba(0,0,0,0.02)',
                    gap: 8,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#FFE8E2' : '#F5F3EF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={24} color={isSelected ? '#FF5A36' : '#0F172A'} strokeWidth={2.2} />
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>
                    {sp.label}
                  </span>
                  <span style={{ fontSize: 11, color: '#7E7972' }}>
                    {sp.desc}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Full-width "Not sure" Card */}
          <div
            onClick={() => setSpaceSize('Not sure')}
            style={{
              backgroundColor: spaceSize === 'Not sure' ? '#FFF4EE' : '#FFFFFF',
              border: spaceSize === 'Not sure' ? '2px solid #FF5A36' : '1px solid #ECE7DE',
              borderRadius: 18,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              marginBottom: 20,
            }}
          >
            <HelpCircle size={18} color={spaceSize === 'Not sure' ? '#FF5A36' : '#716C64'} />
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
              Not sure (We'll evaluate on arrival)
            </span>
          </div>

          {/* Next Button */}
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={nextStep}
              style={{
                width: '100%',
                padding: '15px 22px',
                background: 'linear-gradient(135deg, #FF7253 0%, #FF5A36 100%)',
                color: '#FFFFFF',
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: 0.8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 8px 24px rgba(255, 90, 54, 0.35)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span>Next</span>
              <span>→</span>
            </button>

            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <span style={{ fontFamily: 'Caveat, cursive', color: '#FF7A59', fontSize: 14, fontWeight: 700 }}>
                Bigger Nights Brighter Mornings ♡
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          PAGE 4: "Show us the aftermath?" (Image 4) - Clean upload box
      ══════════════════════════════════════════════════════════════ */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ textAlign: 'right', marginBottom: 2 }}>
            <span style={{ fontFamily: 'Caveat, cursive', color: '#FF7A59', fontSize: 15, fontWeight: 700 }}>
              A few photos help us send the right team ♡
            </span>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', lineHeight: 1.15, letterSpacing: '-0.5px', margin: 0 }}>
                Show us the<br />aftermath?
              </h1>
              <span style={{ position: 'absolute', top: 38, left: 200, color: '#FF5A36', fontSize: 24, fontWeight: 900, transform: 'rotate(15deg)' }}>
                //
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#716C64', marginTop: 8, lineHeight: 1.4 }}>
              Optional: Add photos of the space so our specialists come equipped with exact bags and supplies.
            </p>
          </div>

          {/* Clean Photo Upload Card */}
          <div
            onClick={() => showComingSoon()}
            style={{
              border: '2px dashed #D9D2C7',
              borderRadius: 24,
              backgroundColor: '#FFFFFF',
              padding: '28px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#FFF1ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}
            >
              <Camera size={26} color="#FF5A36" strokeWidth={2.2} />
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Tap to add photos
            </h3>
            <p style={{ fontSize: 12, color: '#8C877F', margin: '4px 0 16px' }}>
              Upload up to 5 photos
            </p>

            {/* 5 Slots */}
            <div style={{ display: 'flex', gap: 10, width: '100%', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map((slot) => (
                <div
                  key={slot}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: '#FAF7F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #EFEAE2',
                  }}
                >
                  <Plus size={18} color="#8C877F" />
                </div>
              ))}
            </div>
          </div>

          {/* Buttons: Next + Skip */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={nextStep}
              style={{
                width: '100%',
                padding: '15px 22px',
                background: 'linear-gradient(135deg, #FF7253 0%, #FF5A36 100%)',
                color: '#FFFFFF',
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: 0.8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 8px 24px rgba(255, 90, 54, 0.35)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span>Next</span>
              <span>→</span>
            </button>

            <button
              onClick={() => nextStep()}
              style={{
                width: '100%',
                padding: '12px 22px',
                backgroundColor: 'transparent',
                color: '#FF5A36',
                borderRadius: 9999,
                fontWeight: 700,
                fontSize: 13.5,
                border: '1.5px solid #FF5A36',
                cursor: 'pointer',
              }}
            >
              Skip for now
            </button>

            <div style={{ textAlign: 'center', marginTop: 4 }}>
              <p style={{ fontSize: 11, color: '#8C877F', margin: 0 }}>
                ⓘ Photos are only used for your booking and kept private.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          PAGE 5: "What’s waiting for us?" (Image 5)
      ══════════════════════════════════════════════════════════════ */}
      {step === 5 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ textAlign: 'right', marginBottom: 2 }}>
            <span style={{ fontFamily: 'Caveat, cursive', color: '#FF7A59', fontSize: 15, fontWeight: 700 }}>
              You party. We handle the rest. ♡
            </span>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', lineHeight: 1.15, letterSpacing: '-0.5px', margin: 0 }}>
                What’s waiting<br />for us?
              </h1>
              <span style={{ position: 'absolute', top: 38, left: 180, color: '#FF5A36', fontSize: 24, fontWeight: 900, transform: 'rotate(15deg)' }}>
                //
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#716C64', marginTop: 6 }}>
              Choose what you’d like us to take care of.
            </p>
          </div>

          {/* 3 Tier Pills Bar */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 18,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              border: '1px solid #ECE7DE',
            }}
          >
            <div style={{ textAlign: 'center', flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#FF5A36' }}>① Pick 1</span>
              <p style={{ fontSize: 10, color: '#8C877F', margin: '2px 0 0' }}>For the essentials</p>
            </div>
            <div style={{ width: 1, height: 24, backgroundColor: '#EBE6DE' }} />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#FF5A36' }}>③ Pick 3</span>
              <p style={{ fontSize: 10, color: '#8C877F', margin: '2px 0 0' }}>For bigger cleanup</p>
            </div>
            <div style={{ width: 1, height: 24, backgroundColor: '#EBE6DE' }} />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#FF5A36' }}>∞ Everything</span>
              <p style={{ fontSize: 10, color: '#8C877F', margin: '2px 0 0' }}>We handle it all</p>
            </div>
          </div>

          {/* 6 Chore Cards (3 rows of 2) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            {[
              { id: 'TRASH', label: 'Trash', img: '/icons/recycle-bin.png', bg: '#F2F8F4' },
              { id: 'LEFTOVER_FOOD', label: 'Leftover food', img: '/icons/leftovers.png', bg: '#FFF8F0' },
              { id: 'DECORATIONS', label: 'Decorations', img: '/icons/balloon.png', bg: '#F8F4FC' },
              { id: 'GIFTS_AND_STUFF', label: 'Gifts & stuff', isCustomGift: true, bg: '#FFF5F5' },
              { id: 'FURNITURE_MESS', label: 'Furniture mess', img: '/icons/couch.png', bg: '#FFFBF0' },
              { id: 'CLEANING', label: 'Cleaning', img: '/icons/cleaning.png', bg: '#F0F9FB' },
            ].map((chore) => {
              const isChecked = selectedServices.includes(chore.id);
              return (
                <div
                  key={chore.id}
                  onClick={() => toggleChore(chore.id)}
                  style={{
                    backgroundColor: chore.bg,
                    borderRadius: 18,
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    position: 'relative',
                    border: isChecked ? '2px solid #FF5A36' : '1px solid rgba(0,0,0,0.04)',
                    boxShadow: isChecked ? '0 4px 12px rgba(255, 90, 54, 0.15)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {chore.isCustomGift ? (
                        <div style={{ fontSize: 28 }}>🎁</div>
                      ) : (
                        <img src={chore.img} alt={chore.label} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                      )}
                    </div>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: isChecked ? 'none' : '1.5px solid #C4BEB5',
                        backgroundColor: isChecked ? '#FF5A36' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isChecked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                    </div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginTop: 10 }}>
                    {chore.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Honestly... everything Card */}
          <div
            onClick={toggleAllChores}
            style={{
              backgroundColor: isEverythingSelected ? '#FFF4EE' : '#FFFFFF',
              border: isEverythingSelected ? '2px solid #FF5A36' : '1px solid #ECE7DE',
              borderRadius: 20,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginBottom: 18,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 32 }}>✨</div>
              <div>
                <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Honestly... everything.
                </h4>
                <p style={{ fontSize: 11.5, color: '#7E7972', margin: '2px 0 0' }}>
                  Take care of the whole place.
                </p>
              </div>
            </div>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: isEverythingSelected ? 'none' : '1.5px solid #C4BEB5',
                backgroundColor: isEverythingSelected ? '#FF5A36' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isEverythingSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
            </div>
          </div>

          {/* Next Button */}
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={nextStep}
              style={{
                width: '100%',
                padding: '15px 22px',
                background: 'linear-gradient(135deg, #FF7253 0%, #FF5A36 100%)',
                color: '#FFFFFF',
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: 0.8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 8px 24px rgba(255, 90, 54, 0.35)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span>Next</span>
              <span>→</span>
            </button>

            <div style={{ textAlign: 'right', marginTop: 14 }}>
              <span style={{ fontFamily: 'Caveat, cursive', color: '#FF7A59', fontSize: 14, fontWeight: 700 }}>
                Cleaner Nights Happier Tomorrows ♡
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          PAGE 6: "We Recommend This Reset" (Recommendation & Packages)
      ══════════════════════════════════════════════════════════════ */}
      {step === 6 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ textAlign: 'right', marginBottom: 2 }}>
            <span style={{ fontFamily: 'Caveat, cursive', color: '#FF7A59', fontSize: 15, fontWeight: 700 }}>
              Tailored to your aftermath ♡
            </span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: '#FF5A36', textTransform: 'uppercase' }}>
              ✦ SMART RECOMMENDATION
            </span>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', lineHeight: 1.2, marginTop: 4 }}>
              We recommend: {activePackage?.displayName || 'Full Reset'}
            </h1>
            <p style={{ fontSize: 14, color: '#716C64', marginTop: 6 }}>
              Based on your {occasion} and selected chores, this gives you the best turnaround.
            </p>
          </div>

          {/* Featured Recommended Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: '20px 18px',
              border: '2px solid #FF5A36',
              boxShadow: '0 8px 24px rgba(255, 90, 54, 0.15)',
              marginBottom: 16,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -12,
                left: 18,
                backgroundColor: '#FF5A36',
                color: '#FFFFFF',
                fontSize: 10.5,
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: 9999,
                letterSpacing: 0.6,
              }}
            >
              ✦ BEST MATCH FOR YOU
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 6 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {activePackage?.displayName}
                </h3>
                <p style={{ fontSize: 13, color: '#FF5A36', fontWeight: 700, margin: '2px 0 0' }}>
                  {activePackage?.tagline}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#0F172A' }}>
                  ₹{calculateTotal().toLocaleString('en-IN')}
                </span>
                <p style={{ fontSize: 10.5, color: '#8C877F', margin: 0 }}>all inclusive</p>
              </div>
            </div>

            <p style={{ fontSize: 12.5, color: '#64748B', margin: '12px 0', lineHeight: 1.4 }}>
              {activePackage?.description}
            </p>

            {/* Checklist of what's included */}
            <div style={{ borderTop: '1px solid #F0ECE4', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {selectedServices.map((svc) => (
                <div key={svc} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#EAF5EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={11} color="#2D7A58" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>
                    {svc.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle to see all packages */}
          <div style={{ marginBottom: 18 }}>
            <button
              onClick={() => setShowAllPackages(!showAllPackages)}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#0F172A',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {showAllPackages ? 'Hide package list ▲' : 'View all packages instead ▼'}
            </button>
          </div>

          {/* All packages list if expanded */}
          {showAllPackages && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  style={{
                    backgroundColor: selectedPackageId === pkg.id ? '#FFF4EE' : '#FFFFFF',
                    border: selectedPackageId === pkg.id ? '2px solid #FF5A36' : '1px solid #ECE7DE',
                    borderRadius: 16,
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {pkg.displayName}
                    </h4>
                    <p style={{ fontSize: 11.5, color: '#7E7972', margin: '2px 0 0' }}>
                      {pkg.tagline}
                    </p>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#FF5A36' }}>
                    ₹{pkg.basePrice}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Choose This Reset Button */}
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={nextStep}
              style={{
                width: '100%',
                padding: '15px 22px',
                background: 'linear-gradient(135deg, #FF7253 0%, #FF5A36 100%)',
                color: '#FFFFFF',
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: 0.8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 8px 24px rgba(255, 90, 54, 0.35)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span>Choose This Reset</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          PAGE 7: "When should we arrive?" (Time & Slots)
      ══════════════════════════════════════════════════════════════ */}
      {step === 7 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ textAlign: 'right', marginBottom: 2 }}>
            <span style={{ fontFamily: 'Caveat, cursive', color: '#FF7A59', fontSize: 15, fontWeight: 700 }}>
              Pick the time, we'll be there ♡
            </span>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', lineHeight: 1.15, letterSpacing: '-0.5px', margin: 0 }}>
                When should<br />we arrive?
              </h1>
              <span style={{ position: 'absolute', top: 38, left: 185, color: '#FF5A36', fontSize: 24, fontWeight: 900, transform: 'rotate(15deg)' }}>
                //
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#716C64', marginTop: 8 }}>
              Immediate emergency response or early morning wake-up call.
            </p>
          </div>

          {/* Date Selector Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button
              onClick={() => setSelectedDateMode('tomorrow')}
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: 16,
                backgroundColor: selectedDateMode === 'tomorrow' ? '#0F172A' : '#FFFFFF',
                color: selectedDateMode === 'tomorrow' ? '#FFFFFF' : '#0F172A',
                fontWeight: 700,
                fontSize: 13,
                border: '1px solid #ECE7DE',
                cursor: 'pointer',
              }}
            >
              ☀️ Tomorrow Morning
            </button>
            <button
              onClick={() => setSelectedDateMode('tonight')}
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: 16,
                backgroundColor: selectedDateMode === 'tonight' ? '#0F172A' : '#FFFFFF',
                color: selectedDateMode === 'tonight' ? '#FFFFFF' : '#0F172A',
                fontWeight: 700,
                fontSize: 13,
                border: '1px solid #ECE7DE',
                cursor: 'pointer',
              }}
            >
              🌙 Tonight (Post-Wrap)
            </button>
          </div>

          {/* Time Slot Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {[
              { time: '07:00', label: '7:00 AM – 9:00 AM', desc: 'Wake up to a sparkling fresh home' },
              { time: '09:00', label: '9:00 AM – 11:00 AM', desc: 'Standard morning-after clean' },
              { time: '11:00', label: '11:00 AM – 1:00 PM', desc: 'Brunch readiness turnaround' },
              { time: '23:30', label: '11:30 PM (Immediate Tonight)', desc: 'Crew dispatched within 45 mins' },
              { time: '01:00', label: '1:00 AM (Post Wrap-Up)', desc: 'Late night quiet shutdown' },
            ].map((slot) => {
              const isSelected = scheduledTime === slot.time;
              return (
                <div
                  key={slot.time}
                  onClick={() => setScheduledTime(slot.time)}
                  style={{
                    backgroundColor: isSelected ? '#FFF4EE' : '#FFFFFF',
                    border: isSelected ? '2px solid #FF5A36' : '1px solid #ECE7DE',
                    borderRadius: 18,
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 12px rgba(255, 90, 54, 0.15)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: isSelected ? '#FFE8E2' : '#F5F3EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={18} color={isSelected ? '#FF5A36' : '#716C64'} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {slot.label}
                      </h4>
                      <p style={{ fontSize: 11.5, color: '#7E7972', margin: '2px 0 0' }}>
                        {slot.desc}
                      </p>
                    </div>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: isSelected ? 'none' : '1.5px solid #C4BEB5', backgroundColor: isSelected ? '#FF5A36' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Button */}
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={nextStep}
              style={{
                width: '100%',
                padding: '15px 22px',
                background: 'linear-gradient(135deg, #FF7253 0%, #FF5A36 100%)',
                color: '#FFFFFF',
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: 0.8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 8px 24px rgba(255, 90, 54, 0.35)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span>Next</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          PAGE 8: "Where is the aftermath?" (Location & Ahmedabad Map)
      ══════════════════════════════════════════════════════════════ */}
      {step === 8 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ textAlign: 'right', marginBottom: 2 }}>
            <span style={{ fontFamily: 'Caveat, cursive', color: '#FF7A59', fontSize: 15, fontWeight: 700 }}>
              Ahmedabad's finest reset team ♡
            </span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', lineHeight: 1.15, letterSpacing: '-0.5px', margin: 0 }}>
                Where is the<br />aftermath?
              </h1>
              <span style={{ position: 'absolute', top: 38, left: 220, color: '#FF5A36', fontSize: 24, fontWeight: 900, transform: 'rotate(15deg)' }}>
                //
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#716C64', marginTop: 8 }}>
              Confirm your pin & address in Ahmedabad.
            </p>
          </div>

          {/* Ahmedabad Map Canvas Card */}
          <div
            style={{
              height: 180,
              borderRadius: 22,
              backgroundColor: '#E5DFD5',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: 16,
              border: '1px solid #ECE7DE',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            }}
          >
            {/* Styled vector map background */}
            <svg width="100%" height="100%" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="200" fill="#EAE5DC" />
              {/* Sabarmati River curve */}
              <path d="M 120 0 Q 150 100 130 200" stroke="#CBD5E1" strokeWidth="22" strokeLinecap="round" />
              {/* SG Highway */}
              <path d="M 0 50 L 400 120" stroke="#FFFFFF" strokeWidth="6" />
              {/* Ring Road */}
              <path d="M 220 0 L 250 200" stroke="#FFFFFF" strokeWidth="5" />
              {/* Minor streets */}
              <path d="M 40 180 L 380 40" stroke="#F1ECE4" strokeWidth="3" />
              <path d="M 160 20 L 360 170" stroke="#F1ECE4" strokeWidth="3" />
            </svg>

            {/* Central Location Pin */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 9999,
                  marginBottom: 6,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  whiteSpace: 'nowrap',
                }}
              >
                📍 {selectedArea}, Ahmedabad ({pincode})
              </div>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: '#FF5A36',
                  border: '3px solid #FFFFFF',
                  boxShadow: '0 0 16px #FF5A36',
                }}
              />
            </div>
          </div>

          {/* Quick Area Pills */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: 14 }}>
            {[
              { name: 'Paldi', pin: '380006' },
              { name: 'Bodakdev', pin: '380054' },
              { name: 'Satellite', pin: '380015' },
              { name: 'Navrangpura', pin: '380009' },
            ].map((loc) => (
              <button
                key={loc.name}
                onClick={() => {
                  setSelectedArea(loc.name);
                  setPincode(loc.pin);
                }}
                style={{
                  padding: '7px 12px',
                  borderRadius: 9999,
                  backgroundColor: selectedArea === loc.name ? '#0F172A' : '#FFFFFF',
                  color: selectedArea === loc.name ? '#FFFFFF' : '#0F172A',
                  fontSize: 12,
                  fontWeight: 700,
                  border: '1px solid #ECE7DE',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {loc.name} ({loc.pin})
              </button>
            ))}
          </div>

          {/* Address Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: 11.5, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 4 }}>
                Flat / Door / House No.
              </label>
              <input
                type="text"
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                placeholder="e.g. Flat 402, Block B"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 14,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #ECE7DE',
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11.5, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 4 }}>
                Building / Society / Street
              </label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="e.g. Riverside Apartments, Paldi"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 14,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #ECE7DE',
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11.5, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 4 }}>
                Landmark
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Opp. NID Ground"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 14,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #ECE7DE',
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Next Button */}
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={nextStep}
              style={{
                width: '100%',
                padding: '15px 22px',
                background: 'linear-gradient(135deg, #FF7253 0%, #FF5A36 100%)',
                color: '#FFFFFF',
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: 0.8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 8px 24px rgba(255, 90, 54, 0.35)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span>Next</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          PAGE 9: "Anything we should know?" (Special Instructions)
      ══════════════════════════════════════════════════════════════ */}
      {step === 9 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ textAlign: 'right', marginBottom: 2 }}>
            <span style={{ fontFamily: 'Caveat, cursive', color: '#FF7A59', fontSize: 15, fontWeight: 700 }}>
              Special care for what matters ♡
            </span>
          </div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', lineHeight: 1.15, letterSpacing: '-0.5px', margin: 0 }}>
                Anything we<br />should know?
              </h1>
              <span style={{ position: 'absolute', top: 38, left: 195, color: '#FF5A36', fontSize: 24, fontWeight: 900, transform: 'rotate(15deg)' }}>
                //
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#716C64', marginTop: 8 }}>
              Quiet entry protocol, pets, and delicate items.
            </p>
          </div>

          {/* Quiet Entry Protocol Switch Card */}
          <div
            onClick={() => setQuietProtocol(!quietProtocol)}
            style={{
              backgroundColor: quietProtocol ? '#FFF4EE' : '#FFFFFF',
              border: quietProtocol ? '2px solid #FF5A36' : '1px solid #ECE7DE',
              borderRadius: 20,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              marginBottom: 16,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16 }}>🤫</span>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Whisper-Quiet Arrival
                </h4>
              </div>
              <p style={{ fontSize: 12, color: '#7E7972', margin: '4px 0 0' }}>
                Baby/host sleeping — do not ring doorbell, WhatsApp on arrival.
              </p>
            </div>
            <div
              style={{
                width: 44,
                height: 24,
                borderRadius: 9999,
                backgroundColor: quietProtocol ? '#FF5A36' : '#E2DDD6',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  position: 'absolute',
                  top: 3,
                  left: quietProtocol ? 22 : 4,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
            </div>
          </div>

          {/* Pets Selector */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 8 }}>
              🐾 Pets in the house?
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'none', label: 'No pets' },
                { id: 'friendly', label: 'Friendly dog/cat' },
                { id: 'kept_in_room', label: 'Kept in bedroom' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPetStatus(p.id as any)}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    borderRadius: 14,
                    backgroundColor: petStatus === p.id ? '#0F172A' : '#FFFFFF',
                    color: petStatus === p.id ? '#FFFFFF' : '#0F172A',
                    fontSize: 12,
                    fontWeight: 700,
                    border: '1px solid #ECE7DE',
                    cursor: 'pointer',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Leftover Packing Instructions */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 6 }}>
              🥡 Food & Leftovers Instructions
            </label>
            <textarea
              rows={2}
              value={foodNotes}
              onChange={(e) => setFoodNotes(e.target.value)}
              placeholder="e.g. Put pizza in fridge, stack unopened sodas..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 14,
                backgroundColor: '#FFFFFF',
                border: '1px solid #ECE7DE',
                fontSize: 13,
                color: '#0F172A',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'none',
              }}
            />
          </div>

          {/* Do Not Touch Items */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: 6 }}>
              🚫 Delicate / Do-Not-Touch Items
            </label>
            <input
              type="text"
              value={doNotTouch}
              onChange={(e) => setDoNotTouch(e.target.value)}
              placeholder="e.g. Vintage turntables, artwork on mantel"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: 14,
                backgroundColor: '#FFFFFF',
                border: '1px solid #ECE7DE',
                fontSize: 13,
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>

          {/* Next Button */}
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={nextStep}
              style={{
                width: '100%',
                padding: '15px 22px',
                background: 'linear-gradient(135deg, #FF7253 0%, #FF5A36 100%)',
                color: '#FFFFFF',
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: 0.8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 8px 24px rgba(255, 90, 54, 0.35)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span>Review Booking</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          PAGE 10: "Review & Confirm" (Final Itemized Review)
      ══════════════════════════════════════════════════════════════ */}
      {step === 10 && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ textAlign: 'right', marginBottom: 2 }}>
            <span style={{ fontFamily: 'Caveat, cursive', color: '#FF7A59', fontSize: 15, fontWeight: 700 }}>
              Almost done! You're off duty ♡
            </span>
          </div>

          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: '#FF5A36', textTransform: 'uppercase' }}>
              ✦ FINAL REVIEW
            </span>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', lineHeight: 1.15, letterSpacing: '-0.5px', margin: '4px 0 0' }}>
              You party.<br />We reset.
            </h1>
            <p style={{ fontSize: 14, color: '#716C64', marginTop: 6 }}>
              Review your details and confirm your dispatch.
            </p>
          </div>

          {/* Itemized Review Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 22,
              padding: '18px',
              border: '1px solid #ECE7DE',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#8C877F' }}>Occasion & Vibe</span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>{occasion}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#8C877F' }}>Space Size</span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>{spaceSize}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#8C877F' }}>Scheduled Arrival</span>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#FF5A36' }}>
                {selectedDateMode === 'tomorrow' ? 'Tomorrow' : 'Tonight'} at {scheduledTime}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: '#8C877F' }}>Address</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', textAlign: 'right', maxWidth: 190 }}>
                {flatNumber}, {building}, {selectedArea}
              </span>
            </div>

            <div style={{ borderTop: '1px solid #F0ECE4', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Total Package
                </h4>
                <p style={{ fontSize: 11, color: '#8C877F', margin: '2px 0 0' }}>
                  {activePackage?.displayName} · No hidden fees
                </p>
              </div>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>
                ₹{calculateTotal().toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Confirm Button */}
          <div style={{ marginTop: 'auto' }}>
            <button
              onClick={handleConfirmBooking}
              disabled={submitting}
              style={{
                width: '100%',
                padding: '16px 22px',
                background: 'linear-gradient(135deg, #FF7253 0%, #FF5A36 100%)',
                color: '#FFFFFF',
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: 0.8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 8px 24px rgba(255, 90, 54, 0.4)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                border: 'none',
                opacity: submitting ? 0.75 : 1,
              }}
            >
              <span>{submitting ? 'Confirming Dispatch...' : '✦ CONFIRM & RESET MY SPACE'}</span>
              {!submitting && <span>→</span>}
            </button>

            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <p style={{ fontSize: 11.5, color: '#8C877F', margin: 0 }}>
                🔒 100% Satisfaction Guarantee · Cancel anytime up to 1 hr before arrival
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Toast Modal for Coming Soon & Notices ─── */}
      {toastMessage && (
        <div
          onClick={() => setToastMessage(null)}
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            borderRadius: 9999,
            padding: '12px 20px',
            fontSize: 13,
            fontWeight: 700,
            zIndex: 10000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};
