'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Lock, Unlock, AlertTriangle, CreditCard, Info } from 'lucide-react';

export default function CardSettingsPage() {
  const [showNumber, setShowNumber] = useState(false);
  const [locked, setLocked] = useState(false);
  const [spendingLimit, setSpendingLimit] = useState('1000');
  const [alerts, setAlerts] = useState(true);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [reported, setReported] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  if (cancelled) {
    return (
      <div className="max-w-lg mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <CreditCard size={28} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Card Cancelled</h1>
          <p className="text-text-muted mb-6">This card has been permanently cancelled.</p>
          <Link
            href="/dashboard/cards"
            className="bg-green text-black font-semibold px-6 py-2.5 rounded-md text-sm hover:opacity-90 transition-opacity"
          >
            Back to Cards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/cards" className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Card Settings</h1>
      </div>

      {reported && (
        <div className="flex items-center gap-3 bg-blue/10 border border-blue/20 rounded-lg p-4 mb-4">
          <Info size={18} className="text-blue shrink-0" />
          <p className="text-sm text-blue">This card has been reported as lost/stolen. A replacement is on the way.</p>
        </div>
      )}

      <div className={`h-48 rounded-xl p-6 flex flex-col justify-between mb-6 ${locked ? 'bg-bg-elevated border border-border' : 'bg-gradient-to-br from-green/20 to-purple/10 border border-green/20'}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">FinPlace Virtual</span>
          <CreditCard size={24} className={locked ? 'text-text-muted' : 'text-green'} />
        </div>
        <div>
          <p className="font-mono text-xl tracking-widest">
            {showNumber ? '4532 1234 5678 4532' : '•••• •••• •••• 4532'}
          </p>
          <p className="text-xs text-text-muted mt-2">Main Account &middot; Exp 12/28</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => setShowNumber(!showNumber)}
          className="w-full flex items-center justify-center gap-2 bg-bg-elevated border border-border py-3 rounded-md text-sm hover:border-border-hover transition-colors"
        >
          {showNumber ? <EyeOff size={16} /> : <Eye size={16} />}
          {showNumber ? 'Hide' : 'Show'} Card Number
        </button>

        <div className="bg-bg-card border border-border rounded-lg p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-text-secondary font-medium">Spending Limit</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">$</span>
              <input
                type="number"
                value={spendingLimit}
                onChange={(e) => setSpendingLimit(e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-md pl-8 pr-4 py-2.5 text-sm text-text focus:border-green focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-sm">Lock Card</span>
            <button
              onClick={() => setLocked(!locked)}
              className={`relative w-11 h-6 rounded-full transition-colors ${locked ? 'bg-blue' : 'bg-bg-elevated border border-border'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${locked ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-sm">Transaction Alerts</span>
            <button
              onClick={() => setAlerts(!alerts)}
              className={`relative w-11 h-6 rounded-full transition-colors ${alerts ? 'bg-green' : 'bg-bg-elevated border border-border'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${alerts ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={() => setShowReportDialog(true)}
            className="w-full flex items-center justify-center gap-2 bg-bg-elevated border border-border py-3 rounded-md text-sm text-text-secondary hover:border-border-hover transition-colors"
          >
            <AlertTriangle size={16} /> Report Lost / Stolen
          </button>
          <button
            onClick={() => setShowCancelDialog(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-md text-sm text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors"
          >
            Cancel Card
          </button>
        </div>
      </div>

      {/* Report Lost/Stolen Dialog */}
      {showReportDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-bg-card border border-border rounded-xl p-6 max-w-[calc(100vw-2rem)] sm:max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Report Card</h3>
            <p className="text-sm text-text-muted mb-5">Are you sure you want to report this card as lost/stolen?</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setReported(true);
                  setShowReportDialog(false);
                }}
                className="flex-1 bg-blue text-white font-semibold py-2.5 rounded-md text-sm hover:opacity-90 transition-opacity"
              >
                Yes, Report
              </button>
              <button
                onClick={() => setShowReportDialog(false)}
                className="flex-1 bg-bg-elevated border border-border py-2.5 rounded-md text-sm hover:border-border-hover transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Card Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-bg-card border border-border rounded-xl p-6 max-w-[calc(100vw-2rem)] sm:max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Cancel Card</h3>
            <p className="text-sm text-text-muted mb-5">Are you sure? This action cannot be undone.</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setCancelled(true);
                  setShowCancelDialog(false);
                }}
                className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-md text-sm hover:opacity-90 transition-opacity"
              >
                Yes, Cancel Card
              </button>
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 bg-bg-elevated border border-border py-2.5 rounded-md text-sm hover:border-border-hover transition-colors"
              >
                Keep Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
