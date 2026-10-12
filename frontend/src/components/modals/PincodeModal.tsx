import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { serviceAreaApi, type ServiceAreaResult } from '../../api/serviceArea';

interface PincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPincode: (pincode: string, city: string) => void;
  currentPincode: string;
}

export const PincodeModal: React.FC<PincodeModalProps> = ({
  isOpen,
  onClose,
  onSelectPincode,
  currentPincode,
}) => {
  const [pincode, setPincode] = useState(currentPincode);
  const [result, setResult] = useState<ServiceAreaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await serviceAreaApi.checkPincode(pincode);
      setResult(res);
      if (res.isServiceable) {
        onSelectPincode(pincode, res.city || 'Mumbai');
      }
    } catch (err: any) {
      setError(err?.message || 'Error checking area');
    } finally {
      setLoading(false);
    }
  };

  const samplePincodes = [
    { pin: '400050', area: 'Bandra West, Mumbai' },
    { pin: '400001', area: 'Fort, Mumbai' },
    { pin: '560001', area: 'MG Road, Bangalore' },
    { pin: '110001', area: 'Connaught Place, Delhi' },
  ];

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

        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)', marginBottom: 4 }}>
          Check Service Area
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: 16 }}>
          After Hours crews are dispatched within 45-60 mins in active zones.
        </p>

        <form onSubmit={handleCheck} style={{ marginBottom: 16 }}>
          <div style={{
            display: 'flex',
            gap: 8,
            marginBottom: 12,
          }}>
            <input
              type="text"
              maxLength={6}
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value.replace(/\D/g, ''));
                setResult(null);
              }}
              placeholder="Enter 6-digit Pincode"
              style={{
                flex: 1,
                padding: '12px 14px',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-cream)',
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-navy)',
              }}
              required
            />
            <button
              type="submit"
              disabled={loading || pincode.length !== 6}
              style={{
                padding: '12px 16px',
                backgroundColor: 'var(--color-navy)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                opacity: pincode.length !== 6 ? 0.6 : 1,
              }}
            >
              <Search size={16} />
              <span>{loading ? '...' : 'Check'}</span>
            </button>
          </div>
        </form>

        {error && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: '#FEE2E2',
            color: '#B91C1C',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            marginBottom: 14,
          }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: result.isServiceable ? 'var(--color-sage-bg)' : '#FFF1F2',
            border: `1px solid ${result.isServiceable ? '#B7E2CB' : '#FECDD3'}`,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}>
            {result.isServiceable ? (
              <CheckCircle2 size={20} color="var(--color-sage)" style={{ marginTop: 2, flexShrink: 0 }} />
            ) : (
              <AlertCircle size={20} color="#E11D48" style={{ marginTop: 2, flexShrink: 0 }} />
            )}
            <div>
              <p style={{
                fontSize: '13px',
                fontWeight: 700,
                color: result.isServiceable ? 'var(--color-sage)' : '#BE123C',
              }}>
                {result.isServiceable ? 'Service Available!' : 'Currently Not Serviceable'}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--color-navy)', marginTop: 2 }}>
                {result.message || (result.isServiceable ? `Reset crew available in ${result.city || 'your area'}` : 'We are expanding rapidly!')}
              </p>
            </div>
          </div>
        )}

        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
            Popular Service Zones:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {samplePincodes.map((item) => (
              <button
                key={item.pin}
                onClick={() => {
                  setPincode(item.pin);
                  setResult({ pincode: item.pin, isServiceable: true, city: item.area.split(',')[1]?.trim() });
                  onSelectPincode(item.pin, item.area.split(',')[1]?.trim() || 'Mumbai');
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-cream)',
                  fontSize: '12px',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{item.area}</span>
                <span style={{ color: 'var(--color-coral)', fontWeight: 700 }}>{item.pin}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
