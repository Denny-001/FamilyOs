import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { LoginSchema, LoginInput } from '@familyos/shared';
import { Input, Button, Card } from '../../components/common';
import { useLogin } from '../../hooks/useAuth';

export default function Login() {
  const { register, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });
  const login = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <Card padding="lg" className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-primary text-center mb-1">FamilyOS</h1>
        <p className="text-center text-onSurface-variant mb-6 text-sm">
          Welcome back. Sign in to continue.
        </p>

        <form onSubmit={handleSubmit((d) => login.mutate(d))} className="space-y-4">
          <Input
            label="Phone number"
            placeholder="+254712345678"
            {...register('phone')}
            error={formState.errors.phone?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={formState.errors.password?.message}
          />
          {login.isError && (
            <p className="text-error text-sm">
              {(login.error as any)?.response?.data?.error ?? 'Login failed'}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="flex justify-between items-center mt-4 text-sm">
          <Link to="/forgot-password" className="text-primary">Forgot password?</Link>
          <Link to="/register" className="text-primary font-medium">Create account</Link>
        </div>
      </Card>
    </div>
  );
}