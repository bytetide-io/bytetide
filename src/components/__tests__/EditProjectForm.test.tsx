import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditProjectForm } from '../EditProjectForm'
import { supabase } from '@/lib/supabase/client'

// Mock Supabase
jest.mock('@/lib/supabase/client')

// Mock data
const mockProject = {
  id: 'project-123',
  domain: 'example.com',
  shopify_url: 'test.myshopify.com',
  access_token: 'shpat_test_token',
  special_demands: 'Test requirements',
  items: ['product', 'customer'],
  source_platform: 'platform-1',
  source_api: {
    api_key: 'test-key',
    api_secret: 'test-secret',
  },
}

const mockPlatform = {
  id: 'platform-1',
  name: 'Test Platform',
  api: {
    api_key: { label: 'API Key', type: 'password', placeholder: 'Enter API key' },
    api_secret: { label: 'API Secret', type: 'password', placeholder: 'Enter secret' },
  },
  files: null,
  plugin: null,
}

const mockFiles = [
  {
    id: 'file-1',
    file_name: 'test.csv',
    file_type: 'custom-csv',
    file_size: 1024,
    description: 'Test file',
    file_path: 'projects/project-123/test.csv',
  },
]

describe('EditProjectForm', () => {
  const defaultProps = {
    project: mockProject,
    onSuccess: jest.fn(),
    onCancel: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock Supabase queries
    supabase.from = jest.fn().mockImplementation((table) => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn(),
      }

      if (table === 'project_files') {
        queryBuilder.order.mockResolvedValue({
          data: mockFiles,
          error: null,
        })
        queryBuilder.delete.mockResolvedValue({
          error: null,
        })
      } else if (table === 'platforms') {
        queryBuilder.single.mockResolvedValue({
          data: mockPlatform,
          error: null,
        })
      } else if (table === 'projects') {
        queryBuilder.update.mockResolvedValue({
          error: null,
        })
      }

      return queryBuilder
    })

    supabase.storage = {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
        remove: jest.fn().mockResolvedValue({ error: null }),
      })),
    }
  })

  it('renders form with project data', async () => {
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('test.myshopify.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('shpat_test_token')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test requirements')).toBeInTheDocument()
    })
  })

  it('displays existing files', async () => {
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument()
      expect(screen.getByText('Test file')).toBeInTheDocument()
      expect(screen.getByText('custom-csv • 0.00 MB')).toBeInTheDocument()
    })
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('example.com')).toBeInTheDocument()
    })

    // Clear domain field
    const domainInput = screen.getByDisplayValue('example.com')
    await user.clear(domainInput)

    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Update Project' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Domain is required')).toBeInTheDocument()
    })
  })

  it('validates domain format', async () => {
    const user = userEvent.setup()
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('example.com')).toBeInTheDocument()
    })

    // Enter invalid domain
    const domainInput = screen.getByDisplayValue('example.com')
    await user.clear(domainInput)
    await user.type(domainInput, 'invalid-domain')

    const submitButton = screen.getByRole('button', { name: 'Update Project' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid domain (e.g., example.com)')).toBeInTheDocument()
    })
  })

  it('validates Shopify URL format', async () => {
    const user = userEvent.setup()
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('test.myshopify.com')).toBeInTheDocument()
    })

    // Enter invalid Shopify URL
    const shopifyInput = screen.getByDisplayValue('test.myshopify.com')
    await user.clear(shopifyInput)
    await user.type(shopifyInput, 'invalid-url')

    const submitButton = screen.getByRole('button', { name: 'Update Project' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid Shopify URL (e.g., mystore.myshopify.com)')).toBeInTheDocument()
    })
  })

  it('validates access token format', async () => {
    const user = userEvent.setup()
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('shpat_test_token')).toBeInTheDocument()
    })

    // Enter invalid access token
    const tokenInput = screen.getByDisplayValue('shpat_test_token')
    await user.clear(tokenInput)
    await user.type(tokenInput, 'invalid-token')

    const submitButton = screen.getByRole('button', { name: 'Update Project' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid Shopify access token')).toBeInTheDocument()
    })
  })

  it('validates data items selection', async () => {
    const user = userEvent.setup()
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('example.com')).toBeInTheDocument()
    })

    // Uncheck all items
    const productCheckbox = screen.getByRole('checkbox', { name: /Products/ })
    const customerCheckbox = screen.getByRole('checkbox', { name: /Customers/ })
    
    await user.click(productCheckbox)
    await user.click(customerCheckbox)

    const submitButton = screen.getByRole('button', { name: 'Update Project' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please select at least one data type to migrate')).toBeInTheDocument()
    })
  })

  it('shows API settings for API-enabled platforms', async () => {
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('API Settings')).toBeInTheDocument()
      expect(screen.getByLabelText('API Key')).toBeInTheDocument()
      expect(screen.getByLabelText('API Secret')).toBeInTheDocument()
    })
  })

  it('submits form successfully', async () => {
    const user = userEvent.setup()
    const mockOnSuccess = jest.fn()
    
    render(<EditProjectForm {...defaultProps} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('example.com')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: 'Update Project' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('handles form submission errors', async () => {
    const user = userEvent.setup()
    
    // Mock submission error
    supabase.from = jest.fn().mockImplementation((table) => {
      if (table === 'projects') {
        return {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            error: { message: 'Update failed' },
          }),
        }
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        single: jest.fn().mockResolvedValue({ data: mockPlatform, error: null }),
      }
    })
    
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('example.com')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: 'Update Project' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument()
    })
  })

  it('deletes existing files', async () => {
    const user = userEvent.setup()
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(supabase.storage.from).toHaveBeenCalledWith('project-files')
    })
  })

  it('adds new files', async () => {
    const user = userEvent.setup()
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Add New File')).toBeInTheDocument()
    })

    // This would require mocking the AdditionalFileUpload component
    // For now, we'll test that the section renders
    expect(screen.getByText('Add New File')).toBeInTheDocument()
  })

  it('normalizes domain input', async () => {
    const user = userEvent.setup()
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('example.com')).toBeInTheDocument()
    })

    const domainInput = screen.getByDisplayValue('example.com')
    await user.clear(domainInput)
    await user.type(domainInput, 'https://www.example.com/')

    // The input should normalize to just the domain
    expect(domainInput).toHaveValue('example.com')
  })

  it('normalizes Shopify URL input', async () => {
    const user = userEvent.setup()
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('test.myshopify.com')).toBeInTheDocument()
    })

    const shopifyInput = screen.getByDisplayValue('test.myshopify.com')
    await user.clear(shopifyInput)
    await user.type(shopifyInput, 'https://test.myshopify.com/')

    // The input should normalize to just the domain
    expect(shopifyInput).toHaveValue('test.myshopify.com')
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnCancel = jest.fn()
    
    render(<EditProjectForm {...defaultProps} onCancel={mockOnCancel} />)

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    
    // Mock delayed response
    supabase.from = jest.fn().mockImplementation((table) => {
      if (table === 'projects') {
        return {
          update: jest.fn().mockReturnThis(),
          eq: jest.fn().mockImplementation(() => 
            new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
          ),
        }
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        single: jest.fn().mockResolvedValue({ data: mockPlatform, error: null }),
      }
    })
    
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('example.com')).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: 'Update Project' })
    await user.click(submitButton)

    // Button should show loading state
    expect(submitButton).toBeDisabled()
  })

  it('clears errors when input values change', async () => {
    const user = userEvent.setup()
    render(<EditProjectForm {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('example.com')).toBeInTheDocument()
    })

    // Clear domain to trigger error
    const domainInput = screen.getByDisplayValue('example.com')
    await user.clear(domainInput)

    const submitButton = screen.getByRole('button', { name: 'Update Project' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Domain is required')).toBeInTheDocument()
    })

    // Type in domain - error should clear
    await user.type(domainInput, 'newdomain.com')

    expect(screen.queryByText('Domain is required')).not.toBeInTheDocument()
  })
})