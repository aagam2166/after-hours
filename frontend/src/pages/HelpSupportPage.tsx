import React, { useState } from 'react';
import { ArrowLeft, Clock, MapPin, CreditCard, Users, ChevronDown, ChevronUp, MessageCircle, Phone } from 'lucide-react';

interface HelpSupportPageProps {
  onBack: () => void;
  onOpenIssueModal: () => void;
}

export const HelpSupportPage: React.FC<HelpSupportPageProps> = ({
  onBack,
  onOpenIssueModal,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can I change my reset time slot after booking?',
      a: 'Yes! As long as our crew has not been dispatched ("On the way"), you can reschedule your time slot with no penalty directly via support chat.',
    },
    {
      q: 'What if my party is running later than expected?',
      a: 'No panic! Message our operations dispatcher. We routinely push late-night slots back by 30 to 60 minutes so you and your guests can wrap up comfortably.',
    },
    {
      q: "What's included in my After Hours reset?",
      a: 'Unlike generic maid services, our trained reset teams handle trash & empty bottle bagging, leftover food packing into airtight containers for the fridge, detachment of banners/balloons, grouping gifts/belongings, furniture resetting, and surface vacuuming/wiping.',
    },
    {
      q: 'Do I have to stay awake while the crew works?',
      a: 'Not at all — that is the entire premise of After Hours! Provide access instructions (or a lockbox / security guard note) with your Secure Arrival PIN, and go straight to sleep. You wake up to a restored home.',
    },
    {
      q: 'What is the policy for delicate barware or valuables?',
      a: 'You can list specific items in the "Do Not Touch" section during booking. Our crew will carefully avoid or work around whatever you designate.',
    },
  ];

  return (
    <div style={{ padding: '24px 24px 80px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      {/* Top Bar */}
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
          No panic. We've got you. ♡
        </span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 800,
          color: 'var(--color-navy)',
          letterSpacing: '-0.5px',
        }}>
          HELP & SUPPORT
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--color-text-muted)', marginTop: 4 }}>
          Something came up? Our concierge team is available round the clock.
        </p>
      </div>

      {/* Quick Help Tiles */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-coral)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
          QUICK HELP
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <button
            onClick={() => alert('To reschedule, please message support below with your Booking ID.')}
            style={{
              padding: '16px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textAlign: 'left',
            }}
          >
            <Clock size={20} color="var(--color-coral)" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)' }}>Change timing</span>
          </button>

          <button
            onClick={() => alert('To update your address, message our dispatch team below.')}
            style={{
              padding: '16px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textAlign: 'left',
            }}
          >
            <MapPin size={20} color="var(--color-coral)" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)' }}>Update address</span>
          </button>

          <button
            onClick={() => alert('Online payments and UPI are reconciled instantly post reset.')}
            style={{
              padding: '16px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textAlign: 'left',
            }}
          >
            <CreditCard size={20} color="var(--color-coral)" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-navy)' }}>Payment queries</span>
          </button>

          <button
            onClick={onOpenIssueModal}
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-peach)',
              borderRadius: '16px',
              border: '1px solid #F6D6CC',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textAlign: 'left',
            }}
          >
            <Users size={20} color="var(--color-coral)" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-coral)' }}>Report crew issue</span>
          </button>
        </div>
      </div>

      {/* FAQs */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-coral)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>
          COMMON QUESTIONS
        </h3>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  borderBottom: idx === faqs.length - 1 ? 'none' : '1px solid var(--color-border-subtle)',
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-navy)' }}>
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp size={18} color="var(--color-coral)" /> : <ChevronDown size={18} color="var(--color-text-muted)" />}
                </button>
                {isOpen && (
                  <div style={{
                    padding: '0 20px 18px',
                    fontSize: '13px',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.5,
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Real Human Support Card (matching PDF) */}
      <div style={{
        backgroundColor: 'var(--color-peach)',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid #F6D6CC',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 16,
      }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-navy)' }}>
            Still stuck? Talk to a real human.
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: 2 }}>
            Our 24/7 night shift concierge responds in under 2 minutes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 400 }}>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1,
              padding: '12px 18px',
              backgroundColor: 'var(--color-coral)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              textDecoration: 'none',
              boxShadow: 'var(--shadow-float)',
            }}
          >
            <MessageCircle size={16} />
            <span>Chat With Us</span>
          </a>

          <a
            href="tel:+919876543210"
            style={{
              flex: 1,
              padding: '12px 18px',
              backgroundColor: '#FFFFFF',
              color: 'var(--color-navy)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              textDecoration: 'none',
            }}
          >
            <Phone size={16} color="var(--color-coral)" />
            <span>Call Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};
