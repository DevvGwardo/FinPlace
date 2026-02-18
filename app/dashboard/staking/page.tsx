'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, DollarSign, Clock, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useConfetti } from '@/hooks/use-confetti';

export default function StakingPage() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [stakedBalance, setStakedBalance] = useState(0);
  const [earnedTotal, setEarnedTotal] = useState(0);
  const [earnedMonth, setEarnedMonth] = useState(0);
  const [apy, setApy] = useState(0);
  const [processing, setProcessing] = useState<'stake' | 'unstake' | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { fireConfetti } = useConfetti();

  const fetchStaking = () => {
    fetch('/api/staking')
      .then(res => res.json())
      .then(data => {
        setStakedBalance(data.stakedBalance || 0);
        setEarnedTotal(data.earnedTotal || 0);
        setApy(data.weightedApy || 0);
        // earnedMonth is approximate - not separately tracked
        setEarnedMonth(data.earnedTotal ? Math.round(data.earnedTotal / 12 * 100) / 100 : 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStaking(); }, []);

  const handleStake = async () => {
    const val = Number(stakeAmount);
    if (!val || val <= 0) return;
    setProcessing('stake');
    try {
      const res = await fetch('/api/staking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset: 'USD', amount: val, apy: 5.2, lockPeriod: 30 }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Successfully staked ${formatCurrency(val)}`);
      fireConfetti();
      setStakeAmount('');
      fetchStaking();
    } catch {
      toast.error('Failed to stake');
    }
    setProcessing(null);
  };

  const handleUnstake = async () => {
    const val = Number(unstakeAmount);
    if (!val || val <= 0) return;
    setProcessing('unstake');
    try {
      // Fetch positions to find one to unstake
      const stakingRes = await fetch('/api/staking');
      const data = await stakingRes.json();
      const activePosition = data.positions?.[0];
      if (!activePosition) {
        toast.error('No active staking position');
        setProcessing(null);
        return;
      }
      const res = await fetch(`/api/staking/${activePosition.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Successfully unstaked ${formatCurrency(val)}`);
      setUnstakeAmount('');
      fetchStaking();
    } catch {
      toast.error('Failed to unstake');
    }
    setProcessing(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">Staking</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Staking</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Staked Balance', value: formatCurrency(stakedBalance), icon: DollarSign, color: 'green' },
          { label: 'Current APY', value: `${apy}%`, icon: TrendingUp, color: 'green' },
          { label: 'Total Earned', value: formatCurrency(earnedTotal), icon: Zap, color: 'purple' },
          { label: 'This Month', value: formatCurrency(earnedMonth), icon: Clock, color: 'blue' },
        ].map((stat) => {
          const Icon = stat.icon;
          const bgDim = stat.color === 'green' ? 'bg-green-dim' : stat.color === 'purple' ? 'bg-purple-dim' : 'bg-blue-dim';
          const textColor = stat.color === 'green' ? 'text-green' : stat.color === 'purple' ? 'text-purple' : 'text-blue';
          return (
            <div key={stat.label} className="bg-bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-muted">{stat.label}</span>
                <div className={`w-8 h-8 rounded-md ${bgDim} ${textColor} flex items-center justify-center`}>
                  <Icon size={16} />
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5">
          <h3 className="font-semibold mb-4">Stake More</h3>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-text-secondary">Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-bg-elevated border border-border rounded-md pl-8 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
                />
              </div>
            </div>
            {stakeAmount && (
              <p className="text-xs text-text-muted">
                Est. monthly yield: <span className="text-green">{formatCurrency(Number(stakeAmount) * (apy / 100) / 12)}</span>
              </p>
            )}
            <button
              onClick={handleStake}
              disabled={!stakeAmount || processing !== null}
              className="w-full bg-green text-black font-semibold py-2.5 rounded-md text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing === 'stake' ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                'Stake'
              )}
            </button>
          </div>
        </div>

        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5">
          <h3 className="font-semibold mb-4">Unstake</h3>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-text-secondary">Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                <input
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-bg-elevated border border-border rounded-md pl-8 pr-12 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-green focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setUnstakeAmount(String(stakedBalance))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-green hover:text-green/80 transition-colors px-1.5 py-0.5"
                >
                  Max
                </button>
              </div>
            </div>
            <p className="text-xs text-text-muted">Available: {formatCurrency(stakedBalance)}</p>
            <button
              onClick={handleUnstake}
              disabled={!unstakeAmount || processing !== null}
              className="w-full bg-bg-elevated border border-border text-text font-semibold py-2.5 rounded-md text-sm hover:border-border-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing === 'unstake' ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                'Unstake'
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
