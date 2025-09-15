'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Alert } from '@/components/Alert'
import { Card, CardHeader, CardContent } from '@/components/Card'

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone: string
}

export default function SettingsPage() {
  const router = useRouter()
  
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    email: '',
    full_name: '',
    phone: ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        // Get profile from users table
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error loading profile:', profileError)
        }

        setProfile({
          id: user.id,
          email: user.email || '',
          full_name: profileData?.full_name || user.user_metadata?.full_name || '',
          phone: profileData?.phone || user.user_metadata?.phone || ''
        })
      } catch (err) {
        console.error('Error loading profile:', err)
        setError('Failed to load profile information.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
    setMessage('')
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
    setMessage('')
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdateLoading(true)
    setError('')
    setMessage('')

    try {
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          phone: profile.phone
        }
      })

      if (authError) {
        setError(authError.message)
        return
      }

      // Update or insert into users table
      const { error: profileError } = await supabase
        .from('users')
        .upsert({
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          phone: profile.phone
        })

      if (profileError) {
        console.error('Profile update error:', profileError)
        setError('Failed to update profile. Please try again.')
        return
      }

      setMessage('Profile updated successfully!')
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setUpdateLoading(false)
    }
  }

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setError('')
    setMessage('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.')
      setPasswordLoading(false)
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long.')
      setPasswordLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Password updated successfully!')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setPasswordLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-32 mb-6"></div>
          <div className="space-y-4">
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="h-48 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
        <p className="mt-2 text-slate-600">
          Manage your account information and security settings.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Profile Information</h2>
            <p className="text-sm text-slate-600">
              Update your personal information and contact details.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateProfile} className="space-y-4">
              <Input
                label="Full Name"
                name="full_name"
                value={profile.full_name}
                onChange={handleProfileChange}
                placeholder="Enter your full name"
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
                value={profile.email}
                disabled
                helpText="Email address cannot be changed. Contact support if needed."
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
                value={profile.phone}
                onChange={handleProfileChange}
                placeholder="Enter your phone number"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />
              
              <div className="pt-4">
                <Button
                  type="submit"
                  loading={updateLoading}
                  className="w-full"
                >
                  Update Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Change Password</h2>
            <p className="text-sm text-slate-600">
              Update your password to keep your account secure.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={updatePassword} className="space-y-4">
              <Input
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
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
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              
              <div className="pt-4">
                <Button
                  type="submit"
                  loading={passwordLoading}
                  variant="secondary"
                  className="w-full"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}