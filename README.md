# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9bcd89f1-de5a-4f95-aa5a-f186501399eb

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9bcd89f1-de5a-4f95-aa5a-f186501399eb) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend as a Service)
- React Router DOM (Client-side routing)
- React Query (Server state management)
- Lucide React (Icons)
- Sonner (Toast notifications)
- React RND (Draggable and resizable components)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9bcd89f1-de5a-4f95-aa5a-f186501399eb) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Project Overview

Workhour Cloud is a cloud-based productivity platform that simulates a desktop environment for remote work. The system provides time tracking capabilities, a virtual workspace with draggable windows, and integrated applications.

### Core Features

1. **Authentication System**
   - User registration and login
   - Session management
   - Profile creation on signup with default hourly rate of $25.00

2. **Time Tracking**
   - Real-time timer with start/stop functionality
   - Automatic earnings calculation based on hourly rate
   - Time entry persistence in database
   - Movable time tracking widget for desktop

3. **Virtual Desktop Environment**
   - Draggable and resizable windows
   - Built-in applications (Text Editor, Web Browser, Terminal)
   - Additional productivity apps (Chrome, Word, Excel, IDE)
   - Taskbar with active applications
   - App launcher with variety of applications

4. **Data Management**
   - User profiles with hourly rates (default: $25.00)
   - Time entries with duration and earnings
   - Workspace configurations

### Available Applications

The system includes a variety of built-in applications that can be launched from the desktop:

1. **Text Editor** - Simple text editing application
2. **Web Browser** - Simulated web browsing experience
3. **Terminal** - Command-line interface
4. **Time Tracker** - Movable widget for time tracking
5. **Google Chrome** - Chrome browser simulation
6. **Microsoft Word** - Document editing application
7. **Microsoft Excel** - Spreadsheet application with hourly rate integration
8. **IDE** - Code editor simulation

### Desktop Features

- Draggable and resizable windows for all applications
- Persistent time tracking widget that automatically starts
- Taskbar with active applications and time display
- App launcher for accessing all available applications
- Automatic session initialization on desktop load

## System Architecture

### Frontend Structure

```
src/
├── components/
│   ├── os/              # Operating system-like components
│   │   ├── apps/        # Built-in applications
│   │   ├── AppLauncher.tsx
│   │   ├── Taskbar.tsx
│   │   └── Window.tsx
│   └── ui/              # Reusable UI components (shadcn-ui)
├── integrations/
│   └── supabase/        # Supabase integration
├── lib/                 # Utility functions
├── pages/               # Application pages
└── hooks/               # Custom React hooks
```

### Backend Structure (Supabase)

```
supabase/
├── migrations/          # Database schema migrations
└── config.toml          # Supabase configuration
```

### Database Schema

The system uses three main tables:

1. **profiles**
   - Stores user information (id, email, full_name, hourly_rate)
   - Row Level Security (RLS) policies for data isolation

2. **time_entries**
   - Tracks work time (started_at, ended_at, duration_seconds, earnings)
   - Associated with users via user_id foreign key
   - RLS policies for data isolation

3. **workspaces**
   - Stores workspace configurations (windows_state as JSONB)
   - Associated with users via user_id foreign key
   - RLS policies for data isolation

## Development Guidelines

### Adding New Features

1. **Frontend Components**
   - Create new components in the appropriate directory under `src/components/`
   - Follow the existing component structure and naming conventions
   - Use TypeScript for type safety
   - Utilize shadcn-ui components when possible for consistency

2. **Database Changes**
   - Create new migration files in `supabase/migrations/`
   - Follow the existing migration naming convention (timestamp_uuid.sql)
   - Include RLS policies for new tables
   - Update `src/integrations/supabase/types.ts` with new table definitions

3. **New Pages**
   - Create new page components in `src/pages/`
   - Add routes in `src/App.tsx`
   - Use existing pages as templates for consistency

### Component Development

1. **Window Components**
   - Use the `Window` component from `src/components/os/Window.tsx` for consistent window behavior
   - Implement proper onClose, onMinimize, and onFocus handlers
   - Consider window default positions and sizes

2. **UI Components**
   - Prefer shadcn-ui components for consistency
   - Follow Tailwind CSS utility class patterns
   - Ensure responsive design using Tailwind's responsive prefixes

### State Management

1. **Local State**
   - Use React's useState and useEffect hooks
   - Consider useReducer for complex state logic

2. **Global State**
   - Use React Query for server state management
   - Consider Context API for client state that needs to be shared across components

3. **Supabase Integration**
   - Use the supabase client from `src/integrations/supabase/client.ts`
   - Handle errors appropriately with try/catch blocks
   - Use React Query for data fetching and caching

### Styling Guidelines

1. **Tailwind CSS**
   - Use utility classes for styling
   - Leverage Tailwind's design system (spacing, colors, typography)
   - Use responsive prefixes for mobile-first design

2. **Color System**
   - Primary colors defined in `tailwind.config.ts`
   - Use semantic color names (primary, secondary, success, warning, error)
   - Consider adding gradient effects for visual appeal

3. **Component Design**
   - Follow shadcn-ui design patterns
   - Maintain consistent spacing and padding
   - Use appropriate typography hierarchy

## Development Workflow

1. **Setting Up Local Development**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   npm install
   npm run dev
   ```

2. **Environment Variables**
   - Configure environment variables in `.env` file
   - Supabase credentials are required for backend functionality

3. **Database Migrations**
   - Run migrations locally using Supabase CLI
   - Create new migrations for schema changes
   - Test migrations thoroughly before deployment

4. **Testing**
   - Test components in isolation
   - Verify database operations with different user contexts
   - Check responsive design on different screen sizes

## Future Development Areas

1. **UI/UX Improvements**
   - Implement gradient purple/blue color scheme
   - Add animations and glassmorphism effects
   - Improve component variants for better consistency

2. **Feature Enhancements**
   - Advanced workspace management
   - Additional built-in applications
   - Collaboration features

3. **Performance Optimization**
   - Code splitting for better load times
   - Image optimization
   - Database query optimization

4. **Security**
   - Enhanced authentication (2FA, OAuth)
   - Data encryption for sensitive information
   - Regular security audits

## Troubleshooting

1. **Authentication Issues**
   - Verify Supabase credentials in `.env` file
   - Check network connectivity to Supabase
   - Review Supabase Auth configuration

2. **Database Connection**
   - Confirm database URL and API key
   - Check RLS policies for appropriate access
   - Verify migration status

3. **UI Rendering Issues**
   - Check Tailwind CSS class names
   - Verify component props and types
   - Review responsive design breakpoints
