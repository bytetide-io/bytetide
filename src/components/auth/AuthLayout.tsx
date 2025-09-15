'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/Card'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'

interface AuthLayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container className="w-full max-w-md">
        <FadeIn>
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <span className="text-2xl font-bold text-slate-900">ByteTide</span>
              </div>
            </Link>
          </div>

          {/* Auth Card */}
          <Card className="border-0 shadow-xl">
            <CardContent className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                {subtitle && (
                  <p className="text-slate-600 text-sm leading-relaxed">{subtitle}</p>
                )}
              </div>

              {/* Form */}
              <div className="space-y-5">
                {children}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          {footer && (
            <div className="text-center mt-6 text-sm text-slate-600">
              {footer}
            </div>
          )}
        </FadeIn>
      </Container>
    </div>
  )
}