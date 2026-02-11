# Netflix Design System

A complete, production-ready design system extracted from Netflix's official brand guidelines. Built with React, TypeScript, Tailwind CSS, and class-variance-authority.

## 📦 Installation

```bash
npm install @netflix/design-system
# or
yarn add @netflix/design-system
# or
pnpm add @netflix/design-system
```

## 🎨 Design Tokens

### Colors

The design system includes Netflix's complete color palette:

**Primary Colors:**
- Netflix Red: `#E50914`
- Black: `#000000`
- White: `#FFFFFF`

**Gray Scale (Netflix's Extended Palette):**
- 24 distinct gray shades from Gray-10 to Gray-900
- Provides maximum fidelity to Netflix's visual identity

**Transparent Variants:**
- White transparent: 15%, 20%, 30%, 35%, 50%, 70%
- Black transparent: 30%, 60%, 90%

### Typography

**Font Families:**
- **Netflix Sans** - Primary UI font (Regular, Medium, Bold)
- **Bebas Neue** - Display font for logos and large headings

**Type Scale:**
- Caption sizes: `caption-1`, `caption-2`
- Body sizes: `small-body`, `body`
- Headlines: `headline-1`, `headline-2`
- Titles: `title-1` through `title-4`, `large-title`
- Display sizes: `display-sm`, `display-md`, `display-lg`, `display-xl`

## 🚀 Usage

### Tailwind Configuration

Add the Netflix preset to your `tailwind.config.ts`:

```typescript
import netflixPreset from '@netflix/design-system/tailwind';

export default {
  presets: [netflixPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@netflix/design-system/src/**/*.{js,ts,jsx,tsx}',
  ],
};
```

### Using Components

```tsx
import { Button, Input, MovieCard, Dropdown } from '@netflix/design-system';

function App() {
  return (
    <div className="bg-netflix-black min-h-screen p-8">
      {/* Primary Netflix Button */}
      <Button variant="primary" size="lg">
        Get Started
      </Button>

      {/* Email Input */}
      <Input
        type="email"
        placeholder="Email address"
        label="Email"
      />

      {/* Movie Card */}
      <MovieCard
        title="House of Ninjas"
        imageUrl="/path/to/image.jpg"
        label="TOP 10"
        rank={2}
      />

      {/* Language Dropdown */}
      <Dropdown
        label="Language"
        options={[
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
        ]}
      />
    </div>
  );
}
```

### Using Design Tokens Directly

```tsx
import { colors, typography } from '@netflix/design-system/tokens';

// Access color tokens
const primaryColor = colors.primitive.netflixRed; // #E50914
const backgroundColor = colors.semantic.background.primary; // #000000

// Access typography tokens
const bodyFont = typography.families.sans; // ['Netflix Sans', ...]
const titleSize = typography.scale.title1; // { fontSize: '27px', ... }
```

### Using Tailwind Classes

```tsx
// Colors
<div className="bg-netflix-black text-white">
<div className="bg-gray-850 text-gray-100">
<div className="bg-primary hover:bg-primary-hover">

// Typography
<h1 className="font-display text-display-lg">Logo</h1>
<p className="font-sans text-body text-gray-200">Body text</p>
<h2 className="text-title-2 font-medium">Section Title</h2>

// Spacing (4px base unit)
<div className="p-4 m-6 gap-2">

// Border Radius
<button className="rounded-lg"> {/* 8px */}
```

## 📘 Component Library

### Button

Multiple variants matching Netflix's UI patterns:

```tsx
<Button variant="primary">Sign In</Button>
<Button variant="secondary">Use a Sign-In Code</Button>
<Button variant="outline">Manage Profiles</Button>
<Button variant="play">Play</Button>
<Button variant="info" icon="ⓘ">More Info</Button>
```

**Specialized Components:**
```tsx
<PlayButton />
<MoreInfoButton />
```

### Input

Form inputs with Netflix styling:

```tsx
<Input placeholder="Email address" />
<Input type="password" placeholder="Password" />
<Input 
  error="Please enter a valid email" 
  state="error"
/>

{/* Specialized inputs */}
<EmailInput />
<PasswordInput />
<PhoneOrEmailInput />
```

### Dropdown/Select

Custom dropdown components:

```tsx
<Select
  label="Language"
  options={[
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
  ]}
/>

<Dropdown
  label="Sort by"
  options={[
    { value: 'suggestions', label: 'Suggestions For You' },
    { value: 'year', label: 'Year Released' },
    { value: 'az', label: 'A-Z' },
  ]}
/>
```

### MovieCard

Content cards for displaying movies/shows:

```tsx
<MovieCard
  title="House of Ninjas"
  imageUrl="/poster.jpg"
  label="TOP 10"
  rank={2}
  duration="51m"
/>

<MovieCard
  variant="continue"
  title="Stranger Things"
  progress={45}
  duration="S1:E3"
/>

{/* Row/Carousel */}
<MovieRow title="Trending Now">
  <MovieCard {...} />
  <MovieCard {...} />
  <MovieCard {...} />
</MovieRow>
```

## 🎯 Key Features

- ✅ **100% Type-Safe** - Full TypeScript support
- ✅ **Tailwind Integration** - Complete Tailwind preset with all Netflix tokens
- ✅ **Component Variants** - CVA-powered variants for flexible styling
- ✅ **Netflix Fidelity** - Exact colors, typography, and spacing from official guidelines
- ✅ **Dark Mode Ready** - Built for Netflix's dark interface
- ✅ **Accessible** - WCAG compliant with proper focus states
- ✅ **Tree-Shakeable** - Import only what you need

## 📂 Project Structure

```
packages/design-system/
├── src/
│   ├── tokens/              # Design tokens
│   │   ├── colors.ts        # Complete color palette
│   │   ├── typography.ts    # Font families and scales
│   │   └── index.ts         # Spacing, shadows, motion
│   ├── components/
│   │   └── custom/          # Netflix-specific components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Dropdown.tsx
│   │       └── MovieCard.tsx
│   ├── lib/
│   │   └── utils.ts         # Helper functions
│   └── index.ts             # Main exports
├── tailwind.config.ts       # Tailwind preset
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Utility Functions

```tsx
import { 
  cn, 
  formatDuration, 
  getMaturityRatingStyle,
  truncate,
  getWatchProgress 
} from '@netflix/design-system';

// Merge classes
const className = cn('bg-black', 'text-white', someCondition && 'font-bold');

// Format video duration
formatDuration(3725); // "1:02:05"

// Get maturity rating styles
const { bgColor, textColor } = getMaturityRatingStyle('TV-MA');

// Truncate text
truncate('Long title here...', 20); // "Long title here..."

// Calculate progress
getWatchProgress(1800, 3600); // 50
```

## 🔧 Customization

While the design system maintains Netflix's visual identity, you can extend it:

```typescript
// tailwind.config.ts
import netflixPreset from '@netflix/design-system/tailwind';

export default {
  presets: [netflixPreset],
  theme: {
    extend: {
      // Add custom tokens while keeping Netflix base
      colors: {
        custom: '#FF0000',
      },
    },
  },
};
```

## 📖 Design System Source

This design system was extracted from Netflix's official brand guidelines, ensuring:
- Accurate color values (including the complete 24-shade gray scale)
- Proper typography hierarchy with Netflix Sans and Bebas Neue
- Component patterns from Netflix's production UI
- Semantic token structure for maintainability

## 🤝 Contributing

This is an extraction of Netflix's design system. For changes:
1. Ensure changes align with Netflix's official guidelines
2. Maintain type safety and accessibility
3. Update documentation for any new components

## 📄 License

MIT

---

**Built with ❤️ using Netflix's Design Guidelines**
