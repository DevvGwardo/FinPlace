import { auth } from '@/auth';
import Link from 'next/link';
import { ArrowRight, UserCircle, Wallet, Building2 } from 'lucide-react';

export default async function OnboardingPage() {
  const session = await auth();
  const name = session?.user?.name?.split(' ')[0] || 'there';

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full bg-green-dim text-green flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl font-bold">{name[0]?.toUpperCase()}</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome, {name}!</h1>
        <p className="text-text-secondary">Let&apos;s get your FinPlace account set up. It only takes a minute.</p>
      </div>

      <div className="flex flex-col gap-3 mb-8 text-left">
        <div className="flex items-center gap-4 p-4 bg-bg-card border border-border rounded-lg">
          <div className="w-10 h-10 rounded-md bg-green-dim text-green flex items-center justify-center shrink-0">
            <UserCircle size={20} />
          </div>
          <div>
            <p className="text-sm font-medium">Choose your account type</p>
            <p className="text-xs text-text-muted">Family or Business</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-bg-card border border-border rounded-lg">
          <div className="w-10 h-10 rounded-md bg-green-dim text-green flex items-center justify-center shrink-0">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-sm font-medium">Set up your wallet</p>
            <p className="text-xs text-text-muted">Secure on-chain wallet</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-bg-card border border-border rounded-lg">
          <div className="w-10 h-10 rounded-md bg-green-dim text-green flex items-center justify-center shrink-0">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-sm font-medium">Connect your bank</p>
            <p className="text-xs text-text-muted">Optional — link a bank account</p>
          </div>
        </div>
      </div>

      <Link
        href="/onboarding/type"
        className="inline-flex items-center gap-2 px-8 py-3 rounded-md font-semibold text-sm bg-green text-black hover:opacity-90 transition-opacity"
      >
        Get Started <ArrowRight size={16} />
      </Link>
    </div>
  );
}
