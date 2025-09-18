'use client'

import React, { Component, ReactNode } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  showDetails?: boolean
}

interface ErrorFallbackProps {
  error: Error | null
  retry: () => void
  showDetails?: boolean
}

function DefaultErrorFallback({ error, retry, showDetails = false }: ErrorFallbackProps) {
  return (
    <Card className="p-8 text-center max-w-lg mx-auto">
      <div className="flex justify-center mb-4">
        <svg 
          className="w-12 h-12 text-red-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1.5" 
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
          />
        </svg>
      </div>
      
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        Something went wrong
      </h2>
      
      <p className="text-slate-600 mb-6">
        We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
      </p>

      {showDetails && error && (
        <details className="mb-6 text-left">
          <summary className="cursor-pointer text-sm font-medium text-slate-700 mb-2">
            Error Details
          </summary>
          <pre className="text-xs text-slate-600 bg-slate-50 p-3 rounded border overflow-auto max-h-32">
            {error.toString()}
          </pre>
        </details>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          onClick={retry}
          variant="primary"
        >
          Try Again
        </Button>
        
        <Button 
          onClick={() => window.location.reload()}
          variant="secondary"
        >
          Reload Page
        </Button>
      </div>
    </Card>
  )
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Render default error fallback
      return (
        <DefaultErrorFallback
          error={this.state.error}
          retry={this.handleRetry}
          showDetails={this.props.showDetails}
        />
      )
    }

    return this.props.children
  }
}

// Specific error boundaries for different sections

export function DashboardErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Dashboard error:', error)
        // Here you could send to monitoring service
      }}
      showDetails={process.env.NODE_ENV === 'development'}
    >
      {children}
    </ErrorBoundary>
  )
}

export function FormErrorBoundary({ children }: { children: ReactNode }) {
  const FormErrorFallback = ({ error, retry }: ErrorFallbackProps) => (
    <Card className="p-6 text-center">
      <div className="flex justify-center mb-4">
        <svg 
          className="w-8 h-8 text-red-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        Form Error
      </h3>
      
      <p className="text-slate-600 mb-4">
        The form encountered an error. Please try again.
      </p>
      
      <Button onClick={retry} variant="primary" size="sm">
        Reset Form
      </Button>
    </Card>
  )

  return (
    <ErrorBoundary
      fallback={<FormErrorFallback error={null} retry={() => {}} />}
      onError={(error, errorInfo) => {
        console.error('Form error:', error)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Page error:', error)
        // Here you could send to monitoring service
      }}
      showDetails={process.env.NODE_ENV === 'development'}
    >
      {children}
    </ErrorBoundary>
  )
}

DashboardErrorBoundary.displayName = 'DashboardErrorBoundary'
FormErrorBoundary.displayName = 'FormErrorBoundary'
PageErrorBoundary.displayName = 'PageErrorBoundary'