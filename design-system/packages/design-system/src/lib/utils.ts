/**
 * Netflix Design System - Utility Functions
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format duration in seconds to MM:SS or HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get maturity rating badge styling
 */
export function getMaturityRatingStyle(rating: string): {
  bgColor: string;
  textColor: string;
  borderColor?: string;
} {
  const ratingMap: Record<string, ReturnType<typeof getMaturityRatingStyle>> = {
    'TV-Y': { bgColor: 'bg-secondary-green', textColor: 'text-black' },
    'TV-Y7': { bgColor: 'bg-secondary-green', textColor: 'text-black' },
    'G': { bgColor: 'bg-secondary-green', textColor: 'text-black' },
    'TV-G': { bgColor: 'bg-secondary-green', textColor: 'text-black' },
    'PG': { bgColor: 'bg-secondary-blue-100', textColor: 'text-white' },
    'TV-PG': { bgColor: 'bg-secondary-blue-100', textColor: 'text-white' },
    'PG-13': { bgColor: 'bg-gray-400', textColor: 'text-white' },
    'TV-14': { bgColor: 'bg-gray-400', textColor: 'text-white' },
    'R': { bgColor: 'bg-primary', textColor: 'text-white' },
    'TV-MA': { bgColor: 'bg-primary', textColor: 'text-white' },
    'NC-17': { bgColor: 'bg-primary', textColor: 'text-white' },
  };

  return ratingMap[rating] || { bgColor: 'bg-gray-600', textColor: 'text-white' };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Calculate percentage watched
 */
export function getWatchProgress(currentTime: number, totalTime: number): number {
  if (totalTime === 0) return 0;
  return Math.min(Math.round((currentTime / totalTime) * 100), 100);
}

/**
 * Debounce function for search and input handlers
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Check if video quality badge should be shown
 */
export function getQualityBadge(quality: 'HD' | '4K' | 'HDR' | 'DOLBY VISION' | 'ULTRA HD 4K'): string {
  const badges: Record<string, string> = {
    'HD': 'HD',
    '4K': '4K',
    'HDR': 'HDR',
    'DOLBY VISION': 'DOLBY VISION',
    'ULTRA HD 4K': 'ULTRA HD 4K',
  };
  
  return badges[quality] || '';
}
