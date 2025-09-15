'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { OnboardingLayout, InvitationCard } from '@/components/onboarding/OnboardingLayout'
import { Button } from '@/components/Button'
import { FormError, FormSuccess } from '@/components/auth/AuthForm'

interface Invitation {
  id: number
  organisation: string
  role: string
  organizationName?: string
  invitedBy?: string
}

export default function InvitationsPage() {
  const router = useRouter()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [processingInvite, setProcessingInvite] = useState<number | null>(null)

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        // Fetch pending invitations with organization details
        const { data: invitationsData, error } = await supabase
          .from('invitations')
          .select(`
            id,
            organisation,
            role,
            organizations (
              name
            )
          `)
          .eq('invited_email', user.email)
          .eq('status', 'pending')

        if (error) {
          setError('Failed to load invitations.')
          return
        }

        if (!invitationsData || invitationsData.length === 0) {
          // No pending invitations, redirect to create organization
          router.push('/onboarding/create-organization')
          return
        }

        const formattedInvitations = invitationsData.map(inv => ({
          id: inv.id,
          organisation: inv.organisation,
          role: inv.role,
          organizationName: (inv.organizations as any)?.name || 'Unknown Organization'
        }))

        setInvitations(formattedInvitations)
      } catch (err) {
        setError('An unexpected error occurred.')
      } finally {
        setLoading(false)
      }
    }

    fetchInvitations()
  }, [router])

  const handleAcceptInvitation = async (invitationId: number, orgId: string, role: string) => {
    setProcessingInvite(invitationId)
    setError('')
    setSuccess('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('User not authenticated.')
        return
      }

      // Create membership
      const { error: membershipError } = await supabase
        .from('memberships')
        .insert({
          org_id: orgId,
          user_id: user.id,
          role: role
        })

      if (membershipError) {
        setError('Failed to accept invitation. Please try again.')
        return
      }

      // Mark invitation as accepted
      const { error: invitationError } = await supabase
        .from('invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId)

      if (invitationError) {
        console.error('Failed to update invitation:', invitationError)
      }

      // Remove from local state
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId))
      setSuccess('Invitation accepted successfully!')

      // If no more invitations, redirect to dashboard
      if (invitations.length === 1) {
        setTimeout(() => router.push('/dashboard'), 1500)
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setProcessingInvite(null)
    }
  }

  const handleDeclineInvitation = async (invitationId: number) => {
    setProcessingInvite(invitationId)
    setError('')

    try {
      // Mark invitation as declined
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'declined' })
        .eq('id', invitationId)

      if (error) {
        setError('Failed to decline invitation.')
        return
      }

      // Remove from local state
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId))
      setSuccess('Invitation declined.')
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setProcessingInvite(null)
    }
  }

  if (loading) {
    return (
      <OnboardingLayout title="Loading your invitations...">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout
      title="You've been invited!"
      subtitle="You have pending invitations to join organizations. Review and accept the ones you'd like to join."
      step={1}
      totalSteps={2}
    >
      <div className="space-y-6">
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}

        {invitations.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">
              Pending Invitations ({invitations.length})
            </h3>
            
            {invitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                organizationName={invitation.organizationName || 'Unknown Organization'}
                role={invitation.role}
                invitedBy={invitation.invitedBy}
                onAccept={() => handleAcceptInvitation(invitation.id, invitation.organisation, invitation.role)}
                onDecline={() => handleDeclineInvitation(invitation.id)}
                loading={processingInvite === invitation.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-600 mb-4">No pending invitations found.</p>
            <Link href="/onboarding/create-organization">
              <Button>Create Organization</Button>
            </Link>
          </div>
        )}

        {invitations.length > 0 && (
          <div className="pt-6 border-t border-neutral-200">
            <p className="text-sm text-neutral-600 text-center mb-4">
              Don&apos;t see the organization you&apos;re looking for?
            </p>
            <div className="text-center">
              <Link href="/onboarding/create-organization">
                <Button variant="secondary">Create New Organization</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </OnboardingLayout>
  )
}