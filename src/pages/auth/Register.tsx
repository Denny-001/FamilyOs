import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { RegisterSchema, RegisterInput } from '@familyos/shared';
import { Input, Button, Card } from '../../components/common';
import { useRegister } from '../../hooks/useAuth';

export default function Register() {
  const { register, handleSubmit, formState } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  });
  const signup = useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <Card padding="lg" className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-primary text-center mb-1">Create your account</h1>
        <p className="text-center text-onSurface-variant mb-6 text-sm">
          Join FamilyOS to connect with your family.
        </p>

        <form onSubmit={handleSubmit((d) => signup.mutate(d))} className="space-y-4">
          <Input label="Full name" {...register('name')} error={formState.errors.name?.message} />
          <Input
            label="Phone number"
            placeholder="+254712345678"
            {...register('phone')}
            error={formState.errors.phone?.message}
          />
          <Input label="Email (optional)" type="email" {...register('email')} />
          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={formState.errors.password?.message}
          />
          {signup.isError && (
            <p className="text-error text-sm">
              {(signup.error as any)?.response?.data?.error ?? 'Registration failed'}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={signup.isPending}>
            {signup.isPending ? 'Creating…' : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account? <Link to="/login" className="text-primary font-medium">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}