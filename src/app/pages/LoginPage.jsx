// ROADMAP: Section 5 & Phase 1 — Login Page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginAsDemo, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success('Welcome back to Market Pulse');
        navigate('/dashboard');
      } else {
        setErrorMessage(res.error || 'Invalid credentials');
        toast.error(res.error || 'Failed to sign in');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      toast.error('Google sign-in error: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#f0f0f5', marginBottom: '6px' }}>
          Terminal Access
        </h2>
        <p style={{ fontSize: '13px', color: '#a0a0b8' }}>
          Enter your credentials to access your real-time analytics
        </p>
      </div>

      {errorMessage && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: 'rgba(255, 23, 68, 0.1)',
            border: '1px solid rgba(255, 23, 68, 0.3)',
            borderRadius: '8px',
            color: '#ff4081',
            fontSize: '13px',
            marginBottom: '18px',
          }}
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#a0a0b8', marginBottom: '6px' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail
              size={16}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#606078' }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@marketpulse.in"
              required
              style={{
                width: '100%',
                padding: '12px 14px 12px 40px',
                background: '#0a0a0f',
                border: '1px solid #2a2a44',
                borderRadius: '8px',
                color: '#f0f0f5',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#3366ff')}
              onBlur={(e) => (e.target.style.borderColor = '#2a2a44')}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 500, color: '#a0a0b8' }}>
              Password
            </label>
          </div>
          <div style={{ position: 'relative' }}>
            <Lock
              size={16}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#606078' }}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              style={{
                width: '100%',
                padding: '12px 40px 12px 40px',
                background: '#0a0a0f',
                border: '1px solid #2a2a44',
                borderRadius: '8px',
                color: '#f0f0f5',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#3366ff')}
              onBlur={(e) => (e.target.style.borderColor = '#2a2a44')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#606078',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #2563eb, #3366ff)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 16px rgba(51, 102, 255, 0.35)',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Terminal</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '22px 0',
        }}
      >
        <div style={{ flex: 1, height: '1px', background: '#1e1e30' }} />
        <span style={{ fontSize: '11px', color: '#606078', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          or continue with
        </span>
        <div style={{ flex: 1, height: '1px', background: '#1e1e30' }} />
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        style={{
          width: '100%',
          padding: '11px',
          background: 'rgba(26, 26, 40, 0.8)',
          border: '1px solid #2a2a44',
          borderRadius: '8px',
          color: '#f0f0f5',
          fontSize: '13px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          cursor: 'pointer',
          transition: 'background-color 0.2s, border-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#222236';
          e.currentTarget.style.borderColor = '#3366ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(26, 26, 40, 0.8)';
          e.currentTarget.style.borderColor = '#2a2a44';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Demo Account Instant Access */}
      <button
        type="button"
        onClick={() => {
          loginAsDemo();
          toast.success('Signed in as Demo Trader (₹10,00,000 Portfolio)');
          navigate('/dashboard');
        }}
        style={{
          marginTop: '10px',
          width: '100%',
          padding: '10px',
          background: 'linear-gradient(135deg, rgba(51, 102, 255, 0.15), rgba(39, 200, 255, 0.1))',
          border: '1px solid rgba(51, 102, 255, 0.4)',
          borderRadius: '8px',
          color: '#27c8ff',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          boxShadow: '0 0 16px rgba(51, 102, 255, 0.15)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(51, 102, 255, 0.25), rgba(39, 200, 255, 0.2))';
          e.currentTarget.style.borderColor = '#27c8ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(51, 102, 255, 0.15), rgba(39, 200, 255, 0.1))';
          e.currentTarget.style.borderColor = 'rgba(51, 102, 255, 0.4)';
        }}
      >
        <span>⚡ Explore Terminal as Demo Trader</span>
      </button>

      {/* Switch to Signup */}
      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#a0a0b8' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#3366ff', fontWeight: 600, textDecoration: 'none' }}>
          Create account
        </Link>
      </div>
    </div>
  );
}
