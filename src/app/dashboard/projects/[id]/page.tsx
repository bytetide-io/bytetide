'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FadeIn } from '@/components/FadeIn'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Alert } from '@/components/Alert'
import { CustomCsvManager } from '@/components/CustomCsvManager'
import { supabase } from '@/lib/supabase/client'
import { useOrganization } from '@/lib/contexts/OrganizationContext'
import { Project, ProjectFile } from '@/lib/types'
import clsx from 'clsx'

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', color: 'bg-yellow-100 text-yellow-800' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  in_review: { label: 'In Review', color: 'bg-purple-100 text-purple-800' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800' },
  migrating: { label: 'Migrating', color: 'bg-orange-100 text-orange-800' },
  completed: { label: 'Completed', color: 'bg-slate-100 text-slate-800' }
}

export default function ProjectDetailPage() {
  const { currentOrganization } = useOrganization()
  const [project, setProject] = useState<Project | null>(null)
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  useEffect(() => {
    if (currentOrganization) {
      fetchProjectDetails()
    }
  }, [projectId, currentOrganization]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProjectDetails = async () => {
    try {
      if (!currentOrganization) {
        throw new Error('No organization available')
      }

      // Fetch the project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('org_id', currentOrganization.id)
        .single()

      if (projectError) {
        if (projectError.code === 'PGRST116') {
          throw new Error('Project not found')
        }
        throw projectError
      }

      // Fetch project files (excluding custom CSV files as they're handled by CustomCsvManager)
      const { data: files, error: filesError } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .neq('file_type', 'custom-csv')
        .order('upload_date', { ascending: false })

      if (filesError) throw filesError

      setProject(project)
      setProjectFiles(files || [])
    } catch (error: any) {
      console.error('Error fetching project details:', error)
      setError(error.message || 'Failed to fetch project details')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleEdit = () => {
    router.push(`/dashboard/projects/${projectId}/edit`)
  }

  const handleReviewData = () => {
    router.push(`/preview/${projectId}`)
  }

  const handleBack = () => {
    router.push('/dashboard/projects')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <FadeIn>
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      </FadeIn>
    )
  }

  if (!project) {
    return (
      <FadeIn>
        <Alert variant="error" className="mb-6">
          Project not found
        </Alert>
      </FadeIn>
    )
  }

  const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.submitted

  return (
    <FadeIn>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-slate-600 hover:text-slate-900"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Projects
          </Button>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={handleEdit}
            >
              Edit Project
            </Button>
            {project.status === 'in_review' && (
              <Button
                variant="primary"
                onClick={handleReviewData}
              >
                Review Data
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {project.domain}
          </h1>
          <span className={clsx(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            statusConfig.color
          )}>
            {statusConfig.label}
          </span>
        </div>
        
        <p className="mt-2 text-lg text-slate-600">
          Migration from {project.source_platform}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Overview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Project Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-1">Source Domain</h3>
                <p className="text-sm text-slate-900">{project.domain}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-1">Platform</h3>
                <p className="text-sm text-slate-900">{project.source_platform}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-1">Shopify Store</h3>
                <p className="text-sm text-slate-900">{project.shopify_url || 'Not set'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-1">Status</h3>
                <span className={clsx(
                  'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                  statusConfig.color
                )}>
                  {statusConfig.label}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-1">Created</h3>
                <p className="text-sm text-slate-900">{formatDate(project.created_at)}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-1">Last Updated</h3>
                <p className="text-sm text-slate-900">{formatDate(project.updated_at)}</p>
              </div>
            </div>

            {project.items && project.items.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Data Types</h3>
                <div className="flex flex-wrap gap-2">
                  {project.items.map(item => (
                    <span
                      key={item}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.special_demands && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-700 mb-1">Special Requirements</h3>
                <p className="text-sm text-slate-900 whitespace-pre-wrap">{project.special_demands}</p>
              </div>
            )}
          </Card>

          {/* Original Project Files */}
          {projectFiles.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Project Files
              </h2>
              
              <div className="space-y-3">
                {projectFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{file.file_name}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-slate-500">
                            {formatFileSize(file.file_size)}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatDate(file.upload_date)}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                            {file.file_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Custom CSV Files Manager */}
          <CustomCsvManager projectId={projectId} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="text-lg font-medium text-slate-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start"
                onClick={handleEdit}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Details
              </Button>
              
              {project.status === 'in_review' && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleReviewData}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Review Data
                </Button>
              )}
            </div>
          </Card>

          {/* Project Timeline */}
          <Card className="p-4">
            <h3 className="text-lg font-medium text-slate-900 mb-3">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Project Created</p>
                  <p className="text-xs text-slate-500">{formatDate(project.created_at)}</p>
                </div>
              </div>
              
              {project.started && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Migration Started</p>
                    <p className="text-xs text-slate-500">{formatDate(project.started)}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <div className={clsx(
                  "w-2 h-2 rounded-full",
                  project.status === 'completed' ? 'bg-slate-500' : 'bg-slate-300'
                )}>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Last Updated</p>
                  <p className="text-xs text-slate-500">{formatDate(project.updated_at)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </FadeIn>
  )
}