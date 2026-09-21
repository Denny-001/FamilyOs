import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { CreateTaskSchema, CreateTaskInput } from '@familyos/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppShell } from '../../components/layout';
import { Card, Input, Button } from '../../components/common';
import { taskService } from '../../services/taskService';

export default function CreateTask() {
  const { familyId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<CreateTaskInput>({
    resolver: zodResolver(CreateTaskSchema),
  });

  const create = useMutation({
    mutationFn: (data: CreateTaskInput) => taskService.create(familyId!, data),
    onSuccess: () => navigate(`/family/${familyId}/tasks`),
  });

  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-6">New task</h1>
      <Card>
        <form onSubmit={handleSubmit((d) => create.mutate(d))} className="space-y-4">
          <Input label="Title" {...register('title')} error={formState.errors.title?.message} />
          <label className="block">
            <span className="block text-sm font-medium mb-1">Description</span>
            <textarea rows={3} {...register('description')} className="input resize-none" />
          </label>
          <Input
            label="Assign to (comma-separated user IDs)"
            {...register('assignedTo', {
              setValueAs: (v) => (typeof v === 'string' ? v.split(',').map((s) => s.trim()) : v),
            })}
          />
          <Input label="Due date" type="datetime-local" {...register('dueDate')} />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Creating…' : 'Create task'}
            </Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
}