import { renderHook, act, waitFor } from '@testing-library/react'
import { useProjectForm } from '../useProjectForm'
import { supabase } from '@/lib/supabase/client'

// Mock Supabase
const mockPlatforms = [
  {
    id: 'platform-1',
    name: 'Shopify',
    files: ['products', 'customers'],
    api: null,
    plugin: null,
  },
  {
    id: 'platform-2', 
    name: 'WooCommerce',
    files: null,
    api: {
      api_key: { label: 'API Key', type: 'password', placeholder: 'Enter API key' },
      api_secret: { label: 'API Secret', type: 'password', placeholder: 'Enter API secret' },
    },
    plugin: null,
  },
  {
    id: 'platform-3',
    name: 'Custom',
    files: null,
    api: null,
    plugin: null,
  },
]

const mockProject = {
  id: 'project-123',
  org_id: 'org-1',
  status: 'submitted',
}

describe('useProjectForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default Supabase mocks
    supabase.from = jest.fn().mockImplementation((table) => {
      if (table === 'platforms') {
        return {
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: mockPlatforms,
            error: null,
          }),
        }
      }
      if (table === 'projects') {
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: mockProject,
            error: null,
          }),
          delete: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
        }
      }
      if (table === 'project_files') {
        return {
          insert: jest.fn().mockReturnThis(),
        }
      }
      return {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
        order: jest.fn().mockReturnThis(),
      }
    })

    supabase.storage = {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
        remove: jest.fn().mockResolvedValue({ error: null }),
      })),
    }
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useProjectForm())
    const [state] = result.current

    expect(state.step).toBe(1)
    expect(state.loading).toBe(false)
    expect(state.platformsLoading).toBe(true)
    expect(state.selectedPlatform).toBe('')
    expect(state.formData.domain).toBe('')
    expect(state.formData.shopify_url).toBe('')
    expect(state.files).toEqual([])
    expect(state.additionalFiles).toEqual([])
    expect(state.errors).toEqual({})
  })

  it('fetches platforms on mount', async () => {
    const { result } = renderHook(() => useProjectForm())

    await waitFor(() => {
      const [state] = result.current
      expect(state.platformsLoading).toBe(false)
      expect(state.platforms).toEqual(mockPlatforms)
    })
  })

  it('sets selected platform correctly', async () => {
    const { result } = renderHook(() => useProjectForm())
    
    await waitFor(() => {
      const [state] = result.current
      expect(state.platformsLoading).toBe(false)
    })

    act(() => {
      const [, actions] = result.current
      actions.setSelectedPlatform('platform-1')
    })

    const [state] = result.current
    expect(state.selectedPlatform).toBe('platform-1')
    expect(state.formData.source_platform).toBe('platform-1')
    expect(state.platform).toEqual(mockPlatforms[0])
    expect(state.isCSVMigration).toBe(true)
    expect(state.requiresFiles).toBe(true)
  })

  it('updates form data correctly', () => {
    const { result } = renderHook(() => useProjectForm())

    act(() => {
      const [, actions] = result.current
      actions.updateFormData({
        domain: 'example.com',
        shopify_url: 'test.myshopify.com',
      })
    })

    const [state] = result.current
    expect(state.formData.domain).toBe('example.com')
    expect(state.formData.shopify_url).toBe('test.myshopify.com')
  })

  it('validates step 1 correctly', async () => {
    const { result } = renderHook(() => useProjectForm())
    
    await waitFor(() => {
      const [state] = result.current
      expect(state.platformsLoading).toBe(false)
    })

    // Test invalid domain
    act(() => {
      const [, actions] = result.current
      actions.updateFormData({ domain: '' })
      const isValid = actions.validateStep(1)
      expect(isValid).toBe(false)
    })

    let [state] = result.current
    expect(state.errors.domain).toBe('Domain is required')

    // Test missing platform
    act(() => {
      const [, actions] = result.current
      actions.updateFormData({ domain: 'example.com' })
      const isValid = actions.validateStep(1)
      expect(isValid).toBe(false)
    })

    state = result.current[0]
    expect(state.errors.source_platform).toBe('Source platform is required')

    // Test valid step 1
    act(() => {
      const [, actions] = result.current
      actions.setSelectedPlatform('platform-1')
      actions.updateFormData({ domain: 'example.com' })
      const isValid = actions.validateStep(1)
      expect(isValid).toBe(true)
    })

    state = result.current[0]
    expect(Object.keys(state.errors)).toHaveLength(0)
  })

  it('validates step 2 correctly', () => {
    const { result } = renderHook(() => useProjectForm())

    // Test missing Shopify URL
    act(() => {
      const [, actions] = result.current
      actions.updateFormData({ shopify_url: '' })
      const isValid = actions.validateStep(2)
      expect(isValid).toBe(false)
    })

    let [state] = result.current
    expect(state.errors.shopify_url).toBe('Shopify URL is required')

    // Test missing access token
    act(() => {
      const [, actions] = result.current
      actions.updateFormData({ 
        shopify_url: 'test.myshopify.com',
        shopify_access_token: ''
      })
      const isValid = actions.validateStep(2)
      expect(isValid).toBe(false)
    })

    state = result.current[0]
    expect(state.errors.shopify_access_token).toBe('Shopify access token is required')

    // Test missing items
    act(() => {
      const [, actions] = result.current
      actions.updateFormData({ 
        shopify_url: 'test.myshopify.com',
        shopify_access_token: 'shpat_test',
        items: []
      })
      const isValid = actions.validateStep(2)
      expect(isValid).toBe(false)
    })

    state = result.current[0]
    expect(state.errors.items).toBe('Please select at least one data type to migrate')

    // Test valid step 2
    act(() => {
      const [, actions] = result.current
      actions.updateFormData({ 
        shopify_url: 'test.myshopify.com',
        shopify_access_token: 'shpat_test',
        items: ['product', 'customer']
      })
      const isValid = actions.validateStep(2)
      expect(isValid).toBe(true)
    })

    state = result.current[0]
    expect(Object.keys(state.errors)).toHaveLength(0)
  })

  it('validates step 3 for CSV migration', async () => {
    const { result } = renderHook(() => useProjectForm())
    
    await waitFor(() => {
      const [state] = result.current
      expect(state.platformsLoading).toBe(false)
    })

    // Set up CSV migration platform
    act(() => {
      const [, actions] = result.current
      actions.setSelectedPlatform('platform-1') // Has files: ['products', 'customers']
    })

    // Test missing files
    act(() => {
      const [, actions] = result.current
      const isValid = actions.validateStep(3)
      expect(isValid).toBe(false)
    })

    let [state] = result.current
    expect(state.errors.files).toBe('Please upload the required files')

    // Test missing required file types
    act(() => {
      const [, actions] = result.current
      actions.setFiles([
        { 
          name: 'test.csv', 
          file: new File([''], 'test.csv'),
          selectedType: 'products', // Missing 'customers'
          customName: '',
          description: ''
        }
      ])
      const isValid = actions.validateStep(3)
      expect(isValid).toBe(false)
    })

    state = result.current[0]
    expect(state.errors.files).toBe('Please upload files for: customers')

    // Test valid CSV migration
    act(() => {
      const [, actions] = result.current
      actions.setFiles([
        { 
          name: 'products.csv', 
          file: new File([''], 'products.csv'),
          selectedType: 'products',
          customName: '',
          description: ''
        },
        { 
          name: 'customers.csv', 
          file: new File([''], 'customers.csv'),
          selectedType: 'customers',
          customName: '',
          description: ''
        }
      ])
      const isValid = actions.validateStep(3)
      expect(isValid).toBe(true)
    })

    state = result.current[0]
    expect(Object.keys(state.errors)).toHaveLength(0)
  })

  it('validates step 3 for API migration', async () => {
    const { result } = renderHook(() => useProjectForm())
    
    await waitFor(() => {
      const [state] = result.current
      expect(state.platformsLoading).toBe(false)
    })

    // Set up API migration platform
    act(() => {
      const [, actions] = result.current
      actions.setSelectedPlatform('platform-2') // Has API credentials
    })

    // Test missing API credentials
    act(() => {
      const [, actions] = result.current
      const isValid = actions.validateStep(3)
      expect(isValid).toBe(false)
    })

    let [state] = result.current
    expect(state.errors.api_api_key).toBe('api_key is required')
    expect(state.errors.api_api_secret).toBe('api_secret is required')

    // Test valid API migration
    act(() => {
      const [, actions] = result.current
      actions.updateFormData({
        api: {
          api_key: 'test-key',
          api_secret: 'test-secret'
        }
      })
      const isValid = actions.validateStep(3)
      expect(isValid).toBe(true)
    })

    state = result.current[0]
    expect(Object.keys(state.errors)).toHaveLength(0)
  })

  it('navigates steps correctly', async () => {
    const { result } = renderHook(() => useProjectForm())
    
    await waitFor(() => {
      const [state] = result.current
      expect(state.platformsLoading).toBe(false)
    })

    // Set up valid step 1
    act(() => {
      const [, actions] = result.current
      actions.setSelectedPlatform('platform-1')
      actions.updateFormData({ domain: 'example.com' })
      actions.nextStep()
    })

    let [state] = result.current
    expect(state.step).toBe(2)

    // Go back
    act(() => {
      const [, actions] = result.current
      actions.prevStep()
    })

    state = result.current[0]
    expect(state.step).toBe(1)
  })

  it('skips step 3 when no files or API needed', async () => {
    const { result } = renderHook(() => useProjectForm())
    
    await waitFor(() => {
      const [state] = result.current
      expect(state.platformsLoading).toBe(false)
    })

    // Set up custom platform (no files or API)
    act(() => {
      const [, actions] = result.current
      actions.setSelectedPlatform('platform-3')
      actions.updateFormData({ 
        domain: 'example.com',
        shopify_url: 'test.myshopify.com',
        shopify_access_token: 'shpat_test',
        items: ['product']
      })
      actions.setStep(2)
      actions.nextStep()
    })

    const [state] = result.current
    expect(state.step).toBe(4) // Should skip step 3
  })

  it('submits project successfully', async () => {
    const { result } = renderHook(() => useProjectForm())
    
    await waitFor(() => {
      const [state] = result.current
      expect(state.platformsLoading).toBe(false)
    })

    act(() => {
      const [, actions] = result.current
      actions.updateFormData({
        domain: 'example.com',
        shopify_url: 'test.myshopify.com',
        shopify_access_token: 'shpat_test',
        items: ['product'],
        source_platform: 'platform-1'
      })
    })

    let projectId
    await act(async () => {
      const [, actions] = result.current
      projectId = await actions.submitProject('org-1')
    })

    expect(projectId).toBe('project-123')
    expect(supabase.from).toHaveBeenCalledWith('projects')
  })

  it('handles project submission errors', async () => {
    const { result } = renderHook(() => useProjectForm())
    
    // Mock error response
    supabase.from = jest.fn().mockImplementation((table) => {
      if (table === 'platforms') {
        return {
          select: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: mockPlatforms,
            error: null,
          }),
        }
      }
      if (table === 'projects') {
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }
      }
      return {}
    })
    
    await waitFor(() => {
      const [state] = result.current
      expect(state.platformsLoading).toBe(false)
    })

    await expect(async () => {
      await act(async () => {
        const [, actions] = result.current
        await actions.submitProject('org-1')
      })
    }).rejects.toThrow()
  })

  it('computes migration types correctly', async () => {
    const { result } = renderHook(() => useProjectForm())
    
    await waitFor(() => {
      const [state] = result.current
      expect(state.platformsLoading).toBe(false)
    })

    // Test CSV migration
    act(() => {
      const [, actions] = result.current
      actions.setSelectedPlatform('platform-1') // Has files
    })

    let [state] = result.current
    expect(state.isCSVMigration).toBe(true)
    expect(state.isAPIMigration).toBe(false)
    expect(state.isCustomMigration).toBe(false)
    expect(state.requiresFiles).toBe(true)
    expect(state.requiresAPI).toBe(false)

    // Test API migration
    act(() => {
      const [, actions] = result.current
      actions.setSelectedPlatform('platform-2') // Has API
    })

    state = result.current[0]
    expect(state.isCSVMigration).toBe(false)
    expect(state.isAPIMigration).toBe(true)
    expect(state.isCustomMigration).toBe(false)
    expect(state.requiresFiles).toBe(false)
    expect(state.requiresAPI).toBe(true)

    // Test custom migration
    act(() => {
      const [, actions] = result.current
      actions.setSelectedPlatform('platform-3') // No files or API
    })

    state = result.current[0]
    expect(state.isCSVMigration).toBe(false)
    expect(state.isAPIMigration).toBe(false)
    expect(state.isCustomMigration).toBe(true)
    expect(state.requiresFiles).toBe(true)
    expect(state.requiresAPI).toBe(false)
  })
})