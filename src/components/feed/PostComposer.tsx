import { useState } from 'react';
import { Card, Button } from '../common';

interface Props {
  onSubmit: (payload: { type: string; content: string }) => void;
  loading?: boolean;
}

export const PostComposer = ({ onSubmit, loading }: Props) => {
  const [content, setContent] = useState('');
  const [type, setType] = useState('text');

  const submit = () => {
    if (!content.trim()) return;
    onSubmit({ type, content: content.trim() });
    setContent('');
    setType('text');
  };

  return (
    <Card className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share something with the family…"
        rows={3}
        className="input resize-none"
      />
      <div className="flex items-center justify-between mt-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input max-w-[160px]"
        >
          <option value="text">Post</option>
          <option value="announcement">Announcement</option>
          <option value="emergency">Emergency</option>
        </select>
        <Button onClick={submit} disabled={loading || !content.trim()}>
          {loading ? 'Posting…' : 'Post'}
        </Button>
      </div>
    </Card>
  );
};