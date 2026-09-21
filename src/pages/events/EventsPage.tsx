import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '../../services/eventService';
import { AppShell } from '../../components/layout';
import { EventCard, CalendarView } from '../../components/events';
import { Button, Spinner, EmptyState } from '../../components/common';

export default function EventsPage() {
  const { familyId } = useParams();
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', familyId],
    queryFn: () => eventService.list(familyId!),
    enabled: !!familyId,
  });

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setView(view === 'list' ? 'calendar' : 'list')}>
            {view === 'list' ? '📅 Calendar' : '📋 List'}
          </Button>
          <Link to={`/family/${familyId}/events/new`}><Button>+ New event</Button></Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size={32} /></div>
      ) : events.length === 0 ? (
        <EmptyState title="No events yet" description="Schedule your first family event." />
      ) : view === 'list' ? (
        <div className="space-y-3">
          {events.map((e: any) => <EventCard key={e._id} event={e} familyId={familyId!} />)}
        </div>
      ) : (
        <CalendarView
          events={events}
          onSelect={(id) => (window.location.href = `/family/${familyId}/events/${id}`)}
        />
      )}
    </AppShell>
  );
}