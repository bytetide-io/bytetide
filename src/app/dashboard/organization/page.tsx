'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Alert } from '@/components/Alert'
import { Card, CardHeader, CardContent } from '@/components/Card'
import { Select } from '@/components/Select'

interface Organization {
  id: string
  name: string
  domain: string
  country?: string
  created_at: string
  created_by: string
}

const countries = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'SE', label: 'Sweden' },
  { value: 'DK', label: 'Denmark' },
  { value: 'NO', label: 'Norway' },
]

export default function OrganizationSettingsPage() {
  const router = useRouter()
  
  const [organization, setOrganization] = useState<Organization>({
    id: '',
    name: '',
    domain: '',
    country: '',
    created_at: '',
    created_by: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [canManage, setCanManage] = useState(false)

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        // Get user's current organization membership
        const { data: membership, error: membershipError } = await supabase
          .from('memberships')
          .select('org_id, role')
          .eq('user_id', user.id)
          .single()

        if (membershipError || !membership) {
          console.error('Error fetching membership:', membershipError)
          router.push('/onboarding')
          return
        }

        // Check if user can manage organization (owner or admin)
        setCanManage(['owner', 'admin'].includes(membership.role))

        // Load organization details
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', membership.org_id)
          .single()

        if (orgError) {
          console.error('Error loading organization:', orgError)
          setError('Failed to load organization information.')
          return
        }

        setOrganization(orgData)
      } catch (err) {
        console.error('Error loading organization:', err)
        setError('Failed to load organization information.')
      } finally {
        setLoading(false)
      }
    }

    loadOrganization()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setOrganization(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
    setMessage('')
  }

  const validateForm = () => {
    if (!organization.name || !organization.domain) {
      setError('Please fill in all required fields.')
      return false
    }

    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(organization.domain)) {
      setError('Please enter a valid domain name (e.g., example.com).')
      return false
    }

    return true
  }

  const updateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateLoading(true)
    setError('')
    setMessage('')

    if (!validateForm()) {
      setUpdateLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          name: organization.name,
          domain: organization.domain,
          country: organization.country
        })
        .eq('id', organization.id)

      if (updateError) {
        if (updateError.code === '23505') {
          setError('This domain is already registered by another organization.')
        } else {
          console.error('Organization update error:', updateError)
          setError('Failed to update organization. Please try again.')
        }
        return
      }

      setMessage('Organization updated successfully!')
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setUpdateLoading(false)
    }
  }

  const deleteOrganization = async () => {
    if (!confirm('Are you sure you want to delete this organization? This action cannot be undone and will remove all associated data.')) {
      return
    }

    if (!confirm('This will permanently delete the organization and all its data. Type "DELETE" to confirm.')) {
      return
    }

    setDeleteLoading(true)
    setError('')

    try {
      const { error: deleteError } = await supabase
        .from('organizations')
        .delete()
        .eq('id', organization.id)

      if (deleteError) {
        console.error('Organization deletion error:', deleteError)
        setError('Failed to delete organization. Please try again.')
        return
      }

      // Redirect to onboarding after successful deletion
      router.push('/onboarding')
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!canManage) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="text-center" padding="lg">
          <div className="mb-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-slate-600">
            You don&apos;t have permission to manage organization settings. Only owners and administrators can access this page.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Organization Settings</h1>
        <p className="mt-2 text-slate-600">
          Manage your organization information and settings.
        </p>
      </div>

      {error && (
        <Alert variant="error" title="Error" className="mb-6">
          {error}
        </Alert>
      )}
      {message && (
        <Alert variant="success" title="Success!" className="mb-6">
          {message}
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Organization Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Organization Information</h2>
            <p className="text-sm text-slate-600">
              Update your organization details and contact information.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateOrganization} className="space-y-4">
              <Input
                label="Organization Name"
                name="name"
                required
                value={organization.name}
                onChange={handleChange}
                placeholder="Enter organization name"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5h6m-6 0H9m8 0v9" />
                  </svg>
                }
              />
              
              <Input
                label="Domain"
                name="domain"
                required
                value={organization.domain}
                onChange={handleChange}
                placeholder="example.com"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                }
              />
              
              <Select
                label="Country"
                value={organization.country || ''}
                onChange={(value) => {
                  setOrganization(prev => ({ ...prev, country: value }))
                  setError('')
                  setMessage('')
                }}
                options={countries}
                placeholder="Select a country"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-slate-800">
                      Organization Information
                    </h3>
                    <div className="mt-2 text-sm text-slate-600">
                      <p>Created: {new Date(organization.created_at).toLocaleDateString()}</p>
                      <p>Organization ID: {organization.id}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button
                  type="submit"
                  loading={updateLoading}
                  className="w-full sm:w-auto"
                >
                  Update Organization
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
            <p className="text-sm text-red-600">
              Irreversible and destructive actions.
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Delete Organization
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Once you delete an organization, there is no going back. This will permanently delete the organization and all associated data including projects, team members, and settings.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={deleteOrganization}
                      loading={deleteLoading}
                      variant="ghost"
                      className="text-red-700 hover:text-red-900 hover:bg-red-100"
                    >
                      Delete Organization
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}