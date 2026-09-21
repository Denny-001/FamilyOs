import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '../../services/eventService';
import { AppShell } from '../../components/layout';
import { Card, Badge, Spinner } from '../../components/common';
import { RSVPButton } from '../../components/events';

export default function EventDetail() {
  const { familyId, eventId } = useParams();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.get(eventId!),
    enabled: !!eventId,
  });

  if (isLoading) return <AppShell><div className="flex justify-center py-12"><Spinner size={32} /></div></AppShell>;
  if (!event) return <AppShell><p>Event not found</p></AppShell>;

  return (
    <AppShell>
      <Card padding="lg">
        <Badge variant="tertiary">{event.type}</Badge>
        <h1 className="text-2xl font-bold mt-3">{event.title}</h1>
        <p className="text-onSurface-variant mt-2">
          {new Date(event.startDate).toLocaleString()}
        </p>
        {event.location?.name && <p className="mt-2">📍 {event.location.name}</p>}
        {event.description && <p className="mt-4 whitespace-pre-wrap">{event.description}</p>}

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Your RSVP</h2>
          <RSVPButton eventId={event._id} />
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Event feed & tasks</h2>
          <p className="text-sm text-onSurface-variant">
            Event-scoped posts and tasks land here in the next iteration.
          </p>
        </div>
      </Card>
    </AppShell>
  );
}