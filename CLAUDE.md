# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is ByteTide - a premium data migration service exclusively for Shopify agencies. The codebase is built on Next.js 15 with React 19, Tailwind CSS v4, TypeScript, and Framer Motion, originally based on the Tailwind Plus Studio template but completely customized for ByteTide's business model.

**Key Business Context**: ByteTide positions itself as a hands-on data engineering team (not a self-service platform) that personally manages every Shopify migration. The messaging emphasizes expert craftsmanship, manual quality assurance, and premium B2B-only service for agencies.

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build (MANDATORY before committing changes)
npm run build

# Production server
npm start

# Linting (MANDATORY before committing changes)
npm run lint
```

**CRITICAL**: Always run `npm run build` AND `npm run lint` before committing to ensure production-ready code. The build process includes static generation for all pages and catches production-only errors.

## Architecture Overview

### App Router Structure
- Uses Next.js 15 App Router (`src/app/` directory)
- Pages are defined in `page.tsx` files within route directories
- Global layout in `src/app/layout.tsx` with basic HTML structure
- Main layout logic in `src/components/RootLayout.tsx` (client component with navigation, animations, and context)

### Authentication & Authorization System
- **Supabase Integration**: Full-stack authentication with SSR support
- **Middleware Protection**: `/src/middleware.ts` handles route protection and user state
- **User States**: Unauthenticated, authenticated without organization, authenticated with organization
- **Protected Routes**: `/dashboard/*`, `/onboarding/*` require authentication
- **Database Tables**: `memberships`, `organizations`, `invitations`, `users`

### Component Architecture & Design System
- **Reusable Components**: All in `src/components/` following strict design system patterns
- **Core Components**: Button, Input, Select, Card, Alert - all with consistent styling
- **Layout Components**: Container, FadeIn, SectionIntro for consistent page structure
- **Auth Components**: AuthForm, AuthLayout for authentication pages
- **Dashboard Components**: Professional dropdown menus, organization switcher, user menu

### Content Management
- **MDX Integration**: Blog posts (`src/app/blog/`) and case studies (`src/app/work/`) are written in MDX
- **Content Loading**: `src/lib/mdx.ts` handles dynamic loading of MDX content with metadata
- **Auto-routing**: MDX files in subdirectories automatically become routes
- **Layouts**: Blog and work sections have wrapper components that provide consistent layouts

### Styling System
- **Tailwind CSS v4**: Uses the new `@theme` directive in `src/styles/tailwind.css`
- **Design Tokens**: Consistent color palette (slate grays, blue accents), typography scale, spacing
- **Component Styling**: All components follow consistent patterns for borders, padding, focus states
- **Animation**: Framer Motion for page transitions, stagger animations, and micro-interactions
- **Responsive Design**: Mobile-first approach with comprehensive responsive breakpoints

## Professional Development Standards

### Code Quality Requirements

#### MANDATORY Pre-Commit Checklist
1. **Build Check**: `npm run build` must pass without errors
2. **Lint Check**: `npm run lint` must pass without warnings
3. **Type Safety**: All TypeScript errors must be resolved
4. **Component Testing**: New components must follow existing patterns
5. **Responsive Design**: Test components across all breakpoints

#### TypeScript Standards
```typescript
// ✅ DO: Proper interface definitions
interface UserState {
  isAuthenticated: boolean
  hasOrganization: boolean
  userId?: string
}

// ✅ DO: Type-safe component props
interface SelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string; description?: string }>
  error?: string
  required?: boolean
}

// ❌ DON'T: Use 'any' type
const user: any = data // Bad!
```

#### Component Design Patterns
```typescript
// ✅ DO: Follow consistent component structure
export function ComponentName({ prop1, prop2, ...rest }: ComponentProps) {
  // 1. Hooks at the top
  const [state, setState] = useState()
  
  // 2. Event handlers
  const handleClick = () => {}
  
  // 3. Early returns for loading/error states
  if (loading) return <LoadingState />
  
  // 4. Main render
  return (
    <div className="consistent-styling-pattern">
      {children}
    </div>
  )
}
```

### Authentication & Security Standards

#### Database Interactions
```typescript
// ✅ DO: Proper error handling
try {
  const { data, error } = await supabase
    .from('memberships')
    .select('org_id, role')
    .eq('user_id', user.id)
  
  if (error) {
    console.error('Database error:', error)
    return
  }
} catch (err) {
  console.error('Unexpected error:', err)
}

// ❌ DON'T: Ignore errors or use unsafe queries
const { data } = await supabase.from('users').select('*') // Too broad!
```

#### Route Protection Patterns
- All authentication logic is centralized in `/src/middleware.ts`
- Never implement auth checks in individual components
- Use proper user state detection through OrganizationContext
- Handle invitation flows through the centralized invitation system

### UI/UX Standards

#### Design System Compliance
```typescript
// ✅ DO: Use design system components
<Button variant="primary" size="lg" loading={isLoading}>
  Submit
</Button>

<Select
  label="Country"
  value={value}
  onChange={setValue}
  options={countries}
  leftIcon={<GlobeIcon />}
  error={error}
/>

// ❌ DON'T: Create one-off styled elements
<button className="bg-blue-500 px-4 py-2 rounded"> // Inconsistent!
```

#### Styling Patterns
```typescript
// ✅ DO: Consistent className patterns
const buttonClasses = clsx(
  'px-4 py-2 rounded-lg font-medium transition-colors',
  variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
  variant === 'secondary' && 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  disabled && 'opacity-50 cursor-not-allowed'
)

// ✅ DO: Use design tokens
<div className="p-6 bg-white rounded-xl shadow-xl border border-slate-200">
```

#### Responsive Design Requirements
- All components must work across mobile, tablet, and desktop
- Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)
- Test dropdown menus on mobile devices
- Ensure proper touch targets (minimum 44px)

### Error Handling & User Experience

#### Error States
```typescript
// ✅ DO: Comprehensive error handling
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)

try {
  setLoading(true)
  setError('')
  
  const result = await apiCall()
  
  if (result.error) {
    setError(result.error.message)
    return
  }
  
  // Success handling
} catch (err) {
  setError('An unexpected error occurred. Please try again.')
} finally {
  setLoading(false)
}
```

#### Loading States
- All async operations must show loading indicators
- Use skeleton screens for complex components
- Disable interactive elements during loading
- Provide clear feedback for user actions

### Performance Standards

#### Code Splitting & Bundle Size
- Use dynamic imports for heavy components
- Lazy load dashboard components
- Optimize images with Next.js Image component
- Monitor bundle size in build output

#### Database Query Optimization
```typescript
// ✅ DO: Specific, efficient queries
const { data } = await supabase
  .from('memberships')
  .select('org_id, role, organizations(name)')
  .eq('user_id', userId)
  .limit(1)

// ❌ DON'T: Overfetch data
const { data } = await supabase
  .from('memberships')
  .select('*') // Too broad!
```

## Development Workflows

### Feature Development Process
1. **Planning**: Understand requirements and existing patterns
2. **Architecture**: Design component interfaces and data flow
3. **Implementation**: Follow TypeScript and component patterns
4. **Testing**: Verify across all breakpoints and user states  
5. **Quality Check**: Run build and lint commands
6. **Integration**: Ensure proper authentication and error handling

### Component Development Guidelines
1. **Design System First**: Use existing Button, Input, Select, Card components
2. **TypeScript**: Define proper interfaces for all props and state
3. **Error Handling**: Implement loading, error, and success states
4. **Accessibility**: Proper labels, ARIA attributes, keyboard navigation
5. **Responsive**: Test on mobile, tablet, and desktop
6. **Performance**: Optimize for fast rendering and minimal re-renders

### Authentication Integration
1. **Middleware**: All route protection happens in middleware
2. **Context**: Use OrganizationContext for user state
3. **Invitations**: Use centralized invitation system
4. **Database**: Follow established patterns for Supabase queries
5. **Security**: Never expose sensitive data or bypass auth checks

## Key Files & Patterns

### Core Architecture Files
- `src/middleware.ts`: Route protection and authentication
- `src/lib/supabase/`: Database client configuration
- `src/lib/contexts/OrganizationContext.tsx`: User state management
- `src/components/`: Reusable design system components

### Authentication Components
- `src/components/auth/`: Authentication-specific components
- `src/app/auth/`: Authentication pages and flows
- `src/app/onboarding/`: User onboarding and organization setup
- `src/components/NoOrganizationScreen.tsx`: Invitation detection

### Design System Components
- `src/components/Button.tsx`: Primary button component
- `src/components/Input.tsx`: Form input with validation
- `src/components/Select.tsx`: Professional dropdown component
- `src/components/Card.tsx`: Container component
- `src/components/Alert.tsx`: Error/success messaging

### Dashboard Components
- `src/app/dashboard/layout.tsx`: Dashboard shell with navigation
- `src/app/dashboard/team/page.tsx`: Team management with invitations
- `src/app/dashboard/organization/page.tsx`: Organization settings

## Quality Assurance

### Pre-Production Checklist
- [ ] `npm run build` passes without errors
- [ ] `npm run lint` passes without warnings
- [ ] All TypeScript errors resolved
- [ ] Components tested across breakpoints
- [ ] Authentication flows work correctly
- [ ] Error states properly handled
- [ ] Loading states implemented
- [ ] Database queries optimized
- [ ] No console errors in browser
- [ ] Professional UI/UX standards met

### Security Checklist
- [ ] No sensitive data exposed in frontend
- [ ] Proper authentication middleware protection
- [ ] Database queries use proper filtering
- [ ] User input sanitized and validated
- [ ] Error messages don't leak sensitive information

This CLAUDE.md ensures ByteTide maintains professional, production-ready code standards across all development activities.