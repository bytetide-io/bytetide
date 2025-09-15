'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Alert } from '@/components/Alert'
import { supabase } from '@/lib/supabase/client'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Check if user has a valid session (from password reset link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/forgot-password')
      }
    }
    checkSession()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.')
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
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess('Password updated successfully!')
        setTimeout(() => {
          router.push('/dashboard')
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
      title="Set new password"
      subtitle="Enter your new password below"
      footer={
        <Link href="/auth/login" className="font-semibold text-slate-900 hover:text-slate-700 transition-colors">
          Back to Sign In
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <Alert variant="error" title="Error">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" title="Success!">
            {success}
          </Alert>
        )}
        
        <Input
          label="New Password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Enter your new password"
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
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Confirm your new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <div className="pt-2">
          <Button
            type="submit"
            loading={loading}
            fullWidth
            size="lg"
          >
            Update Password
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout title="Reset Password" subtitle="Loading...">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
        </div>
      </AuthLayout>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}