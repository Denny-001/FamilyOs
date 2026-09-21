import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { feedService } from '../../services/feedService';
import { Input } from '../common';

interface Props {
  familyId: string;
  postId: string;
  onSubmit: (content: string) => void;
}

export const CommentSection = ({ familyId, postId, onSubmit }: Props) => {
  const [text, setText] = useState('');
  const qc = useQueryClient();

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', familyId, postId],
    queryFn: () => feedService.comments(familyId, postId),
  });

  const submit = async () => {
    if (!text.trim()) return;
    await feedService.addComment(familyId, postId, text.trim());
    setText('');
    qc.invalidateQueries({ queryKey: ['comments', familyId, postId] });
    onSubmit(text.trim());
  };

  return (
    <div>
      {comments.map((c: any) => (
        <div key={c._id} className="text-sm mb-2">
          <span className="font-medium">{c.authorId?.name}: </span>
          <span className="text-onSurface-variant">{c.content}</span>
        </div>
      ))}
      <div className="flex gap-2 mt-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment…"
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <button onClick={submit} className="btn-primary px-4">Post</button>
      </div>
    </div>
  );
};