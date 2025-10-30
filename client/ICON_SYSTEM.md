# ImpactMatch Icon System 🎨

A cohesive modern icon set with glassmorphic design, neon gradients, and futuristic animations for the ImpactMatch platform.

## 🌟 Design Philosophy

- **Clean & Futuristic**: Minimal semi-3D style with glowing edges
- **Glassmorphic UI**: Frosted glass blur with soft lighting
- **Gradient Colors**: Teal (#00C6A7) → Blue (#007CF0) → Violet (#8E2DE2)
- **Consistency**: Unified line weight, color palette, and glow intensity
- **Interactive**: Subtle hover effects and smooth animations

## 📦 Installation

The icon system uses React Icons library:

```bash
npm install react-icons
```

## 🎯 Components

### 1. ModernIcon
The base icon component with glassmorphic styling.

```jsx
import { ModernIcon } from './components/IconSystem';

<ModernIcon 
  name="ai-matching"        // Icon name from iconMap
  size="md"                 // xs | sm | md | lg | xl
  gradient="teal"           // teal | blue | violet | tealBlue
  glow={true}              // Enable/disable glow effect
  animated={true}          // Enable/disable animations
  className=""             // Additional Tailwind classes
/>
```

**Sizes:**
- `xs`: 16px (w-4 h-4)
- `sm`: 32px (w-8 h-8)
- `md`: 48px (w-12 h-12) - Default
- `lg`: 64px (w-16 h-16)
- `xl`: 80px (w-20 h-20)

**Use Cases:**
- General purpose icons
- Card decorations
- List items
- Form elements

---

### 2. FeatureIcon
Large animated icon perfect for feature cards.

```jsx
import { FeatureIcon } from './components/IconSystem';

<FeatureIcon 
  name="transparent-tracking"
  gradient="violet"
  animated={true}
  className=""
/>
```

**Features:**
- 80px × 80px size
- Rotating glow background
- 360° spin on hover
- Perfect for feature sections

**Use Cases:**
- Feature highlights
- Service offerings
- Key benefits showcase
- Landing page sections

---

### 3. FloatingIconBadge
Compact badge with icon and label.

```jsx
import { FloatingIconBadge } from './components/IconSystem';

<FloatingIconBadge 
  name="ai-matching"
  label="AI Powered"
  gradient="teal"
  className=""
/>
```

**Features:**
- Inline flex layout
- Icon + text combination
- Scale & lift on hover
- Glassmorphic background

**Use Cases:**
- Hero section badges
- Call-out tags
- Feature labels
- Trust indicators

---

### 4. NavIcon
Interactive navigation icon with active states.

```jsx
import { NavIcon } from './components/IconSystem';

<NavIcon 
  name="home"
  label="Home"
  active={isActive}
  onClick={() => navigate('/')}
  className=""
/>
```

**Features:**
- Active state highlighting
- Gradient background on active
- Hover lift animation
- Smooth layout transitions

**Use Cases:**
- Navigation bar
- Tab controls
- Menu items
- Sidebar links

---

### 5. SocialIcon
Social media icon with hover effects.

```jsx
import { SocialIcon } from './components/IconSystem';

<SocialIcon 
  name="twitter"
  href="https://twitter.com/..."
  size="md"             // sm | md | lg
  className=""
/>
```

**Features:**
- Opens in new tab
- Gradient glow on hover
- Color transition
- 3 size options

**Use Cases:**
- Footer social links
- Contact sections
- Share buttons
- Profile links

---

## 🎨 Available Icons

### Feature Icons
- `ai-matching` - AI Cause Matching (🤖)
- `local-discovery` - Local Impact Discovery (📍)
- `transparent-tracking` - Transparent Tracking (✅)
- `real-time-chat` - Real-time Chat (💬)
- `impact-scoring` - Impact Scoring (🏆)
- `interactive-map` - Interactive Map (🗺️)

### Navigation Icons
- `home` - Home (🏠)
- `causes` - Causes (🎯)
- `map` - Map (🗺️)
- `dashboard` - Dashboard (📊)

### Contact Icons
- `email` - Email (📧)
- `phone` - Phone (📞)
- `location` - Location (📍)

### Social Icons
- `twitter` - Twitter (🐦)
- `facebook` - Facebook (📘)
- `instagram` - Instagram (📸)
- `linkedin` - LinkedIn (💼)

## 🌈 Gradient Presets

```jsx
gradient="teal"      // #00C6A7 → #007CF0
gradient="blue"      // #007CF0 → #8E2DE2
gradient="violet"    // #8E2DE2 → #00C6A7
gradient="tealBlue"  // #00C6A7 → #007CF0 → #8E2DE2
```

## 💡 Usage Examples

### Feature Section
```jsx
import { FeatureIcon } from './components/IconSystem';

const features = [
  { name: 'ai-matching', label: 'AI Matching', gradient: 'teal' },
  { name: 'local-discovery', label: 'Local Discovery', gradient: 'blue' },
  { name: 'transparent-tracking', label: 'Transparent', gradient: 'violet' },
];

<div className="grid grid-cols-3 gap-8">
  {features.map(feature => (
    <div key={feature.name} className="text-center">
      <FeatureIcon 
        name={feature.name} 
        gradient={feature.gradient}
      />
      <h3>{feature.label}</h3>
    </div>
  ))}
</div>
```

### Hero Badge
```jsx
import { FloatingIconBadge } from './components/IconSystem';

<div className="mb-8">
  <FloatingIconBadge 
    name="ai-matching"
    label="Powered by AI"
    gradient="teal"
  />
</div>
```

### Navigation Bar
```jsx
import { NavIcon } from './components/IconSystem';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <nav className="flex gap-4">
      <NavIcon 
        name="home"
        label="Home"
        active={location.pathname === '/'}
        onClick={() => navigate('/')}
      />
      <NavIcon 
        name="causes"
        label="Causes"
        active={location.pathname === '/causes'}
        onClick={() => navigate('/causes')}
      />
      {/* ... more nav items */}
    </nav>
  );
};
```

### Footer Social Links
```jsx
import { SocialIcon } from './components/IconSystem';

<div className="flex gap-4">
  <SocialIcon name="twitter" href="https://twitter.com/..." size="md" />
  <SocialIcon name="facebook" href="https://facebook.com/..." size="md" />
  <SocialIcon name="instagram" href="https://instagram.com/..." size="md" />
  <SocialIcon name="linkedin" href="https://linkedin.com/..." size="md" />
</div>
```

### Contact Section
```jsx
import { ModernIcon } from './components/IconSystem';

<div className="space-y-4">
  <div className="flex items-center gap-4">
    <ModernIcon name="email" size="sm" gradient="teal" />
    <span>contact@impactmatch.com</span>
  </div>
  <div className="flex items-center gap-4">
    <ModernIcon name="phone" size="sm" gradient="blue" />
    <span>+1 (555) 123-4567</span>
  </div>
  <div className="flex items-center gap-4">
    <ModernIcon name="location" size="sm" gradient="violet" />
    <span>San Francisco, CA</span>
  </div>
</div>
```

## 🎭 Animation Customization

All animations use Framer Motion and can be customized:

```jsx
// Disable animations
<ModernIcon name="ai-matching" animated={false} />

// Disable glow effect
<ModernIcon name="ai-matching" glow={false} />

// Custom animation props
<ModernIcon 
  name="ai-matching"
  whileHover={{ scale: 1.2, rotate: 10 }}
  transition={{ duration: 0.5 }}
/>
```

## 🎨 Custom Styling

Add custom Tailwind classes:

```jsx
<ModernIcon 
  name="ai-matching"
  className="mx-auto my-8 shadow-2xl"
/>

<FeatureIcon 
  name="local-discovery"
  className="absolute top-4 right-4"
/>
```

## 📱 Responsive Design

Use Tailwind responsive modifiers:

```jsx
<ModernIcon 
  name="ai-matching"
  size="sm"
  className="md:w-16 md:h-16 lg:w-20 lg:h-20"
/>
```

## 🔧 Adding New Icons

1. Import the icon from `react-icons`:
```jsx
import { FiNewIcon } from 'react-icons/fi';
```

2. Add to `iconMap`:
```jsx
export const iconMap = {
  // ... existing icons
  'new-feature': FiNewIcon,
};
```

3. Use it anywhere:
```jsx
<ModernIcon name="new-feature" gradient="teal" />
```

## 🎯 Best Practices

✅ **Do:**
- Use consistent gradient themes throughout sections
- Match icon sizes to context (sm for inline, lg for features)
- Enable animations for interactive elements
- Use appropriate component for context (FeatureIcon for features, NavIcon for navigation)

❌ **Don't:**
- Mix too many gradient types in one section
- Use xl size for navigation icons
- Disable animations on feature showcases
- Use FeatureIcon in tight spaces

## 🚀 Live Demo

Visit `/icons` route to see all icons in action with interactive examples.

## 🎨 Design Tokens

```css
/* Colors */
--color-teal: #00C6A7
--color-blue: #007CF0
--color-violet: #8E2DE2

/* Backgrounds */
--bg-glass: rgba(255, 255, 255, 0.6)
--bg-gradient: linear-gradient(to bottom right, #e8f9f6, #f2f7ff, white)

/* Shadows */
--shadow-glow-teal: 0 0 40px rgba(0, 198, 167, 0.3)
--shadow-glow-blue: 0 0 40px rgba(0, 124, 240, 0.3)
--shadow-glow-violet: 0 0 40px rgba(142, 45, 226, 0.3)
```

## 📄 License

Part of the ImpactMatch platform. All rights reserved.

---

**Created with ❤️ for ImpactMatch - Matching People with Purpose**
