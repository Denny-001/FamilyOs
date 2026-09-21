import { Modal } from './Modal';
import { Button } from './Button';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  loading,
}: Props) => (
  <Modal open={open} onClose={onCancel} title={title}>
    <p className="text-onSurface-variant mb-6">{message}</p>
    <div className="flex justify-end gap-3">
      <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      <Button onClick={onConfirm} disabled={loading}>{confirmLabel}</Button>
    </div>
  </Modal>
);