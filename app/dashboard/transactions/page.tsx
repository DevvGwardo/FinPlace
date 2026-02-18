'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Filter, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type TypeFilter = 'all' | 'deposit' | 'withdrawal' | 'transfer';

export default function TransactionsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = () => {
    toast.success('Transactions exported!');
  };

  const filtered = transactions.filter((tx: any) => {
    const desc = tx.description || '';
    const matchesSearch = desc.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const filterPills: { label: string; value: TypeFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Deposits', value: 'deposit' },
    { label: 'Withdrawals', value: 'withdrawal' },
    { label: 'Transfers', value: 'transfer' },
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">Transactions</h1>
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
          <h1 className="text-2xl font-bold">Transactions</h1>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-bg-elevated border border-border px-3 py-2.5 rounded-md text-sm hover:border-border-hover transition-colors"
        >
          <Download size={16} /> Export
        </button>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-bg-elevated border border-border rounded-md pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
          />
        </div>
        <button
          onClick={() => setFilterOpen((prev) => !prev)}
          className={`flex items-center gap-2 bg-bg-elevated border px-3 py-2.5 rounded-md text-sm transition-colors ${
            filterOpen ? 'border-green text-green' : 'border-border hover:border-border-hover'
          }`}
        >
          <Filter size={16} /> Filter
        </button>
      </div>

      {filterOpen && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {filterPills.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setTypeFilter(pill.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                typeFilter === pill.value
                  ? 'bg-green text-black'
                  : 'bg-bg-elevated border border-border text-text-secondary hover:border-border-hover'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      )}

      {!filterOpen && <div className="mb-4" />}

      <div className="bg-bg-card border border-border rounded-lg">
        {filtered.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-text-muted">No transactions found.</div>
        ) : (
          filtered.map((tx, i) => (
            <div key={tx.id}>
              <div
                onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
                className={`flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 cursor-pointer hover:bg-bg-elevated/50 transition-colors ${
                  i < filtered.length - 1 && expandedId !== tx.id ? 'border-b border-border' : ''
                }`}
              >
                <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${Number(tx.amount) > 0 ? 'bg-green-dim text-green' : 'bg-bg-elevated text-text-muted'}`}>
                  {Number(tx.amount) > 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.description || 'Transaction'}</p>
                  <p className="text-xs text-text-muted">{tx.account?.name || 'Unknown'}</p>
                </div>
                <span className="text-xs bg-bg-elevated text-text-muted px-2 py-1 rounded-md hidden sm:block">{tx.category || 'General'}</span>
                <span className="text-xs text-text-muted hidden md:block">{formatDate(tx.createdAt)}</span>
                <p className={`text-sm font-medium ${Number(tx.amount) > 0 ? 'text-green' : 'text-text'}`}>
                  {Number(tx.amount) > 0 ? '+' : ''}{formatCurrency(Math.abs(Number(tx.amount)))}
                </p>
              </div>
              {expandedId === tx.id && (
                <div className={`bg-bg-elevated p-4 mx-3 mb-3 rounded-md ${i < filtered.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-text-muted mb-0.5">Date</p>
                      <p className="font-medium">{formatDate(tx.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-0.5">Category</p>
                      <p className="font-medium">{tx.category || 'General'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-0.5">Account</p>
                      <p className="font-medium">{tx.account?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-0.5">Amount</p>
                      <p className={`font-medium ${Number(tx.amount) > 0 ? 'text-green' : 'text-text'}`}>
                        {Number(tx.amount) > 0 ? '+' : ''}{formatCurrency(Math.abs(Number(tx.amount)))}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted mb-0.5">Type</p>
                      <p className="font-medium capitalize">{tx.type}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {transactions.length === 0 && !loading && (
        <div className="text-center py-12 text-text-muted">
          <p className="text-sm">No transactions yet</p>
        </div>
      )}

    </div>
  );
}
