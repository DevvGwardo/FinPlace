'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Plus, Check, X, ArrowRight } from 'lucide-react';

interface ConnectedBank {
  id: string;
  name: string;
  last4: string;
  type: string;
}

export default function BankConnectionPage() {
  const [connectedBanks, setConnectedBanks] = useState<ConnectedBank[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFinish = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingComplete: true }),
      });
      if (res.ok) {
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConnectBank = () => {
    // Mock Plaid connection
    setConnectedBanks([
      ...connectedBanks,
      {
        id: String(connectedBanks.length + 1),
        name: 'Chase Bank',
        last4: '4532',
        type: 'Checking',
      },
    ]);
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-text-muted mb-2">Step 3 of 3</p>
        <h1 className="text-2xl font-bold">Connect your bank</h1>
        <p className="text-text-secondary mt-2">Link a bank account to fund your FinPlace wallet. You can skip this and do it later.</p>
      </div>

      {connectedBanks.length > 0 && (
        <div className="flex flex-col gap-2 mb-4">
          {connectedBanks.map((bank) => (
            <div key={bank.id} className="flex items-center gap-3 p-4 bg-bg-card border border-border rounded-lg">
              <div className="w-10 h-10 rounded-md bg-green-dim text-green flex items-center justify-center">
                <Building2 size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{bank.name}</p>
                <p className="text-xs text-text-muted">{bank.type} •••• {bank.last4}</p>
              </div>
              <Check size={18} className="text-green" />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleConnectBank}
        className="w-full p-5 rounded-lg border border-dashed border-border bg-bg-card hover:border-border-hover transition-colors flex items-center justify-center gap-3 mb-8"
      >
        <div className="w-10 h-10 rounded-md bg-blue-dim text-blue flex items-center justify-center">
          <Plus size={20} />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium">{connectedBanks.length > 0 ? 'Add Another Account' : 'Connect Bank Account'}</p>
          <p className="text-xs text-text-muted">Securely link via Plaid</p>
        </div>
      </button>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link href="/onboarding/wallet" className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="flex items-center gap-3">
          <button
            disabled={loading}
            onClick={handleFinish}
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            Skip for now
          </button>
          <button
            disabled={loading}
            onClick={handleFinish}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md font-semibold text-sm bg-green text-black hover:opacity-90 transition-opacity"
          >
            {loading ? 'Saving...' : 'Finish Setup'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
