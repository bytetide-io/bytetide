'use client'

import Link from 'next/link'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'

interface OnboardingLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  step?: number
  totalSteps?: number
}

export function OnboardingLayout({ 
  title, 
  subtitle, 
  children, 
  step, 
  totalSteps 
}: OnboardingLayoutProps) {
  return (
    <Container className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <FadeIn className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-neutral-950">ByteTide</span>
          </Link>
          
          {step && totalSteps && (
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i + 1 <= step ? 'bg-blue-600' : 'bg-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-3 text-sm text-neutral-500">
                Step {step} of {totalSteps}
              </span>
            </div>
          )}
          
          <h1 className="mt-6 text-3xl font-bold text-neutral-950">{title}</h1>
          {subtitle && <p className="mt-2 text-lg text-neutral-600">{subtitle}</p>}
        </div>
        
        <div className="bg-white py-8 px-8 shadow-sm ring-1 ring-neutral-200 rounded-lg">
          {children}
        </div>
      </FadeIn>
    </Container>
  )
}

interface InvitationCardProps {
  organizationName: string
  role: string
  invitedBy?: string
  onAccept: () => void
  onDecline: () => void
  loading?: boolean
}

export function InvitationCard({
  organizationName,
  role,
  invitedBy,
  onAccept,
  onDecline,
  loading = false
}: InvitationCardProps) {
  return (
    <div className="border border-neutral-200 rounded-lg p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">{organizationName}</h3>
        <p className="text-sm text-neutral-600">
          Role: <span className="font-medium capitalize">{role}</span>
        </p>
        {invitedBy && (
          <p className="text-sm text-neutral-600">
            Invited by: <span className="font-medium">{invitedBy}</span>
          </p>
        )}
      </div>
      
      <div className="flex space-x-3">
        <button
          onClick={onAccept}
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Accepting...' : 'Accept'}
        </button>
        <button
          onClick={onDecline}
          disabled={loading}
          className="flex-1 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Decline
        </button>
      </div>
    </div>
  )
}