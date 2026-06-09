import React from 'react';
import { cn } from '../../lib/utils';

export function Card({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[8px] border border-[var(--border)] bg-[var(--surface)] shadow-sm shadow-stone-200/40',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
