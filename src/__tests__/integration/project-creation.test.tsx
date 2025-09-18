import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewProjectForm } from '@/components/forms/project/NewProjectForm'
import { OrganizationProvider } from '@/lib/contexts/OrganizationContext'
import { supabase } from '@/lib/supabase/client'

// Mock Supabase
jest.mock('@/lib/supabase/client')

// Mock the organization context data
const mockOrganization = {
  id: 'org-123',
  name: 'Test Organization',
}

const mockPlatforms = [
  {
    id: 'platform-csv',
    name: 'CSV Platform',
    files: ['products', 'customers'],
    api: null,
    plugin: null,
  },
  {
    id: 'platform-api',
    name: 'API Platform',
    files: null,
    api: {
      api_key: { label: 'API Key', type: 'password', placeholder: 'Enter API key' },
      api_secret: { label: 'API Secret', type: 'password', placeholder: 'Enter secret' },
    },
    plugin: null,
  },
]

const mockProject = {
  id: 'project-123',
  org_id: 'org-123',
  status: 'submitted',
}

describe('Project Creation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock Supabase responses
    supabase.from = jest.fn().mockImplementation((table) => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn(),
      }

      if (table === 'platforms') {
        queryBuilder.order.mockResolvedValue({
          data: mockPlatforms,
          error: null,
        })
      } else if (table === 'projects') {
        queryBuilder.insert.mockReturnThis()
        queryBuilder.select.mockReturnThis()
        queryBuilder.single.mockResolvedValue({
          data: mockProject,
          error: null,
        })
      } else if (table === 'project_files') {
        queryBuilder.insert.mockResolvedValue({
          error: null,
        })
      }

      return queryBuilder
    })

    supabase.storage = {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
      })),
    }

    supabase.auth = {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      }),
    }
  })

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <OrganizationProvider>
        {component}
      </OrganizationProvider>
    )
  }

  it('completes full project creation flow with CSV migration', async () => {
    const user = userEvent.setup()
    const mockOnSuccess = jest.fn()
    
    renderWithProvider(<NewProjectForm onSuccess={mockOnSuccess} />)

    // Wait for platforms to load
    await waitFor(() => {
      expect(screen.getByText('CSV Platform')).toBeInTheDocument()
    })

    // Step 1: Basic Info
    const domainInput = screen.getByLabelText(/source store domain/i)
    await user.type(domainInput, 'example.com')

    // Select CSV platform
    await user.click(screen.getByText('CSV Platform'))

    // Continue to step 2
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Step 2: Shopify Setup
    await waitFor(() => {
      expect(screen.getByLabelText(/shopify store url/i)).toBeInTheDocument()
    })

    const shopifyUrlInput = screen.getByLabelText(/shopify store url/i)
    const accessTokenInput = screen.getByLabelText(/shopify access token/i)

    await user.type(shopifyUrlInput, 'test.myshopify.com')
    await user.type(accessTokenInput, 'shpat_test_token')

    // Select data types
    await user.click(screen.getByLabelText(/products/i))
    await user.click(screen.getByLabelText(/customers/i))

    // Continue to step 3
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Step 3: File Upload
    await waitFor(() => {
      expect(screen.getByText(/upload your files/i)).toBeInTheDocument()
    })

    // Mock file uploads
    const file1 = new File(['csv content 1'], 'products.csv', { type: 'text/csv' })
    const file2 = new File(['csv content 2'], 'customers.csv', { type: 'text/csv' })

    const fileInput = screen.getByLabelText(/choose files/i)
    await user.upload(fileInput, [file1, file2])

    // Map files to types
    await waitFor(() => {
      expect(screen.getByText('products.csv')).toBeInTheDocument()
    })

    // Continue to review
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Step 4: Review
    await waitFor(() => {
      expect(screen.getByText(/review your project/i)).toBeInTheDocument()
      expect(screen.getByText('example.com')).toBeInTheDocument()
      expect(screen.getByText('test.myshopify.com')).toBeInTheDocument()
    })

    // Submit project
    await user.click(screen.getByRole('button', { name: /create project/i }))

    // Verify successful submission
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith('project-123')
    })
  })

  it('completes full project creation flow with API migration', async () => {
    const user = userEvent.setup()
    const mockOnSuccess = jest.fn()
    
    renderWithProvider(<NewProjectForm onSuccess={mockOnSuccess} />)

    // Wait for platforms to load
    await waitFor(() => {
      expect(screen.getByText('API Platform')).toBeInTheDocument()
    })

    // Step 1: Basic Info
    const domainInput = screen.getByLabelText(/source store domain/i)
    await user.type(domainInput, 'api-store.com')

    // Select API platform
    await user.click(screen.getByText('API Platform'))

    // Continue to step 2
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Step 2: Shopify Setup
    await waitFor(() => {
      expect(screen.getByLabelText(/shopify store url/i)).toBeInTheDocument()
    })

    const shopifyUrlInput = screen.getByLabelText(/shopify store url/i)
    const accessTokenInput = screen.getByLabelText(/shopify access token/i)

    await user.type(shopifyUrlInput, 'api-test.myshopify.com')
    await user.type(accessTokenInput, 'shpat_api_token')

    // Select data types
    await user.click(screen.getByLabelText(/products/i))

    // Continue to step 3
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Step 3: API Configuration
    await waitFor(() => {
      expect(screen.getByLabelText(/api key/i)).toBeInTheDocument()
    })

    const apiKeyInput = screen.getByLabelText(/api key/i)
    const apiSecretInput = screen.getByLabelText(/api secret/i)

    await user.type(apiKeyInput, 'test-api-key')
    await user.type(apiSecretInput, 'test-api-secret')

    // Continue to review
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Step 4: Review
    await waitFor(() => {
      expect(screen.getByText(/review your project/i)).toBeInTheDocument()
      expect(screen.getByText('api-store.com')).toBeInTheDocument()
      expect(screen.getByText('api-test.myshopify.com')).toBeInTheDocument()
    })

    // Submit project
    await user.click(screen.getByRole('button', { name: /create project/i }))

    // Verify successful submission
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith('project-123')
    })
  })

  it('handles validation errors throughout the flow', async () => {
    const user = userEvent.setup()
    
    renderWithProvider(<NewProjectForm />)

    // Wait for platforms to load
    await waitFor(() => {
      expect(screen.getByText('CSV Platform')).toBeInTheDocument()
    })

    // Try to continue without domain
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/domain is required/i)).toBeInTheDocument()
      expect(screen.getByText(/source platform is required/i)).toBeInTheDocument()
    })

    // Fix domain but leave platform empty
    const domainInput = screen.getByLabelText(/source store domain/i)
    await user.type(domainInput, 'invalid-domain')

    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Should show domain format error
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid domain/i)).toBeInTheDocument()
    })

    // Fix validation errors
    await user.clear(domainInput)
    await user.type(domainInput, 'example.com')
    await user.click(screen.getByText('CSV Platform'))

    // Now should be able to continue
    await user.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(screen.getByLabelText(/shopify store url/i)).toBeInTheDocument()
    })
  })

  it('handles submission errors gracefully', async () => {
    const user = userEvent.setup()
    
    // Mock submission error
    supabase.from = jest.fn().mockImplementation((table) => {
      if (table === 'platforms') {
        return {
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: mockPlatforms,
            error: null,
          }),
        }
      } else if (table === 'projects') {
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }
      }
      return {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn(),
      }
    })
    
    renderWithProvider(<NewProjectForm />)

    // Complete the flow quickly
    await waitFor(() => {
      expect(screen.getByText('CSV Platform')).toBeInTheDocument()
    })

    // Fill basic info
    await user.type(screen.getByLabelText(/source store domain/i), 'example.com')
    await user.click(screen.getByText('CSV Platform'))
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Fill Shopify info
    await waitFor(() => {
      expect(screen.getByLabelText(/shopify store url/i)).toBeInTheDocument()
    })
    
    await user.type(screen.getByLabelText(/shopify store url/i), 'test.myshopify.com')
    await user.type(screen.getByLabelText(/shopify access token/i), 'shpat_test')
    await user.click(screen.getByLabelText(/products/i))
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Skip file upload for this test
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Try to submit
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: /create project/i }))

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/failed to upload files/i)).toBeInTheDocument()
    })
  })

  it('allows navigation between steps', async () => {
    const user = userEvent.setup()
    
    renderWithProvider(<NewProjectForm />)

    await waitFor(() => {
      expect(screen.getByText('CSV Platform')).toBeInTheDocument()
    })

    // Complete step 1
    await user.type(screen.getByLabelText(/source store domain/i), 'example.com')
    await user.click(screen.getByText('CSV Platform'))
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Complete step 2
    await waitFor(() => {
      expect(screen.getByLabelText(/shopify store url/i)).toBeInTheDocument()
    })
    
    await user.type(screen.getByLabelText(/shopify store url/i), 'test.myshopify.com')
    await user.type(screen.getByLabelText(/shopify access token/i), 'shpat_test')
    await user.click(screen.getByLabelText(/products/i))
    await user.click(screen.getByRole('button', { name: /continue/i }))

    // Go to step 3
    await waitFor(() => {
      expect(screen.getByText(/upload your files/i)).toBeInTheDocument()
    })

    // Go back to step 2
    await user.click(screen.getByRole('button', { name: /back/i }))

    await waitFor(() => {
      expect(screen.getByLabelText(/shopify store url/i)).toBeInTheDocument()
      expect(screen.getByDisplayValue('test.myshopify.com')).toBeInTheDocument()
    })

    // Go back to step 1
    await user.click(screen.getByRole('button', { name: /back/i }))

    await waitFor(() => {
      expect(screen.getByDisplayValue('example.com')).toBeInTheDocument()
    })
  })
})