import { type HTMLAttributes } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'max-w-2xl',
  md: 'max-w-[960px]',
  lg: 'max-w-6xl',
};

export function Container({ size = 'md', className = '', children, ...props }: ContainerProps) {
  return (
    <div className={`mx-auto px-5 ${sizeStyles[size]} ${className}`} {...props}>
      {children}
    </div>
  );
}
