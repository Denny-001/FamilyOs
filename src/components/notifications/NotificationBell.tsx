import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

export const NotificationBell = () => {
  const { data = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then((r) => r.data.data),
    refetchInterval: 30_000,
  });

  const unread = (data as any[]).filter((n) => !n.read).length;

  return (
    <Link to="/notifications" className="relative p-2 rounded-full hover:bg-surface-container" aria-label="Notifications">
      <span className="text-xl">🔔</span>
      {unread > 0 && (
        <span className="absolute top-0 right-0 bg-error text-onError text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  );
};