import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { CreateEventSchema, CreateEventInput } from '@familyos/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppShell } from '../../components/layout';
import { Card, Input, Button } from '../../components/common';
import { eventService } from '../../services/eventService';

export default function CreateEvent() {
  const { familyId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<CreateEventInput>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: { type: 'birthday', currency: 'KES' },
  });

  const create = useMutation({
    mutationFn: (data: CreateEventInput) => eventService.create(familyId!, data),
    onSuccess: () => navigate(`/family/${familyId}/events`),
  });

  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-6">New event</h1>
      <Card>
        <form onSubmit={handleSubmit((d) => create.mutate(d))} className="space-y-4">
          <Input label="Title" {...register('title')} error={formState.errors.title?.message} />
          <label className="block">
            <span className="block text-sm font-medium mb-1">Type</span>
            <select {...register('type')} className="input">
              <option value="birthday">Birthday</option>
              <option value="wedding">Wedding</option>
              <option value="funeral">Funeral</option>
              <option value="reunion">Reunion</option>
              <option value="graduation">Graduation</option>
              <option value="other">Other</option>
            </select>
          </label>
          <Input label="Start date" type="datetime-local" {...register('startDate')} />
          <Input label="End date (optional)" type="datetime-local" {...register('endDate')} />
          <Input label="Location" {...register('location.name')} />
          <label className="block">
            <span className="block text-sm font-medium mb-1">Description</span>
            <textarea rows={3} {...register('description')} className="input resize-none" />
          </label>
          <Input
            label="Contribution target (optional)"
            type="number"
            {...register('contributionTarget', { valueAsNumber: true })}
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Creating…' : 'Create event'}
            </Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
}