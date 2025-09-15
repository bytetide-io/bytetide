'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'
import { FormField, FormError, FormSuccess } from '@/components/auth/AuthForm'
import { Button } from '@/components/Button'
import { Select } from '@/components/Select'

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
  // Add more countries as needed
]

export default function CreateOrganizationPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    country: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.name || !formData.domain || !formData.country) {
      setError('Please fill in all required fields.')
      return false
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(formData.domain)) {
      setError('Please enter a valid domain name (e.g., example.com).')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('User not authenticated.')
        setLoading(false)
        return
      }

      // Create organization (temporarily without country until migration is applied)
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: formData.name,
          domain: formData.domain,
          // country: formData.country, // Commented out until migration is applied
          created_by: user.id
        })
        .select()
        .single()

      if (orgError) {
        console.error('Organization creation error:', orgError)
        if (orgError.code === '23505') {
          setError('This domain is already registered. Please use a different domain.')
        } else {
          setError(`Failed to create organization: ${orgError.message || 'Please try again.'}`)
        }
        return
      }

      // Create membership for the user as owner
      const { error: membershipError } = await supabase
        .from('memberships')
        .insert({
          org_id: orgData.id,
          user_id: user.id,
          role: 'owner'
        })

      if (membershipError) {
        console.error('Membership creation error:', membershipError)
        setError(`Organization created but failed to set up membership: ${membershipError.message || 'Please contact support.'}`)
        return
      }

      setSuccess('Organization created successfully!')
      
      // Redirect to dashboard after success
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingLayout
      title="Create your organization"
      subtitle="Set up your organization to start managing your migration projects."
      step={2}
      totalSteps={2}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
        
        <div className="space-y-4">
          <FormField
            label="Organization Name *"
            name="name"
            required
            placeholder="Enter your organization name"
            value={formData.name}
            onChange={handleChange}
          />
          
          <FormField
            label="Domain *"
            name="domain"
            placeholder="example.com"
            value={formData.domain}
            onChange={handleChange}
          />
          
          <Select
            label="Country"
            value={formData.country}
            onChange={(value) => {
              setFormData(prev => ({ ...prev, country: value }))
              setError('')
            }}
            options={countries}
            placeholder="Select a country"
            required
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-blue-800">
                  About your organization
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Your organization will be used to group your migration projects and team members. 
                    You can invite team members and manage permissions after creating the organization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Creating Organization...' : 'Create Organization'}
        </Button>
      </form>
    </OnboardingLayout>
  )
}