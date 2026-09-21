import { EventItem } from '../../types';

interface Props {
  events: EventItem[];
  onSelect: (id: string) => void;
}

/**
 * Minimal month grid calendar (dependency-free).
 * Swap for react-big-calendar later if richer UX is needed.
 */
export const CalendarView = ({ events, onSelect }: Props) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayEvents = (day: number) =>
    events.filter((e) => {
      const d = new Date(e.startDate);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });

  return (
    <div className="grid grid-cols-7 gap-1">
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
        <div key={i} className="text-xs text-center font-medium text-onSurface-variant py-2">
          {d}
        </div>
      ))}
      {Array.from({ length: firstDay }).map((_, i) => (
        <div key={`empty-${i}`} />
      ))}
      {Array.from({ length: daysInMonth }).map((_, i) => {
        const day = i + 1;
        const items = dayEvents(day);
        return (
          <button
            key={day}
            onClick={() => items[0] && onSelect(items[0]._id)}
            className={`aspect-square p-1 rounded-lg text-sm border border-outline-variant/30 hover:bg-surface-container
              ${items.length ? 'bg-primary-container' : ''}`}
          >
            <span className="block text-right">{day}</span>
            {items.slice(0, 2).map((e) => (
              <span key={e._id} className="block text-[10px] truncate text-left">{e.title}</span>
            ))}
          </button>
        );
      })}
    </div>
  );
};