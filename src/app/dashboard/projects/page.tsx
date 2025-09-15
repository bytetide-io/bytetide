'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Alert } from '@/components/Alert'
import { supabase } from '@/lib/supabase/client'
import { Project, Status, User } from '@/lib/types'
// Safe date formatting function
const formatProjectDate = (dateString: string | null) => {
  if (!dateString) return 'Unknown date'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid date'
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return 'Invalid date'
  }
}
import clsx from 'clsx'

// Helper function to get creator display
const getCreatorName = (creator: any) => {
  if (!creator) return 'Team member'
  return creator.full_name || creator.email || 'Team member'
}

interface ProjectWithStatus extends Project {
  status_info?: Status
  platform_info?: { name: string; platform: string }
  creator?: User
}

const STATUS_COLORS = {
  submitted: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  in_review: 'bg-purple-100 text-purple-800',
  approved: 'bg-green-100 text-green-800',
  migrating: 'bg-orange-100 text-orange-800',
  completed: 'bg-emerald-100 text-emerald-800'
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithStatus[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    // Check for filter parameter from URL
    const filterParam = searchParams.get('filter')
    if (filterParam) {
      setActiveFilter(filterParam)
    }
  }, [searchParams])

  useEffect(() => {
    // Filter projects based on active filter
    if (activeFilter === 'all') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter(project => project.status === activeFilter))
    }
  }, [projects, activeFilter])

  const fetchProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Get user's organization
      const { data: membership } = await supabase
        .from('memberships')
        .select('org_id')
        .eq('user_id', user.id)
        .single()

      if (!membership) throw new Error('User is not part of an organization')

      // Fetch projects with status, platform, and creator info
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          status_info:status(status, name, description),
          platform_info:platform_requirements(name, platform),
          creator:users!created_by(id, email, full_name)
        `)
        .eq('org_id', membership.org_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error: any) {
      console.error('Error fetching projects:', error)
      setError(error.message || 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    setDeletingProjectId(projectId)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete project')
      }

      // Remove project from local state
      setProjects(prev => prev.filter(p => p.id !== projectId))
      
    } catch (error: any) {
      console.error('Error deleting project:', error)
      setError(error.message || 'Failed to delete project')
    } finally {
      setDeletingProjectId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Migration Projects
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              Track and manage your data migration projects
            </p>
          </div>
          <Button href="/dashboard/projects/new">
            New Project
          </Button>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Filter Tabs */}
        {projects.length > 0 && (
          <div className="mb-6">
            <nav className="flex space-x-8 border-b border-slate-200">
              {[
                { key: 'all', label: 'All Projects', count: projects.length },
                { key: 'submitted', label: 'Submitted', count: projects.filter(p => p.status === 'submitted').length },
                { key: 'in_progress', label: 'In Progress', count: projects.filter(p => p.status === 'in_progress').length },
                { key: 'in_review', label: 'In Review', count: projects.filter(p => p.status === 'in_review').length },
                { key: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'completed').length },
              ].filter(tab => tab.count > 0 || tab.key === 'all').map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={clsx(
                    'py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                    activeFilter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  )}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        )}

        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <div className="mx-auto w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No projects yet
            </h2>
            <p className="text-slate-600 mb-6">
              Get started by creating your first migration project
            </p>
            <Button href="/dashboard/projects/new">
              Create Your First Project
            </Button>
          </Card>
        ) : filteredProjects.length === 0 ? (
          <Card className="text-center py-12">
            <div className="mx-auto w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No {activeFilter === 'all' ? '' : activeFilter.replace('_', ' ')} projects
            </h2>
            <p className="text-slate-600 mb-6">
              {activeFilter === 'all' 
                ? 'Get started by creating your first migration project'
                : `No projects with status "${activeFilter.replace('_', ' ')}" found`
              }
            </p>
            {activeFilter === 'all' && (
              <Button href="/dashboard/projects/new">
                Create Your First Project
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {project.domain}
                      </h3>
                      <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        STATUS_COLORS[project.status] || 'bg-slate-100 text-slate-800'
                      )}>
                        {project.status_info?.name || project.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-600 mb-3">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        {project.platform_info?.name || project.source_platform}
                      </span>
                      
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {project.shopify_url}
                      </span>
                      
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Created by {getCreatorName(project.creator)}
                      </span>
                      
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatProjectDate(project.created_at)}
                      </span>
                    </div>

                    {project.items && project.items.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {project.items.map((item) => (
                            <span key={item} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {project.status_info?.description && (
                      <p className="text-sm text-slate-600">
                        {project.status_info.description}
                      </p>
                    )}

                    {project.special_demands && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-700">
                          <span className="font-medium">Special requirements:</span> {project.special_demands}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    <div className="flex space-x-2">
                      {project.status === 'in_review' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          href={`/preview/${project.id}`}
                        >
                          Review Data
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        href={`/dashboard/projects/${project.id}/edit`}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Button>

                      {project.status === 'submitted' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteProject(project.id)}
                          disabled={deletingProjectId === project.id}
                          loading={deletingProjectId === project.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </FadeIn>
  )
}