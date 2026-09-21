import { HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ children, padding = 'md', className = '', ...rest }: Props) => {
  const pad = { none: '', sm: 'p-3', md: 'p-4', lg: 'p-6' }[padding];
  return (
    <div
      className={`bg-surface-container rounded-2xl shadow-sm border border-outline-variant/40 ${pad} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};