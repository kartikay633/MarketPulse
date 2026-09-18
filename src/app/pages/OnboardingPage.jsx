// ROADMAP: Section 5 & Phase 1 — Onboarding Flow
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { ArrowRight, CheckCircle2, TrendingUp, BarChart3, Award, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const EXPERIENCE_LEVELS = [
  {
    id: 'beginner',
    title: 'Beginner',
    desc: 'New to Indian equity markets. Interested in NIFTY 50, basic metrics, and simulated paper trading.',
    icon: Sparkles,
    badge: 'Standard Starter',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    desc: 'Regularly follow Indian stocks, technical candlestick charts, earnings reports, and sector trends.',
    icon: TrendingUp,
    badge: 'Active Investor',
  },
  {
    id: 'advanced',
    title: 'Advanced / Pro',
    desc: 'Experienced trader interested in market breadth, volume spikes, valuation multiples, and speed.',
    icon: Award,
    badge: 'Market Veteran',
  },
];

const SECTOR_OPTIONS = [
  'Banking & Financials',
  'Information Technology (IT)',
  'Pharmaceuticals & Healthcare',
  'Automobiles & EV',
  'Energy, Oil & Gas',
  'Fast Moving Consumer Goods (FMCG)',
  'Metals & Mining',
  'Infrastructure & Capital Goods',
  'Real Estate & Construction',
  'Telecom & Media',
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuthStore();

  const [step, setStep] = useState(1);
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [selectedSectors, setSelectedSectors] = useState(['Banking & Financials', 'Information Technology (IT)']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSector = (sector) => {
    if (selectedSectors.includes(sector)) {
      setSelectedSectors(selectedSectors.filter((s) => s !== sector));
    } else {
      setSelectedSectors([...selectedSectors, sector]);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const res = await updateProfile({
        experienceLevel,
        interestedSectors: selectedSectors,
        onboardingCompleted: true,
      });

      if (res.success) {
        toast.success('Market Pulse configured for your profile');
        navigate('/dashboard');
      } else {
        toast.error('Failed to save preferences');
      }
    } catch (err) {
      toast.error('Error completing setup: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0f',
        backgroundImage: 'radial-gradient(ellipse at 50% -10%, rgba(51, 102, 255, 0.2), transparent 70%)',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'rgba(18, 18, 26, 0.9)',
          border: '1px solid rgba(42, 42, 68, 0.8)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#3366ff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              STEP {step} OF 2
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f0f0f5', marginTop: '4px' }}>
              {step === 1 ? 'Select Your Market Experience' : 'Choose Your Focus Sectors'}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '4px',
                borderRadius: '2px',
                background: '#3366ff',
              }}
            />
            <div
              style={{
                width: '36px',
                height: '4px',
                borderRadius: '2px',
                background: step === 2 ? '#3366ff' : 'rgba(255, 255, 255, 0.1)',
              }}
            />
          </div>
        </div>

        {/* STEP 1: Experience Level */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              {EXPERIENCE_LEVELS.map((lvl) => {
                const isSelected = experienceLevel === lvl.id;
                const Icon = lvl.icon;
                return (
                  <div
                    key={lvl.id}
                    onClick={() => setExperienceLevel(lvl.id)}
                    style={{
                      padding: '18px 20px',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(51, 102, 255, 0.12)' : 'rgba(26, 26, 40, 0.6)',
                      border: `1.5px solid ${isSelected ? '#3366ff' : 'rgba(42, 42, 68, 0.8)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 0 20px rgba(51, 102, 255, 0.2)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: isSelected ? '#3366ff' : 'rgba(42, 42, 68, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? '#fff' : '#a0a0b8',
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#f0f0f5' }}>{lvl.title}</span>
                        <span
                          style={{
                            fontSize: '11px',
                            color: isSelected ? '#27c8ff' : '#606078',
                            background: isSelected ? 'rgba(39, 200, 255, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {lvl.badge}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#a0a0b8', marginTop: '4px', lineHeight: 1.4 }}>
                        {lvl.desc}
                      </p>
                    </div>
                    {isSelected && <CheckCircle2 size={20} color="#3366ff" />}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  background: '#3366ff',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Sectors */}
        {step === 2 && (
          <div>
            <p style={{ fontSize: '13px', color: '#a0a0b8', marginBottom: '20px' }}>
              Select the industry sectors you follow most closely. We'll customize your pulse feeds, news, and default watchlist cards accordingly.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '36px' }}>
              {SECTOR_OPTIONS.map((sec) => {
                const isSelected = selectedSectors.includes(sec);
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => toggleSector(sec)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '9999px',
                      background: isSelected ? 'rgba(51, 102, 255, 0.15)' : 'rgba(26, 26, 40, 0.6)',
                      border: `1px solid ${isSelected ? '#3366ff' : 'rgba(42, 42, 68, 0.8)'}`,
                      color: isSelected ? '#3366ff' : '#a0a0b8',
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {isSelected && <span style={{ color: '#00c853' }}>●</span>}
                    <span>{sec}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#a0a0b8',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                &larr; Back
              </button>

              <button
                onClick={handleFinish}
                disabled={isSubmitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #2563eb, #3366ff)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(51, 102, 255, 0.4)',
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Configuring Terminal...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Market Pulse</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
