import { forwardRef, InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = '', ...rest }, ref) => (
    <label className="block">
      {label && <span className="block text-sm font-medium mb-1">{label}</span>}
      <input ref={ref} className={`input ${className}`} {...rest} />
      {error && <span className="text-error text-sm mt-1">{error}</span>}
    </label>
  )
);
Input.displayName = 'Input';