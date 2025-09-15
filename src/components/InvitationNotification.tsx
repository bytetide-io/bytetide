'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/Button'

interface PendingInvitation {
  id: number
  role: string
  organizationName: string
}

export function InvitationNotification() {
  const [invitations, setInvitations] = useState<PendingInvitation[]>([])
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const checkForInvitations = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) return

        // Check for pending invitations
        const { data: invitationsData } = await supabase
          .from('invitations')
          .select(`
            id,
            role,
            organizations (
              name
            )
          `)
          .eq('invited_email', user.email)
          .eq('status', 'pending')

        if (invitationsData && invitationsData.length > 0) {
          const formattedInvitations = invitationsData.map(inv => ({
            id: inv.id,
            role: inv.role,
            organizationName: (inv.organizations as any)?.name || 'Unknown Organization'
          }))

          setInvitations(formattedInvitations)
          setShowNotification(true)
        }
      } catch (error) {
        console.error('Error checking for invitations:', error)
      }
    }

    checkForInvitations()
  }, [])

  if (!showNotification || invitations.length === 0) {
    return null
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            You have {invitations.length} pending invitation{invitations.length > 1 ? 's' : ''}!
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              {invitations.length === 1 ? (
                <>You&apos;ve been invited to join <strong>{invitations[0].organizationName}</strong> as a <strong>{invitations[0].role}</strong>.</>
              ) : (
                <>You&apos;ve been invited to join {invitations.length} organizations.</>
              )}
            </p>
          </div>
          <div className="mt-3 flex gap-2">
            <Link href="/onboarding/invitations">
              <Button size="sm">
                Review Invitation{invitations.length > 1 ? 's' : ''}
              </Button>
            </Link>
            <button
              onClick={() => setShowNotification(false)}
              className="text-sm font-medium text-blue-800 hover:text-blue-900"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}