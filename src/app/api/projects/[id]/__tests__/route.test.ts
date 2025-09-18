import { NextRequest } from 'next/server'
import { DELETE } from '../route'
import { createClient } from '@/lib/supabase/server'

// Mock Supabase
jest.mock('@/lib/supabase/server')
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

// Mock data
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
}

const mockProject = {
  id: 'project-456',
  status: 'submitted',
  org_id: 'org-789',
}

const mockMembership = {
  org_id: 'org-789',
}

const mockProjectFiles = [
  { file_path: 'projects/project-456/file1.csv' },
  { file_path: 'projects/project-456/file2.csv' },
]

const mockPreviewFiles = [
  { file_path: 'previews/project-456/preview1.json' },
]

// Helper function to create mock Supabase client
const createMockSupabaseClient = (overrides = {}) => {
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
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
        delete: jest.fn().mockReturnThis(),
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
        queryBuilder.single.mockResolvedValue({
          data: mockProjectFiles,
          error: null,
        })
        queryBuilder.delete.mockResolvedValue({
          error: null,
        })
      } else if (table === 'preview_files') {
        queryBuilder.single.mockResolvedValue({
          data: mockPreviewFiles,
          error: null,
        })
        queryBuilder.delete.mockResolvedValue({
          error: null,
        })
      } else if (table === 'previews') {
        queryBuilder.delete.mockResolvedValue({
          error: null,
        })
      }

      return queryBuilder
    }),
    storage: {
      from: jest.fn().mockReturnValue({
        remove: jest.fn().mockResolvedValue({ error: null }),
      }),
    },
  }

  return { ...defaultMocks, ...overrides }
}

describe('/api/projects/[id] DELETE', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateClient.mockResolvedValue(createMockSupabaseClient())
  })

  const createRequest = (projectId = 'project-456') => {
    return new NextRequest(`http://localhost:3000/api/projects/${projectId}`, {
      method: 'DELETE',
    })
  }

  const createParams = (projectId = 'project-456') => ({
    params: Promise.resolve({ id: projectId }),
  })

  it('successfully deletes a project', async () => {
    const request = createRequest()
    const params = createParams()

    const response = await DELETE(request, params)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Project deleted successfully')
  })

  it('returns 400 when project ID is missing', async () => {
    const request = createRequest('')
    const params = createParams('')

    const response = await DELETE(request, params)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Project ID is required')
  })

  it('returns 401 when user is not authenticated', async () => {
    mockCreateClient.mockResolvedValue(createMockSupabaseClient({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Not authenticated' },
        }),
      },
    }))

    const request = createRequest()
    const params = createParams()

    const response = await DELETE(request, params)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Authentication required')
  })

  it('returns 404 when project is not found', async () => {
    mockCreateClient.mockResolvedValue(createMockSupabaseClient({
      from: jest.fn().mockImplementation((table) => {
        if (table === 'projects') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }
        }
        return createMockSupabaseClient().from(table)
      }),
    }))

    const request = createRequest()
    const params = createParams()

    const response = await DELETE(request, params)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Project not found')
  })

  it('returns 403 when user does not have access to project', async () => {
    mockCreateClient.mockResolvedValue(createMockSupabaseClient({
      from: jest.fn().mockImplementation((table) => {
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
        if (table === 'memberships') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'No membership found' },
            }),
          }
        }
        return createMockSupabaseClient().from(table)
      }),
    }))

    const request = createRequest()
    const params = createParams()

    const response = await DELETE(request, params)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toBe('Access denied: You do not have permission to delete this project')
  })

  it('returns 400 when project status is not submitted', async () => {
    const projectWithWrongStatus = { ...mockProject, status: 'in_progress' }
    
    mockCreateClient.mockResolvedValue(createMockSupabaseClient({
      from: jest.fn().mockImplementation((table) => {
        if (table === 'projects') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: projectWithWrongStatus,
              error: null,
            }),
          }
        }
        if (table === 'memberships') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockMembership,
              error: null,
            }),
          }
        }
        return createMockSupabaseClient().from(table)
      }),
    }))

    const request = createRequest()
    const params = createParams()

    const response = await DELETE(request, params)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Project can only be deleted when status is "submitted"')
    expect(data.currentStatus).toBe('in_progress')
  })

  it('deletes all related files and data', async () => {
    const mockSupabase = createMockSupabaseClient()
    mockCreateClient.mockResolvedValue(mockSupabase)

    const request = createRequest()
    const params = createParams()

    await DELETE(request, params)

    // Verify project files are deleted
    expect(mockSupabase.from).toHaveBeenCalledWith('project_files')
    expect(mockSupabase.storage.from).toHaveBeenCalledWith('project-files')

    // Verify preview files are deleted
    expect(mockSupabase.from).toHaveBeenCalledWith('preview_files')
    expect(mockSupabase.storage.from).toHaveBeenCalledWith('preview-files')

    // Verify previews are deleted
    expect(mockSupabase.from).toHaveBeenCalledWith('previews')

    // Verify project is deleted
    expect(mockSupabase.from).toHaveBeenCalledWith('projects')
  })

  it('continues deletion even if storage cleanup fails', async () => {
    const mockSupabase = createMockSupabaseClient({
      storage: {
        from: jest.fn().mockReturnValue({
          remove: jest.fn().mockResolvedValue({ 
            error: { message: 'Storage error' } 
          }),
        }),
      },
    })
    mockCreateClient.mockResolvedValue(mockSupabase)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const request = createRequest()
    const params = createParams()

    const response = await DELETE(request, params)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Project deleted successfully')
    expect(consoleSpy).toHaveBeenCalledWith('Error deleting files from storage:', expect.any(Object))

    consoleSpy.mockRestore()
  })

  it('returns 500 when file deletion fails', async () => {
    const mockSupabase = createMockSupabaseClient({
      from: jest.fn().mockImplementation((table) => {
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
        if (table === 'memberships') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockMembership,
              error: null,
            }),
          }
        }
        if (table === 'project_files') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: mockProjectFiles,
              error: null,
            }),
            delete: jest.fn().mockReturnThis(),
          }
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          delete: jest.fn().mockResolvedValue({
            error: { message: 'Database error' },
          }),
        }
      }),
    })
    mockCreateClient.mockResolvedValue(mockSupabase)

    const request = createRequest()
    const params = createParams()

    const response = await DELETE(request, params)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to delete project files')
  })

  it('returns 500 when project deletion fails', async () => {
    const mockSupabase = createMockSupabaseClient({
      from: jest.fn().mockImplementation((table) => {
        if (table === 'projects' && arguments[0] === 'projects') {
          // First call to get project data
          if (!arguments[1]) {
            return {
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({
                data: mockProject,
                error: null,
              }),
            }
          }
          // Second call to delete project
          return {
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({
              error: { message: 'Delete failed' },
            }),
          }
        }
        return createMockSupabaseClient().from(table)
      }),
    })
    mockCreateClient.mockResolvedValue(mockSupabase)

    const request = createRequest()
    const params = createParams()

    const response = await DELETE(request, params)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to delete project')
  })

  it('handles unexpected errors gracefully', async () => {
    mockCreateClient.mockRejectedValue(new Error('Unexpected error'))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const request = createRequest()
    const params = createParams()

    const response = await DELETE(request, params)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
    expect(consoleSpy).toHaveBeenCalledWith('Error deleting project:', expect.any(Error))

    consoleSpy.mockRestore()
  })
})