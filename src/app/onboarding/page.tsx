'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { supabase } from '@/lib/supabase/client'
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout'

interface UserState {
  hasOrganizations: boolean
  hasPendingInvitations: boolean
  organizationCount: number
}

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userState, setUserState] = useState<UserState | null>(null)

  useEffect(() => {
    const checkUserState = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        // Check user's organizations
        const { data: memberships, error: membershipError } = await supabase
          .from('memberships')
          .select(`
            id,
            org_id,
            role,
            organizations (
              id,
              name
            )
          `)
          .eq('user_id', user.id)

        if (membershipError) {
          console.error('Error fetching memberships:', membershipError)
          // Continue execution as user might still need onboarding
        }

        // Check pending invitations
        const { data: invitations } = await supabase
          .from('invitations')
          .select('id, organisation, role')
          .eq('invited_email', user.email)
          .eq('status', 'pending')

        const state: UserState = {
          hasOrganizations: Boolean(memberships && memberships.length > 0),
          hasPendingInvitations: Boolean(invitations && invitations.length > 0),
          organizationCount: memberships?.length || 0
        }

        setUserState(state)

        // Route based on user state
        if (state.hasOrganizations) {
          // User has organizations, go to dashboard
          router.push('/dashboard')
        } else if (state.hasPendingInvitations) {
          // User has pending invitations, show them
          router.push('/onboarding/invitations')
        } else {
          // No organizations or invitations, create organization
          router.push('/onboarding/create-organization')
        }
      } catch (error) {
        console.error('Error checking user state:', error)
        // Default to create organization on error
        router.push('/onboarding/create-organization')
      } finally {
        setLoading(false)
      }
    }

    checkUserState()
  }, [router])

  if (loading || !userState) {
    return (
      <OnboardingLayout title="Setting up your account...">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </OnboardingLayout>
    )
  }

  // This should not normally render since we redirect above
  return (
    <OnboardingLayout title="Welcome to ByteTide">
      <div className="text-center py-8">
        <p className="text-neutral-600">Redirecting you to the right place...</p>
      </div>
    </OnboardingLayout>
  )
}