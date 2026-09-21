import { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, icon, action }: Props) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    {icon && <div className="mb-4 text-onSurface-variant/60">{icon}</div>}
    <h3 className="text-lg font-semibold text-onSurface">{title}</h3>
    {description && <p className="text-sm text-onSurface-variant mt-1 max-w-sm">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);