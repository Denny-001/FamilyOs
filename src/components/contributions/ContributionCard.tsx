import { Card, Badge } from '../common';
import { formatCurrency } from '../../utils/helpers';

interface Props {
  contribution: {
    _id: string;
    userId: { _id: string; name: string };
    amountExpected: number;
    amountPaid: number;
    currency: string;
    status: 'pending' | 'partial' | 'paid';
  };
  onPay?: () => void;
  canPay?: boolean;
}

export const ContributionCard = ({ contribution, onPay, canPay }: Props) => {
  const pct = contribution.amountExpected
    ? Math.min(100, (contribution.amountPaid / contribution.amountExpected) * 100)
    : 0;

  return (
    <Card>
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium">{contribution.userId.name}</span>
        <Badge variant={contribution.status === 'paid' ? 'primary' : contribution.status === 'partial' ? 'tertiary' : 'error'}>
          {contribution.status}
        </Badge>
      </div>

      <div className="h-2 bg-surface-containerHighest rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="flex justify-between items-center mt-2 text-sm text-onSurface-variant">
        <span>
          {formatCurrency(contribution.amountPaid, contribution.currency)} of{' '}
          {formatCurrency(contribution.amountExpected, contribution.currency)}
        </span>
        {canPay && contribution.status !== 'paid' && (
          <button onClick={onPay} className="text-primary font-medium">Pay now</button>
        )}
      </div>
    </Card>
  );
};