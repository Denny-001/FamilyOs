import { Card, Badge, EmptyState } from '../common';
import { vaultService } from '../../services/vaultService';

interface Doc {
  _id: string;
  fileName: string;
  category: string;
  accessLevel: string;
  createdAt: string;
}

interface Props {
  documents: Doc[];
  onDelete?: (id: string) => void;
}

export const DocumentList = ({ documents, onDelete }: Props) => {
  if (!documents.length) {
    return <EmptyState title="Vault is empty" description="Upload documents to share securely with the family." />;
  }

  const download = async (id: string) => {
    const { url } = await vaultService.download(id);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <Card key={doc._id}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{doc.fileName}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="tertiary">{doc.category}</Badge>
                <span className="text-xs text-onSurface-variant">{doc.accessLevel}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => download(doc._id)} className="text-primary text-sm font-medium">
                Download
              </button>
              {onDelete && (
                <button onClick={() => onDelete(doc._id)} className="text-error text-sm font-medium">
                  Delete
                </button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};