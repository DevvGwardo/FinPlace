'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Bell, LogOut, User, Settings, CreditCard, HelpCircle } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/app/dashboard/providers';
import { getInitials } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Receipt,
  CreditCard as CreditCardIcon,
  TrendingUp,
  Camera,
  BarChart3,
  ListTodo,
  GraduationCap,
  Trophy,
  Settings as SettingsIcon,
} from 'lucide-react';

interface HeaderProps {
  variant?: 'landing' | 'app';
}

const mobileNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Accounts', href: '/dashboard/accounts', icon: Users },
  { label: 'Transfer', href: '/dashboard/transfer', icon: ArrowLeftRight },
  { label: 'Transactions', href: '/dashboard/transactions', icon: Receipt },
  { label: 'Cards', href: '/dashboard/cards', icon: CreditCardIcon },
  { label: 'Staking', href: '/dashboard/staking', icon: TrendingUp },
  { type: 'divider' as const },
  { label: 'Receipts', href: '/dashboard/receipts', icon: Camera },
  { label: 'Insights', href: '/dashboard/insights', icon: BarChart3 },
  { label: 'Tasks', href: '/dashboard/tasks', icon: ListTodo },
  { label: 'Learn', href: '/dashboard/learn', icon: GraduationCap },
  { label: 'Rewards', href: '/dashboard/rewards', icon: Trophy },
  { type: 'divider' as const },
  { label: 'Settings', href: '/dashboard/settings', icon: SettingsIcon },
] as const;

const placeholderNotifications = [
  {
    id: '1',
    title: 'Deposit Received',
    message: 'You received $500.00 from External Transfer',
    time: '2 min ago',
    unread: true,
  },
  {
    id: '2',
    title: 'Staking Reward',
    message: 'You earned $4.23 in staking rewards this week',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: '3',
    title: 'Task Completed',
    message: 'Emma completed "Clean Room" — $5.00 reward pending approval',
    time: '3 hours ago',
    unread: false,
  },
  {
    id: '4',
    title: 'Card Transaction',
    message: 'Virtual card ending 4242 was charged $12.99 at Netflix',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '5',
    title: 'Security Alert',
    message: 'New device logged into your account from Chrome on macOS',
    time: '2 days ago',
    unread: false,
  },
];

export function Header({ variant = 'landing' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const { user, signOut } = useAuth();
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const userInitials = user?.name ? getInitials(user.name) : 'U';

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const unreadCount = placeholderNotifications.filter((n) => n.unread).length;

  if (variant === 'landing') {
    return (
      <header className="sticky top-0 z-50 bg-bg/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-[960px] mx-auto px-5 flex items-center justify-between h-16">
          <Logo size="md" href="/" />
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-text-secondary hover:text-text transition-colors">Features</Link>
            <Link href="#staking" className="text-sm text-text-secondary hover:text-text transition-colors">Staking</Link>
            <Link href="#family" className="text-sm text-text-secondary hover:text-text transition-colors">Family</Link>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard" className="px-4 py-2 text-sm text-text-secondary hover:text-text transition-colors">View Demo</Link>
            <Link href="/login" className="px-4 py-2 text-sm text-text-secondary hover:text-text transition-colors">Log in</Link>
            <Link href="/register" className="px-4 py-2 text-sm bg-green text-black font-semibold rounded-md hover:opacity-90 transition-opacity">Join Waitlist</Link>
          </div>
          <button className="md:hidden text-text-secondary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-bg-card px-5 py-4 flex flex-col gap-4">
            <Link href="#features" className="text-sm text-text-secondary">Features</Link>
            <Link href="#staking" className="text-sm text-text-secondary">Staking</Link>
            <Link href="#family" className="text-sm text-text-secondary">Family</Link>
            <hr className="border-border" />
            <Link href="/dashboard" className="text-sm text-text-secondary">View Demo</Link>
            <Link href="/login" className="text-sm text-text-secondary">Log in</Link>
            <Link href="/register" className="px-4 py-2 text-sm bg-green text-black font-semibold rounded-md text-center">Join Waitlist</Link>
          </div>
        )}
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-text-secondary hover:text-text transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Logo size="md" href="/dashboard" />
          </div>
          <div className="flex items-center gap-3">
            {/* Notifications Bell */}
            <div className="relative" ref={notificationsRef}>
              <button
                className="relative p-2 text-text-secondary hover:text-text transition-colors rounded-md hover:bg-bg-elevated"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-green rounded-full" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-semibold text-text">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-green font-medium">{unreadCount} new</span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {placeholderNotifications.map((notification) => (
                      <button
                        key={notification.id}
                        className="w-full text-left px-4 py-3 hover:bg-bg-elevated transition-colors border-b border-border last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <span className="mt-1.5 w-2 h-2 bg-green rounded-full shrink-0" />
                          )}
                          <div className={notification.unread ? '' : 'ml-5'}>
                            <p className="text-sm font-medium text-text">{notification.title}</p>
                            <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-text-muted mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border">
                    <Link
                      href="/dashboard"
                      className="block text-center text-xs text-green font-medium py-3 hover:bg-bg-elevated transition-colors"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                className="w-8 h-8 rounded-full bg-green-dim text-green flex items-center justify-center text-sm font-semibold hover:ring-2 hover:ring-green/30 transition-all"
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                }}
              >
                {userInitials}
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-2rem)] bg-bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-text">{userName}</p>
                    <p className="text-xs text-text-secondary">{userEmail}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text hover:bg-bg-elevated transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text hover:bg-bg-elevated transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <Link
                      href="/dashboard/cards"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text hover:bg-bg-elevated transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <CreditCard size={16} />
                      My Cards
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-text hover:bg-bg-elevated transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <HelpCircle size={16} />
                      Help & Support
                    </Link>
                  </div>
                  <div className="border-t border-border py-1">
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-bg-elevated transition-colors"
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sidebar Panel */}
          <aside className="absolute top-16 left-0 bottom-0 w-72 max-w-[80vw] bg-bg border-r border-border overflow-y-auto">
            <nav className="flex flex-col py-4 px-3 gap-0.5">
              {mobileNavItems.map((item, i) => {
                if ('type' in item && item.type === 'divider') {
                  return <hr key={i} className="border-border my-2" />;
                }
                if (!('href' in item)) return null;
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-green-dim text-green font-medium'
                        : 'text-text-secondary hover:text-text hover:bg-bg-elevated'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
