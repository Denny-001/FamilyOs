import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Input, Button } from '../../components/common';

export default function ForgotPassword() {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to backend /auth/forgot-password
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <Card padding="lg" className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-primary text-center mb-6">Reset password</h1>
        {sent ? (
          <p className="text-sm text-onSurface-variant text-center">
            If an account exists, we've sent reset instructions via SMS.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Input
              label="Phone number"
              placeholder="+254712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
        )}
        <p className="text-center text-sm mt-4">
          <Link to="/login" className="text-primary">Back to sign in</Link>
        </p>
      </Card>
    </div>
  );
}