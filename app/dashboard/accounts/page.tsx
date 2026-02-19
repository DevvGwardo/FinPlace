'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Snowflake } from 'lucide-react';
import { formatCurrency, getInitials } from '@/lib/utils';

type Account = {
  id: string;
  name: string;
  type: string;
  balance: number | string;
  isActive: boolean;
};

export default function AccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/accounts', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setAccounts(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const preferredMainAccount =
    filteredAccounts.find((account) =>
      account.name.toLowerCase().includes('main')
    ) ?? filteredAccounts[0];
  const secondaryAccounts = filteredAccounts.filter(
    (account) => account.id !== preferredMainAccount?.id
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">Sub-Accounts</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Sub-Accounts</h1>
        </div>
        <Link href="/dashboard/accounts/new" className="flex items-center gap-2 bg-green text-black font-semibold px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity">
          <Plus size={16} /> Add New
        </Link>
      </div>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search accounts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-bg-elevated border border-border rounded-md pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
        />
      </div>

      {preferredMainAccount && (
        <Link
          key={preferredMainAccount.id}
          href={`/dashboard/accounts/${preferredMainAccount.id}`}
          className="block bg-bg-card border border-border rounded-lg p-5 hover:border-border-hover transition-colors mb-3"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-dim text-green flex items-center justify-center text-sm font-semibold">
                {getInitials(preferredMainAccount.name)}
              </div>
              <div>
                <p className="font-semibold">{preferredMainAccount.name}</p>
                <p className="text-xs text-text-muted capitalize">{preferredMainAccount.type} • Main</p>
              </div>
            </div>
            {!preferredMainAccount.isActive ? (
              <span className="flex items-center gap-1 text-xs bg-blue-dim text-blue px-2 py-1 rounded-full">
                <Snowflake size={12} /> Frozen
              </span>
            ) : (
              <span className="text-xs bg-green-dim text-green px-2 py-1 rounded-full">Active</span>
            )}
          </div>
          <p className="text-2xl font-bold">{formatCurrency(Number(preferredMainAccount.balance))}</p>
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {secondaryAccounts.map((account) => (
          <Link
            key={account.id}
            href={`/dashboard/accounts/${account.id}`}
            className="bg-bg-card border border-border rounded-lg p-5 hover:border-border-hover transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-dim text-green flex items-center justify-center text-sm font-semibold">
                  {getInitials(account.name)}
                </div>
                <div>
                  <p className="font-semibold">{account.name}</p>
                  <p className="text-xs text-text-muted capitalize">{account.type}</p>
                </div>
              </div>
              {!account.isActive ? (
                <span className="flex items-center gap-1 text-xs bg-blue-dim text-blue px-2 py-1 rounded-full">
                  <Snowflake size={12} /> Frozen
                </span>
              ) : (
                <span className="text-xs bg-green-dim text-green px-2 py-1 rounded-full">Active</span>
              )}
            </div>
            <p className="text-2xl font-bold">{formatCurrency(Number(account.balance))}</p>
          </Link>
        ))}
      </div>

      {accounts.length === 0 && !searchQuery && !loading && (
        <div className="text-center py-12 text-text-muted">
          <p className="text-sm">No sub-accounts yet</p>
          <Link href="/dashboard/accounts/new" className="text-green text-sm hover:underline mt-2 inline-block">Create your first account</Link>
        </div>
      )}

      {filteredAccounts.length === 0 && searchQuery && (
        <div className="text-center py-12 text-text-muted">
          <Search size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No accounts match &ldquo;{searchQuery}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
