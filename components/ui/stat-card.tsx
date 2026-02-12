import { type ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({ label, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <div className={`bg-bg-card border border-border rounded-lg p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] text-text-muted">{label}</p>
          <p className="text-[28px] font-bold mt-1 leading-tight">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.positive ? 'text-green' : 'text-red-500'}`}>
              {trend.positive ? '+' : ''}{trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-md bg-green-dim flex items-center justify-center text-green">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
