'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Briefcase, ArrowLeft, ArrowRight } from 'lucide-react';

const accountTypes = [
  {
    id: 'family',
    label: 'Family',
    description: 'Manage finances for your family. Create sub-accounts for kids, set spending controls, assign chores, and teach financial literacy.',
    tag: 'For parents & kids',
    icon: Users,
    color: 'green',
  },
  {
    id: 'business',
    label: 'Business',
    description: 'Manage finances for your team. Create employee accounts, set budgets, track expenses, and streamline payroll.',
    tag: 'For teams & orgs',
    icon: Briefcase,
    color: 'blue',
  },
] as const;

export default function AccountTypePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-text-muted mb-2">Step 1 of 3</p>
        <h1 className="text-2xl font-bold">Choose your account type</h1>
        <p className="text-text-secondary mt-2">Select how you plan to use FinPlace. You can always change this later.</p>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        {accountTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selected === type.id;
          const bgDim = type.color === 'green' ? 'bg-green-dim' : 'bg-blue-dim';
          const textColor = type.color === 'green' ? 'text-green' : 'text-blue';
          return (
            <button
              key={type.id}
              onClick={() => setSelected(type.id)}
              className={`text-left p-4 md:p-5 rounded-lg border-2 transition-all ${
                isSelected
                  ? type.color === 'green'
                    ? 'border-green bg-green-dim/30'
                    : 'border-blue bg-blue-dim/30'
                  : 'border-border bg-bg-card hover:border-border-hover'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-md ${bgDim} ${textColor} flex items-center justify-center shrink-0`}>
                  <Icon size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{type.label}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${bgDim} ${textColor}`}>{type.tag}</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">{type.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <Link href="/register" className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>
        <button
          disabled={!selected || loading}
          onClick={async () => {
            if (!selected) return;
            setLoading(true);
            try {
              const res = await fetch('/api/onboarding', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountType: selected }),
              });
              if (res.ok) {
                router.push('/onboarding/wallet');
              }
            } finally {
              setLoading(false);
            }
          }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-md font-semibold text-sm transition-all ${
            selected && !loading
              ? 'bg-green text-black hover:opacity-90'
              : 'bg-bg-elevated text-text-muted cursor-not-allowed'
          }`}
        >
          {loading ? 'Saving...' : 'Continue'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
