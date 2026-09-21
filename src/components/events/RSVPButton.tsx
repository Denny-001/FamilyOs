import { useState } from 'react';
import { eventService } from '../../services/eventService';

interface Props {
  eventId: string;
  initialStatus?: string;
  onUpdated?: (status: string) => void;
}

const options = [
  { value: 'yes', label: 'Going', color: 'bg-primary text-onPrimary' },
  { value: 'maybe', label: 'Maybe', color: 'bg-tertiary text-onTertiary' },
  { value: 'no', label: "Can't make it", color: 'bg-error text-onError' },
];

export const RSVPButton = ({ eventId, initialStatus, onUpdated }: Props) => {
  const [status, setStatus] = useState(initialStatus ?? 'pending');

  const update = async (value: string) => {
    await eventService.rsvp(eventId, value);
    setStatus(value);
    onUpdated?.(value);
  };

  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => update(o.value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition border
            ${status === o.value ? o.color : 'border-outline-variant/40 hover:bg-surface-container'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
};