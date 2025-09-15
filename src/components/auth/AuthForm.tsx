'use client'

import { useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'

interface AuthFormProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthForm({ title, subtitle, children, footer }: AuthFormProps) {
  return (
    <Container className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <FadeIn className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold text-neutral-950">ByteTide</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-neutral-950">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>}
        </div>
        
        <div className="bg-white py-8 px-6 shadow-sm ring-1 ring-neutral-200 rounded-lg">
          {children}
        </div>
        
        {footer && <div className="text-center text-sm text-neutral-600">{footer}</div>}
      </FadeIn>
    </Container>
  )
}

interface FormFieldProps {
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export function FormField({
  label,
  name,
  type = 'text',
  required = false,
  autoComplete,
  placeholder,
  value,
  onChange,
  error,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={clsx(
          'relative block w-full rounded-md border-0 py-2 px-3 text-neutral-900 ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6',
          error && 'ring-red-300 focus:ring-red-600'
        )}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

interface FormErrorProps {
  message: string
}

export function FormError({ message }: FormErrorProps) {
  return (
    <div className="rounded-md bg-red-50 p-4 border border-red-200">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  )
}

interface FormSuccessProps {
  message: string
}

export function FormSuccess({ message }: FormSuccessProps) {
  return (
    <div className="rounded-md bg-green-50 p-4 border border-green-200">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">Success</h3>
          <p className="mt-1 text-sm text-green-700">{message}</p>
        </div>
      </div>
    </div>
  )
}