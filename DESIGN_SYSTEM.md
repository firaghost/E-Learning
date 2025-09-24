# Ethiopian Learning Platform - Design System

## Overview
This design system creates a unique, modern, and culturally resonant experience for young Ethiopian professionals, students, and early-career job seekers. The design balances professionalism with approachability, incorporating Ethiopian cultural elements in a contemporary way.

## 1. Color Palette

### Primary Colors
```css
/* Ethiopian Heritage Colors - Modernized */
--ethiopia-emerald: #00A651;     /* Modern green, professional yet vibrant */
--ethiopia-gold: #F4B942;        /* Warm gold, representing opportunity */
--ethiopia-crimson: #E63946;     /* Bold red, representing passion */
--ethiopia-sapphire: #2E86AB;    /* Deep blue, representing trust and stability */
```

### Secondary Colors
```css
/* Supporting Palette */
--terra-brown: #8B4513;          /* Earthy connection to Ethiopian highlands */
--honey-amber: #FFC947;          /* Warm accent, representing growth */
--sage-green: #87A96B;           /* Muted green, calming and natural */
--clay-orange: #D2691E;          /* Warm earth tone */
```

### Neutral Colors
```css
/* Modern Neutrals */
--charcoal: #2D3748;             /* Primary text */
--slate: #4A5568;                /* Secondary text */
--ash: #718096;                  /* Tertiary text */
--pearl: #E2E8F0;                /* Light borders */
--cloud: #F7FAFC;                /* Light backgrounds */
--snow: #FFFFFF;                 /* Pure white */

/* Dark Mode */
--dark-charcoal: #1A202C;        /* Dark background */
--dark-slate: #2D3748;           /* Dark surface */
--dark-ash: #4A5568;             /* Dark borders */
```

### Semantic Colors
```css
/* Status Colors */
--success: #38A169;              /* Success states */
--warning: #D69E2E;              /* Warning states */
--error: #E53E3E;                /* Error states */
--info: #3182CE;                 /* Info states */
```

## 2. Typography

### Font Stack
```css
/* Primary Font - Headings */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Secondary Font - Body */
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;500;600&display=swap');

/* Accent Font - Ethiopian Touch */
@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&display=swap');
```

### Typography Scale
```css
/* Headings */
.text-display: 4rem;     /* 64px - Hero titles */
.text-h1: 3rem;          /* 48px - Page titles */
.text-h2: 2.25rem;       /* 36px - Section titles */
.text-h3: 1.875rem;      /* 30px - Subsection titles */
.text-h4: 1.5rem;        /* 24px - Card titles */
.text-h5: 1.25rem;       /* 20px - Small headings */
.text-h6: 1.125rem;      /* 18px - Smallest headings */

/* Body Text */
.text-body-lg: 1.125rem; /* 18px - Large body */
.text-body: 1rem;        /* 16px - Regular body */
.text-body-sm: 0.875rem; /* 14px - Small body */
.text-caption: 0.75rem;  /* 12px - Captions */
```

### Font Weights
```css
.font-light: 300;
.font-normal: 400;
.font-medium: 500;
.font-semibold: 600;
.font-bold: 700;
.font-extrabold: 800;
```

## 3. UI Components

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, var(--ethiopia-emerald) 0%, var(--ethiopia-sapphire) 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 166, 81, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 166, 81, 0.4);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--ethiopia-emerald);
  border: 2px solid var(--ethiopia-emerald);
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--ethiopia-emerald);
  color: white;
  transform: translateY(-1px);
}

/* Accent Button */
.btn-accent {
  background: linear-gradient(135deg, var(--ethiopia-gold) 0%, var(--honey-amber) 100%);
  color: var(--charcoal);
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
}
```

### Cards
```css
/* Base Card */
.card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--pearl);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* Feature Card */
.card-feature {
  background: linear-gradient(135deg, white 0%, #f8fafc 100%);
  border-radius: 1.25rem;
  padding: 2rem;
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
}

.card-feature::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 2px;
  background: linear-gradient(135deg, var(--ethiopia-emerald), var(--ethiopia-gold));
  border-radius: inherit;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

/* Course Card */
.card-course {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
}

.card-course:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 166, 81, 0.15);
}
```

### Forms
```css
/* Input Fields */
.input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--pearl);
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.input:focus {
  outline: none;
  border-color: var(--ethiopia-emerald);
  box-shadow: 0 0 0 3px rgba(0, 166, 81, 0.1);
}

/* Select Dropdown */
.select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
```

### Navigation
```css
/* Navbar */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
}

/* Nav Links */
.nav-link {
  color: var(--slate);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--ethiopia-emerald);
  background: rgba(0, 166, 81, 0.1);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, var(--ethiopia-emerald), var(--ethiopia-gold));
  border-radius: 1px;
}
```

## 4. Unique Visual Elements

### Ethiopian Pattern Integration
```css
/* Subtle geometric patterns inspired by Ethiopian textiles */
.pattern-habesha {
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(0, 166, 81, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(244, 185, 66, 0.1) 0%, transparent 50%);
  background-size: 60px 60px;
}

.pattern-cross {
  background-image: 
    linear-gradient(45deg, transparent 40%, rgba(0, 166, 81, 0.05) 40%, rgba(0, 166, 81, 0.05) 60%, transparent 60%),
    linear-gradient(-45deg, transparent 40%, rgba(244, 185, 66, 0.05) 40%, rgba(244, 185, 66, 0.05) 60%, transparent 60%);
  background-size: 20px 20px;
}
```

### Custom Icons
```css
/* Icon containers with Ethiopian color accents */
.icon-container {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--ethiopia-emerald) 0%, var(--ethiopia-sapphire) 100%);
  color: white;
  margin-bottom: 1rem;
}

.icon-container.secondary {
  background: linear-gradient(135deg, var(--ethiopia-gold) 0%, var(--honey-amber) 100%);
  color: var(--charcoal);
}
```

### Progress Indicators
```css
/* Skill progress bars with Ethiopian styling */
.progress-bar {
  width: 100%;
  height: 0.5rem;
  background: var(--pearl);
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--ethiopia-emerald) 0%, var(--ethiopia-gold) 100%);
  border-radius: 0.25rem;
  transition: width 0.8s ease;
}
```

## 5. Animations & Interactions

### Micro-interactions
```css
/* Hover animations */
@keyframes gentle-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.hover-bounce:hover {
  animation: gentle-bounce 0.6s ease-in-out;
}

/* Loading animations */
@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 5px rgba(0, 166, 81, 0.5);
  }
  50% { 
    box-shadow: 0 0 20px rgba(0, 166, 81, 0.8);
  }
}

.loading-pulse {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Slide-in animations */
@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-in-up 0.6s ease-out;
}
```

### Creative Interaction Patterns

#### 1. Skill Tree Navigation
```css
/* Interactive skill progression visualization */
.skill-tree {
  position: relative;
  padding: 2rem;
}

.skill-node {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--ethiopia-emerald), var(--ethiopia-sapphire));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
}

.skill-node:hover {
  transform: scale(1.2);
  box-shadow: 0 8px 24px rgba(0, 166, 81, 0.4);
}

.skill-node.completed::after {
  content: '✓';
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--ethiopia-gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: var(--charcoal);
}

/* Connecting lines between nodes */
.skill-connection {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, var(--ethiopia-emerald), var(--ethiopia-gold));
  top: 50%;
  transform: translateY(-50%);
}
```

#### 2. Tutor Profile Reveal
```css
/* Animated tutor card reveal */
.tutor-card {
  perspective: 1000px;
  height: 300px;
}

.tutor-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.tutor-card:hover .tutor-card-inner {
  transform: rotateY(180deg);
}

.tutor-card-front,
.tutor-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 1rem;
  padding: 1.5rem;
}

.tutor-card-back {
  background: linear-gradient(135deg, var(--ethiopia-emerald), var(--ethiopia-sapphire));
  color: white;
  transform: rotateY(180deg);
}
```

#### 3. Playful Loading States
```css
/* Ethiopian coffee bean loading animation */
@keyframes coffee-bounce {
  0%, 80%, 100% { transform: scale(0.8); }
  40% { transform: scale(1.2); }
}

.loading-coffee {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.coffee-bean {
  width: 0.75rem;
  height: 0.75rem;
  background: var(--terra-brown);
  border-radius: 50%;
  animation: coffee-bounce 1.4s ease-in-out infinite;
}

.coffee-bean:nth-child(1) { animation-delay: -0.32s; }
.coffee-bean:nth-child(2) { animation-delay: -0.16s; }
.coffee-bean:nth-child(3) { animation-delay: 0s; }
```

## 6. Visual Hierarchy Rules

### Information Architecture
1. **Hero Section**: Large display text with gradient backgrounds
2. **Primary Actions**: Prominent buttons with Ethiopian color gradients
3. **Content Sections**: Clear spacing with subtle pattern backgrounds
4. **Secondary Information**: Muted colors and smaller typography

### Layout Principles
```css
/* Container sizes */
.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }

/* Spacing scale */
.space-xs: 0.25rem;   /* 4px */
.space-sm: 0.5rem;    /* 8px */
.space-md: 1rem;      /* 16px */
.space-lg: 1.5rem;    /* 24px */
.space-xl: 2rem;      /* 32px */
.space-2xl: 3rem;     /* 48px */
.space-3xl: 4rem;     /* 64px */

/* Z-index layers */
.z-dropdown: 1000;
.z-sticky: 1020;
.z-fixed: 1030;
.z-modal-backdrop: 1040;
.z-modal: 1050;
.z-popover: 1060;
.z-tooltip: 1070;
```

### Content Priority Flow
1. **Primary**: Course discovery, tutor booking, job opportunities
2. **Secondary**: User profiles, progress tracking, community features  
3. **Tertiary**: Settings, help documentation, footer links

### Mobile-First Responsive Design
```css
/* Breakpoints */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }

/* Mobile navigation */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid var(--pearl);
  padding: 1rem;
  display: flex;
  justify-content: space-around;
}

@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
}
```

## Implementation Notes

### Accessibility Features
- High contrast ratios (4.5:1 minimum)
- Focus indicators with Ethiopian color accents
- Screen reader friendly animations
- Keyboard navigation support

### Performance Considerations
- CSS custom properties for theme switching
- Optimized animations using transform and opacity
- Lazy loading for complex visual elements
- Progressive enhancement for advanced features

### Cultural Sensitivity
- Colors respect Ethiopian flag symbolism
- Patterns inspired by traditional textiles
- Typography maintains readability across languages
- Icons and imagery celebrate Ethiopian heritage

This design system creates a unique identity that stands out from generic templates while maintaining professional credibility and cultural authenticity.
