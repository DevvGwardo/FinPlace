'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer } from '@/components/ui/toast';

const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  accountType: string;
  walletAddress?: string;
  onboardingComplete?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    if (!isDemo) {
      // Only set up Supabase auth listener when not in demo mode
      let cleanup: (() => void) | undefined;
      import('@/lib/supabase/client').then(({ createClient }) => {
        const supabase = createClient();
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            fetchProfile();
          } else {
            setUser(null);
            setIsLoading(false);
          }
        });
        cleanup = () => subscription.unsubscribe();
      });
      return () => cleanup?.();
    }
  }, [fetchProfile]);

  const handleSignOut = async () => {
    if (!isDemo) {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signOut: handleSignOut, refreshUser: fetchProfile }}
    >
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
}
