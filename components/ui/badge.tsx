type BadgeVariant = 'green' | 'blue' | 'purple' | 'red' | 'gray';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: 'bg-green-dim text-green',
  blue: 'bg-blue-dim text-blue',
  purple: 'bg-purple-dim text-purple',
  red: 'bg-red-500/10 text-red-500',
  gray: 'bg-bg-elevated text-text-secondary',
};

export function Badge({ variant = 'green', className = '', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
