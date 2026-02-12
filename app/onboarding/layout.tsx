'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';

const steps = [
  { label: 'Account Type', path: '/onboarding/type' },
  { label: 'Wallet', path: '/onboarding/wallet' },
  { label: 'Bank', path: '/onboarding/bank' },
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showProgress = steps.some((s) => pathname.includes(s.path));
  const currentIndex = steps.findIndex((s) => pathname.includes(s.path));

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="p-4 md:p-5 border-b border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-text">
            Fin<span className="text-green">Place</span>
          </Link>
          <span className="text-xs text-text-muted">Setup</span>
        </div>
      </header>

      {showProgress && (
        <div className="border-b border-border">
          <div className="max-w-lg mx-auto px-5 py-4">
            <div className="flex items-center gap-2">
              {steps.map((step, i) => {
                const isCompleted = i < currentIndex;
                const isActive = i === currentIndex;
                return (
                  <div key={step.path} className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                          isCompleted
                            ? 'bg-green text-black'
                            : isActive
                              ? 'bg-green text-black'
                              : 'bg-bg-elevated text-text-muted'
                        }`}
                      >
                        {isCompleted ? <Check size={14} /> : i + 1}
                      </div>
                      <span
                        className={`text-xs font-medium whitespace-nowrap ${
                          isCompleted || isActive ? 'text-green' : 'text-text-muted'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`h-px flex-1 min-w-4 ${
                          i < currentIndex ? 'bg-green' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex items-center justify-center p-4 md:p-5">
        <div className="w-full max-w-lg">
          {children}
        </div>
      </main>
    </div>
  );
}
