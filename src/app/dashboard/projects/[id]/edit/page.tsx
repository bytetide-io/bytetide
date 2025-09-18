'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FadeIn } from '@/components/FadeIn'
import { EditProjectForm } from '@/components/EditProjectForm'
import { Alert } from '@/components/Alert'
import { supabase } from '@/lib/supabase/client'
import { useOrganization } from '@/lib/contexts/OrganizationContext'
import { Project } from '@/lib/types'

export default function EditProjectPage() {
  const { currentOrganization } = useOrganization()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  useEffect(() => {
    if (currentOrganization) {
      fetchProject()
    }
  }, [projectId, currentOrganization]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProject = async () => {
    try {
      if (!currentOrganization) {
        throw new Error('No organization available')
      }

      // Fetch the specific project
      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('org_id', currentOrganization.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Project not found')
        }
        throw error
      }

      setProject(project)
    } catch (error: any) {
      console.error('Error fetching project:', error)
      setError(error.message || 'Failed to fetch project')
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    router.push('/dashboard/projects')
  }

  const handleCancel = () => {
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

  return (
    <FadeIn>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Edit Project: {project.domain}
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Update your migration project details and settings
        </p>
      </div>
      
      <EditProjectForm 
        project={project}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </FadeIn>
  )
}