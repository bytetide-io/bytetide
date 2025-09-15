'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AuthForm, FormError, FormSuccess } from '@/components/auth/AuthForm'
import { Button } from '@/components/Button'
import { supabase } from '@/lib/supabase/client'

function VerifyPageContent() {
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('')
  const [isResending, setIsResending] = useState(false)

  const handleResendEmail = async () => {
    const email = searchParams.get('email')
    if (!email) {
      setMessage('No email address provided. Please try registering again.')
      return
    }

    setIsResending(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Verification email resent! Please check your inbox.')
      }
    } catch (err) {
      setMessage('Failed to resend verification email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthForm
      title="Check your email"
      subtitle="We've sent you a verification link to complete your registration"
      footer={
        <Link href="/auth/login" className="font-medium text-slate-600 hover:text-slate-500">
          Back to Sign In
        </Link>
      }
    >
      <div className="text-center space-y-6">
        <div className="rounded-full bg-green-50 p-3 mx-auto w-fit">
          <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <div className="space-y-3">
          <p className="text-slate-600">
            Click the verification link in your email to complete your account setup.
          </p>
          <p className="text-sm text-slate-500">
            Didn&apos;t receive an email? Check your spam folder or click below to resend.
          </p>
        </div>
        
        {message && (
          <div className="mt-4">
            {message.includes('resent') ? (
              <FormSuccess message={message} />
            ) : (
              <FormError message={message} />
            )}
          </div>
        )}
        
        <div className="pt-4">
          <Button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full"
            variant="secondary"
          >
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
        </div>
      </div>
    </AuthForm>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <AuthForm title="Email Verification" subtitle="Loading...">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </AuthForm>
    }>
      <VerifyPageContent />
    </Suspense>
  )
}