import React from 'react';
import { Home, FileText, User } from 'lucide-react';

export type TabType = 'home' | 'resets' | 'me' | 'book' | 'tracker' | 'help';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const isHomeActive = activeTab === 'home';
  const isResetsActive = activeTab === 'resets' || activeTab === 'tracker';
  const isMeActive = activeTab === 'me';

  return (
    <nav
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #ECE7DE',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 16px 16px',
        zIndex: 40,
        boxShadow: '0 -2px 10px rgba(15, 23, 42, 0.03)',
      }}
    >
      {/* 1. Home */}
      <button
        onClick={() => onSelectTab('home')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          cursor: 'pointer',
          padding: '2px 8px',
        }}
      >
        <div
          style={{
            padding: '5px 18px',
            borderRadius: 16,
            backgroundColor: isHomeActive ? '#FFE8E2' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <Home
            size={22}
            color={isHomeActive ? '#FF5A36' : '#8C877F'}
            fill={isHomeActive ? '#FF5A36' : 'none'}
            strokeWidth={isHomeActive ? 2.5 : 2}
          />
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: isHomeActive ? 700 : 500,
            color: isHomeActive ? '#FF5A36' : '#8C877F',
          }}
        >
          Home
        </span>
      </button>

      {/* 2. Resets */}
      <button
        onClick={() => onSelectTab('resets')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          cursor: 'pointer',
          padding: '2px 8px',
        }}
      >
        <div
          style={{
            padding: '5px 18px',
            borderRadius: 16,
            backgroundColor: isResetsActive ? '#FFE8E2' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <FileText
            size={22}
            color={isResetsActive ? '#FF5A36' : '#8C877F'}
            strokeWidth={isResetsActive ? 2.5 : 2}
          />
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: isResetsActive ? 700 : 500,
            color: isResetsActive ? '#FF5A36' : '#8C877F',
          }}
        >
          Resets
        </span>
      </button>

      {/* 3. Me */}
      <button
        onClick={() => onSelectTab('me')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          cursor: 'pointer',
          padding: '2px 8px',
        }}
      >
        <div
          style={{
            padding: '5px 18px',
            borderRadius: 16,
            backgroundColor: isMeActive ? '#FFE8E2' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <User
            size={22}
            color={isMeActive ? '#FF5A36' : '#8C877F'}
            strokeWidth={isMeActive ? 2.5 : 2}
          />
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: isMeActive ? 700 : 500,
            color: isMeActive ? '#FF5A36' : '#8C877F',
          }}
        >
          Me
        </span>
      </button>
    </nav>
  );
};
