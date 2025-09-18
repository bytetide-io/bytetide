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

## 🏆 PREMIUM PRODUCTION-GRADE STANDARDS

### Component Architecture Excellence

#### Component Size & Complexity Rules
```typescript
// 🚫 NEVER: Components over 300 lines
// ✅ ALWAYS: Break down into smaller, focused components

// ❌ BAD: Massive form component
export function NewProjectForm() {
  // 954 lines of code... 
}

// ✅ GOOD: Composed form with focused components
export function NewProjectForm() {
  return (
    <ProjectFormProvider>
      <BasicInfoStep />
      <ShopifySetupStep />
      <FileUploadStep />
      <ReviewStep />
    </ProjectFormProvider>
  )
}
```

#### Single Responsibility Principle
- **One Purpose Per Component**: Each component should do exactly one thing well
- **Maximum 3 Props for Simple Components**: More props indicate the component is doing too much
- **Extract Custom Hooks**: Business logic belongs in hooks, not components
- **Composition Over Inheritance**: Build complex UIs by composing simple components

#### Mandatory Component Structure
```typescript
// ✅ REQUIRED: Every component must follow this exact structure
interface ComponentProps {
  // 1. Required props first
  data: SomeType
  onAction: (data: SomeType) => void
  
  // 2. Optional props with defaults
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  
  // 3. Event handlers
  onClick?: () => void
  
  // 4. Standard HTML props last
  className?: string
  children?: React.ReactNode
}

export function Component({ 
  data, 
  onAction, 
  variant = 'primary',
  size = 'md',
  onClick,
  className,
  children,
  ...rest 
}: ComponentProps) {
  // 1. Hooks at the top (state, context, custom hooks)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  
  // 2. Computed values
  const isDisabled = loading || !user
  
  // 3. Event handlers
  const handleClick = useCallback(() => {
    if (onClick) onClick()
  }, [onClick])
  
  // 4. Effects
  useEffect(() => {
    // Side effects here
  }, [])
  
  // 5. Early returns (loading, error, empty states)
  if (loading) return <LoadingSkeleton />
  if (!data) return <EmptyState />
  
  // 6. Main render with proper className composition
  return (
    <div 
      className={clsx(
        'base-styles-always-first',
        variant === 'primary' && 'variant-styles',
        size === 'lg' && 'size-styles',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

// 7. Always export with displayName for debugging
Component.displayName = 'Component'
```

### Type Safety Excellence

#### Zero Tolerance for `any`
```typescript
// 🚫 BANNED: Using 'any' type
const data: any = response // NEVER DO THIS

// ✅ REQUIRED: Proper type definitions
interface ApiResponse<T> {
  data: T
  error: string | null
  status: 'success' | 'error' | 'loading'
}

// ✅ REQUIRED: Generic constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T>
  create(item: Omit<T, 'id'>): Promise<T>
}
```

#### Error Type Safety
```typescript
// ✅ REQUIRED: Typed error handling
type AppError = 
  | { type: 'VALIDATION_ERROR'; field: string; message: string }
  | { type: 'NETWORK_ERROR'; status: number; message: string }
  | { type: 'AUTH_ERROR'; message: string }

const handleError = (error: AppError) => {
  switch (error.type) {
    case 'VALIDATION_ERROR':
      setFieldError(error.field, error.message)
      break
    case 'NETWORK_ERROR':
      showToast(`Network error (${error.status}): ${error.message}`)
      break
    case 'AUTH_ERROR':
      redirectToLogin()
      break
  }
}
```

### File Organization Standards

#### Mandatory Barrel Exports
```typescript
// src/components/index.ts - REQUIRED in every directory
export { Button } from './Button'
export { Input } from './Input'
export { Select } from './Select'
export type { ButtonProps, InputProps, SelectProps } from './types'

// src/components/forms/index.ts
export { FormField } from './FormField'
export { FormProvider } from './FormProvider'
export { useForm } from './useForm'

// Usage becomes clean:
import { Button, Input, FormField } from '@/components'
import { FormProvider, useForm } from '@/components/forms'
```

#### Directory Structure Rules
```
src/
├── components/
│   ├── ui/              # Basic design system components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   └── index.ts     # MANDATORY barrel export
│   ├── forms/           # Form-specific components
│   │   ├── ProjectForm/
│   │   ├── AuthForm/
│   │   └── index.ts
│   ├── dashboard/       # Dashboard-specific components
│   ├── layout/          # Layout components
│   └── index.ts         # Master barrel export
├── hooks/               # Custom hooks only
├── lib/
│   ├── api/            # API layer
│   ├── utils/          # Pure utilities
│   ├── types/          # Global type definitions
│   └── constants/      # App constants
└── app/                # Next.js pages only
```

### Performance Excellence

#### Mandatory React.memo Usage
```typescript
// ✅ REQUIRED: Memo for components that receive props
export const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data,
  onUpdate
}: Props) {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison if needed
  return prevProps.data.id === nextProps.data.id
})

// ✅ REQUIRED: Memo for list items
export const ListItem = React.memo(function ListItem({ item }: { item: Item }) {
  return <div>{item.name}</div>
})
```

#### Bundle Size Monitoring
```typescript
// ✅ REQUIRED: Lazy loading for large components
const HeavyDashboard = lazy(() => import('@/components/dashboard/HeavyDashboard'))
const ComplexForm = lazy(() => import('@/components/forms/ComplexForm'))

// ✅ REQUIRED: Dynamic imports for conditional features
const handleExport = async () => {
  const { exportToCsv } = await import('@/lib/export')
  exportToCsv(data)
}
```

### Error Handling Excellence

#### Mandatory Error Boundaries
```typescript
// ✅ REQUIRED: Error boundary for each major section
export function DashboardErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={<DashboardErrorFallback />}
      onError={(error, errorInfo) => {
        console.error('Dashboard error:', error)
        // Send to monitoring service
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

// ✅ REQUIRED: Graceful error UI
function DashboardErrorFallback() {
  return (
    <Card className="p-8 text-center">
      <AlertTriangleIcon className="w-12 h-12 mx-auto mb-4 text-red-500" />
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-slate-600 mb-4">
        We're sorry, but the dashboard encountered an error.
      </p>
      <Button onClick={() => window.location.reload()}>
        Reload Page
      </Button>
    </Card>
  )
}
```

#### Comprehensive Error States
```typescript
// ✅ REQUIRED: Every async operation must handle all states
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: AppError }

const useAsyncOperation = <T,>(
  operation: () => Promise<T>
): [AsyncState<T>, () => Promise<void>] => {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' })
  
  const execute = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const data = await operation()
      setState({ status: 'success', data })
    } catch (error) {
      setState({ status: 'error', error: error as AppError })
    }
  }, [operation])
  
  return [state, execute]
}
```

### Icon System Excellence

#### Unified Icon Component
```typescript
// ✅ REQUIRED: Single icon system using Lucide React
import { 
  ChevronDown, 
  AlertTriangle, 
  CheckCircle,
  X,
  Menu,
  Upload,
  Download
} from 'lucide-react'

interface IconProps {
  name: 'chevron-down' | 'alert-triangle' | 'check-circle' | 'x' | 'menu' | 'upload' | 'download'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const iconMap = {
  'chevron-down': ChevronDown,
  'alert-triangle': AlertTriangle,
  'check-circle': CheckCircle,
  'x': X,
  'menu': Menu,
  'upload': Upload,
  'download': Download,
} as const

export function Icon({ name, size = 'md', className }: IconProps) {
  const IconComponent = iconMap[name]
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  }
  
  return (
    <IconComponent 
      className={clsx(sizeClasses[size], className)} 
    />
  )
}

// Usage:
<Icon name="chevron-down" size="sm" className="text-slate-500" />
```

### Code Quality Gates

#### Pre-Commit Requirements
```bash
# .husky/pre-commit - MANDATORY
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 1. Type checking
npm run type-check || exit 1

# 2. Linting
npm run lint || exit 1

# 3. Build check
npm run build || exit 1

# 4. Bundle size check
npm run bundle-analyzer || exit 1
```

#### Component Quality Checklist
**Before creating ANY component, verify:**
- [ ] Component name is descriptive and follows PascalCase
- [ ] Props interface is properly typed with JSDoc comments
- [ ] Component is under 200 lines (break down if larger)
- [ ] Uses proper forwarding of refs if needed
- [ ] Handles loading, error, and empty states
- [ ] Uses React.memo if receiving props
- [ ] Follows consistent className composition pattern
- [ ] Has proper accessibility attributes
- [ ] Is responsive across all breakpoints
- [ ] Exported with barrel export in index.ts

### Naming Conventions

#### File Naming Rules
```typescript
// ✅ Components: PascalCase
Button.tsx
ProjectForm.tsx
DashboardLayout.tsx

// ✅ Hooks: camelCase starting with 'use'
useAuth.ts
useProjectData.ts
useFormValidation.ts

// ✅ Utilities: camelCase
formatDate.ts
validateEmail.ts
apiClient.ts

// ✅ Types: PascalCase with descriptive suffix
types.ts (contains UserType, ProjectType, etc.)
api.types.ts
form.types.ts

// ✅ Constants: SCREAMING_SNAKE_CASE
API_ENDPOINTS.ts
VALIDATION_RULES.ts
```

#### Variable Naming Rules
```typescript
// ✅ REQUIRED: Descriptive, searchable names
const activeProjectsCount = projects.filter(p => p.status === 'active').length
const isFormSubmitting = loading && formState.isSubmitted
const handleProjectUpdate = (projectId: string, updates: ProjectUpdates) => {}

// 🚫 BANNED: Abbreviations and unclear names
const c = projects.filter(p => p.status === 'active').length // BAD
const loading = true // TOO GENERIC
const handle = () => {} // UNCLEAR
```

This CLAUDE.md ensures ByteTide maintains professional, production-ready code standards across all development activities with zero tolerance for technical debt.