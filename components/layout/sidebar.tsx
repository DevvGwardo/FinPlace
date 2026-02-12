'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Receipt,
  CreditCard,
  TrendingUp,
  Camera,
  BarChart3,
  ListTodo,
  GraduationCap,
  Trophy,
  Settings,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Accounts', href: '/dashboard/accounts', icon: Users },
  { label: 'Transfer', href: '/dashboard/transfer', icon: ArrowLeftRight },
  { label: 'Transactions', href: '/dashboard/transactions', icon: Receipt },
  { label: 'Cards', href: '/dashboard/cards', icon: CreditCard },
  { label: 'Staking', href: '/dashboard/staking', icon: TrendingUp },
  { type: 'divider' as const },
  { label: 'Receipts', href: '/dashboard/receipts', icon: Camera },
  { label: 'Insights', href: '/dashboard/insights', icon: BarChart3 },
  { label: 'Tasks', href: '/dashboard/tasks', icon: ListTodo },
  { label: 'Learn', href: '/dashboard/learn', icon: GraduationCap },
  { label: 'Rewards', href: '/dashboard/rewards', icon: Trophy },
  { type: 'divider' as const },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-bg h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
      <nav className="flex flex-col py-4 px-3 gap-0.5">
        {navItems.map((item, i) => {
          if ('type' in item && item.type === 'divider') {
            return <hr key={i} className="border-border my-2" />;
          }
          if (!('href' in item)) return null;
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
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
  );
}
