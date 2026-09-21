import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { familyService } from '../../services/familyService';
import { useFamilyStore } from '../../store/familyStore';
import { AppShell } from '../../components/layout';
import { Card, Button, Modal, Input, EmptyState } from '../../components/common';

export default function FamilyDashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { families, setFamilies, setActive } = useFamilyStore();

  const create = useMutation({
    mutationFn: () => familyService.create(name),
    onSuccess: (family) => {
      setFamilies([...families, { ...family, role: 'owner' }]);
      setActive({ ...family, role: 'owner' });
      setShowCreate(false);
      navigate(`/family/${family._id}/feed`);
    },
  });

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your families</h1>
        <Button onClick={() => setShowCreate(true)}>+ New family</Button>
      </div>

      {families.length === 0 ? (
        <EmptyState
          title="No families yet"
          description="Create a family workspace or join one with an invite code."
          action={<Button onClick={() => setShowCreate(true)}>Create family</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {families.map((f) => (
            <Card
              key={f._id}
              className="cursor-pointer hover:shadow-md transition"
              onClick={() => {
                setActive(f);
                navigate(`/family/${f._id}/feed`);
              }}
            >
              <h3 className="font-semibold text-lg">{f.name}</h3>
              <p className="text-sm text-onSurface-variant mt-1">Role: {f.role}</p>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create a family">
        <Input
          label="Family name"
          placeholder="e.g. The Mwangi Family"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button onClick={() => create.mutate()} disabled={!name || create.isPending}>
            {create.isPending ? 'Creating…' : 'Create'}
          </Button>
        </div>
      </Modal>
    </AppShell>
  );
}