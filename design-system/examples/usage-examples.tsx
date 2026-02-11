/**
 * Netflix Design System - Usage Examples
 * Real-world implementation examples
 */

import React from 'react';
import {
  Button,
  PlayButton,
  MoreInfoButton,
  Input,
  EmailInput,
  PasswordInput,
  Dropdown,
  MovieCard,
  MovieRow,
} from '@netflix/design-system';

// Example 1: Sign In Page
export function SignInPage() {
  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded bg-black-transparent-90 p-16">
        <h1 className="text-title-1 font-medium text-white">Sign In</h1>
        
        <form className="space-y-4">
          <EmailInput placeholder="Email or phone number" />
          <PasswordInput placeholder="Password" />
          
          <Button variant="primary" size="lg" fullWidth>
            Sign In
          </Button>
          
          <div className="text-center">
            <span className="text-gray-200">OR</span>
          </div>
          
          <Button variant="secondary" size="lg" fullWidth>
            Use a Sign-In Code
          </Button>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-200">
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <a href="#" className="text-sm text-gray-200 hover:underline">
              Need help?
            </a>
          </div>
        </form>
        
        <p className="text-gray-200">
          New to Netflix?{' '}
          <a href="#" className="text-white hover:underline">
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
}

// Example 2: Hero Banner
export function HeroBanner() {
  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero-image.jpg"
          alt="Hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-black-transparent-60 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex h-full items-center px-16">
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary px-2 py-1 text-xs font-bold text-white">
              TOP 10
            </span>
            <span className="text-sm font-medium text-white">
              #2 in TV Shows Today
            </span>
          </div>
          
          <h1 className="font-display text-display-xl text-white">
            HOUSE OF NINJAS
          </h1>
          
          <p className="text-headline-1 text-white">
            Years after retiring from their formidable ninja lives, a dysfunctional
            family must return to shadowy missions to counteract a string of
            looming threats.
          </p>
          
          <div className="flex gap-4">
            <PlayButton size="lg" />
            <MoreInfoButton size="lg" />
          </div>
          
          <div className="flex items-center gap-4 text-sm text-white">
            <span className="rounded border border-gray-400 px-2 py-1">TV-14</span>
            <span>3 Seasons</span>
            <span>2024</span>
            <span className="rounded border border-gray-400 px-2 py-1">HD</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 3: Content Rows
export function ContentBrowser() {
  const movies = [
    {
      id: 1,
      title: 'House of Ninjas',
      imageUrl: '/posters/house-of-ninjas.jpg',
      label: 'TOP 10' as const,
      rank: 2,
    },
    {
      id: 2,
      title: 'Stranger Things',
      imageUrl: '/posters/stranger-things.jpg',
      label: 'Recently Added' as const,
    },
    // ... more movies
  ];

  return (
    <div className="min-h-screen bg-netflix-black px-16 py-12">
      <MovieRow title="Trending Now">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            imageUrl={movie.imageUrl}
            label={movie.label}
            rank={movie.rank}
            className="w-64 flex-shrink-0"
          />
        ))}
      </MovieRow>
      
      <MovieRow title="Continue Watching">
        <MovieCard
          title="Breaking Bad"
          imageUrl="/posters/breaking-bad.jpg"
          variant="continue"
          progress={65}
          duration="S3:E7"
          className="w-64 flex-shrink-0"
        />
        {/* ... more cards */}
      </MovieRow>
      
      <MovieRow title="New Releases">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            imageUrl={movie.imageUrl}
            label="Recently Added"
            className="w-64 flex-shrink-0"
          />
        ))}
      </MovieRow>
    </div>
  );
}

// Example 4: Browse with Filters
export function BrowsePage() {
  return (
    <div className="min-h-screen bg-netflix-black px-16 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-title-2 font-medium text-white">
          Browse by Languages
        </h1>
        
        <div className="flex gap-4">
          <Dropdown
            label=""
            options={[
              { value: 'original', label: 'Original Language' },
              { value: 'dubbed', label: 'Dubbing' },
              { value: 'subtitles', label: 'Subtitles' },
            ]}
          />
          
          <Dropdown
            label=""
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
              { value: 'de', label: 'German' },
            ]}
          />
          
          <Dropdown
            label=""
            options={[
              { value: 'suggestions', label: 'Suggestions For You' },
              { value: 'year', label: 'Year Released' },
              { value: 'az', label: 'A-Z' },
              { value: 'za', label: 'Z-A' },
            ]}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Movie cards grid */}
      </div>
    </div>
  );
}

// Example 5: Profile Selection
export function ProfileSelection() {
  const profiles = [
    { id: 1, name: 'James', avatar: '/avatars/james.png' },
    { id: 2, name: 'Sarah', avatar: '/avatars/sarah.png' },
    { id: 3, name: 'Kids', avatar: '/avatars/kids.png' },
  ];

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-title-1 font-medium text-white">
          Who's watching?
        </h1>
        
        <div className="flex gap-6 justify-center">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              className="group flex flex-col items-center gap-2 transition-transform hover:scale-110"
            >
              <div className="h-32 w-32 overflow-hidden rounded border-4 border-transparent group-hover:border-white transition-colors">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-headline-1 text-gray-200 group-hover:text-white transition-colors">
                {profile.name}
              </span>
            </button>
          ))}
          
          <button className="group flex flex-col items-center gap-2">
            <div className="h-32 w-32 flex items-center justify-center rounded border-4 border-transparent group-hover:border-white transition-colors bg-gray-700">
              <span className="text-6xl text-gray-400 group-hover:text-white">+</span>
            </div>
            <span className="text-headline-1 text-gray-200 group-hover:text-white">
              Add Profile
            </span>
          </button>
        </div>
        
        <Button variant="outline" size="lg">
          Manage Profiles
        </Button>
      </div>
    </div>
  );
}

// Example 6: Using Design Tokens Directly
export function CustomComponent() {
  return (
    <div 
      className="rounded-lg p-6"
      style={{
        backgroundColor: 'var(--color-gray-850)',
        borderColor: 'var(--color-gray-600)',
      }}
    >
      <h2 className="text-title-3 font-medium mb-4 text-white">
        Custom Styled Component
      </h2>
      <p className="text-body text-gray-200">
        This component uses Netflix design tokens directly while
        maintaining flexibility for custom layouts.
      </p>
    </div>
  );
}
