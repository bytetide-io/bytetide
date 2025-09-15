'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

interface PendingInvitation {
  id: number
  role: string
  organizationName: string
  organizationId: string
}

export function NoOrganizationScreen() {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [processingInvite, setProcessingInvite] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const checkForInvitations = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) return

        // Check for pending invitations
        const { data: invitationsData, error } = await supabase
          .from('invitations')
          .select(`
            id,
            role,
            organisation,
            organizations (
              name
            )
          `)
          .eq('invited_email', user.email)
          .eq('status', 'pending')

        if (error) {
          console.error('Error fetching invitations:', error)
        } else if (invitationsData && invitationsData.length > 0) {
          const formattedInvitations = invitationsData.map(inv => ({
            id: inv.id,
            role: inv.role,
            organizationName: (inv.organizations as any)?.name || 'Unknown Organization',
            organizationId: inv.organisation
          }))

          setInvitations(formattedInvitations)
        }
      } catch (error) {
        console.error('Error checking for invitations:', error)
      } finally {
        setLoading(false)
      }
    }

    checkForInvitations()
  }, [])

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

      // Check if user's email matches invitation email
      const invitation = invitations.find(inv => inv.id === invitationId)
      if (!invitation) {
        setError('Invitation not found.')
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
        console.error('Membership error:', membershipError)
        setError('Failed to accept invitation. You may already be a member of this organization.')
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

      setSuccess('Invitation accepted successfully! Refreshing page...')
      
      // Refresh the page to update organization context
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      console.error('Error accepting invitation:', err)
      setError('An unexpected error occurred.')
    } finally {
      setProcessingInvite(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center" padding="lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Checking for invitations...</p>
        </Card>
      </div>
    )
  }

  // If user has pending invitations, show them first
  if (invitations.length > 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full" padding="lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              You&apos;ve been invited!
            </h2>
            <p className="text-slate-600">
              You have {invitations.length} pending invitation{invitations.length > 1 ? 's' : ''} to join organization{invitations.length > 1 ? 's' : ''}. 
              Review and accept the one{invitations.length > 1 ? 's' : ''} you&apos;d like to join.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-medium text-slate-900">
              Pending Invitations ({invitations.length})
            </h3>
            
            {invitations.map((invitation) => (
              <div key={invitation.id} className="bg-slate-50 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">{invitation.organizationName}</h4>
                    <p className="text-sm text-slate-600">Role: <span className="font-medium capitalize">{invitation.role}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptInvitation(invitation.id, invitation.organizationId, invitation.role)}
                      loading={processingInvite === invitation.id}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={processingInvite === invitation.id}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600 mb-4">
              Don&apos;t see the organization you&apos;re looking for?
            </p>
            <Link href="/onboarding/create-organization">
              <Button variant="secondary" fullWidth>
                Create New Organization
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  // No invitations - show create organization option
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center" padding="lg">
        <div className="mb-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5h6m-6 0H9m8 0v9" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">No Organization Found</h2>
        <p className="text-slate-600 mb-6">
          You don&apos;t seem to be a member of any organization or have any pending invitations.
        </p>
        <Link href="/onboarding/create-organization">
          <Button fullWidth>Create Organization</Button>
        </Link>
      </Card>
    </div>
  )
}