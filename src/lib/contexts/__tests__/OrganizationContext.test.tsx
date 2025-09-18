import { render, screen, waitFor, act } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { OrganizationProvider, useOrganization } from '../OrganizationContext'
import { supabase } from '@/lib/supabase/client'

// Mock the router
const mockPush = jest.fn()
const mockReplace = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
}))

// Test component to consume the context
const TestComponent = () => {
  const { 
    currentOrganization, 
    organizations, 
    loading, 
    isAuthenticated, 
    hasOrganization,
    switchOrganization,
    refreshOrganizations 
  } = useOrganization()

  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="has-organization">{hasOrganization ? 'has-org' : 'no-org'}</div>
      <div data-testid="current-org">{currentOrganization?.name || 'none'}</div>
      <div data-testid="org-count">{organizations.length}</div>
      <button onClick={() => switchOrganization('org-2')} data-testid="switch-org">
        Switch Org
      </button>
      <button onClick={refreshOrganizations} data-testid="refresh">
        Refresh
      </button>
    </div>
  )
}

// Mock Supabase responses
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
}

const mockOrganizations = [
  { id: 'org-1', name: 'Organization 1' },
  { id: 'org-2', name: 'Organization 2' },
]

const mockMemberships = [
  {
    id: 'mem-1',
    user_id: 'user-123',
    org_id: 'org-1',
    role: 'admin',
    organizations: mockOrganizations[0],
  },
  {
    id: 'mem-2',
    user_id: 'user-123',
    org_id: 'org-2',
    role: 'member',
    organizations: mockOrganizations[1],
  },
]

describe('OrganizationContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    
    // Default mock implementations
    supabase.auth.getUser = jest.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
    
    supabase.from = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: mockMemberships,
        error: null,
      }),
    })
  })

  it('loads user and organizations on mount', async () => {
    render(
      <OrganizationProvider>
        <TestComponent />
      </OrganizationProvider>
    )

    // Initially loading
    expect(screen.getByTestId('loading')).toHaveTextContent('loading')

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('has-organization')).toHaveTextContent('has-org')
    expect(screen.getByTestId('current-org')).toHaveTextContent('Organization 1')
    expect(screen.getByTestId('org-count')).toHaveTextContent('2')
  })

  it('handles unauthenticated user', async () => {
    supabase.auth.getUser = jest.fn().mockResolvedValue({
      data: { user: null },
      error: null,
    })

    render(
      <OrganizationProvider>
        <TestComponent />
      </OrganizationProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    expect(screen.getByTestId('authenticated')).toHaveTextContent('not-authenticated')
    expect(screen.getByTestId('has-organization')).toHaveTextContent('no-org')
    expect(screen.getByTestId('current-org')).toHaveTextContent('none')
  })

  it('handles user with no organizations', async () => {
    supabase.from = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    })

    render(
      <OrganizationProvider>
        <TestComponent />
      </OrganizationProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('has-organization')).toHaveTextContent('no-org')
    expect(screen.getByTestId('current-org')).toHaveTextContent('none')
    expect(screen.getByTestId('org-count')).toHaveTextContent('0')
  })

  it('switches organizations correctly', async () => {
    render(
      <OrganizationProvider>
        <TestComponent />
      </OrganizationProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    expect(screen.getByTestId('current-org')).toHaveTextContent('Organization 1')

    act(() => {
      screen.getByTestId('switch-org').click()
    })

    expect(screen.getByTestId('current-org')).toHaveTextContent('Organization 2')
  })

  it('persists selected organization in localStorage', async () => {
    render(
      <OrganizationProvider>
        <TestComponent />
      </OrganizationProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    act(() => {
      screen.getByTestId('switch-org').click()
    })

    expect(localStorage.getItem('selectedOrganization')).toBe('org-2')
  })

  it('loads persisted organization from localStorage', async () => {
    localStorage.setItem('selectedOrganization', 'org-2')

    render(
      <OrganizationProvider>
        <TestComponent />
      </OrganizationProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    expect(screen.getByTestId('current-org')).toHaveTextContent('Organization 2')
  })

  it('refreshes organizations', async () => {
    const mockRefreshData = [
      {
        id: 'mem-1',
        user_id: 'user-123',
        org_id: 'org-1',
        role: 'admin',
        organizations: { id: 'org-1', name: 'Updated Organization 1' },
      },
    ]

    render(
      <OrganizationProvider>
        <TestComponent />
      </OrganizationProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    // Mock the refresh call
    supabase.from = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: mockRefreshData,
        error: null,
      }),
    })

    act(() => {
      screen.getByTestId('refresh').click()
    })

    await waitFor(() => {
      expect(screen.getByTestId('current-org')).toHaveTextContent('Updated Organization 1')
    })
  })

  it('handles API errors gracefully', async () => {
    supabase.auth.getUser = jest.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    supabase.from = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      }),
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    render(
      <OrganizationProvider>
        <TestComponent />
      </OrganizationProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    expect(consoleSpy).toHaveBeenCalledWith('Error loading organizations:', expect.any(Object))
    expect(screen.getByTestId('has-organization')).toHaveTextContent('no-org')

    consoleSpy.mockRestore()
  })

  it('redirects unauthenticated users to login', async () => {
    supabase.auth.getUser = jest.fn().mockResolvedValue({
      data: { user: null },
      error: null,
    })

    render(
      <OrganizationProvider requireAuth>
        <TestComponent />
      </OrganizationProvider>
    )

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/auth/login')
    })
  })

  it('redirects users without organizations to onboarding', async () => {
    supabase.from = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    })

    render(
      <OrganizationProvider requireOrganization>
        <TestComponent />
      </OrganizationProvider>
    )

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/onboarding')
    })
  })

  it('provides correct context values', async () => {
    render(
      <OrganizationProvider>
        <TestComponent />
      </OrganizationProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading')
    })

    // Check all context values are correct
    expect(screen.getByTestId('authenticated')).toHaveTextContent('authenticated')
    expect(screen.getByTestId('has-organization')).toHaveTextContent('has-org')
    expect(screen.getByTestId('current-org')).toHaveTextContent('Organization 1')
    expect(screen.getByTestId('org-count')).toHaveTextContent('2')
  })
})