'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Flame, Trophy, Gift, Zap, Loader2 } from 'lucide-react';

const iconMap: Record<string, any> = { Zap, Flame, Trophy, Star, Gift };

export default function RewardsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [xp, setXp] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/rewards')
      .then(res => res.json())
      .then(data => {
        const totalXp = data.reduce((sum: number, r: any) => sum + (r.value || 0), 0);
        setXp(totalXp);
        setAchievements(data.map((r: any) => ({
          name: r.title,
          desc: r.description || '',
          earned: !!r.unlockedAt,
          icon: iconMap[r.icon || ''] || Star,
          id: r.id,
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  const level = Math.floor(xp / 250) + 1;
  const progress = (xp % 250) / 250 * 100;
  const xpInLevel = xp % 250;
  const xpForNext = 250;

  const handleClaim = (achievementName: string) => {
    setClaiming(achievementName);
    setTimeout(() => {
      setAchievements((prev) =>
        prev.map((a) => (a.name === achievementName ? { ...a, earned: true } : a))
      );
      setXp((prev) => prev + 100);
      setClaiming(null);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">Rewards</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Rewards</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5 text-center">
          <Star size={24} className="text-green mx-auto mb-2" />
          <p className="text-2xl font-bold">{xp.toLocaleString()}</p>
          <p className="text-xs text-text-muted">Total XP</p>
        </div>
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5 text-center">
          <Trophy size={24} className="text-purple mx-auto mb-2" />
          <p className="text-2xl font-bold">Level {level}</p>
          <div className="h-1.5 bg-bg-elevated rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-purple rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-text-muted mt-1">{xpInLevel}/{xpForNext} to Level {level + 1}</p>
        </div>
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5 text-center">
          <Flame size={24} className="text-green mx-auto mb-2" />
          <p className="text-2xl font-bold">--</p>
          <p className="text-xs text-text-muted">Current Streak</p>
        </div>
      </div>

      <h3 className="font-semibold mb-3">Achievements</h3>
      {achievements.length === 0 && (
        <div className="bg-bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-sm text-text-muted">No rewards yet</p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {achievements.map((a) => {
          const Icon = a.icon;
          const isClaiming = claiming === a.name;
          return (
            <div
              key={a.name}
              className={`bg-bg-card border rounded-lg p-4 flex items-center gap-3 transition-all ${a.earned ? 'border-green/20' : 'border-border'} ${isClaiming ? 'scale-[1.02] shadow-lg' : ''}`}
              style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease' }}
            >
              <div className={`w-10 h-10 rounded-md flex items-center justify-center ${a.earned ? 'bg-green-dim text-green' : 'bg-bg-elevated text-text-muted'}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{a.name}</p>
                <p className="text-xs text-text-muted">{a.desc}</p>
              </div>
              {a.earned ? (
                <span className="text-xs bg-green-dim text-green px-2 py-1 rounded-full">Earned</span>
              ) : (
                <button
                  onClick={() => handleClaim(a.name)}
                  disabled={isClaiming}
                  className="text-xs bg-green text-black font-medium px-3 py-2.5 min-h-[44px] rounded-full hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center gap-1"
                >
                  {isClaiming ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Claiming...
                    </>
                  ) : (
                    'Claim'
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
