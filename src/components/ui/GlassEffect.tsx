'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassEffectProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
  download?: string | boolean;
}

export function GlassEffect({
  as,
  children,
  className,
  ...props
}: GlassEffectProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = (as ?? 'div') as any;
  return (
    <Tag className={cn('relative z-0', className)} {...props}>
      {/* Frosted glass background */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          borderRadius: 'inherit',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          background: 'rgba(255,255,255,0.08)',
          pointerEvents: 'none',
        }}
      />
      {/* Border + inset highlight */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          borderRadius: 'inherit',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22)',
          pointerEvents: 'none',
        }}
      />
      {children}
    </Tag>
  );
}
