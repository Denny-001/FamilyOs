import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedService } from '../../services/feedService';
import { AppShell } from '../../components/layout';
import { PostCard, PostComposer } from '../../components/feed';
import { Spinner, EmptyState } from '../../components/common';
import { useRealTime } from '../../hooks/useRealTime';

export default function FeedPage() {
  const { familyId } = useParams();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['feed', familyId],
    queryFn: () => feedService.list(familyId!),
    enabled: !!familyId,
  });

  const create = useMutation({
    mutationFn: (payload: { type: string; content: string }) =>
      feedService.create(familyId!, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feed', familyId] }),
  });

  useRealTime(familyId, {
    'post:new': () => qc.invalidateQueries({ queryKey: ['feed', familyId] }),
  });

  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-6">Family Feed</h1>
      <PostComposer onSubmit={(p) => create.mutate(p)} loading={create.isPending} />

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size={32} /></div>
      ) : !data?.items?.length ? (
        <EmptyState title="No posts yet" description="Be the first to share something." />
      ) : (
        data.items.map((post: any) => (
          <PostCard
            key={post._id}
            post={post}
            familyId={familyId!}
            onReact={(type) => feedService.react(familyId!, post._id, type)}
            onComment={() => qc.invalidateQueries({ queryKey: ['comments', familyId, post._id] })}
          />
        ))
      )}
    </AppShell>
  );
}