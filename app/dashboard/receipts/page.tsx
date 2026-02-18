'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  Upload,
  Plus,
  ShoppingBag,
  Coffee,
  Car,
  X,
  Check,
  Loader2,
  Trash2,
  ChevronRight,
  Receipt,
  Utensils,
  Tv,
  type LucideIcon,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ReceiptItem {
  name: string;
  qty: number;
  price: number;
}

interface ReceiptData {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  date: string;
  icon: LucideIcon;
  items?: ReceiptItem[];
  tax?: number;
  paymentMethod?: string;
}

const categoryOptions = [
  { label: 'Groceries', icon: ShoppingBag },
  { label: 'Food & Drink', icon: Coffee },
  { label: 'Transport', icon: Car },
  { label: 'Dining', icon: Utensils },
  { label: 'Entertainment', icon: Tv },
  { label: 'Other', icon: Receipt },
];

const iconForCategory = (cat: string): LucideIcon => {
  const found = categoryOptions.find((c) => c.label === cat);
  return found?.icon ?? Receipt;
};

const scannedReceiptTemplates: Omit<ReceiptData, 'id'>[] = [
  {
    merchant: 'Target',
    amount: 89.47,
    category: 'Groceries',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    icon: ShoppingBag,
    items: [
      { name: 'Paper Towels (6pk)', qty: 1, price: 12.99 },
      { name: 'Laundry Detergent', qty: 1, price: 14.99 },
      { name: 'Frozen Pizza (2pk)', qty: 2, price: 17.98 },
      { name: 'Orange Juice', qty: 1, price: 4.99 },
      { name: 'Cereal', qty: 2, price: 9.98 },
      { name: 'Trash Bags', qty: 1, price: 8.99 },
      { name: 'Hand Soap', qty: 3, price: 11.97 },
    ],
    tax: 7.58,
    paymentMethod: 'Virtual Card ••4242',
  },
  {
    merchant: 'Chipotle',
    amount: 18.65,
    category: 'Dining',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    icon: Utensils,
    items: [
      { name: 'Chicken Burrito Bowl', qty: 1, price: 11.75 },
      { name: 'Chips & Guac', qty: 1, price: 4.25 },
    ],
    tax: 2.65,
    paymentMethod: 'Virtual Card ••4242',
  },
  {
    merchant: 'AMC Theaters',
    amount: 32.50,
    category: 'Entertainment',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    icon: Tv,
    items: [
      { name: 'Movie Ticket (2x)', qty: 2, price: 24.00 },
      { name: 'Large Popcorn', qty: 1, price: 8.50 },
    ],
    tax: 0.00,
    paymentMethod: 'Physical Card ••8821',
  },
];

export default function ReceiptsPage() {
  const { toast } = useToast();
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null);

  useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => {
        // Filter transactions that have receipt metadata
        const receiptTxs = data.filter((tx: any) => tx.metadata?.isReceipt);
        setReceipts(receiptTxs.map((tx: any) => ({
          id: tx.id,
          merchant: tx.metadata?.merchant || tx.counterparty || tx.description || 'Unknown',
          amount: Math.abs(Number(tx.amount)),
          category: tx.category || 'Other',
          date: formatDate(tx.createdAt),
          icon: iconForCategory(tx.category || 'Other'),
          items: tx.metadata?.items || [],
          tax: tx.metadata?.tax || 0,
          paymentMethod: tx.metadata?.paymentMethod || '',
        })));
      })
      .finally(() => setLoading(false));
  }, []);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scannedReceipt, setScannedReceipt] = useState<ReceiptData | null>(null);
  const [scanTemplateIndex, setScanTemplateIndex] = useState(0);

  // Manual entry form state
  const [formMerchant, setFormMerchant] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState('Groceries');
  const [formDate, setFormDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [formNotes, setFormNotes] = useState('');

  const handleScan = () => {
    setScanning(true);
    setScanComplete(false);
    setScannedReceipt(null);

    // Simulate AI processing
    setTimeout(() => {
      const template = scannedReceiptTemplates[scanTemplateIndex % scannedReceiptTemplates.length];
      const newReceipt: ReceiptData = {
        ...template,
        id: String(Date.now()),
      };
      setScannedReceipt(newReceipt);
      setScanning(false);
      setScanComplete(true);
      setScanTemplateIndex((i) => i + 1);
    }, 2000);
  };

  const confirmScannedReceipt = async () => {
    if (!scannedReceipt) return;
    try {
      const accountsRes = await fetch('/api/accounts');
      const accounts = await accountsRes.json();
      if (accounts.length === 0) return;

      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: accounts[0].id,
          type: 'withdrawal',
          amount: -scannedReceipt.amount,
          description: scannedReceipt.merchant,
          category: scannedReceipt.category,
          counterparty: scannedReceipt.merchant,
          metadata: {
            isReceipt: true,
            merchant: scannedReceipt.merchant,
            items: scannedReceipt.items,
            tax: scannedReceipt.tax,
            paymentMethod: scannedReceipt.paymentMethod,
          },
        }),
      });

      setReceipts(prev => [scannedReceipt, ...prev]);
      toast.success('Receipt saved');
      setScanComplete(false);
      setScannedReceipt(null);
    } catch {
      toast.error('Failed to save receipt');
    }
  };

  const dismissScan = () => {
    setScanning(false);
    setScanComplete(false);
    setScannedReceipt(null);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(formAmount);
    if (!formMerchant || isNaN(amountVal)) return;

    try {
      // Need an account to attach the transaction to
      const accountsRes = await fetch('/api/accounts');
      const accounts = await accountsRes.json();
      if (accounts.length === 0) return;

      const dateObj = new Date(formDate + 'T00:00:00');
      const items = formNotes
        ? [{ name: formNotes, qty: 1, price: amountVal }]
        : [{ name: formMerchant + ' purchase', qty: 1, price: amountVal }];

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: accounts[0].id,
          type: 'withdrawal',
          amount: -amountVal,
          description: formMerchant,
          category: formCategory,
          counterparty: formMerchant,
          metadata: {
            isReceipt: true,
            merchant: formMerchant,
            items,
            tax: 0,
            paymentMethod: 'Manual Entry',
          },
        }),
      });
      if (!res.ok) return;
      const newTx = await res.json();

      const newReceipt: ReceiptData = {
        id: newTx.id,
        merchant: formMerchant,
        amount: amountVal,
        category: formCategory,
        date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        icon: iconForCategory(formCategory),
        items,
        tax: 0,
        paymentMethod: 'Manual Entry',
      };

      setReceipts(prev => [newReceipt, ...prev]);
      toast.success('Receipt added');
      setShowManualEntry(false);
      setFormMerchant(''); setFormAmount(''); setFormCategory('Groceries');
      setFormDate(new Date().toISOString().split('T')[0]); setFormNotes('');
    } catch {
      toast.error('Failed to add receipt');
    }
  };

  const deleteReceipt = (id: string) => {
    setReceipts((prev) => prev.filter((r) => r.id !== id));
    setSelectedReceipt(null);
    toast.success('Receipt deleted');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">Receipts</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Receipt detail view
  if (selectedReceipt) {
    const r = selectedReceipt;
    const Icon = r.icon;
    const subtotal = r.items ? r.items.reduce((s, i) => s + i.price, 0) : r.amount;
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedReceipt(null)}
            className="text-text-muted hover:text-text transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Receipt Details</h1>
        </div>

        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-green-dim text-green flex items-center justify-center">
              <Icon size={22} />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold">{r.merchant}</p>
              <p className="text-sm text-text-muted">
                {r.category} &middot; {r.date}
              </p>
            </div>
            <p className="text-xl font-bold">${r.amount.toFixed(2)}</p>
          </div>

          {/* Line items */}
          {r.items && r.items.length > 0 && (
            <div className="p-4 md:p-6 border-b border-border">
              <p className="text-xs uppercase tracking-wider text-text-muted mb-3">Items</p>
              <div className="flex flex-col gap-2">
                {r.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      {item.qty > 1 ? `${item.qty}x ` : ''}
                      {item.name}
                    </span>
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr className="border-border my-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {r.tax !== undefined && (
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-text-secondary">Tax</span>
                  <span>${r.tax.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm font-semibold mt-2 pt-2 border-t border-border">
                <span>Total</span>
                <span>${r.amount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Payment method */}
          {r.paymentMethod && (
            <div className="px-6 py-4 border-b border-border flex items-center justify-between text-sm">
              <span className="text-text-muted">Payment Method</span>
              <span className="text-text-secondary">{r.paymentMethod}</span>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 flex items-center justify-end">
            <button
              onClick={() => deleteReceipt(r.id)}
              className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors px-3 py-2 rounded-md hover:bg-red-400/10"
            >
              <Trash2 size={16} />
              Delete Receipt
            </button>
          </div>
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
        <h1 className="text-2xl font-bold">Receipts</h1>
      </div>

      {/* Scan Area */}
      <div className="bg-bg-card border-2 border-dashed border-border rounded-xl p-6 md:p-10 text-center mb-6 hover:border-border-hover transition-colors">
        {scanning ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-dim text-green flex items-center justify-center animate-pulse">
              <Loader2 size={24} className="animate-spin" />
            </div>
            <p className="font-semibold">Scanning Receipt...</p>
            <p className="text-sm text-text-muted">AI is extracting merchant, items, and totals</p>
            <div className="flex gap-1 mt-2">
              <span className="w-2 h-2 bg-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : scanComplete && scannedReceipt ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-dim text-green flex items-center justify-center">
              <Check size={24} />
            </div>
            <p className="font-semibold">Receipt Scanned!</p>
            <div className="bg-bg-elevated border border-border rounded-lg p-4 w-full max-w-sm mx-auto text-left mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{scannedReceipt.merchant}</span>
                <span className="font-semibold">${scannedReceipt.amount.toFixed(2)}</span>
              </div>
              <p className="text-xs text-text-muted mb-1">
                {scannedReceipt.category} &middot; {scannedReceipt.date}
              </p>
              {scannedReceipt.items && (
                <p className="text-xs text-text-muted">
                  {scannedReceipt.items.length} item{scannedReceipt.items.length !== 1 ? 's' : ''} detected
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={confirmScannedReceipt}
                className="flex items-center gap-2 bg-green text-black font-semibold px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
              >
                <Check size={16} /> Save Receipt
              </button>
              <button
                onClick={dismissScan}
                className="flex items-center gap-2 bg-bg-elevated border border-border px-4 py-2 rounded-md text-sm hover:border-border-hover transition-colors"
              >
                <X size={16} /> Discard
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-green-dim text-green flex items-center justify-center mx-auto mb-4">
              <Camera size={24} />
            </div>
            <p className="font-semibold mb-1">Scan a Receipt</p>
            <p className="text-sm text-text-muted">
              Take a photo or upload an image. AI will extract the details.
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={handleScan}
                className="flex items-center gap-2 bg-green text-black font-semibold px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
              >
                <Camera size={16} /> Camera
              </button>
              <button
                onClick={handleScan}
                className="flex items-center gap-2 bg-bg-elevated border border-border px-4 py-2 rounded-md text-sm hover:border-border-hover transition-colors"
              >
                <Upload size={16} /> Upload
              </button>
            </div>
          </>
        )}
      </div>

      {/* Manual Entry Form */}
      {showManualEntry && (
        <div className="bg-bg-card border border-border rounded-xl p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">New Receipt</h3>
            <button
              onClick={() => setShowManualEntry(false)}
              className="text-text-muted hover:text-text transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted font-medium">Merchant</label>
                <input
                  type="text"
                  value={formMerchant}
                  onChange={(e) => setFormMerchant(e.target.value)}
                  placeholder="e.g. Walmart"
                  required
                  className="bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-green transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted font-medium">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-green transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted font-medium">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-green transition-colors"
                >
                  {categoryOptions.map((c) => (
                    <option key={c.label} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted font-medium">Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text focus:outline-none focus:border-green transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-muted font-medium">Notes (optional)</label>
              <input
                type="text"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="What was this for?"
                className="bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-green transition-colors"
              />
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowManualEntry(false)}
                className="px-4 py-2 text-sm text-text-secondary hover:text-text transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-green text-black font-semibold px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
              >
                <Plus size={16} /> Add Receipt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recent Receipts */}
      <h3 className="font-semibold mb-3">
        Recent Receipts
        {receipts.length > 0 && (
          <span className="text-text-muted font-normal text-sm ml-2">({receipts.length})</span>
        )}
      </h3>
      {receipts.length === 0 ? (
        <div className="bg-bg-card border border-border rounded-xl p-6 md:p-8 text-center">
          <Receipt size={32} className="text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-muted">No receipts yet. Scan or add one above.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {receipts.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedReceipt(r)}
                className="bg-bg-card border border-border rounded-lg p-4 flex items-center gap-3 hover:border-border-hover transition-colors text-left w-full"
              >
                <div className="w-12 h-12 rounded-md bg-bg-elevated flex items-center justify-center text-text-muted">
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{r.merchant}</p>
                  <p className="text-xs text-text-muted">
                    {r.category} &middot; {r.date}
                    {r.items && (
                      <span> &middot; {r.items.length} item{r.items.length !== 1 ? 's' : ''}</span>
                    )}
                  </p>
                </div>
                <p className="text-sm font-medium mr-1">${r.amount.toFixed(2)}</p>
                <ChevronRight size={16} className="text-text-muted shrink-0" />
              </button>
            );
          })}
        </div>
      )}

      {/* Manual Entry Button */}
      {!showManualEntry && (
        <button
          onClick={() => setShowManualEntry(true)}
          className="w-full mt-4 p-3 rounded-md border border-dashed border-border text-sm text-text-muted hover:text-text hover:border-border-hover transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Manual Entry
        </button>
      )}
    </div>
  );
}
