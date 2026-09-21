import { useState } from 'react';

const reactions = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'pray', emoji: '🙏', label: 'Pray' },
  { type: 'laugh', emoji: '😂', label: 'Laugh' },
];

interface Props {
  onReact: (type: string) => void;
  initial?: string[];
}

export const ReactionButtons = ({ onReact, initial = [] }: Props) => {
  const [active, setActive] = useState<string[]>(initial);

  const toggle = (type: string) => {
    setActive((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
    onReact(type);
  };

  return (
    <div className="flex items-center gap-2">
      {reactions.map((r) => (
        <button
          key={r.type}
          onClick={() => toggle(r.type)}
          className={`px-3 py-1.5 rounded-full text-sm transition border
            ${active.includes(r.type)
              ? 'bg-primary-container border-primary text-onContainer'
              : 'border-outline-variant/40 hover:bg-surface-container'}`}
          aria-label={r.label}
        >
          <span className="mr-1">{r.emoji}</span>
          {r.label}
        </button>
      ))}
    </div>
  );
};