'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useOrganization } from '@/lib/contexts/OrganizationContext'
import { Button } from '@/components/Button'
import { InvitationNotification } from '@/components/InvitationNotification'
import { Project, Status, User } from '@/lib/types'
import clsx from 'clsx'

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

// Helper function to get creator display
const getCreatorName = (creator: any) => {
  if (!creator) return 'Team member'
  return creator.full_name || creator.email || 'Team member'
}

interface Stats {
  total: number
  submitted: number
  in_progress: number
  in_review: number
  completed: number
}

interface ProjectWithStatus extends Project {
  status_info?: Status
  platform_info?: { id: string; name: string }
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

export default function DashboardPage() {
  const { currentOrganization } = useOrganization()
  const [stats, setStats] = useState<Stats>({
    total: 0,
    submitted: 0,
    in_progress: 0,
    in_review: 0,
    completed: 0
  })
  const [recentProjects, setRecentProjects] = useState<ProjectWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!currentOrganization) return
      
      try {
        // Fetch projects with status, platform, and creator info
        const { data: projects, error } = await supabase
          .from('projects')
          .select(`
            *,
            status_info:status(status, name, description),
            platform_info:platforms!source_platform(id, name),
            creator:users!created_by(id, email, full_name)
          `)
          .eq('org_id', currentOrganization.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        const projectList = projects || []
        
        // Calculate stats
        const statsData = {
          total: projectList.length,
          submitted: projectList.filter(p => p.status === 'submitted').length,
          in_progress: projectList.filter(p => p.status === 'in_progress').length,
          in_review: projectList.filter(p => p.status === 'in_review').length,
          completed: projectList.filter(p => p.status === 'completed').length,
        }
        
        setStats(statsData)
        setRecentProjects(projectList.slice(0, 5)) // Show 5 most recent
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadDashboardData()
  }, [currentOrganization])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 rounded"></div>
            ))}
          </div>
          <div className="h-48 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Simple Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {currentOrganization?.name}
        </h1>
      </div>

      {/* Invitation Notification */}
      <InvitationNotification />



      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-slate-900">
              {stats.total === 0 ? 'Get Started' : 'Quick Actions'}
            </h2>
            <p className="text-slate-500">
              {stats.total === 0 
                ? 'Create your first migration project' 
                : stats.in_review > 0 
                ? 'You have projects ready for review'
                : stats.in_progress > 0
                ? 'Projects currently in progress'
                : 'Manage your migration projects'
              }
            </p>
          </div>
          <div className="flex space-x-3">
            {stats.in_review > 0 && (
              <Button 
                variant="secondary" 
                href="/dashboard/projects?filter=in_review"
              >
                Review Projects
              </Button>
            )}
            <Button href="/dashboard/projects/new">
              {stats.total === 0 ? 'Create Project' : 'New Project'}
            </Button>
            {stats.total > 0 && (
              <Button variant="secondary" href="/dashboard/projects">
                View All Projects
              </Button>
            )}
            {stats.total === 0 && (
              <Button variant="secondary" href="/dashboard/team">
                Invite Team
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-slate-900">Recent Projects</h2>
          {recentProjects.length > 0 && (
            <Link href="/dashboard/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all projects
            </Link>
          )}
        </div>
        
        {recentProjects.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900">No projects yet</h3>
            <p className="mt-1 text-sm text-slate-500">Get started by creating your first migration project.</p>
            <div className="mt-6">
              <Button href="/dashboard/projects/new">
                Create Project
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                      {project.domain}
                    </h3>
                    <span className={clsx(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                      STATUS_COLORS[project.status] || 'bg-slate-100 text-slate-800'
                    )}>
                      {project.status_info?.name || project.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span>
                      {project.platform_info?.name || project.source_platform}
                    </span>
                    <span>→</span>
                    <span>
                      {project.shopify_url}
                    </span>
                    <span>•</span>
                    <span>
                      Created by {getCreatorName(project.creator)}
                    </span>
                    <span>•</span>
                    <span>
                      {formatProjectDate(project.created_at)}
                    </span>
                  </div>
                </div>
                
                <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                  {project.status === 'in_review' && (
                    <Button
                      size="xs"
                      variant="secondary"
                      href={`/preview/${project.id}`}
                    >
                      Review
                    </Button>
                  )}
                  
                  <Button
                    size="xs"
                    variant="ghost"
                    href={`/dashboard/projects/${project.id}/edit`}
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                  
                  <Link 
                    href="/dashboard/projects"
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}