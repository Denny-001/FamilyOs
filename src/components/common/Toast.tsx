import { useEffect } from 'react';

interface Props {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type = 'info', onClose, duration = 3000 }: Props) => {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const bg = {
    success: 'bg-primary text-onPrimary',
    error: 'bg-error text-onError',
    info: 'bg-tertiary text-onTertiary',
  }[type];

  return (
    <div className={`fixed bottom-6 right-6 ${bg} px-5 py-3 rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2`}>
      {message}
    </div>
  );
};