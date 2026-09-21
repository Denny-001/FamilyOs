import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'error';
}

export const Badge = ({ children, variant = 'primary' }: Props) => {
  const map = {
    primary: 'bg-primary-container text-onContainer',
    secondary: 'bg-secondary-container text-onSecondary-container',
    tertiary: 'bg-tertiary-container text-onTertiary-container',
    error: 'bg-error-container text-onError-container',
  }[variant];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map}`}>
      {children}
    </span>
  );
};