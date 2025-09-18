import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TeamPage from '../page'
import { useOrganization } from '@/lib/contexts/OrganizationContext'
import { supabase } from '@/lib/supabase/client'

// Mock the organization context
jest.mock('@/lib/contexts/OrganizationContext')
const mockUseOrganization = useOrganization as jest.MockedFunction<typeof useOrganization>

// Mock Supabase
jest.mock('@/lib/supabase/client')

const mockOrganization = {
  id: 'org-123',
  name: 'Test Organization',
}

const mockMembers = [
  {
    id: 'member-1',
    full_name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    joined_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 'member-2',
    full_name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'member',
    joined_at: '2023-01-02T00:00:00Z',
  },
]

const mockInvitations = [
  {
    id: 1,
    invited_email: 'invite@example.com',
    role: 'member',
    created_at: '2023-01-03T00:00:00Z',
  },
]

describe('TeamPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default organization context mock
    mockUseOrganization.mockReturnValue({
      currentOrganization: mockOrganization,
      loading: false,
      organizations: [mockOrganization],
      isAuthenticated: true,
      hasOrganization: true,
      switchOrganization: jest.fn(),
      refreshOrganizations: jest.fn(),
    })

    // Default Supabase mocks
    supabase.from = jest.fn().mockImplementation((table) => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
      }

      if (table === 'memberships') {
        queryBuilder.select.mockResolvedValue({
          data: mockMembers.map(member => ({
            ...member,
            users: { full_name: member.full_name, email: member.email },
          })),
          error: null,
        })
      } else if (table === 'invitations') {
        queryBuilder.eq.mockReturnThis()
        queryBuilder.single.mockResolvedValue({ data: null, error: null })
        queryBuilder.insert.mockReturnThis()
        queryBuilder.select.mockReturnThis()
        queryBuilder.single.mockResolvedValue({
          data: mockInvitations[0],
          error: null,
        })
        
        // For the initial load
        if (!queryBuilder.insert.mock.calls.length) {
          queryBuilder.eq.mockResolvedValue({
            data: mockInvitations,
            error: null,
          })
        }
      }

      return queryBuilder
    })
  })

  it('renders team page with members and invitations', async () => {
    render(<TeamPage />)

    await waitFor(() => {
      expect(screen.getByText('Team Management')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      expect(screen.getByText('invite@example.com')).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    mockUseOrganization.mockReturnValue({
      currentOrganization: null,
      loading: true,
      organizations: [],
      isAuthenticated: true,
      hasOrganization: false,
      switchOrganization: jest.fn(),
      refreshOrganizations: jest.fn(),
    })

    render(<TeamPage />)

    // Check for loading indicators in the rendered component
    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  it('handles no organization state', () => {
    mockUseOrganization.mockReturnValue({
      currentOrganization: null,
      loading: false,
      organizations: [],
      isAuthenticated: true,
      hasOrganization: false,
      switchOrganization: jest.fn(),
      refreshOrganizations: jest.fn(),
    })

    render(<TeamPage />)

    // Should render nothing when no organization (context handles redirects)
    expect(screen.queryByText('Team Management')).not.toBeInTheDocument()
  })

  it('sends team invitation', async () => {
    const user = userEvent.setup()
    render(<TeamPage />)

    await waitFor(() => {
      expect(screen.getByText('Team Management')).toBeInTheDocument()
    })

    // Fill invitation form
    const emailInput = screen.getByLabelText('Email Address')
    const roleSelect = screen.getByRole('button', { name: /Member/ })
    const submitButton = screen.getByRole('button', { name: 'Send Invitation' })

    await user.type(emailInput, 'newuser@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Invitation sent to newuser@example.com/)).toBeInTheDocument()
    })
  })

  it('validates invitation email format', async () => {
    const user = userEvent.setup()
    render(<TeamPage />)

    await waitFor(() => {
      expect(screen.getByText('Team Management')).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText('Email Address')
    const submitButton = screen.getByRole('button', { name: 'Send Invitation' })

    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
    })
  })

  it('prevents duplicate invitations', async () => {
    // Mock existing member check
    supabase.from = jest.fn().mockImplementation((table) => {
      if (table === 'memberships') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: [{ users: { email: 'existing@example.com' } }],
            error: null,
          }),
        }
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
    })

    const user = userEvent.setup()
    render(<TeamPage />)

    await waitFor(() => {
      expect(screen.getByText('Team Management')).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText('Email Address')
    const submitButton = screen.getByRole('button', { name: 'Send Invitation' })

    await user.type(emailInput, 'existing@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('This user is already a member of your team.')).toBeInTheDocument()
    })
  })

  it('prevents duplicate invitations to pending emails', async () => {
    // Mock existing invitation check
    supabase.from = jest.fn().mockImplementation((table) => {
      if (table === 'memberships') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }
      }
      if (table === 'invitations') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { id: 1 },
            error: null,
          }),
        }
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      }
    })

    const user = userEvent.setup()
    render(<TeamPage />)

    await waitFor(() => {
      expect(screen.getByText('Team Management')).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText('Email Address')
    const submitButton = screen.getByRole('button', { name: 'Send Invitation' })

    await user.type(emailInput, 'pending@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('An invitation has already been sent to this email address.')).toBeInTheDocument()
    })
  })

  it('cancels invitations', async () => {
    const user = userEvent.setup()
    render(<TeamPage />)

    await waitFor(() => {
      expect(screen.getByText('invite@example.com')).toBeInTheDocument()
    })

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    await waitFor(() => {
      expect(screen.getByText('Invitation cancelled successfully.')).toBeInTheDocument()
    })
  })

  it('removes team members', async () => {
    const user = userEvent.setup()
    
    // Mock window.confirm
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)
    
    render(<TeamPage />)

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    // Find remove button for Jane (not John who is admin)
    const removeButtons = screen.getAllByRole('button', { name: 'Remove' })
    await user.click(removeButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Team member removed successfully.')).toBeInTheDocument()
    })

    confirmSpy.mockRestore()
  })

  it('does not allow removing owners', async () => {
    const membersWithOwner = [
      {
        id: 'member-1',
        full_name: 'Owner User',
        email: 'owner@example.com',
        role: 'owner',
        joined_at: '2023-01-01T00:00:00Z',
      },
    ]

    supabase.from = jest.fn().mockImplementation((table) => {
      if (table === 'memberships') {
        return {
          select: jest.fn().mockResolvedValue({
            data: membersWithOwner.map(member => ({
              ...member,
              users: { full_name: member.full_name, email: member.email },
            })),
            error: null,
          }),
        }
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      }
    })

    render(<TeamPage />)

    await waitFor(() => {
      expect(screen.getByText('Owner User')).toBeInTheDocument()
    })

    // Should not have remove button for owner
    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
  })

  it('handles invitation errors gracefully', async () => {
    // Mock invitation error
    supabase.from = jest.fn().mockImplementation((table) => {
      if (table === 'memberships') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }
      }
      if (table === 'invitations') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
          insert: jest.fn().mockReturnThis(),
        }
      }
      return {
        insert: jest.fn().mockResolvedValue({
          error: { message: 'Database error' },
        }),
      }
    })

    const user = userEvent.setup()
    render(<TeamPage />)

    await waitFor(() => {
      expect(screen.getByText('Team Management')).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText('Email Address')
    const submitButton = screen.getByRole('button', { name: 'Send Invitation' })

    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Failed to send invitation. Please try again.')).toBeInTheDocument()
    })
  })

  it('displays team member count correctly', async () => {
    render(<TeamPage />)

    await waitFor(() => {
      expect(screen.getByText('Team Members (2)')).toBeInTheDocument()
      expect(screen.getByText('Pending Invitations (1)')).toBeInTheDocument()
    })
  })

  it('shows empty state when no team members', async () => {
    supabase.from = jest.fn().mockImplementation((table) => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
      }

      if (table === 'memberships') {
        queryBuilder.select.mockResolvedValue({
          data: [],
          error: null,
        })
      } else if (table === 'invitations') {
        queryBuilder.eq.mockResolvedValue({
          data: [],
          error: null,
        })
      }

      return queryBuilder
    })

    render(<TeamPage />)

    await waitFor(() => {
      expect(screen.getByText('No team members yet.')).toBeInTheDocument()
    })
  })

  it('clears form after successful invitation', async () => {
    const user = userEvent.setup()
    render(<TeamPage />)

    await waitFor(() => {
      expect(screen.getByText('Team Management')).toBeInTheDocument()
    })

    const emailInput = screen.getByLabelText('Email Address')
    const submitButton = screen.getByRole('button', { name: 'Send Invitation' })

    await user.type(emailInput, 'newuser@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(emailInput).toHaveValue('')
    })
  })
})