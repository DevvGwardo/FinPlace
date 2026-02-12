'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

function validatePassword(password: string): PasswordValidation {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
}

function isPasswordValid(validation: PasswordValidation): boolean {
  return Object.values(validation).every(Boolean);
}

type View = 'waitlist' | 'register';

export default function RegisterPage() {
  const [view, setView] = useState<View>('waitlist');

  return view === 'waitlist' ? (
    <WaitlistView onSwitchToRegister={() => setView('register')} />
  ) : (
    <RegisterView onSwitchToWaitlist={() => setView('waitlist')} />
  );
}

function WaitlistView({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message);
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setMessage('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Join the Waitlist</h1>
        <p className="text-text-secondary mt-2">
          We&apos;re onboarding new users in waves. Drop your email and we&apos;ll notify you when it&apos;s your turn.
        </p>
      </div>

      {status === 'success' ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-green-dim text-green flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={24} />
          </div>
          <p className="text-green font-medium mb-2">{message}</p>
          <p className="text-text-muted text-sm">
            We&apos;ll email you when your account is ready to set up.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {status === 'error' && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {message}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-text-secondary font-medium">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="you@example.com"
                className="w-full bg-bg-elevated border border-border rounded-md pl-10 pr-4 py-3 text-[15px] text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
                required
                disabled={status === 'loading'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full inline-flex items-center justify-center gap-2 bg-green text-black font-semibold py-3 rounded-md hover:opacity-90 transition-opacity mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Join the Waitlist
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      )}

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-bg px-3 text-text-muted">already approved?</span>
        </div>
      </div>

      <button
        onClick={onSwitchToRegister}
        className="w-full flex items-center justify-center gap-2 bg-bg-elevated border border-border text-text py-3 rounded-md hover:border-border-hover transition-colors text-sm font-medium"
      >
        Create your account
      </button>

      <p className="text-center text-sm text-text-muted mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-green hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

function RegisterView({ onSwitchToWaitlist }: { onSwitchToWaitlist: () => void }) {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid(passwordValidation)) {
      setError('Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      // Sign in with Supabase after successful registration
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError('Account created but sign-in failed. Please log in manually.');
        setIsLoading(false);
        return;
      }

      router.push('/onboarding');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-text-secondary mt-2">
          You&apos;ve been approved! Set up your FinPlace account below.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
          {error}
          {error.includes('waitlist') && (
            <button
              onClick={onSwitchToWaitlist}
              className="block mx-auto mt-2 text-green hover:underline text-xs"
            >
              Join the waitlist
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-text-secondary font-medium">Full Name</label>
          <div className="relative">
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-bg-elevated border border-border rounded-md pl-10 pr-4 py-3 text-[15px] text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-text-secondary font-medium">Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-approved@email.com"
              className="w-full bg-bg-elevated border border-border rounded-md pl-10 pr-4 py-3 text-[15px] text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-text-secondary font-medium">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (!passwordTouched) setPasswordTouched(true);
              }}
              placeholder="Min. 8 characters"
              className="w-full bg-bg-elevated border border-border rounded-md pl-10 pr-10 py-3 text-[15px] text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordTouched && password.length > 0 && (
            <ul className="text-xs space-y-1 mt-1">
              <li className={passwordValidation.minLength ? 'text-green' : 'text-text-muted'}>
                {passwordValidation.minLength ? '\u2713' : '\u2022'} At least 8 characters
              </li>
              <li className={passwordValidation.hasUppercase ? 'text-green' : 'text-text-muted'}>
                {passwordValidation.hasUppercase ? '\u2713' : '\u2022'} One uppercase letter
              </li>
              <li className={passwordValidation.hasLowercase ? 'text-green' : 'text-text-muted'}>
                {passwordValidation.hasLowercase ? '\u2713' : '\u2022'} One lowercase letter
              </li>
              <li className={passwordValidation.hasNumber ? 'text-green' : 'text-text-muted'}>
                {passwordValidation.hasNumber ? '\u2713' : '\u2022'} One number
              </li>
              <li className={passwordValidation.hasSpecial ? 'text-green' : 'text-text-muted'}>
                {passwordValidation.hasSpecial ? '\u2713' : '\u2022'} One special character
              </li>
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-text-secondary font-medium">Confirm Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className={`w-full bg-bg-elevated border rounded-md pl-10 pr-10 py-3 text-[15px] text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors ${
                confirmPassword && !passwordsMatch ? 'border-red-500' : 'border-border'
              }`}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <span className="text-xs text-red-500">Passwords do not match</span>
          )}
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 rounded border-border bg-bg-elevated accent-green"
            disabled={isLoading}
          />
          <span className="text-sm text-text-secondary">
            I agree to the{' '}
            <Link href="#" className="text-green hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link href="#" className="text-green hover:underline">Privacy Policy</Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={!agreed || isLoading}
          className="w-full bg-green text-black font-semibold py-3 rounded-md hover:opacity-90 transition-opacity mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-text-muted mt-6">
        Not approved yet?{' '}
        <button onClick={onSwitchToWaitlist} className="text-green hover:underline">Join the waitlist</button>
        {' '}&middot;{' '}
        <Link href="/login" className="text-green hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
