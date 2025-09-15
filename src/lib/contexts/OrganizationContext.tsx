'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Organization {
  id: string
  name: string
  domain: string
  country?: string
  created_at: string
}

interface Membership {
  id: string
  role: string
  organization: Organization
}

interface OrganizationContextType {
  currentOrganization: Organization | null
  organizations: Membership[]
  loading: boolean
  switchOrganization: (orgId: string) => void
  refreshOrganizations: () => Promise<void>
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}

interface OrganizationProviderProps {
  children: React.ReactNode
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [organizations, setOrganizations] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrganizations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setOrganizations([])
        setCurrentOrganization(null)
        return
      }

      // Fetch user's organization memberships
      const { data: memberships, error } = await supabase
        .from('memberships')
        .select(`
          id,
          role,
          organizations (
            id,
            name,
            domain,
            country,
            created_at
          )
        `)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching organizations:', error)
        return
      }

      const formattedMemberships: Membership[] = (memberships || []).map(membership => ({
        id: membership.id,
        role: membership.role,
        organization: membership.organizations as any as Organization
      }))

      setOrganizations(formattedMemberships)

      // Set current organization (first one by default, or from localStorage)
      const savedOrgId = localStorage.getItem('currentOrganizationId')
      let currentOrg = null

      if (savedOrgId) {
        currentOrg = formattedMemberships.find(m => m.organization.id === savedOrgId)?.organization
      }

      if (!currentOrg && formattedMemberships.length > 0) {
        currentOrg = formattedMemberships[0].organization
      }

      setCurrentOrganization(currentOrg || null)

      if (currentOrg) {
        localStorage.setItem('currentOrganizationId', currentOrg.id)
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    } finally {
      setLoading(false)
    }
  }

  const switchOrganization = (orgId: string) => {
    const membership = organizations.find(m => m.organization.id === orgId)
    if (membership) {
      setCurrentOrganization(membership.organization)
      localStorage.setItem('currentOrganizationId', orgId)
    }
  }

  const refreshOrganizations = async () => {
    setLoading(true)
    await fetchOrganizations()
  }

  useEffect(() => {
    fetchOrganizations()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchOrganizations()
      } else if (event === 'SIGNED_OUT') {
        setOrganizations([])
        setCurrentOrganization(null)
        localStorage.removeItem('currentOrganizationId')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const value: OrganizationContextType = {
    currentOrganization,
    organizations,
    loading,
    switchOrganization,
    refreshOrganizations
  }

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  )
}