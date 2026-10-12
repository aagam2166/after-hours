import React from 'react';
import { MapPin, ChevronDown, Bell } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import type { TabType } from './BottomNav';

interface HeaderProps {
  onSelectTab: (tab: TabType) => void;
  onOpenPincodeModal: () => void;
  currentCity?: string;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectTab,
  onOpenPincodeModal,
  currentCity = 'Ahmedabad',
  onOpenNotifications,
}) => {
  return (
    <header
      style={{
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--color-cream)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Brand Logo */}
      <div
        onClick={() => onSelectTab('home')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <BrandLogo size={24} />
      </div>

      {/* City Pill */}
      <button
        onClick={onOpenPincodeModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E6DFD5',
          borderRadius: 9999,
          padding: '7px 14px',
          fontSize: '13px',
          fontWeight: 700,
          color: '#0F172A',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)',
          cursor: 'pointer',
        }}
      >
        <MapPin size={14} color="#0F172A" />
        <span>{currentCity}</span>
        <ChevronDown size={14} color="#64748B" />
      </button>

      {/* Notification Bell */}
      <button
        onClick={onOpenNotifications}
        title="Notifications"
        style={{
          position: 'relative',
          width: 38,
          height: 38,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          cursor: 'pointer',
        }}
      >
        <Bell size={20} color="#0F172A" strokeWidth={2.2} />
        <span
          style={{
            position: 'absolute',
            top: 7,
            right: 7,
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#FF5A36',
          }}
        />
      </button>
    </header>
  );
};
