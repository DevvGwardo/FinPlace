'use client';

import { useState } from 'react';
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  callbackUrl?: string;
}

export function WalletConnect({ callbackUrl = '/dashboard' }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleWalletConnect = async () => {
    setIsConnecting(true);

    try {
      // Wallet connection requires wagmi/rainbowkit setup
      // This is a placeholder until Web3 provider is configured
      console.warn('Wallet Connect requires additional Web3 provider setup (wagmi/rainbowkit).');
    } catch (error) {
      console.error('Wallet connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="mt-3 space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-bg px-2 text-text-muted">Web3 Login</span>
        </div>
      </div>

      <button
        onClick={handleWalletConnect}
        disabled={isConnecting}
        className="w-full flex items-center justify-center gap-2 bg-bg-elevated border border-border text-text py-3 rounded-md hover:border-border-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wallet size={18} />
        <span className="text-sm font-medium">
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </span>
      </button>
    </div>
  );
}
