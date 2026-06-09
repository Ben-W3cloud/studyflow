import React from 'react';
import { cn } from '../../lib/utils';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' &&
          'bg-[var(--primary)] text-white shadow-sm shadow-pink-200 hover:bg-[#d9467d]',
        variant === 'secondary' &&
          'border border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[#ded8d2] hover:bg-[#fffaf7]',
        variant === 'ghost' &&
          'text-[var(--muted)] hover:bg-[#f2eee9] hover:text-[var(--foreground)]',
        variant === 'icon' &&
          'border border-[var(--border)] bg-white text-[var(--foreground)] hover:bg-[#fffaf7]',
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-11 px-5 text-sm',
        size === 'lg' && 'h-12 px-6 text-base',
        variant === 'icon' && 'h-11 w-11 px-0',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
