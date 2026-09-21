import { Link } from 'react-router-dom';
import { EventItem } from '../../types';
import { Card, Badge } from '../common';

interface Props {
  event: EventItem;
  familyId: string;
}

export const EventCard = ({ event, familyId }: Props) => (
  <Link to={`/family/${familyId}/events/${event._id}`}>
    <Card className="hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <Badge variant="tertiary">{event.type}</Badge>
          <h3 className="font-semibold text-lg mt-2">{event.title}</h3>
          <p className="text-sm text-onSurface-variant mt-1">
            {new Date(event.startDate).toLocaleDateString(undefined, {
              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
            })}
          </p>
          {event.location?.name && (
            <p className="text-sm text-onSurface-variant mt-1">📍 {event.location.name}</p>
          )}
        </div>
      </div>
    </Card>
  </Link>
);