# Workhour Cloud Technical Specification

This document provides detailed technical specifications for the Workhour Cloud system, including implementation details, architecture decisions, and development guidelines.

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [System Architecture](#system-architecture)
3. [Database Schema](#database-schema)
4. [API Design](#api-design)
5. [Security Implementation](#security-implementation)
6. [Performance Considerations](#performance-considerations)
7. [Error Handling](#error-handling)
8. [Internationalization](#internationalization)
9. [Accessibility](#accessibility)
10. [Deployment Architecture](#deployment-architecture)

## Technology Stack

### Frontend Technologies
- **React 18**: Component-based UI library
- **TypeScript**: Static type checking
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable component library
- **React Router DOM**: Client-side routing
- **React Query**: Server state management
- **React RND**: Draggable and resizable components
- **Lucide React**: Icon library
- **Sonner**: Toast notifications

### Backend Technologies
- **Supabase**: Backend-as-a-Service
  - Authentication
  - PostgreSQL Database
  - Realtime subscriptions
  - Storage
- **PostgreSQL**: Relational database

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **GitHub**: Version control

## System Architecture

### Component Architecture
The system follows a modular component architecture with clear separation of concerns:

```
App
├── Router
│   ├── Index (Landing Page)
│   ├── Auth (Authentication)
│   ├── Dashboard (Time Tracking)
│   ├── Desktop (Virtual Workspace)
│   └── NotFound (404 Page)
├── OS Components
│   ├── Window Manager
│   ├── Taskbar
│   ├── App Launcher
│   └── Built-in Apps
│       ├── Terminal
│       ├── Text Editor
│       └── Web Browser
└── UI Components
    ├── shadcn/ui Components
    └── Custom Components
```

### Data Flow
1. User interacts with UI components
2. State changes trigger API calls through Supabase client
3. Supabase processes requests and updates database
4. Database changes trigger realtime updates
5. UI re-renders with updated data

### State Management
- **Local State**: React useState/useReducer
- **Server State**: React Query with Supabase
- **Global State**: React Context for UI themes
- **URL State**: React Router

## Database Schema

### Profiles Table
```sql
-- Table Definition
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  hourly_rate DECIMAL(10, 2) DEFAULT 25.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

Indexes:
- CREATE INDEX idx_profiles_user_id ON profiles(id);

RLS Policies:
- CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
  
- CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
  
- CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

### Time Entries Table
```sql
-- Table Definition
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

Indexes:
- CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);
- CREATE INDEX idx_time_entries_started_at ON time_entries(started_at);

RLS Policies:
- CREATE POLICY "Users can view own time entries"
  ON public.time_entries FOR SELECT USING (auth.uid() = user_id);
  
- CREATE POLICY "Users can create own time entries"
  ON public.time_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
  
- CREATE POLICY "Users can update own time entries"
  ON public.time_entries FOR UPDATE USING (auth.uid() = user_id);
  
- CREATE POLICY "Users can delete own time entries"
  ON public.time_entries FOR DELETE USING (auth.uid() = user_id);

### Workspaces Table
```sql
-- Table Definition
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  windows_state JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

Indexes:
- CREATE INDEX idx_workspaces_user_id ON workspaces(user_id);

RLS Policies:
- CREATE POLICY "Users can view own workspaces"
  ON public.workspaces FOR SELECT USING (auth.uid() = user_id);
  
- CREATE POLICY "Users can create own workspaces"
  ON public.workspaces FOR INSERT WITH CHECK (auth.uid() = user_id);
  
- CREATE POLICY "Users can update own workspaces"
  ON public.workspaces FOR UPDATE USING (auth.uid() = user_id);
  
- CREATE POLICY "Users can delete own workspaces"
  ON public.workspaces FOR DELETE USING (auth.uid() = user_id);

## API Design

### Authentication API
```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: string,
  password: string,
  options: {
    data: {
      full_name: string
    },
    emailRedirectTo: string
  }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: string,
  password: string
});

// Sign out
const { error } = await supabase.auth.signOut();

// Get session
const { data: { session } } = await supabase.auth.getSession();

// Subscribe to auth state changes
const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
```

### Profiles API
```typescript
// Get user profile
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

// Update user profile
const { data, error } = await supabase
  .from('profiles')
  .update({
    full_name: string,
    hourly_rate: number
  })
  .eq('id', userId);
```

### Time Entries API
```typescript
// Create time entry
const { data, error } = await supabase
  .from('time_entries')
  .insert({
    user_id: string,
    started_at: string,
    description: string
  })
  .select()
  .single();

// Update time entry
const { data, error } = await supabase
  .from('time_entries')
  .update({
    ended_at: string,
    duration_seconds: number,
    earnings: number
  })
  .eq('id', entryId);

// Get time entries
const { data, error } = await supabase
  .from('time_entries')
  .select('*')
  .eq('user_id', userId)
  .order('started_at', { ascending: false });

// Delete time entry
const { data, error } = await supabase
  .from('time_entries')
  .delete()
  .eq('id', entryId);
```

### Workspaces API
```typescript
// Create workspace
const { data, error } = await supabase
  .from('workspaces')
  .insert({
    user_id: string,
    name: string,
    windows_state: Json
  })
  .select()
  .single();

// Update workspace
const { data, error } = await supabase
  .from('workspaces')
  .update({
    name: string,
    windows_state: Json
  })
  .eq('id', workspaceId);

// Get workspaces
const { data, error } = await supabase
  .from('workspaces')
  .select('*')
  .eq('user_id', userId);

// Delete workspace
const { data, error } = await supabase
  .from('workspaces')
  .delete()
  .eq('id', workspaceId);
```

## Security Implementation

### Authentication Security
- Password strength requirements (minimum 6 characters)
- Secure session management with JWT tokens
- Automatic token refresh
- Session persistence with localStorage

### Data Security
- Row Level Security (RLS) policies for all tables
- Data encryption at rest (handled by Supabase)
- Secure API communication (HTTPS)
- Input validation and sanitization

### Authorization
- User-based data isolation
- Permission-based access control
- Role-based access control (future implementation)

### Best Practices
- Never expose sensitive credentials in client code
- Validate all user inputs
- Sanitize data before displaying
- Implement proper error handling without exposing sensitive information

## Performance Considerations

### Frontend Performance
- Code splitting for route-based components
- Lazy loading for non-critical components
- Image optimization (future implementation)
- Efficient state management to minimize re-renders
- Memoization for expensive computations

### Database Performance
- Proper indexing on frequently queried columns
- Pagination for large datasets
- Efficient query patterns
- Connection pooling (handled by Supabase)

### Caching Strategy
- React Query for server state caching
- Browser caching for static assets
- CDN for production deployment

### Optimization Techniques
- Debouncing for input-heavy operations
- Virtualization for large lists
- Bundle size optimization
- Tree shaking for unused code

## Error Handling

### Error Categories
1. **Authentication Errors**: Login, signup, session issues
2. **Network Errors**: API connectivity issues
3. **Database Errors**: Query failures, constraint violations
4. **Validation Errors**: Form input validation
5. **UI Errors**: Component rendering issues

### Error Handling Patterns
``typescript
try {
  const { data, error } = await supabase.operation();
  if (error) throw error;
  // Handle success
} catch (error: any) {
  // Handle specific error types
  if (error.status === 401) {
    // Handle authentication error
  } else if (error.message.includes('constraint')) {
    // Handle validation error
  } else {
    // Handle generic error
  }
  // Show user-friendly error message
  toast.error(error.message);
}
```

### Error Boundaries
- React error boundaries for UI component failures
- Global error handling for uncaught exceptions
- User-friendly error messages
- Error logging for debugging

## Internationalization

### Current Implementation
- Portuguese (pt-BR) as the primary language
- String literals in components
- Date/time formatting with locale considerations

### Future Enhancements
- Integration with i18next or similar library
- Language switching capability
- RTL language support
- Currency localization

### Best Practices
- Externalize all user-facing strings
- Use proper pluralization
- Consider cultural differences in UI design
- Test with different locales

## Accessibility

### Current Implementation
- Semantic HTML structure
- Proper heading hierarchy
- Keyboard navigation support
- Color contrast compliance

### WCAG Compliance
- Level AA compliance target
- Screen reader compatibility
- Focus management
- ARIA attributes where needed

### Accessibility Features
- Skip navigation links
- Proper form labeling
- Error identification
- Consistent navigation

### Testing
- Automated accessibility testing with axe-core
- Manual testing with screen readers
- Keyboard-only navigation testing
- Color contrast testing

## Deployment Architecture

### Current Deployment
- Lovable platform deployment
- Supabase cloud hosting
- Static asset serving
- Automatic SSL

### Infrastructure Components
1. **Frontend Hosting**: Lovable CDN
2. **Backend Services**: Supabase
3. **Database**: Supabase PostgreSQL
4. **Authentication**: Supabase Auth
5. **Storage**: Supabase Storage

### Scalability
- Horizontal scaling handled by Supabase
- CDN for static assets
- Database connection pooling
- Caching strategies

### Monitoring
- Supabase dashboard for database monitoring
- Lovable analytics
- Error tracking (future implementation)
- Performance monitoring (future implementation)

### Backup and Recovery
- Automated database backups (Supabase)
- Point-in-time recovery
- Export/import capabilities
- Disaster recovery plan

## Development Environment

### Required Tools
- Node.js (version specified in .nvmrc)
- npm or yarn
- Git
- Code editor (VS Code recommended)
- Browser developer tools

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

### Development Scripts
```json
{
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Husky for git hooks (future implementation)

## Testing Strategy

### Test Types
1. **Unit Tests**: Component and utility function testing
2. **Integration Tests**: API and database interaction testing
3. **End-to-End Tests**: User flow testing
4. **Accessibility Tests**: a11y compliance testing
5. **Performance Tests**: Load and stress testing

### Testing Tools
- Jest for unit testing
- React Testing Library for component testing
- Cypress or Playwright for E2E testing
- axe-core for accessibility testing
- Lighthouse for performance testing

### Test Coverage Goals
- Components: 80%+
- Utility functions: 90%+
- API integration: 70%+
- Critical user flows: 100%

## Future Technical Considerations

### Microservices Architecture
- Consider breaking down into microservices as system grows
- GraphQL API for flexible data fetching
- Message queue for background processing

### Advanced Features
- Real-time collaboration
- AI-powered insights
- Mobile application
- Desktop application

### Performance Enhancements
- Server-side rendering (SSR)
- Progressive Web App (PWA) capabilities
- Web Workers for heavy computations
- Service Workers for offline support

### Security Enhancements
- Two-factor authentication
- OAuth integration
- Data encryption for sensitive fields
- Regular security audits

This technical specification provides a comprehensive overview of the Workhour Cloud system's implementation details and serves as a guide for continued development and maintenance.