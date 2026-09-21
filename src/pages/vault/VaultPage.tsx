import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { vaultService } from '../../services/vaultService';
import { AppShell } from '../../components/layout';
import { DocumentList } from '../../components/vault';
import { Spinner, Button } from '../../components/common';

export default function VaultPage() {
  const { familyId } = useParams();
  const qc = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ['vault', familyId],
    queryFn: () => vaultService.list(familyId!),
    enabled: !!familyId,
  });

  const handleDelete = async (id: string) => {
    await vaultService.remove(id);
    qc.invalidateQueries({ queryKey: ['vault', familyId] });
  };

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Document Vault</h1>
        <Button>+ Upload</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size={32} /></div>
      ) : (
        <DocumentList documents={data} onDelete={handleDelete} />
      )}
    </AppShell>
  );
}