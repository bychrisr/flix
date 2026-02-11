/**
 * Netflix Design System - Input Component
 * Email, password, and general text inputs with Netflix styling
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const inputVariants = cva(
  'flex w-full rounded bg-gray-600 px-4 py-3 text-body text-white placeholder:text-gray-250 transition-all duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border border-gray-400 focus:border-white',
        filled: 'border border-transparent bg-gray-600 focus:bg-gray-550',
      },
      inputSize: {
        sm: 'h-10 px-3 text-sm',
        md: 'h-12 px-4 text-body',
        lg: 'h-14 px-5 text-headline-1',
      },
      state: {
        default: '',
        error: 'border-primary ring-1 ring-primary',
        success: 'border-secondary-green ring-1 ring-secondary-green',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
      state: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, state, label, error, helperText, ...props }, ref) => {
    const hasError = error || state === 'error';
    
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-medium text-white">
            {label}
          </label>
        )}
        <input
          className={cn(
            inputVariants({ 
              variant, 
              inputSize, 
              state: hasError ? 'error' : state,
              className 
            })
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="flex items-center gap-1 text-sm text-primary">
            <span className="inline-block">⚠</span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-200">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Specialized input variants for Netflix patterns

export const EmailInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  (props, ref) => (
    <Input
      type="email"
      placeholder="Email address"
      autoComplete="email"
      ref={ref}
      {...props}
    />
  )
);

EmailInput.displayName = 'EmailInput';

export const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  (props, ref) => (
    <Input
      type="password"
      placeholder="Password"
      autoComplete="current-password"
      ref={ref}
      {...props}
    />
  )
);

PasswordInput.displayName = 'PasswordInput';

export const PhoneOrEmailInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  (props, ref) => (
    <Input
      type="text"
      placeholder="Email or phone number"
      autoComplete="username"
      ref={ref}
      {...props}
    />
  )
);

PhoneOrEmailInput.displayName = 'PhoneOrEmailInput';

export { Input, inputVariants };
