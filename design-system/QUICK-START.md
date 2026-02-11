# Netflix Design System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd packages/design-system
npm install
```

Required peer dependencies:
- React 18+
- Tailwind CSS 3.4+

### Step 2: Configure Tailwind

In your project's `tailwind.config.ts`:

```typescript
import netflixPreset from './packages/design-system/tailwind.config';

export default {
  presets: [netflixPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './packages/design-system/src/**/*.{js,ts,jsx,tsx}',
  ],
};
```

### Step 3: Import Global Styles

Create or update your global CSS file:

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Netflix Sans Font (you'll need to add the font files) */
@font-face {
  font-family: 'Netflix Sans';
  src: url('/fonts/NetflixSans-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Netflix Sans';
  src: url('/fonts/NetflixSans-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: 'Netflix Sans';
  src: url('/fonts/NetflixSans-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Bebas Neue';
  src: url('/fonts/BebasNeue-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

/* Base styles */
body {
  @apply bg-netflix-black text-white font-sans;
}
```

### Step 4: Use Components

```tsx
import { Button, Input, MovieCard } from './packages/design-system/src';

function App() {
  return (
    <div className="min-h-screen bg-netflix-black p-8">
      <h1 className="font-display text-display-lg text-white mb-8">
        Netflix Clone
      </h1>
      
      <div className="space-y-4 max-w-md">
        <Input 
          type="email" 
          placeholder="Email address" 
        />
        
        <Button variant="primary" size="lg" fullWidth>
          Get Started
        </Button>
      </div>
    </div>
  );
}
```

## 🎨 Essential Tailwind Classes

### Colors
```tsx
<div className="bg-netflix-black text-white">
<div className="bg-gray-850 text-gray-100">
<div className="bg-primary hover:bg-primary-hover">
```

### Typography
```tsx
<h1 className="font-display text-display-lg">Logo</h1>
<h2 className="text-title-2 font-medium">Heading</h2>
<p className="text-body text-gray-200">Body text</p>
```

### Spacing
```tsx
<div className="p-4 m-6 gap-2"> {/* 16px, 24px, 8px */}
```

## 📦 Component Examples

### Sign In Form
```tsx
<form className="space-y-4">
  <Input type="email" placeholder="Email or phone number" />
  <Input type="password" placeholder="Password" />
  <Button variant="primary" size="lg" fullWidth>
    Sign In
  </Button>
</form>
```

### Hero Banner
```tsx
<div className="relative h-screen">
  <div className="absolute inset-0">
    <img src="/hero.jpg" alt="Hero" className="w-full h-full object-cover" />
  </div>
  <div className="relative z-10 p-16">
    <h1 className="font-display text-display-xl text-white mb-6">
      HOUSE OF NINJAS
    </h1>
    <div className="flex gap-4">
      <PlayButton />
      <MoreInfoButton />
    </div>
  </div>
</div>
```

### Content Row
```tsx
<MovieRow title="Trending Now">
  <MovieCard
    title="House of Ninjas"
    imageUrl="/posters/1.jpg"
    label="TOP 10"
    rank={2}
  />
  <MovieCard
    title="Stranger Things"
    imageUrl="/posters/2.jpg"
    label="Recently Added"
  />
</MovieRow>
```

## 🎯 Key Files Reference

| File | Purpose |
|------|---------|
| `src/tokens/colors.ts` | All color values |
| `src/tokens/typography.ts` | Font families and scales |
| `src/components/custom/Button.tsx` | Button component |
| `src/components/custom/Input.tsx` | Form inputs |
| `src/components/custom/MovieCard.tsx` | Content cards |
| `tailwind.config.ts` | Tailwind preset |
| `examples/usage-examples.tsx` | Real-world examples |

## 🔧 Customization

### Extending Colors
```typescript
// tailwind.config.ts
export default {
  presets: [netflixPreset],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#0000FF',
      },
    },
  },
};
```

### Custom Components
```tsx
import { cn } from './src/lib/utils';

function CustomCard({ className, children }) {
  return (
    <div className={cn(
      'rounded-lg bg-gray-800 p-6',
      className
    )}>
      {children}
    </div>
  );
}
```

## ⚠️ Important Notes

1. **Fonts**: You need to add Netflix Sans and Bebas Neue font files to your project
2. **Images**: Replace placeholder image URLs with your actual assets
3. **Icons**: Install a library like `lucide-react` for icons in buttons
4. **Responsive**: All components support responsive breakpoints

## 📚 Learn More

- **Full README**: `packages/design-system/README.md`
- **Extraction Report**: `docs/EXTRACTION-REPORT.md`
- **Usage Examples**: `examples/usage-examples.tsx`
- **Component API**: Check TypeScript definitions in component files

## 🎬 Next Steps

1. ✅ Set up your project with the design system
2. ✅ Add Netflix Sans and Bebas Neue fonts
3. ✅ Explore usage examples
4. ✅ Build your Netflix-inspired UI
5. ✅ Customize as needed

---

**Happy Building! 🍿**
