import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { AppShell } from '../../components/layout';
import { Card, Spinner, EmptyState } from '../../components/common';

export default function NotificationsPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then((r) => r.data.data),
  });

  const markRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
    qc.invalidateQueries({ queryKey: ['notifications'] });
  };

  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size={32} /></div>
      ) : data.length === 0 ? (
        <EmptyState title="You're all caught up" description="No notifications right now." />
      ) : (
        <div className="space-y-3">
          {data.map((n: any) => (
            <Card
              key={n._id}
              className={`cursor-pointer ${!n.read ? 'border-l-4 border-primary' : ''}`}
              onClick={() => !n.read && markRead(n._id)}
            >
              <p className="font-medium">{n.type}</p>
              <p className="text-sm text-onSurface-variant">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}