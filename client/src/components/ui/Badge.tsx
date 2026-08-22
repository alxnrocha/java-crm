import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'active' | 'review' | 'expiring' | 'draft' | 'renewed' | 'blue' | 'slate' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  withDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'slate',
  size = 'md',
  withDot = false,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full select-none';

  const variants = {
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    review: 'bg-purple-50 text-purple-700 border border-purple-200/80',
    expiring: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    draft: 'bg-slate-100 text-slate-700 border border-slate-200',
    renewed: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    danger: 'bg-red-50 text-red-700 border border-red-200/80',
  };

  const dotColors = {
    active: 'bg-emerald-500',
    review: 'bg-purple-500',
    expiring: 'bg-amber-500',
    draft: 'bg-slate-400',
    renewed: 'bg-blue-500',
    blue: 'bg-blue-500',
    slate: 'bg-slate-500',
    danger: 'bg-red-500',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-0.5 text-xs gap-1.5',
    lg: 'px-3 py-1 text-sm gap-2',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {withDot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColors[variant],
            variant === 'active' && 'animate-pulse'
          )}
        />
      )}
      {children}
    </span>
  );
};
