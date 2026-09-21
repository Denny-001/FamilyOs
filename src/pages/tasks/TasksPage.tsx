import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../../services/taskService';
import { AppShell } from '../../components/layout';
import { TaskList } from '../../components/tasks';
import { Button, Spinner } from '../../components/common';

export default function TasksPage() {
  const { familyId } = useParams();
  const qc = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', familyId],
    queryFn: () => taskService.list(familyId!),
    enabled: !!familyId,
  });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => taskService.update(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks', familyId] }),
  });

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link to={`/family/${familyId}/tasks/new`}><Button>+ New task</Button></Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size={32} /></div>
      ) : (
        <TaskList
          tasks={tasks}
          onToggleStatus={(id, status) => update.mutate({ id, status })}
        />
      )}
    </AppShell>
  );
}