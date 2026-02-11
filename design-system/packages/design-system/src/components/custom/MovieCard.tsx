/**
 * Netflix Design System - Movie/Content Card Component
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva(
  'group relative overflow-hidden rounded transition-all duration-base',
  {
    variants: {
      variant: {
        default: 'bg-gray-800 hover:scale-105 hover:z-10',
        featured: 'bg-transparent',
        continue: 'bg-gray-900',
      },
      size: {
        sm: 'aspect-[2/3]',
        md: 'aspect-[16/9]',
        lg: 'aspect-[21/9]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

export interface MovieCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title: string;
  imageUrl?: string;
  rank?: number;
  label?: 'Recently Added' | 'New Season' | 'Leaving Soon' | 'TOP 10';
  logo?: string;
  progress?: number; // For "Continue Watching" - 0 to 100
  duration?: string;
}

const MovieCard = React.forwardRef<HTMLDivElement, MovieCardProps>(
  ({ 
    className, 
    variant, 
    size, 
    title, 
    imageUrl, 
    rank, 
    label, 
    logo,
    progress,
    duration,
    ...props 
  }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Background Image */}
        {imageUrl && (
          <div className="absolute inset-0">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black-transparent-90 via-transparent to-transparent opacity-0 transition-opacity duration-base group-hover:opacity-100" />
          </div>
        )}

        {/* Rank Badge (for TOP 10) */}
        {rank && (
          <div className="absolute bottom-0 left-0 flex items-end">
            <span className="font-display text-[150px] font-bold leading-none text-gray-900 opacity-80" 
                  style={{ WebkitTextStroke: '2px white' }}>
              {rank}
            </span>
          </div>
        )}

        {/* Label Badge */}
        {label && (
          <div className="absolute left-0 top-0 m-2">
            {label === 'TOP 10' ? (
              <div className="flex items-center gap-1 rounded bg-primary px-2 py-1">
                <span className="text-xs font-bold text-white">TOP</span>
                <span className="text-xs font-bold text-white">10</span>
              </div>
            ) : (
              <div className="rounded bg-primary px-2 py-1">
                <span className="text-xs font-bold text-white">{label}</span>
              </div>
            )}
          </div>
        )}

        {/* Logo (if provided) */}
        {logo && (
          <div className="absolute inset-x-0 top-1/3 px-4">
            <img src={logo} alt={`${title} logo`} className="h-auto w-full" />
          </div>
        )}

        {/* Progress Bar (for Continue Watching) */}
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Hover Overlay with Info */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-base group-hover:opacity-100">
          {/* Title */}
          <h3 className="text-body font-medium text-white line-clamp-2">
            {title}
          </h3>
          
          {/* Duration */}
          {duration && (
            <p className="text-sm text-gray-200">{duration}</p>
          )}

          {/* Action Buttons */}
          <div className="mt-2 flex gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-colors hover:bg-white-transparent-70">
              <span className="text-sm">▶</span>
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400 bg-transparent text-white transition-colors hover:border-white">
              <span className="text-sm">+</span>
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400 bg-transparent text-white transition-colors hover:border-white">
              <span className="text-sm">👍</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

MovieCard.displayName = 'MovieCard';

// Carousel/Row Component for displaying multiple cards
interface MovieRowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const MovieRow: React.FC<MovieRowProps> = ({ title, children, className }) => {
  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-title-3 font-medium text-white">{title}</h2>
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {children}
      </div>
    </div>
  );
};

export { MovieCard, cardVariants };
