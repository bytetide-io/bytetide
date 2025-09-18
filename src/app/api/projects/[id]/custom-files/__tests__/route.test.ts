import { NextRequest } from 'next/server'
import { POST, GET, DELETE } from '../route'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Mock Supabase
jest.mock('@/lib/supabase/server')
jest.mock('@supabase/supabase-js')

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockCreateSupabaseClient = createSupabaseClient as jest.MockedFunction<typeof createSupabaseClient>

// Mock data
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
}

const mockProject = {
  id: 'project-456',
  org_id: 'org-789',
}

const mockMembership = {
  org_id: 'org-789',
  role: 'admin',
}

const mockFiles = [
  {
    id: 'file-1',
    file_name: 'test1.csv',
    file_type: 'custom-csv',
    file_size: 1024,
    upload_date: '2023-01-01T00:00:00Z',
  },
  {
    id: 'file-2',
    file_name: 'test2.csv',
    file_type: 'custom-csv',
    file_size: 2048,
    upload_date: '2023-01-02T00:00:00Z',
  },
]

// Helper function to create mock clients
const createMockClients = (overrides = {}) => {
  const defaultMocks = {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: mockUser },
        error: null,
      }),
    },
    from: jest.fn().mockImplementation((table) => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn(),
      }

      if (table === 'projects') {
        queryBuilder.single.mockResolvedValue({
          data: mockProject,
          error: null,
        })
      } else if (table === 'memberships') {
        queryBuilder.single.mockResolvedValue({
          data: mockMembership,
          error: null,
        })
      } else if (table === 'project_files') {
        queryBuilder.order.mockResolvedValue({
          data: mockFiles,
          error: null,
        })
        queryBuilder.single.mockResolvedValue({
          data: { file_path: 'projects/project-456/test.csv' },
          error: null,
        })
        queryBuilder.insert.mockResolvedValue({
          error: null,
        })
        queryBuilder.delete.mockResolvedValue({
          error: null,
        })
      }

      return queryBuilder
    }),
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ error: null }),
        remove: jest.fn().mockResolvedValue({ error: null }),
      }),
    },
  }

  const mockClient = { ...defaultMocks, ...overrides }
  mockCreateClient.mockResolvedValue(mockClient)
  mockCreateSupabaseClient.mockReturnValue(mockClient)
  
  return mockClient
}

describe('/api/projects/[id]/custom-files', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    createMockClients()
  })

  const createParams = (projectId = 'project-456') => ({
    params: Promise.resolve({ id: projectId }),
  })

  describe('POST', () => {
    const createUploadRequest = (files = [new File(['test'], 'test.csv', { type: 'text/csv' })]) => {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      
      return new NextRequest('http://localhost:3000/api/projects/project-456/custom-files', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer test-token',
        },
      })
    }

    it('successfully uploads files', async () => {
      const files = [
        new File(['test1'], 'test1.csv', { type: 'text/csv' }),
        new File(['test2'], 'test2.csv', { type: 'text/csv' }),
      ]
      const request = createUploadRequest(files)
      const params = createParams()

      const response = await POST(request, params)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.results).toHaveLength(2)
      expect(data.results[0].success).toBe(true)
      expect(data.results[1].success).toBe(true)
    })

    it('returns 400 when no files provided', async () => {
      const request = createUploadRequest([])
      const params = createParams()

      const response = await POST(request, params)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('No files provided')
    })

    it('returns 401 when no authorization header', async () => {
      const formData = new FormData()
      formData.append('files', new File(['test'], 'test.csv'))
      
      const request = new NextRequest('http://localhost:3000/api/projects/project-456/custom-files', {
        method: 'POST',
        body: formData,
      })
      const params = createParams()

      const response = await POST(request, params)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Authorization header required')
    })

    it('returns 401 when user is not authenticated', async () => {
      createMockClients({
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'Not authenticated' },
          }),
        },
      })

      const request = createUploadRequest()
      const params = createParams()

      const response = await POST(request, params)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid authentication')
    })

    it('returns 404 when project not found', async () => {
      createMockClients({
        from: jest.fn().mockImplementation((table) => {
          if (table === 'projects') {
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }
          }
          return createMockClients().from(table)
        }),
      })

      const request = createUploadRequest()
      const params = createParams()

      const response = await POST(request, params)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Project not found')
    })

    it('returns 403 when user lacks permission', async () => {
      createMockClients({
        from: jest.fn().mockImplementation((table) => {
          if (table === 'memberships') {
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }
          }
          if (table === 'projects') {
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({
                data: mockProject,
                error: null,
              }),
            }
          }
          return createMockClients().from(table)
        }),
      })

      const request = createUploadRequest()
      const params = createParams()

      const response = await POST(request, params)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Access denied: You do not have permission to access this project')
    })

    it('rejects non-CSV files', async () => {
      const files = [new File(['test'], 'test.txt', { type: 'text/plain' })]
      const request = createUploadRequest(files)
      const params = createParams()

      const response = await POST(request, params)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.results[0].success).toBe(false)
      expect(data.results[0].error).toBe('Only CSV files are allowed for custom uploads')
    })

    it('rejects files larger than 50MB', async () => {
      // Create a mock file that appears to be larger than 50MB
      const largeFile = new File(['test'], 'large.csv', { type: 'text/csv' })
      Object.defineProperty(largeFile, 'size', { value: 51 * 1024 * 1024 })
      
      const request = createUploadRequest([largeFile])
      const params = createParams()

      const response = await POST(request, params)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.results[0].success).toBe(false)
      expect(data.results[0].error).toBe('File size must be less than 50MB')
    })

    it('handles storage upload errors', async () => {
      createMockClients({
        storage: {
          from: jest.fn().mockReturnValue({
            upload: jest.fn().mockResolvedValue({ 
              error: { message: 'Storage error' } 
            }),
          }),
        },
      })

      const request = createUploadRequest()
      const params = createParams()

      const response = await POST(request, params)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.results[0].success).toBe(false)
      expect(data.results[0].error).toBe('Storage error')
    })
  })

  describe('GET', () => {
    const createGetRequest = () => {
      return new NextRequest('http://localhost:3000/api/projects/project-456/custom-files', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token',
        },
      })
    }

    it('successfully retrieves custom files', async () => {
      const request = createGetRequest()
      const params = createParams()

      const response = await GET(request, params)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.files).toEqual(mockFiles)
    })

    it('returns 401 when no authorization header', async () => {
      const request = new NextRequest('http://localhost:3000/api/projects/project-456/custom-files', {
        method: 'GET',
      })
      const params = createParams()

      const response = await GET(request, params)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Authorization header required')
    })

    it('returns empty array when no files found', async () => {
      createMockClients({
        from: jest.fn().mockImplementation((table) => {
          if (table === 'project_files') {
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              order: jest.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }
          }
          return createMockClients().from(table)
        }),
      })

      const request = createGetRequest()
      const params = createParams()

      const response = await GET(request, params)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.files).toEqual([])
    })
  })

  describe('DELETE', () => {
    const createDeleteRequest = (fileId = 'file-1') => {
      return new NextRequest('http://localhost:3000/api/projects/project-456/custom-files', {
        method: 'DELETE',
        body: JSON.stringify({ fileId }),
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      })
    }

    it('successfully deletes a file', async () => {
      const request = createDeleteRequest()
      const params = createParams()

      const response = await DELETE(request, params)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('File deleted successfully')
    })

    it('returns 400 when fileId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/projects/project-456/custom-files', {
        method: 'DELETE',
        body: JSON.stringify({}),
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
      })
      const params = createParams()

      const response = await DELETE(request, params)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('File ID is required')
    })

    it('returns 403 when user lacks admin/owner role', async () => {
      createMockClients({
        from: jest.fn().mockImplementation((table) => {
          if (table === 'memberships') {
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({
                data: { ...mockMembership, role: 'member' },
                error: null,
              }),
            }
          }
          if (table === 'projects') {
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({
                data: mockProject,
                error: null,
              }),
            }
          }
          return createMockClients().from(table)
        }),
      })

      const request = createDeleteRequest()
      const params = createParams()

      const response = await DELETE(request, params)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Insufficient permissions to delete files')
    })

    it('returns 404 when file not found', async () => {
      createMockClients({
        from: jest.fn().mockImplementation((table) => {
          if (table === 'project_files' && arguments.length > 1) {
            // File lookup call
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }
          }
          return createMockClients().from(table)
        }),
      })

      const request = createDeleteRequest()
      const params = createParams()

      const response = await DELETE(request, params)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('File not found')
    })

    it('continues deletion even if storage cleanup fails', async () => {
      createMockClients({
        storage: {
          from: jest.fn().mockReturnValue({
            remove: jest.fn().mockResolvedValue({ 
              error: { message: 'Storage error' } 
            }),
          }),
        },
      })

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const request = createDeleteRequest()
      const params = createParams()

      const response = await DELETE(request, params)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(consoleSpy).toHaveBeenCalledWith('Storage deletion error:', expect.any(Object))

      consoleSpy.mockRestore()
    })

    it('handles database deletion errors', async () => {
      createMockClients({
        from: jest.fn().mockImplementation((table) => {
          if (table === 'project_files') {
            // First call for file lookup
            const firstCall = {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({
                data: { file_path: 'projects/project-456/test.csv' },
                error: null,
              }),
            }
            
            // Return different mock based on how it's being used
            if (arguments.length === 1) {
              return firstCall
            }
            
            return {
              delete: jest.fn().mockReturnThis(),
              eq: jest.fn().mockResolvedValue({
                error: { message: 'Database error' },
              }),
            }
          }
          return createMockClients().from(table)
        }),
      })

      const request = createDeleteRequest()
      const params = createParams()

      const response = await DELETE(request, params)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Database error')
    })
  })
})