# Ethiopian Learning Platform - Design System Implementation Guide

## Quick Start

### 1. Installation & Setup

The design system is already integrated into your project. To use it:

```bash
# Install required dependencies (if not already installed)
npm install framer-motion
```

### 2. Import Components

```tsx
// Import individual UI components
import EthiopianButton from './components/ui/EthiopianButton';
import EthiopianCard from './components/ui/EthiopianCard';
import SkillTree from './components/ui/SkillTree';
import TutorFlipCard from './components/ui/TutorFlipCard';
import ProgressIndicator from './components/ui/ProgressIndicator';
```

### 3. Use Design System Classes

```tsx
// Use predefined CSS classes
<div className="card hover-bounce">
  <h2 className="text-h2 font-display gradient-text-ethiopia">
    Welcome to Ethiopian Learning
  </h2>
  <p className="text-body font-body text-slate">
    Discover opportunities and grow your skills
  </p>
</div>
```

## Component Examples

### EthiopianButton Usage

```tsx
import EthiopianButton from './components/ui/EthiopianButton';

function MyComponent() {
  return (
    <div className="space-y-4">
      {/* Primary button with loading state */}
      <EthiopianButton 
        variant="primary" 
        size="lg"
        loading={isLoading}
        onClick={handleSubmit}
      >
        Enroll in Course
      </EthiopianButton>
      
      {/* Secondary button */}
      <EthiopianButton variant="secondary">
        Learn More
      </EthiopianButton>
      
      {/* Accent button */}
      <EthiopianButton variant="accent" size="sm">
        Book Tutor
      </EthiopianButton>
    </div>
  );
}
```

### EthiopianCard Usage

```tsx
import EthiopianCard from './components/ui/EthiopianCard';

function CourseGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <EthiopianCard variant="course">
        <img src="/course-image.jpg" alt="Course" className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-h4 font-display font-bold mb-2">React Development</h3>
          <p className="text-body text-slate">Learn modern React development</p>
        </div>
      </EthiopianCard>
      
      <EthiopianCard variant="feature">
        <div className="icon-container">
          <span className="text-2xl">🎓</span>
        </div>
        <h3 className="text-h3 font-display font-bold mb-4">Expert Tutors</h3>
        <p className="text-body text-slate">Connect with experienced professionals</p>
      </EthiopianCard>
    </div>
  );
}
```

### SkillTree Usage

```tsx
import SkillTree from './components/ui/SkillTree';

const skills = [
  {
    id: 'html',
    name: 'HTML Basics',
    icon: '🌐',
    completed: true,
    x: 100,
    y: 100,
    description: 'Learn the fundamentals of HTML markup'
  },
  {
    id: 'css',
    name: 'CSS Styling',
    icon: '🎨',
    completed: true,
    prerequisites: ['html'],
    x: 250,
    y: 100,
    description: 'Master CSS for beautiful web designs'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '⚡',
    completed: false,
    prerequisites: ['html', 'css'],
    x: 400,
    y: 100,
    description: 'Add interactivity with JavaScript'
  }
];

function LearningPath() {
  return (
    <div className="bg-pattern-habesha p-8 rounded-2xl">
      <h2 className="text-h2 font-display font-bold mb-8 text-center">
        Your Learning Journey
      </h2>
      <SkillTree 
        skills={skills}
        onSkillClick={(skill) => console.log('Clicked:', skill.name)}
        className="min-h-96"
      />
    </div>
  );
}
```

### TutorFlipCard Usage

```tsx
import TutorFlipCard from './components/ui/TutorFlipCard';

const tutor = {
  id: '1',
  name: 'Dr. Almaz Tadesse',
  avatar: '/avatars/almaz.jpg',
  specialization: 'Software Engineering',
  rating: 4.9,
  experience: '8+ years',
  bio: 'Experienced software engineer with expertise in full-stack development and mentoring.',
  skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker'],
  hourlyRate: 45,
  availability: 'Available weekends'
};

function TutorSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TutorFlipCard 
        tutor={tutor}
        onBookSession={(tutorId) => console.log('Book session with:', tutorId)}
      />
    </div>
  );
}
```

### ProgressIndicator Usage

```tsx
import ProgressIndicator from './components/ui/ProgressIndicator';

function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Skill progress bars */}
      <ProgressIndicator 
        value={75} 
        label="React Development"
        variant="skill"
        size="md"
      />
      
      {/* Circular progress */}
      <ProgressIndicator 
        value={60} 
        variant="circle"
        size="lg"
        label="Overall Progress"
      />
      
      {/* Simple progress bar */}
      <ProgressIndicator 
        value={90} 
        variant="bar"
        showPercentage={true}
      />
    </div>
  );
}
```

## Design Patterns & Best Practices

### 1. Color Usage

```tsx
// Use semantic color classes
<div className="bg-ethiopia-emerald text-white">Primary actions</div>
<div className="bg-ethiopia-gold text-charcoal">Secondary highlights</div>
<div className="text-success">Success messages</div>
<div className="text-error">Error messages</div>

// Use gradient utilities
<div className="gradient-ethiopia text-white">Hero sections</div>
<h1 className="gradient-text-ethiopia">Gradient text</h1>
```

### 2. Typography Hierarchy

```tsx
// Page structure
<h1 className="text-display font-display font-bold">Hero Title</h1>
<h2 className="text-h1 font-display font-bold">Page Title</h2>
<h3 className="text-h2 font-display font-semibold">Section Title</h3>
<h4 className="text-h3 font-display font-medium">Subsection</h4>

// Body text
<p className="text-body font-body">Regular content</p>
<p className="text-body-lg font-body">Important content</p>
<p className="text-body-sm font-body text-slate">Secondary info</p>
<p className="text-caption font-body text-ash">Captions</p>
```

### 3. Spacing & Layout

```tsx
// Use consistent spacing
<div className="space-y-6">        {/* Vertical spacing */}
<div className="space-x-4">        {/* Horizontal spacing */}
<div className="p-6">              {/* Padding */}
<div className="mb-8">             {/* Margin bottom */}

// Container classes
<div className="container-responsive"> {/* Responsive container */}
<div className="max-w-4xl mx-auto">    {/* Centered content */}
```

### 4. Animation Guidelines

```tsx
// Use built-in animation classes
<div className="hover-bounce">Gentle hover effect</div>
<div className="animate-slide-up">Slide in animation</div>
<div className="animate-float">Floating animation</div>

// Loading states
<div className="loading-pulse">Pulsing loader</div>
<div className="loading-coffee">
  <div className="coffee-bean"></div>
  <div className="coffee-bean"></div>
  <div className="coffee-bean"></div>
</div>
```

### 5. Pattern Backgrounds

```tsx
// Ethiopian-inspired patterns
<div className="bg-pattern-habesha">Subtle radial pattern</div>
<div className="bg-pattern-cross">Cross pattern background</div>

// Combine with other backgrounds
<section className="bg-pattern-habesha bg-cloud">
  <div className="container-responsive py-16">
    {/* Content */}
  </div>
</section>
```

## Responsive Design

### Breakpoint Usage

```tsx
// Mobile-first responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<h1 className="text-h3 md:text-h2 lg:text-h1">
<div className="p-4 md:p-6 lg:p-8">
```

### Mobile Navigation

```tsx
// Use mobile navigation for small screens
<div className="mobile-nav md:hidden">
  <button className="nav-link">Home</button>
  <button className="nav-link">Courses</button>
  <button className="nav-link">Tutors</button>
  <button className="nav-link">Profile</button>
</div>
```

## Accessibility Features

### Focus Management

```tsx
// Use focus ring utilities
<button className="btn-primary focus-ring">Accessible button</button>
<input className="input focus-ring" />
```

### Screen Reader Support

```tsx
// Add proper ARIA labels
<button aria-label="Book tutoring session with Dr. Almaz">
  Book Session
</button>

// Use semantic HTML
<main>
  <section aria-labelledby="courses-heading">
    <h2 id="courses-heading">Available Courses</h2>
  </section>
</main>
```

## Dark Mode Support

The design system automatically supports dark mode through CSS custom properties:

```tsx
// Toggle dark mode
<button onClick={() => document.documentElement.classList.toggle('dark')}>
  Toggle Dark Mode
</button>

// Colors automatically adapt in dark mode
<div className="bg-cloud text-charcoal"> {/* Inverts in dark mode */}
```

## Performance Considerations

### Lazy Loading

```tsx
// Lazy load heavy components
const SkillTree = React.lazy(() => import('./components/ui/SkillTree'));

function MyComponent() {
  return (
    <Suspense fallback={<div className="loading-coffee">Loading...</div>}>
      <SkillTree skills={skills} />
    </Suspense>
  );
}
```

### Animation Optimization

```tsx
// Use transform and opacity for smooth animations
.my-animation {
  transform: translateY(0);
  opacity: 1;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

// Respect user preferences
@media (prefers-reduced-motion: reduce) {
  .my-animation {
    transition: none;
  }
}
```

## Customization

### Extending Colors

```javascript
// In tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1E40AF',
        brand: {
          primary: '#00A651',
          secondary: '#F4B942',
        }
      }
    }
  }
}
```

### Custom Components

```tsx
// Create new components following the pattern
const CustomCard: React.FC<CustomCardProps> = ({ children, ...props }) => {
  return (
    <motion.div 
      className="card bg-gradient-to-br from-ethiopia-emerald to-ethiopia-sapphire"
      whileHover={{ scale: 1.02 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
```

## Migration Guide

### From Existing Components

1. **Replace basic buttons:**
   ```tsx
   // Before
   <button className="bg-blue-500 text-white px-4 py-2 rounded">
   
   // After  
   <EthiopianButton variant="primary">
   ```

2. **Update card components:**
   ```tsx
   // Before
   <div className="bg-white shadow-lg rounded-lg p-6">
   
   // After
   <EthiopianCard>
   ```

3. **Modernize color usage:**
   ```tsx
   // Before
   <div className="bg-green-500">
   
   // After
   <div className="bg-ethiopia-emerald">
   ```

This implementation guide provides everything you need to start using the Ethiopian Learning Platform design system effectively. The components are designed to be flexible, accessible, and culturally resonant while maintaining modern web standards.
