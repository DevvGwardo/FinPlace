import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Plus,
  ArrowRight,
  CreditCard,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, getInitials, formatRelativeTime } from '@/lib/utils';
import { getTotalBalance, getSubAccounts, getRecentTransactions, getStakingSummary } from '@/lib/queries';

export default async function DashboardPage() {
  const [totalBalance, subAccounts, recentTransactions, stakingSummary] = await Promise.all([
    getTotalBalance(),
    getSubAccounts(),
    getRecentTransactions(5),
    getStakingSummary(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Alert Banner */}
      <div className="bg-blue-dim border border-blue/20 rounded-lg p-4 mb-6 flex items-center flex-wrap gap-3">
        <AlertCircle size={18} className="text-blue shrink-0" />
        <p className="text-sm text-text-secondary">
          <span className="text-blue font-medium">New:</span> Virtual cards are now available. Issue instant cards for any sub-account.
        </p>
        <Link href="/dashboard/cards" className="text-sm text-blue hover:underline ml-auto shrink-0">
          Learn more
        </Link>
      </div>

      {/* Balance & Staking Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {/* Total Balance */}
        <div className="md:col-span-2 bg-bg-card border border-border rounded-lg p-4 md:p-6">
          <p className="text-sm text-text-muted">Total Balance</p>
          <p className="text-[36px] font-bold mt-1 leading-tight">{formatCurrency(totalBalance)}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={14} className="text-green" />
            <span className="text-sm text-text-secondary">Across {subAccounts.length} account{subAccounts.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Staking Summary */}
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-6">
          <p className="text-sm text-text-muted">Staking Yield</p>
          <p className="text-[28px] font-bold mt-1 leading-tight text-green">{stakingSummary.weightedApy}% <span className="text-sm font-normal text-text-muted">APY</span></p>
          <p className="text-sm text-text-secondary mt-2">
            Earned this month: <span className="text-green">{formatCurrency(stakingSummary.earnedTotal)}</span>
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Link
          href="/dashboard/fund"
          className="bg-bg-card border border-border rounded-lg p-4 flex flex-col items-center gap-2 hover:border-border-hover transition-colors"
        >
          <div className="w-10 h-10 rounded-md bg-green-dim text-green flex items-center justify-center">
            <Plus size={20} />
          </div>
          <span className="text-sm font-medium">Fund</span>
        </Link>
        <Link
          href="/dashboard/transfer"
          className="bg-bg-card border border-border rounded-lg p-4 flex flex-col items-center gap-2 hover:border-border-hover transition-colors"
        >
          <div className="w-10 h-10 rounded-md bg-blue-dim text-blue flex items-center justify-center">
            <Send size={20} />
          </div>
          <span className="text-sm font-medium">Transfer</span>
        </Link>
        <Link
          href="/dashboard/staking"
          className="bg-bg-card border border-border rounded-lg p-4 flex flex-col items-center gap-2 hover:border-border-hover transition-colors"
        >
          <div className="w-10 h-10 rounded-md bg-purple-dim text-purple flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <span className="text-sm font-medium">Stake</span>
        </Link>
      </div>

      {/* Sub-Accounts & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        {/* Sub-Accounts */}
        <div className="lg:col-span-2">
          <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Sub-Accounts</h2>
              <Link href="/dashboard/accounts" className="text-xs text-text-muted hover:text-text transition-colors flex items-center gap-1">
                See all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {subAccounts.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">No accounts yet</p>
              ) : (
                subAccounts.map((account: any) => (
                  <Link
                    key={account.id}
                    href={`/dashboard/accounts/${account.id}`}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-bg-elevated transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-green-dim text-green flex items-center justify-center text-xs font-semibold">
                      {getInitials(account.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{account.name}</p>
                      <p className="text-xs text-text-muted capitalize">{account.type}</p>
                    </div>
                    <p className="text-sm font-medium">{formatCurrency(Number(account.balance))}</p>
                  </Link>
                ))
              )}
            </div>
            <Link
              href="/dashboard/accounts/new"
              className="flex items-center justify-center gap-2 mt-3 p-2.5 rounded-md border border-dashed border-border text-sm text-text-muted hover:text-text hover:border-border-hover transition-colors"
            >
              <Plus size={16} />
              Add Account
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-3">
          <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recent Transactions</h2>
              <Link href="/dashboard/transactions" className="text-xs text-text-muted hover:text-text transition-colors flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="flex flex-col">
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">No transactions yet</p>
              ) : (
                recentTransactions.map((tx: any) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 py-3 border-b border-border last:border-0"
                  >
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center ${Number(tx.amount) > 0 ? 'bg-green-dim text-green' : 'bg-bg-elevated text-text-muted'}`}>
                      {Number(tx.amount) > 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tx.description}</p>
                      <p className="text-xs text-text-muted">{tx.category || 'General'} &middot; {formatRelativeTime(tx.createdAt)}</p>
                    </div>
                    <p className={`text-sm font-medium ${Number(tx.amount) > 0 ? 'text-green' : 'text-text'}`}>
                      {Number(tx.amount) > 0 ? '+' : ''}{formatCurrency(Number(tx.amount))}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
