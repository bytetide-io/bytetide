'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { OrganizationProvider, useOrganization } from '@/lib/contexts/OrganizationContext'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { NoOrganizationScreen } from '@/components/NoOrganizationScreen'
import { Logo } from '@/components/Logo'

function OrganizationSwitcher() {
  const { currentOrganization, organizations, switchOrganization } = useOrganization()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element
      if (dropdownOpen && !target.closest('[data-dropdown="org-switcher"]')) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  if (organizations.length <= 1) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-sm"></div>
        </div>
        <span className="text-sm font-semibold text-slate-900">
          {currentOrganization?.name || 'No Organization'}
        </span>
      </div>
    )
  }

  return (
    <div className="relative" data-dropdown="org-switcher">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-sm"></div>
        </div>
        <span className="text-sm font-semibold text-slate-900">
          {currentOrganization?.name || 'Select Organization'}
        </span>
        <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Organizations</p>
            </div>
            <div className="py-1">
              {organizations.map((membership) => (
                <button
                  key={membership.organization.id}
                  onClick={() => {
                    switchOrganization(membership.organization.id)
                    setDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center space-x-3 ${currentOrganization?.id === membership.organization.id
                    ? 'bg-blue-50 text-blue-900 border-r-2 border-blue-500'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentOrganization?.id === membership.organization.id
                    ? 'bg-blue-500'
                    : 'bg-slate-900'
                    }`}>
                    <div className="w-3 h-3 bg-white rounded-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{membership.organization.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{membership.role}</div>
                  </div>
                  {currentOrganization?.id === membership.organization.id && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DashboardHeader() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element
      if (dropdownOpen && !target.closest('[data-dropdown="user-menu"]')) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center">
              <Logo
                className="h-6"
                invert={false}
                filled={true}
              />
            </Link>
            <OrganizationSwitcher />
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-1">
              <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/projects" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                Projects
              </Link>
              <Link href="/dashboard/team" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                Team
              </Link>
              <Link href="/dashboard/settings" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                Settings
              </Link>
            </nav>

            <div className="relative" data-dropdown="user-menu">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-slate-600">
                    {(user?.user_metadata?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-slate-600">
                            {(user?.user_metadata?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-900 truncate">
                            {user?.user_metadata?.full_name || 'User'}
                          </div>
                          <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center w-full text-left px-4 py-3 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Account Settings
                      </Link>
                      <Link
                        href="/dashboard/organization"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center w-full text-left px-4 py-3 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5h6m-6 0H9m8 0v9" />
                        </svg>
                        Organization Settings
                      </Link>
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { loading, currentOrganization } = useOrganization()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-slate-900"></div>
      </div>
    )
  }

  if (!currentOrganization) {
    return <NoOrganizationScreen />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OrganizationProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </OrganizationProvider>
  )
}