'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Shield, Bell, Link2, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '@/app/dashboard/providers';
import { getInitials } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { signOut, refreshUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [txAlerts, setTxAlerts] = useState(true);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [connectedBanks, setConnectedBanks] = useState([
    { name: 'Chase Bank', detail: 'Checking •••• 4532' },
  ]);
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [newBankName, setNewBankName] = useState('');

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(user => {
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        const s = user.settings || {};
        setTwoFactor(s.twoFactorEnabled ?? false);
        setBiometric(s.biometricEnabled ?? true);
        setPushNotif(s.pushNotifications ?? true);
        setEmailNotif(s.emailNotifications ?? true);
        setTxAlerts(s.transactionAlerts ?? true);
        if (s.connectedBanks) setConnectedBanks(s.connectedBanks);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone,
          settings: {
            twoFactorEnabled: twoFactor,
            biometricEnabled: biometric,
            pushNotifications: pushNotif,
            emailNotifications: emailNotif,
            transactionAlerts: txAlerts,
            connectedBanks,
          },
        }),
      });
      await refreshUser();
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword) return;
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Failed to update password');
        return;
      }
      toast.success('Password updated');
      setShowPasswordForm(false);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch {
      toast.error('Failed to update password');
    }
  };

  const handleExportData = () => {
    toast.info("Data export started. You'll receive an email shortly.");
  };

  const handleDeleteAccount = async () => {
    try {
      await fetch('/api/user', { method: 'DELETE' });
      signOut();
    } catch {
      toast.error('Failed to delete account');
    }
    setShowDeleteDialog(false);
    setDeleteConfirmText('');
  };

  const handleDisconnect = (bankName: string) => {
    setConnectedBanks((prev) => prev.filter((b) => b.name !== bankName));
  };

  const handleConnectBank = () => {
    if (newBankName.trim()) {
      setConnectedBanks((prev) => [...prev, { name: newBankName.trim(), detail: 'New account' }]);
      setNewBankName('');
      setShowConnectForm(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="flex flex-col gap-4">
        {/* Profile */}
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-text-muted" />
            <h3 className="font-semibold">Profile</h3>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-green-dim text-green flex items-center justify-center text-xl font-semibold">{name ? getInitials(name) : 'U'}</div>
            <button className="text-sm text-green hover:underline">Change avatar</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-text-secondary">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="bg-bg-elevated border border-border rounded-md px-4 py-2.5 text-sm text-text focus:border-green focus:outline-none transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-text-secondary">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-bg-elevated border border-border rounded-md px-4 py-2.5 text-sm text-text focus:border-green focus:outline-none transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-text-secondary">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-bg-elevated border border-border rounded-md px-4 py-2.5 text-sm text-text focus:border-green focus:outline-none transition-colors" />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-text-muted" />
            <h3 className="font-semibold">Security</h3>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-left px-3 py-2.5 rounded-md bg-bg-elevated border border-border text-sm hover:border-border-hover transition-colors"
            >
              Change Password
            </button>
            {showPasswordForm && (
              <div className="flex flex-col gap-3 p-4 bg-bg-elevated rounded-md border border-border">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-bg-card border border-border rounded-md px-3 py-2 text-sm text-text focus:border-green focus:outline-none transition-colors"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-bg-card border border-border rounded-md px-3 py-2 text-sm text-text focus:border-green focus:outline-none transition-colors"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-secondary">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-bg-card border border-border rounded-md px-3 py-2 text-sm text-text focus:border-green focus:outline-none transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdatePassword}
                    disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                    className="bg-green text-black text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => { setShowPasswordForm(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
                    className="text-sm text-text-muted hover:text-text px-4 py-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {[
              { label: 'Two-Factor Authentication', checked: twoFactor, set: setTwoFactor },
              { label: 'Biometric Login', checked: biometric, set: setBiometric },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <span className="text-sm">{item.label}</span>
                <button
                  onClick={() => item.set(!item.checked)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${item.checked ? 'bg-green' : 'bg-bg-elevated border border-border'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${item.checked ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-text-muted" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          {[
            { label: 'Push Notifications', checked: pushNotif, set: setPushNotif },
            { label: 'Email Notifications', checked: emailNotif, set: setEmailNotif },
            { label: 'Transaction Alerts', checked: txAlerts, set: setTxAlerts },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <span className="text-sm">{item.label}</span>
              <button
                onClick={() => item.set(!item.checked)}
                className={`relative w-11 h-6 rounded-full transition-colors ${item.checked ? 'bg-green' : 'bg-bg-elevated border border-border'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${item.checked ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
        </div>

        {/* Connected Accounts */}
        <div className="bg-bg-card border border-border rounded-lg p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Link2 size={18} className="text-text-muted" />
            <h3 className="font-semibold">Connected Accounts</h3>
          </div>
          {connectedBanks.map((bank) => (
            <div key={bank.name} className="flex items-center justify-between p-3 bg-bg-elevated rounded-md mb-2">
              <div>
                <p className="text-sm font-medium">{bank.name}</p>
                <p className="text-xs text-text-muted">{bank.detail}</p>
              </div>
              <button onClick={() => handleDisconnect(bank.name)} className="text-xs text-red-500 hover:underline">Disconnect</button>
            </div>
          ))}
          {connectedBanks.length === 0 && !showConnectForm && (
            <p className="text-sm text-text-muted mb-2">No connected accounts</p>
          )}
          {showConnectForm ? (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <input
                value={newBankName}
                onChange={(e) => setNewBankName(e.target.value)}
                placeholder="Bank name"
                className="flex-1 bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text focus:border-green focus:outline-none transition-colors"
              />
              <button
                onClick={handleConnectBank}
                disabled={!newBankName.trim()}
                className="text-sm bg-green text-black font-medium px-3 py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Connect
              </button>
              <button
                onClick={() => { setShowConnectForm(false); setNewBankName(''); }}
                className="text-sm text-text-muted hover:text-text px-2 py-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setShowConnectForm(true)} className="text-sm text-green hover:underline">+ Connect another</button>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-bg-card border border-red-500/20 rounded-lg p-4 md:p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-red-500" />
            <h3 className="font-semibold text-red-500">Danger Zone</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleExportData} className="text-sm bg-bg-elevated border border-border px-4 py-2 rounded-md hover:border-border-hover transition-colors">Export Data</button>
            <button onClick={() => setShowDeleteDialog(true)} className="text-sm text-red-500 bg-red-500/10 px-4 py-2 rounded-md hover:bg-red-500/20 transition-colors">Delete Account</button>
          </div>
        </div>

        <button onClick={handleSave} className="w-full bg-green text-black font-semibold py-3 rounded-md hover:opacity-90 transition-opacity">
          Save Changes
        </button>
      </div>

      {/* Delete Account Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card border border-border rounded-lg p-6 max-w-[calc(100vw-2rem)] sm:max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-red-500">Delete Account</h3>
              <button onClick={() => { setShowDeleteDialog(false); setDeleteConfirmText(''); }} className="text-text-muted hover:text-text">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-text-secondary mb-4">This action is irreversible. All your data will be permanently deleted.</p>
            <p className="text-sm font-medium mb-2">Type <span className="text-red-500">DELETE</span> to confirm</p>
            <input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text focus:border-red-500 focus:outline-none transition-colors mb-4"
              placeholder="Type DELETE"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className="flex-1 text-sm text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Account
              </button>
              <button
                onClick={() => { setShowDeleteDialog(false); setDeleteConfirmText(''); }}
                className="flex-1 text-sm bg-bg-elevated border border-border px-4 py-2 rounded-md hover:border-border-hover transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
