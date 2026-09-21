import { Link } from 'react-router-dom';
import { Post } from '../../types';
import { Card, Avatar, Badge } from '../common';
import { ReactionButtons } from './ReactionButtons';
import { CommentSection } from './CommentSection';

interface Props {
  post: Post;
  familyId: string;
  onReact: (type: string) => void;
  onComment: (content: string) => void;
}

export const PostCard = ({ post, familyId, onReact, onComment }: Props) => (
  <Card className="mb-4">
    <header className="flex items-center gap-3 mb-3">
      <Avatar name={post.authorId?.name ?? 'Member'} src={post.authorId?.avatarUrl} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{post.authorId?.name}</p>
        <p className="text-xs text-onSurface-variant">
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>
      {post.pinned && <Badge variant="tertiary">Pinned</Badge>}
      {post.type === 'emergency' && <Badge variant="error">Emergency</Badge>}
    </header>

    <p className="whitespace-pre-wrap mb-3">{post.content}</p>

    {post.mediaUrls?.length > 0 && (
      <div className="grid grid-cols-2 gap-2 mb-3">
        {post.mediaUrls.map((url) => (
          <img key={url} src={url} alt="" className="rounded-xl w-full h-40 object-cover" />
        ))}
      </div>
    )}

    <ReactionButtons onReact={onReact} />
    <div className="mt-3 pt-3 border-t border-outline-variant/40">
      <CommentSection
        familyId={familyId}
        postId={post._id}
        onSubmit={(content) => onComment(content)}
      />
    </div>
  </Card>
);