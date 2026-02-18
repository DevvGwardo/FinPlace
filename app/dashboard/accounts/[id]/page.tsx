'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, DollarSign, Snowflake, ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const account = {
  id: '1', name: 'Emma', type: 'child', status: 'active',
  walletAddress: '0x742d...3a8B', initials: 'EM',
};

const transactions = [
  { id: '1', description: 'Allowance', amount: 25.00, type: 'deposit', date: 'Today' },
  { id: '2', description: 'App Store', amount: -4.99, type: 'withdrawal', date: 'Yesterday' },
  { id: '3', description: 'Chore Reward', amount: 10.00, type: 'deposit', date: '2 days ago' },
  { id: '4', description: 'Snack Shop', amount: -7.50, type: 'withdrawal', date: '3 days ago' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function AccountDetailPage() {
  const [balance, setBalance] = useState(842.50);
  const [frozen, setFrozen] = useState(false);
  const [showFundForm, setShowFundForm] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleFund = () => {
    const amount = parseFloat(fundAmount);
    if (!amount || amount <= 0) return;
    setProcessing(true);
    setTimeout(() => {
      setBalance((prev) => prev + amount);
      toast.success(`Funded $${amount.toFixed(2)} successfully`);
      setFundAmount('');
      setShowFundForm(false);
      setProcessing(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/accounts" className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Account Details</h1>
      </div>

      <div className="bg-bg-card border border-border rounded-lg p-4 md:p-6 mb-4">
        {frozen && (
          <div className="flex items-center gap-2 bg-blue/10 border border-blue/20 rounded-md p-3 mb-4 text-sm text-blue">
            <Snowflake size={16} className="shrink-0" />
            This account is currently frozen. Transactions are disabled.
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-dim text-green flex items-center justify-center text-lg font-semibold">
              {account.initials}
            </div>
            <div>
              <h2 className="text-xl font-bold">{account.name}</h2>
              <p className="text-sm text-text-muted capitalize">{account.type} account &middot; {account.walletAddress}</p>
            </div>
          </div>
          {frozen ? (
            <span className="text-xs bg-blue/10 text-blue px-2.5 py-1 rounded-full">Frozen</span>
          ) : (
            <span className="text-xs bg-green-dim text-green px-2.5 py-1 rounded-full">Active</span>
          )}
        </div>
        <p className="text-2xl md:text-[36px] font-bold mt-4">{formatCurrency(balance)}</p>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <button
            onClick={() => !frozen && setShowFundForm(!showFundForm)}
            disabled={frozen}
            className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-md text-sm transition-opacity ${
              frozen
                ? 'bg-bg-elevated text-text-muted cursor-not-allowed'
                : 'bg-green text-black hover:opacity-90'
            }`}
          >
            <DollarSign size={16} /> Fund
          </button>
          <button
            onClick={() => setFrozen(!frozen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
              frozen
                ? 'bg-blue/10 text-blue border border-blue/20 hover:bg-blue/20'
                : 'bg-bg-elevated border border-border hover:border-border-hover'
            }`}
          >
            <Snowflake size={16} /> {frozen ? 'Unfreeze' : 'Freeze'}
          </button>
          <Link href={`/dashboard/accounts/${account.id}/controls`} className="flex items-center gap-2 bg-bg-elevated border border-border px-4 py-2 rounded-md text-sm hover:border-border-hover transition-colors">
            <Settings size={16} /> Controls
          </Link>
        </div>

        {showFundForm && !frozen && (
          <div className="mt-4 p-4 bg-bg-elevated border border-border rounded-lg">
            <label className="text-sm text-text-secondary font-medium mb-2 block">Fund Amount</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-bg-card border border-border rounded-md pl-8 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
                />
              </div>
              <button
                onClick={handleFund}
                disabled={processing}
                className="bg-green text-black font-semibold px-4 py-2.5 rounded-md text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {processing ? 'Processing...' : 'Confirm'}
              </button>
              <button
                onClick={() => { setShowFundForm(false); setFundAmount(''); }}
                className="bg-bg-card border border-border px-4 py-2.5 rounded-md text-sm hover:border-border-hover transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-bg-card border border-border rounded-lg p-5">
        <h3 className="font-semibold mb-4">Recent Transactions</h3>
        <div className="flex flex-col">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
              <div className={`w-9 h-9 rounded-md flex items-center justify-center ${tx.amount > 0 ? 'bg-green-dim text-green' : 'bg-bg-elevated text-text-muted'}`}>
                {tx.amount > 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{tx.description}</p>
                <p className="text-xs text-text-muted">{tx.date}</p>
              </div>
              <p className={`text-sm font-medium ${tx.amount > 0 ? 'text-green' : 'text-text'}`}>
                {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}
