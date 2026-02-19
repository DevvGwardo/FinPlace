'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FlippableCreditCard } from '@/components/ui/credit-debit-card';

type Card = {
  id: string;
  last4: string;
  account: string;
  type: 'virtual' | 'physical';
  status: 'active' | 'locked';
  expiry: string;
  holderName: string;
};

type ApiCard = {
  id: string;
  cardNumber: string;
  cardType: 'virtual' | 'physical';
  status: 'active' | 'locked';
  expiryMonth?: number;
  expiryYear?: number;
  account?: { name?: string };
};

type ApiAccount = {
  id: string;
  name: string;
};

const DEMO_HOLDER = 'FINPLACE MEMBER';

function formatExpiry(month?: number, year?: number) {
  if (!month || !year) return '12/30';
  return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
}

export default function CardsPage() {
  const { toast } = useToast();
  const [cards, setCards] = useState<Card[]>([]);
  const [accountOptions, setAccountOptions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formAccount, setFormAccount] = useState('');
  const [formType, setFormType] = useState<'virtual' | 'physical'>('virtual');

  useEffect(() => {
    Promise.all([
      fetch('/api/cards').then(res => res.json()),
      fetch('/api/accounts').then(res => res.json()),
    ]).then(([cardsData, accountsData]) => {
      const cardsArr = Array.isArray(cardsData) ? cardsData : [];
      const accountsArr = Array.isArray(accountsData) ? accountsData : [];
      setCards((cardsArr as ApiCard[]).map((c) => ({
        id: c.id,
        last4: c.cardNumber.slice(-4),
        account: c.account?.name || 'Unknown',
        type: c.cardType as 'virtual' | 'physical',
        status: c.status as 'active' | 'locked',
        expiry: formatExpiry(c.expiryMonth, c.expiryYear),
        holderName: DEMO_HOLDER,
      })));
      setAccountOptions((accountsArr as ApiAccount[]).map((a) => ({ id: a.id, name: a.name })));
      if (accountsArr.length > 0) setFormAccount(accountsArr[0].id);
    }).finally(() => setLoading(false));
  }, []);

  const openFormWithType = (type: 'virtual' | 'physical') => {
    setFormType(type);
    setShowForm(true);
  };

  const createLocalDemoCard = () => {
    const randomLast4 = String(Math.floor(1000 + Math.random() * 9000));
    setCards(prev => [{
      id: `demo-${Date.now()}`,
      last4: randomLast4,
      account: accountOptions.find(a => a.id === formAccount)?.name || 'Main Checking',
      type: formType,
      status: 'active',
      expiry: '12/30',
      holderName: DEMO_HOLDER,
    }, ...prev]);
    toast.success('Demo card created');
    setShowForm(false);
    setFormType('virtual');
  };

  const handleCreateCard = async () => {
    if (accountOptions.length === 0) {
      createLocalDemoCard();
      return;
    }

    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: formAccount, cardType: formType }),
      });
      if (!res.ok) {
        createLocalDemoCard();
        return;
      }
      const newCard = await res.json();
      setCards(prev => [{
        id: newCard.id,
        last4: newCard.cardNumber.slice(-4),
        account: accountOptions.find(a => a.id === formAccount)?.name || 'Account',
        type: newCard.cardType,
        status: newCard.status,
        expiry: formatExpiry(newCard.expiryMonth, newCard.expiryYear),
        holderName: DEMO_HOLDER,
      }, ...prev]);
      toast.success('Card created successfully');
      setShowForm(false);
      setFormType('virtual');
    } catch {
      createLocalDemoCard();
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">Cards</h1>
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
          <h1 className="text-2xl font-bold">Cards</h1>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="flex items-center gap-2 bg-green text-black font-semibold px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> New Card
        </button>
      </div>

      {showForm && (
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Create New Card</h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 text-text-muted hover:text-text transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-text-secondary font-medium">Account</label>
              <select
                value={formAccount}
                onChange={(e) => setFormAccount(e.target.value)}
                className="bg-bg-elevated border border-border rounded-md px-4 py-2.5 text-sm text-text focus:border-green focus:outline-none transition-colors appearance-none"
              >
                {accountOptions.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-text-secondary font-medium">Card Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormType('virtual')}
                  className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    formType === 'virtual'
                      ? 'bg-green text-black'
                      : 'bg-bg-elevated border border-border text-text-secondary hover:border-border-hover'
                  }`}
                >
                  Virtual
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('physical')}
                  className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    formType === 'physical'
                      ? 'bg-green text-black'
                      : 'bg-bg-elevated border border-border text-text-secondary hover:border-border-hover'
                  }`}
                >
                  Physical
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-bg-elevated border border-border text-text font-semibold py-2.5 rounded-md text-sm hover:border-border-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCard}
                className="flex-1 bg-green text-black font-semibold py-2.5 rounded-md text-sm hover:opacity-90 transition-opacity"
              >
                Create Card
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {cards.map((card) => {
          const isDemoCard = card.id.startsWith('demo-');
          const cardTile = (
            <>
              <div className="p-4">
                <FlippableCreditCard
                  className="h-44 w-full"
                  cardholderName={card.holderName}
                  cardNumber={`•••• •••• •••• ${card.last4}`}
                  expiryDate={card.expiry}
                  cvv="•••"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${card.status === 'active' ? 'bg-green-dim text-green' : 'bg-bg-elevated text-text-muted'}`}>
                  {card.status === 'active' ? 'Active' : 'Locked'} · {card.type}
                </span>
                <span className="text-xs text-text-muted">{card.account}</span>
              </div>
            </>
          );

          if (isDemoCard) {
            return (
              <div
                key={card.id}
                className="bg-bg-card border border-border rounded-lg overflow-hidden"
              >
                {cardTile}
              </div>
            );
          }

          return (
            <Link
              key={card.id}
              href={`/dashboard/cards/${card.id}`}
              className="bg-bg-card border border-border rounded-lg overflow-hidden hover:border-border-hover transition-colors"
            >
              {cardTile}
            </Link>
          );
        })}
      </div>

      <div className="bg-bg-card border border-border rounded-lg p-4 md:p-6">
        <h3 className="font-semibold mb-2">Request New Card</h3>
        <p className="text-sm text-text-secondary mb-4">Choose the type of card you need.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => openFormWithType('virtual')}
            className="p-4 rounded-md border border-border bg-bg-elevated hover:border-border-hover transition-colors text-left"
          >
            <p className="font-medium text-sm">Virtual Card</p>
            <p className="text-xs text-text-muted mt-1">Instant &bull; Online use</p>
          </button>
          <button
            onClick={() => openFormWithType('physical')}
            className="p-4 rounded-md border border-border bg-bg-elevated hover:border-border-hover transition-colors text-left"
          >
            <p className="font-medium text-sm">Physical Card</p>
            <p className="text-xs text-text-muted mt-1">5-7 days &bull; In-store use</p>
          </button>
        </div>
      </div>
    </div>
  );
}
