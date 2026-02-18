'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const allPlans = [
  { name: 'Free', price: '$0', features: ['2 sub-accounts', 'Basic controls', '1% staking APY'] },
  { name: 'Pro', price: '$9.99', features: ['10 sub-accounts', 'Advanced controls', '5.2% staking APY', 'Virtual cards', 'AI insights'] },
  { name: 'Business', price: '$29.99', features: ['Unlimited accounts', 'Full controls', '5.2% staking APY', 'Physical cards', 'Priority support'] },
];

const history = [
  { date: 'Jan 1, 2026', amount: '$9.99', status: 'Paid' },
  { date: 'Dec 1, 2025', amount: '$9.99', status: 'Paid' },
  { date: 'Nov 1, 2025', amount: '$9.99', status: 'Paid' },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState('Pro');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(user => {
        const plan = user.settings?.plan || 'Free';
        setCurrentPlan(plan);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSwitchPlan = async (planName: string) => {
    setProcessing(planName);
    try {
      const userRes = await fetch('/api/user');
      const user = await userRes.json();
      const currentSettings = user.settings || {};
      await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: { ...currentSettings, plan: planName } }),
      });
      setCurrentPlan(planName);
      toast.success(`Switched to ${planName} plan`);
    } catch {
      toast.error('Failed to switch plan');
    }
    setProcessing(null);
  };

  const handleSavePayment = () => {
    toast.success('Payment method updated');
    setShowPaymentForm(false);
    setCardNumber('');
    setCardExpiry('');
  };

  const getButtonLabel = (planName: string): string => {
    const planOrder = ['Free', 'Pro', 'Business'];
    const currentIdx = planOrder.indexOf(currentPlan);
    const planIdx = planOrder.indexOf(planName);
    return planIdx < currentIdx ? 'Downgrade' : 'Upgrade';
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">Billing</h1>
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
        <h1 className="text-2xl font-bold">Billing</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {allPlans.map((plan) => {
          const isCurrent = plan.name === currentPlan;
          const isProcessing = processing === plan.name;
          return (
            <div key={plan.name} className={`bg-bg-card border rounded-lg p-5 ${isCurrent ? 'border-green' : 'border-border'}`}>
              {isCurrent && <span className="text-xs bg-green-dim text-green px-2 py-0.5 rounded-full mb-3 inline-block">Current Plan</span>}
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <p className="text-2xl font-bold mt-1">{plan.price}<span className="text-sm font-normal text-text-muted">/mo</span></p>
              <ul className="mt-4 flex flex-col gap-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Check size={14} className="text-green shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              {!isCurrent && (
                <button
                  onClick={() => handleSwitchPlan(plan.name)}
                  disabled={processing !== null}
                  className="w-full mt-4 bg-bg-elevated border border-border py-2 rounded-md text-sm hover:border-border-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Switching...
                    </>
                  ) : (
                    getButtonLabel(plan.name)
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-bg-card border border-border rounded-lg p-5 mb-4">
        <h3 className="font-semibold mb-3">Payment Method</h3>
        <div className="flex items-center justify-between p-3 bg-bg-elevated rounded-md">
          <div className="flex items-center gap-3">
            <CreditCard size={18} className="text-text-muted" />
            <div>
              <p className="text-sm font-medium">•••• •••• •••• 4532</p>
              <p className="text-xs text-text-muted">Expires 12/28</p>
            </div>
          </div>
          <button onClick={() => setShowPaymentForm(!showPaymentForm)} className="text-sm text-green hover:underline">Update</button>
        </div>
        {showPaymentForm && (
          <div className="mt-3 p-4 bg-bg-elevated rounded-md border border-border flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary">Card Number</label>
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="•••• •••• •••• ••••"
                className="bg-bg-card border border-border rounded-md px-3 py-2 text-sm text-text focus:border-green focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-secondary">Expiry</label>
              <input
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                className="bg-bg-card border border-border rounded-md px-3 py-2 text-sm text-text focus:border-green focus:outline-none transition-colors w-24 md:w-32"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSavePayment}
                disabled={!cardNumber || !cardExpiry}
                className="bg-green text-black text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => { setShowPaymentForm(false); setCardNumber(''); setCardExpiry(''); }}
                className="text-sm text-text-muted hover:text-text px-4 py-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-bg-card border border-border rounded-lg p-5">
        <h3 className="font-semibold mb-3">Billing History</h3>
        {history.map((h, i) => (
          <div key={i} className={`flex items-center justify-between py-3 ${i < history.length - 1 ? 'border-b border-border' : ''}`}>
            <span className="text-sm">{h.date}</span>
            <span className="text-sm font-medium">{h.amount}</span>
            <span className="text-xs bg-green-dim text-green px-2 py-0.5 rounded-full">{h.status}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
