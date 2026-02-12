'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Wallet, Plus, Link2, Copy, Check, Shield } from 'lucide-react';

export default function WalletSetupPage() {
  const [mode, setMode] = useState<'choose' | 'created'>('choose');
  const [copied, setCopied] = useState(false);
  const mockAddress = '0x742d...3a8B';
  const fullAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f3a8B';

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-text-muted mb-2">Step 2 of 3</p>
        <h1 className="text-2xl font-bold">Set up your wallet</h1>
        <p className="text-text-secondary mt-2">Your wallet is how FinPlace secures your funds on-chain.</p>
      </div>

      {mode === 'choose' ? (
        <div className="flex flex-col gap-3 mb-8">
          <button
            onClick={() => setMode('created')}
            className="text-left p-4 md:p-5 rounded-lg border border-border bg-bg-card hover:border-border-hover transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-md bg-green-dim text-green flex items-center justify-center shrink-0">
                <Plus size={22} />
              </div>
              <div>
                <h3 className="font-semibold">Create New Wallet</h3>
                <p className="text-sm text-text-secondary mt-1">We&apos;ll generate a secure wallet for you. You&apos;ll get a seed phrase to back up.</p>
              </div>
            </div>
          </button>

          <button className="text-left p-4 md:p-5 rounded-lg border border-border bg-bg-card hover:border-border-hover transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-md bg-blue-dim text-blue flex items-center justify-center shrink-0">
                <Link2 size={22} />
              </div>
              <div>
                <h3 className="font-semibold">Connect Existing Wallet</h3>
                <p className="text-sm text-text-secondary mt-1">Use WalletConnect, MetaMask, or Phantom to connect your wallet.</p>
              </div>
            </div>
          </button>
        </div>
      ) : (
        <div className="mb-8">
          <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-md bg-green-dim text-green flex items-center justify-center">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-sm text-text-muted">Your Wallet Address</p>
                <p className="font-mono text-sm font-medium break-all">{mockAddress}</p>
              </div>
              <button
                onClick={handleCopy}
                className="ml-auto text-text-muted hover:text-text transition-colors"
              >
                {copied ? <Check size={18} className="text-green" /> : <Copy size={18} />}
              </button>
            </div>
            <div className="bg-bg-elevated rounded-md p-3 flex items-start gap-2">
              <Shield size={16} className="text-purple shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary leading-relaxed">
                Your wallet has been created securely. Make sure to back up your seed phrase in a safe location. You&apos;ll need it to recover your wallet.
              </p>
            </div>
          </div>

          <button className="w-full bg-purple-dim text-purple border border-purple/20 py-3 rounded-md text-sm font-medium hover:bg-purple/20 transition-colors">
            Back Up Seed Phrase
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link href="/onboarding/type" className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>
        <Link
          href={mode === 'created' ? '/onboarding/bank' : '#'}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-semibold text-sm transition-all ${
            mode === 'created'
              ? 'bg-green text-black hover:opacity-90'
              : 'bg-bg-elevated text-text-muted cursor-not-allowed'
          }`}
          onClick={(e) => mode !== 'created' && e.preventDefault()}
        >
          Continue <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
