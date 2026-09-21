import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { contributionService } from '../../services/contributionService';
import { AppShell } from '../../components/layout';
import { ContributionCard } from '../../components/contributions';
import { Spinner, EmptyState } from '../../components/common';

export default function ContributionsPage() {
  const { familyId, eventId } = useParams();
  const { data = [], isLoading } = useQuery({
    queryKey: ['contributions', familyId, eventId],
    queryFn: () => contributionService.listForEvent(familyId!, eventId!),
    enabled: !!familyId && !!eventId,
  });

  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-6">Contributions</h1>
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size={32} /></div>
      ) : data.length === 0 ? (
        <EmptyState title="No contributions yet" description="Once an admin sets expectations, they'll show here." />
      ) : (
        <div className="space-y-3">
          {data.map((c: any) => <ContributionCard key={c._id} contribution={c} />)}
        </div>
      )}
    </AppShell>
  );
}