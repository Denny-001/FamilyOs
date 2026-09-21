import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFamily } from '../../hooks/useFamily';
import { AppShell } from '../../components/layout';
import { Card, Input, Button } from '../../components/common';
import { api } from '../../services/api';

export default function FamilySettings() {
  const { familyId } = useParams();
  const { data: family } = useFamily(familyId);
  const [name, setName] = useState('');
  const [cover, setCover] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await api.patch(`/families/${familyId}`, {
      ...(name && { name }),
      ...(cover && { coverPhotoUrl: cover }),
    });
    setSaving(false);
  };

  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-6">Family settings</h1>
      <Card>
        <Input
          label="Family name"
          defaultValue={family?.name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="mt-4">
          <Input
            label="Cover photo URL"
            defaultValue={family?.coverPhotoUrl}
            onChange={(e) => setCover(e.target.value)}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
        </div>
      </Card>
    </AppShell>
  );
}