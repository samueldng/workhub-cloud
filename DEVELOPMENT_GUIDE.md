# Workhour Cloud Development Guide

This guide provides detailed technical documentation for continuing development on the Workhour Cloud platform.

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Database Design](#database-design)
3. [API Integration](#api-integration)
4. [Component Structure](#component-structure)
5. [State Management](#state-management)
6. [UI/UX Guidelines](#uiux-guidelines)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Process](#deployment-process)

## System Architecture

### High-Level Overview
The Workhour Cloud system follows a client-server architecture with React as the frontend framework and Supabase as the backend service.

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Frontend│◄──►│  Supabase Backend│◄──►│  Storage System │
└─────────────────┘    └──────────────────┘    └─────────────────┘
       │                        │
       ▼                        ▼
┌─────────────────┐    ┌──────────────────┐
│ Authentication  │    │   Data Storage   │
└─────────────────┘    └──────────────────┘
```

### Frontend Architecture
The frontend is organized using a feature-based structure:

```
src/
├── components/
│   ├── os/              # OS-like components (windows, taskbar, etc.)
│   │   ├── apps/        # Built-in applications
│   │   │   ├── Terminal.tsx
│   │   │   ├── TextEditor.tsx
│   │   │   └── WebBrowser.tsx
│   │   ├── AppLauncher.tsx
│   │   ├── Taskbar.tsx
│   │   └── Window.tsx
│   └── ui/              # Reusable UI components (shadcn-ui)
├── integrations/
│   └── supabase/        # Supabase integration
│       ├── client.ts    # Supabase client configuration
│       └── types.ts     # Generated TypeScript types
├── lib/                 # Utility functions
│   └── utils.ts
├── pages/               # Application pages
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── Desktop.tsx
│   ├── Index.tsx
│   └── NotFound.tsx
├── hooks/               # Custom React hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

### Backend Architecture
Supabase provides the backend services including authentication, database, and storage:

```
Supabase Services:
├── Authentication (Auth)
├── Database (PostgreSQL)
├── Storage
├── Realtime
└── Functions (Edge Functions)
```

## Database Design

### Entity Relationship Diagram
```
┌─────────────┐       ┌──────────────┐
│   profiles  │◄──────┤  auth.users  │
└─────────────┘       └──────────────┘
       │
       ▼
┌─────────────┐
│ time_entries│
└─────────────┘
       │
       ▼
┌─────────────┐
│ workspaces  │
└─────────────┘
```

### Table Specifications

#### 1. profiles
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  hourly_rate DECIMAL(10, 2) DEFAULT 25.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

Row Level Security Policies:
- Users can view own profile
- Users can update own profile
- Users can insert own profile

#### 2. time_entries
```sql
CREATE TABLE public.time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  earnings DECIMAL(10, 2) DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

Row Level Security Policies:
- Users can view own time entries
- Users can create own time entries
- Users can update own time entries
- Users can delete own time entries

#### 3. workspaces
```sql
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  windows_state JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

Row Level Security Policies:
- Users can view own workspaces
- Users can create own workspaces
- Users can update own workspaces
- Users can delete own workspaces

### Database Functions

#### 1. handle_new_user()
Automatically creates a profile when a new user signs up with a default hourly rate of $25.00.

#### 2. update_updated_at()
Updates the `updated_at` timestamp when records are modified.

## API Integration

### Supabase Client
The Supabase client is configured in `src/integrations/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

### Common API Patterns

#### Authentication
```typescript
// Sign up
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: { full_name: fullName },
    emailRedirectTo: `${window.location.origin}/dashboard`
  }
});

// Sign in
const { error } = await supabase.auth.signInWithPassword({ email, password });

// Sign out
await supabase.auth.signOut();
```

#### Database Operations
```typescript
// Insert
const { data, error } = await supabase
  .from("time_entries")
  .insert({ user_id: user.id })
  .select()
  .single();

// Update
await supabase
  .from("time_entries")
  .update({
    ended_at: new Date().toISOString(),
    duration_seconds: duration,
    earnings: parseFloat(earnings)
  })
  .eq("id", currentEntry.id);

// Select
const { data } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", userId)
  .single();
```

## Component Structure

### OS Components

#### Window Component
Located at `src/components/os/Window.tsx`, this component provides draggable and resizable windows.

Props:
- `id`: Unique identifier for the window
- `title`: Window title
- `icon`: Icon component
- `children`: Window content
- `defaultPosition`: Initial position (x, y)
- `defaultSize`: Initial size (width, height)
- `onClose`: Close handler
- `onMinimize`: Minimize handler
- `isActive`: Active state
- `onFocus`: Focus handler

#### Taskbar Component
Located at `src/components/os/Taskbar.tsx`, this component provides the system taskbar.

Props:
- `elapsedTime`: Tracked time in seconds
- `onLogout`: Logout handler
- `openApps`: Array of open applications
- `onAppClick`: App click handler
- `onNewApp`: New app handler

#### AppLauncher Component
Located at `src/components/os/AppLauncher.tsx`, this component provides the application launcher.

Props:
- `onLaunchApp`: App launch handler
- `onClose`: Close handler

### Built-in Applications

#### Terminal
Located at `src/components/os/apps/Terminal.tsx`, this component simulates a terminal application.

#### TextEditor
Located at `src/components/os/apps/TextEditor.tsx`, this component provides a simple text editor.

#### WebBrowser
Located at `src/components/os/apps/WebBrowser.tsx`, this component simulates a web browser.

## State Management

### React State
Local component state is managed using React's useState and useEffect hooks.

Example from Dashboard.tsx:
```typescript
const [isTracking, setIsTracking] = useState(false);
const [currentEntry, setCurrentEntry] = useState<any>(null);
const [elapsed, setElapsed] = useState(0);
```

### Supabase Auth State
Authentication state is managed through Supabase Auth subscriptions:

```typescript
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) {
      navigate("/auth");
    } else {
      setUser(session.user);
      loadProfile(session.user.id);
    }
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
    if (!session) {
      navigate("/auth");
    }
  });

  return () => subscription.unsubscribe();
}, [navigate]);
```

### Time Tracking State
Real-time timer state is managed with useEffect intervals:

```typescript
useEffect(() => {
  let interval: any;
  if (isTracking && currentEntry) {
    interval = setInterval(() => {
      setElapsed((Date.now() - new Date(currentEntry.started_at).getTime()) / 1000);
    }, 1000);
  }
  return () => clearInterval(interval);
}, [isTracking, currentEntry]);
```

## UI/UX Guidelines

### Design System
The application uses Tailwind CSS with a custom color palette defined in `tailwind.config.ts`.

#### Color Palette
- Primary: Purple-based gradient
- Secondary: Blue-based gradient
- Success: Green
- Warning: Yellow
- Error: Red
- Background: Dark theme optimized

#### Typography
- Primary font: System UI stack
- Font sizes follow a consistent scale
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Component Design Principles
1. **Consistency**: Use existing components and patterns
2. **Accessibility**: Ensure proper contrast and keyboard navigation
3. **Responsiveness**: Mobile-first design approach
4. **Performance**: Optimize for fast rendering

### Animations and Transitions
- Subtle transitions for state changes
- Smooth window dragging and resizing
- Toast notifications with entrance/exit animations

## Testing Strategy

### Unit Testing
Components should be tested in isolation using Jest and React Testing Library.

Example test structure:
```typescript
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Integration Testing
Test the interaction between components and Supabase services.

### End-to-End Testing
Use Cypress or Playwright to test user flows:
1. User registration and login
2. Time tracking functionality
3. Window management
4. Data persistence

### Test Coverage Goals
- Components: 80%+
- Utility functions: 90%+
- API integration: 70%+

## Deployment Process

### Continuous Deployment
The project is deployed through Lovable's deployment system.

### Environment Configuration
Environment variables are managed through Lovable's project settings.

### Monitoring and Analytics
- Error tracking with Sentry or similar
- Performance monitoring
- User analytics (if required)

### Rollback Strategy
- Use Lovable's version control for rollbacks
- Database migrations should be reversible when possible

## Future Development Roadmap

### Short-term Goals (Next 2-4 weeks)
1. Implement gradient purple/blue color scheme
2. Add animations and glassmorphism effects
3. Improve component variants for consistency
4. Enhance workspace state persistence

### Medium-term Goals (Next 2-3 months)
1. Add more built-in applications
2. Implement collaboration features
3. Advanced reporting and analytics
4. Mobile application development

### Long-term Goals (6+ months)
1. AI-powered productivity insights
2. Cross-platform desktop application
3. Marketplace for third-party applications
4. Advanced workspace customization

## Contributing Guidelines

### Code Review Process
1. All changes require at least one code review
2. Follow the existing code style and patterns
3. Ensure tests pass before merging
4. Update documentation when necessary

### Branching Strategy
- Main branch for production-ready code
- Feature branches for new functionality
- Hotfix branches for urgent fixes

### Commit Message Convention
Follow conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for adding or updating tests

### Pull Request Process
1. Create a pull request from feature branch to main
2. Add appropriate labels and assign reviewers
3. Ensure all checks pass
4. Address review feedback
5. Merge after approval