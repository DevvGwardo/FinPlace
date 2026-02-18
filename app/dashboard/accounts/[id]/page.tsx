'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Settings, DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatRelativeTime, getInitials } from '@/lib/utils';

type Account = {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency?: string;
  isActive?: boolean;
};

type Transaction = {
  id: string;
  accountId: string;
  amount: number | string;
  description?: string | null;
  category?: string | null;
  createdAt: string;
};

export default function AccountDetailPage() {
  const { toast } = useToast();
  const params = useParams<{ id: string }>();
  const accountId = params.id;

  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFundForm, setShowFundForm] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const accountTransactions = useMemo(
    () => transactions.filter((tx) => tx.accountId === accountId).slice(0, 10),
    [transactions, accountId]
  );

  const loadData = useCallback(async () => {
    if (!accountId) return;

    setLoading(true);
    try {
      const [accountsRes, txRes] = await Promise.all([
        fetch('/api/accounts', { cache: 'no-store' }),
        fetch('/api/transactions', { cache: 'no-store' }),
      ]);

      const [accountsData, txData] = await Promise.all([accountsRes.json(), txRes.json()]);
      const accounts = Array.isArray(accountsData) ? accountsData : [];
      const current = accounts.find((a: Account) => a.id === accountId) || null;

      setAccount(current);
      setTransactions(Array.isArray(txData) ? txData : []);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFund = async () => {
    if (!account) return;

    const amount = Number(fundAmount);
    if (!Number.isFinite(amount) || amount <= 0) return;

    setProcessing(true);
    try {
      const res = await fetch('/api/fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: account.id,
          amount,
          source: 'Manual top up',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Funding failed');
      }

      toast.success(`Funded ${formatCurrency(amount)} successfully`);
      setFundAmount('');
      setShowFundForm(false);
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Funding failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard/accounts" className="text-text-muted hover:text-text transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Account Details</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard/accounts" className="text-text-muted hover:text-text transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Account Details</h1>
        </div>
        <div className="bg-bg-card border border-border rounded-lg p-6 text-center text-text-muted">
          Account not found.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/accounts" className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Account Details</h1>
      </div>

      <div className="bg-bg-card border border-border rounded-lg p-4 md:p-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-dim text-green flex items-center justify-center text-lg font-semibold">
              {getInitials(account.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{account.name}</h2>
              <p className="text-sm text-text-muted capitalize">{account.type} account</p>
            </div>
          </div>
          {account.isActive === false ? (
            <span className="text-xs bg-blue/10 text-blue px-2.5 py-1 rounded-full">Frozen</span>
          ) : (
            <span className="text-xs bg-green-dim text-green px-2.5 py-1 rounded-full">Active</span>
          )}
        </div>

        <p className="text-2xl md:text-[36px] font-bold mt-4">{formatCurrency(Number(account.balance))}</p>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <button
            onClick={() => setShowFundForm(!showFundForm)}
            className="flex items-center gap-2 bg-green text-black font-semibold px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
          >
            <DollarSign size={16} /> Fund
          </button>
          <Link
            href={`/dashboard/accounts/${account.id}/controls`}
            className="flex items-center gap-2 bg-bg-elevated border border-border px-4 py-2 rounded-md text-sm hover:border-border-hover transition-colors"
          >
            <Settings size={16} /> Controls
          </Link>
        </div>

        {showFundForm && (
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
                onClick={() => {
                  setShowFundForm(false);
                  setFundAmount('');
                }}
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
          {accountTransactions.length === 0 ? (
            <p className="text-sm text-text-muted">No transactions yet for this account.</p>
          ) : (
            accountTransactions.map((tx) => {
              const amount = Number(tx.amount);
              const isCredit = amount > 0;
              return (
                <div key={tx.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                  <div className={`w-9 h-9 rounded-md flex items-center justify-center ${isCredit ? 'bg-green-dim text-green' : 'bg-bg-elevated text-text-muted'}`}>
                    {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{tx.description || tx.category || 'Transaction'}</p>
                    <p className="text-xs text-text-muted">{formatRelativeTime(tx.createdAt)}</p>
                  </div>
                  <p className={`text-sm font-medium ${isCredit ? 'text-green' : 'text-text'}`}>
                    {isCredit ? '+' : ''}{formatCurrency(amount)}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
