'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Alert } from '@/components/Alert'
import { supabase } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('') // Clear error when user starts typing
  }

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all required fields.')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return false
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.')
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
      // First, check if there are any pending invitations for this email
      const { data: invitations } = await supabase
        .from('invitations')
        .select('id, organisation, role')
        .eq('invited_email', formData.email)
        .eq('status', 'pending') // Only pending invitations

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
          data: {
            full_name: formData.fullName,
            phone: formData.phone || null,
            has_pending_invitations: invitations && invitations.length > 0
          }
        }
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.user) {
        // Insert user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: formData.email,
            full_name: formData.fullName,
            phone: formData.phone || null
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
        }

        setSuccess('Account created successfully! Please check your email to verify your account.')
        
        // Redirect to verify page with email parameter for resend functionality
        setTimeout(() => {
          router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`)
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of teams using ByteTide to manage their data migrations"
      footer={
        <>
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-slate-900 hover:text-slate-700 transition-colors">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <Alert variant="error" title="Registration failed">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" title="Success!">
            {success}
          </Alert>
        )}
        
        <div className="grid grid-cols-1 gap-5">
          <Input
            label="Full Name"
            name="fullName"
            required
            autoComplete="name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          
          <Input
            label="Email Address"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />
          
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Enter your phone number (optional)"
            value={formData.phone}
            onChange={handleChange}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />
          
          <Input
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            helpText="Minimum 8 characters"
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />
          
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            leftIcon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            loading={loading}
            fullWidth
            size="lg"
          >
            Create Account
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}