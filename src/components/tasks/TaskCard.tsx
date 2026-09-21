import { TaskItem } from '../../types';
import { Card, Badge, Avatar } from '../common';

interface Props {
  task: TaskItem;
  onToggleStatus: (status: TaskItem['status']) => void;
}

const statusVariants: Record<TaskItem['status'], 'primary' | 'tertiary' | 'error'> = {
  done: 'primary',
  in_progress: 'tertiary',
  todo: 'error',
};

export const TaskCard = ({ task, onToggleStatus }: Props) => (
  <Card>
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-onSurface-variant mt-1 line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center gap-3 mt-3">
          <Badge variant={statusVariants[task.status]}>{task.status.replace('_', ' ')}</Badge>
          {task.dueDate && (
            <span className="text-xs text-onSurface-variant">
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3">
          {task.assignedTo.slice(0, 3).map((u) => (
            <Avatar key={u._id} name={u.name} src={u.avatarUrl} size="sm" />
          ))}
        </div>
      </div>
      <select
        value={task.status}
        onChange={(e) => onToggleStatus(e.target.value as TaskItem['status'])}
        className="text-sm input max-w-[130px]"
      >
        <option value="todo">To-Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  </Card>
);