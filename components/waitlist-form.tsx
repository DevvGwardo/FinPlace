'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

interface WaitlistFormProps {
  size?: 'default' | 'large';
  className?: string;
}

export function WaitlistForm({ size = 'default', className = '' }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
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
      if (res.ok) setEmail('');
    } catch {
      setMessage('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className={`flex items-center justify-center gap-2 text-green ${size === 'large' ? 'text-lg' : 'text-sm'} ${className}`}>
        <CheckCircle2 size={size === 'large' ? 20 : 16} />
        <span>{message}</span>
      </div>
    );
  }

  const isLarge = size === 'large';

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row items-center gap-3 ${className}`}>
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="Enter your email"
          className={`bg-bg-elevated border border-border rounded-lg text-text placeholder:text-text-muted focus:outline-none focus:border-green/50 transition-colors ${
            isLarge ? 'px-5 py-4 text-base w-[320px]' : 'px-4 py-3 text-sm w-[280px]'
          } ${status === 'error' ? 'border-red-500/50' : ''}`}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`group relative inline-flex items-center justify-center gap-2 bg-green text-black font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-300 disabled:opacity-70 ${
          isLarge ? 'px-8 py-4 text-base' : 'px-6 py-3 text-sm'
        }`}
      >
        {status === 'loading' ? (
          <Loader2 size={isLarge ? 20 : 16} className="animate-spin" />
        ) : (
          <>
            Join the Waitlist
            <ArrowRight
              size={isLarge ? 18 : 16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </>
        )}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-xs sm:absolute sm:-bottom-6 sm:left-0">{message}</p>
      )}
    </form>
  );
}
