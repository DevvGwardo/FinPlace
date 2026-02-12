import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ hover = true, padding = 'lg', className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-bg-card border border-border rounded-lg ${paddingStyles[padding]} ${hover ? 'transition-colors duration-200 hover:border-border-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
