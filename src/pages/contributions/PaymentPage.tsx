import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '../../components/layout';
import { PaymentModal } from '../../components/contributions';
import { Card } from '../../components/common';

export default function PaymentPage() {
  const { contributionId } = useParams();
  const navigate = useNavigate();
  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-6">Make a payment</h1>
      <Card>
        <p className="text-onSurface-variant">
          Complete your M-Pesa payment using the popup below.
        </p>
      </Card>
      <PaymentModal
        open
        contributionId={contributionId!}
        onClose={() => navigate(-1)}
        onSuccess={() => navigate(-1)}
      />
    </AppShell>
  );
}