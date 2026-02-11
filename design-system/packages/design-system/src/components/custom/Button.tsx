/**
 * Netflix Design System - Button Component
 * Supports all button variants from the design system
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded font-medium transition-all duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary red button (Sign In, Get Started)
        primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active',
        
        // Secondary gray button (Use a Sign-In Code)
        secondary: 'bg-gray-450 text-white hover:bg-gray-400',
        
        // Outline button (Manage Profiles)
        outline: 'border border-gray-400 bg-transparent text-white hover:border-white',
        
        // Ghost button (icon buttons, subtle actions)
        ghost: 'bg-transparent text-white hover:bg-white-transparent-15',
        
        // Play button (hero banner)
        play: 'bg-white text-black hover:bg-white-transparent-70 font-bold',
        
        // More Info button
        info: 'bg-gray-600 bg-opacity-60 text-white hover:bg-gray-550 backdrop-blur-sm',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-body',
        lg: 'h-12 px-6 text-headline-1',
        xl: 'h-14 px-8 text-title-4',
        
        // Icon button sizes
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, icon, iconPosition = 'left', children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Specialized button components for common Netflix patterns

export const PlayButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  ({ children, icon, ...props }, ref) => (
    <Button variant="play" icon={icon || '▶'} iconPosition="left" ref={ref} {...props}>
      {children || 'Play'}
    </Button>
  )
);

PlayButton.displayName = 'PlayButton';

export const MoreInfoButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  ({ children, icon, ...props }, ref) => (
    <Button variant="info" icon={icon || 'ⓘ'} iconPosition="left" ref={ref} {...props}>
      {children || 'More Info'}
    </Button>
  )
);

MoreInfoButton.displayName = 'MoreInfoButton';

export { Button, buttonVariants };
