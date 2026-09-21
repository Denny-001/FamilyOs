import { useState } from 'react';
import { Modal, Button, Input } from '../common';
import { contributionService } from '../../services/contributionService';

interface Props {
  open: boolean;
  contributionId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PaymentModal = ({ open, contributionId, onClose, onSuccess }: Props) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      await contributionService.initiatePayment({ contributionId, provider: 'mpesa', phone });
      onSuccess?.();
      onClose();
    } catch (e: any) {
      setError(e.response?.data?.error ?? 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Pay via M-Pesa">
      <p className="text-sm text-onSurface-variant mb-4">
        Enter the M-Pesa number to receive the STK push.
      </p>
      <Input
        label="Phone number"
        placeholder="+254712345678"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={error}
      />
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={submit} disabled={loading || !phone}>
          {loading ? 'Sending…' : 'Send STK Push'}
        </Button>
      </div>
    </Modal>
  );
};