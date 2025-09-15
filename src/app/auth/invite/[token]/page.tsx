'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { AuthForm, FormError, FormSuccess } from '@/components/auth/AuthForm'
import { Button } from '@/components/Button'

interface InvitationData {
  id: number
  invited_email: string
  organisation: string
  role: string
  organizationName: string
  expires_at?: string
}

export default function InviteAcceptPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [status, setStatus] = useState<'loading' | 'valid' | 'expired' | 'used' | 'invalid'>('loading')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [processing, setProcessing] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkInvitation = async () => {
      if (!token) {
        setStatus('invalid')
        return
      }

      try {
        // For now, we'll use the token as the invitation ID (simple implementation)
        // In production, you'd want to use a more secure token system
        const invitationId = parseInt(token)
        
        if (isNaN(invitationId)) {
          setStatus('invalid')
          return
        }

        // Get invitation data
        const { data: invitationData, error: inviteError } = await supabase
          .from('invitations')
          .select(`
            id,
            invited_email,
            organisation,
            role,
            expires_at,
            organizations (
              name
            )
          `)
          .eq('id', invitationId)
          .eq('status', 'pending') // Only pending invitations
          .single()

        if (inviteError || !invitationData) {
          setStatus('invalid')
          return
        }

        // Check if invitation is expired
        if (invitationData.expires_at && new Date(invitationData.expires_at) < new Date()) {
          setStatus('expired')
          return
        }

        setInvitation({
          ...invitationData,
          organizationName: (invitationData.organizations as any)?.name || 'Unknown Organization'
        })

        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        setStatus('valid')
      } catch (err) {
        setStatus('invalid')
      }
    }

    checkInvitation()
  }, [token])

  const handleAcceptInvitation = async () => {
    if (!invitation || !user) return

    setProcessing(true)
    setError('')
    setSuccess('')

    try {
      // Check if user's email matches invitation email
      if (user.email !== invitation.invited_email) {
        setError('This invitation is for a different email address. Please sign in with the correct account.')
        return
      }

      // Create membership
      const { error: membershipError } = await supabase
        .from('memberships')
        .insert({
          org_id: invitation.organisation,
          user_id: user.id,
          role: invitation.role
        })

      if (membershipError) {
        setError('Failed to accept invitation. You may already be a member of this organization.')
        return
      }

      // Mark invitation as accepted
      const { error: invitationError } = await supabase
        .from('invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id)

      if (invitationError) {
        console.error('Failed to update invitation:', invitationError)
      }

      setSuccess('Invitation accepted successfully! Redirecting to dashboard...')
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600">Verifying invitation...</p>
          </div>
        )

      case 'invalid':
        return (
          <div className="text-center py-8 space-y-4">
            <FormError message="This invitation link is invalid or has already been used." />
            <div className="space-y-2">
              <Button onClick={() => router.push('/auth/login')} className="w-full">
                Sign In
              </Button>
              <Button 
                onClick={() => router.push('/auth/register')} 
                variant="secondary" 
                className="w-full"
              >
                Create Account
              </Button>
            </div>
          </div>
        )

      case 'expired':
        return (
          <div className="text-center py-8 space-y-4">
            <FormError message="This invitation has expired. Please request a new invitation." />
            <Button onClick={() => router.push('/auth/login')} className="w-full">
              Sign In
            </Button>
          </div>
        )

      case 'valid':
        if (!user) {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-neutral-600 mb-6">
                  You&apos;ve been invited to join <strong>{invitation?.organizationName}</strong> as a{' '}
                  <strong>{invitation?.role}</strong>.
                </p>
                <p className="text-sm text-neutral-500 mb-6">
                  You need to sign in or create an account to accept this invitation.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push(`/auth/login?redirectTo=/auth/invite/${token}`)} 
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => router.push(`/auth/register?redirectTo=/auth/invite/${token}`)} 
                  variant="secondary" 
                  className="w-full"
                >
                  Create Account
                </Button>
              </div>
            </div>
          )
        }

        return (
          <div className="space-y-6">
            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                You&apos;re invited to join
              </h3>
              <div className="bg-neutral-50 p-4 rounded-lg border">
                <p className="font-medium text-neutral-900">{invitation?.organizationName}</p>
                <p className="text-sm text-neutral-600">
                  Role: <span className="font-medium capitalize">{invitation?.role}</span>
                </p>
                <p className="text-sm text-neutral-600">
                  Invited: <span className="font-medium">{invitation?.invited_email}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleAcceptInvitation}
                disabled={processing}
                className="w-full"
              >
                {processing ? 'Accepting Invitation...' : 'Accept Invitation'}
              </Button>
              
              <Button
                onClick={() => router.push('/dashboard')}
                variant="secondary"
                className="w-full"
              >
                Decline
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AuthForm
      title="Organization Invitation"
      subtitle={
        status === 'valid' && invitation
          ? `Join ${invitation.organizationName}`
          : 'Accept your invitation'
      }
    >
      {renderContent()}
    </AuthForm>
  )
}