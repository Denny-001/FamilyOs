import { TaskItem } from '../../types';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../common';

interface Props {
  tasks: TaskItem[];
  onToggleStatus: (id: string, status: TaskItem['status']) => void;
}

export const TaskList = ({ tasks, onToggleStatus }: Props) => {
  if (!tasks.length) {
    return <EmptyState title="No tasks yet" description="Create a task to get the family organized." />;
  }
  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <TaskCard key={t._id} task={t} onToggleStatus={(s) => onToggleStatus(t._id, s)} />
      ))}
    </div>
  );
};