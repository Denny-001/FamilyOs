import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFamilyMembers } from '../../hooks/useFamily';
import { AppShell } from '../../components/layout';
import { Card, Avatar, Badge, Button, Modal, Input, Spinner } from '../../components/common';
import { api } from '../../services/api';

export default function FamilyMembers() {
  const { familyId } = useParams();
  const { data: members, isLoading } = useFamilyMembers(familyId);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const [role, setRole] = useState('adult');

  const createInvite = async () => {
    const res = await api.post(`/families/${familyId}/invites`, { role, expiresInDays: 14 });
    setInviteUrl(res.data.data.joinUrl);
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Members</h1>
        <Button onClick={() => setShowInvite(true)}>Invite</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size={32} /></div>
      ) : (
        <div className="space-y-3">
          {(members ?? []).map((m: any) => (
            <Card key={m._id} className="flex items-center gap-3">
              <Avatar name={m.userId?.name ?? 'Member'} src={m.userId?.avatarUrl} />
              <div className="flex-1">
                <p className="font-medium">{m.userId?.name}</p>
                <p className="text-xs text-onSurface-variant">{m.relationship}</p>
              </div>
              <Badge>{m.role}</Badge>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="Invite a member">
        {inviteUrl ? (
          <div className="space-y-3">
            <p className="text-sm text-onSurface-variant">Share this link:</p>
            <Input readOnly value={inviteUrl} onFocus={(e) => e.target.select()} />
          </div>
        ) : (
          <>
            <label className="block">
              <span className="block text-sm font-medium mb-1">Role on join</span>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="input">
                <option value="adult">Adult</option>
                <option value="minor">Minor</option>
                <option value="guest">Guest</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setShowInvite(false)}>Cancel</Button>
              <Button onClick={createInvite}>Generate invite</Button>
            </div>
          </>
        )}
      </Modal>
    </AppShell>
  );
}