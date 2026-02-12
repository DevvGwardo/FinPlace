import { type ReactNode } from 'react';

interface SectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ eyebrow, title, description, children, className = '' }: SectionProps) {
  return (
    <section className={`py-12 md:py-[50px] ${className}`}>
      {(eyebrow || title || description) && (
        <div className="mb-8">
          {eyebrow && (
            <p className="text-xs uppercase tracking-wider text-text-muted mb-2">{eyebrow}</p>
          )}
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {description && <p className="text-text-secondary mt-2 max-w-xl">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
