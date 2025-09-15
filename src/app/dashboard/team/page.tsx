'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { Alert } from '@/components/Alert'
import { Card, CardHeader, CardContent } from '@/components/Card'
import { Select } from '@/components/Select'

interface TeamMember {
  id: string
  full_name: string
  email: string
  role: string
  joined_at: string
  invited_by?: string
}

interface PendingInvitation {
  id: number
  invited_email: string
  role: string
  created_at: string
}

const roleOptions = [
  { value: 'viewer', label: 'Viewer', description: 'Can view projects and data' },
  { value: 'member', label: 'Member', description: 'Can create and edit projects' },
  { value: 'admin', label: 'Admin', description: 'Can manage team and settings' },
]

export default function TeamPage() {
  const router = useRouter()
  
  const [members, setMembers] = useState<TeamMember[]>([])
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([])
  const [currentOrg, setCurrentOrg] = useState<string>('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  
  const [loading, setLoading] = useState(true)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        // Get user's organization
        const { data: membership } = await supabase
          .from('memberships')
          .select('org_id, organizations(name)')
          .eq('user_id', user.id)
          .single()

        if (!membership) {
          router.push('/onboarding')
          return
        }

        setCurrentOrg(membership.org_id)

        // Load team members
        const { data: membersData, error: membersError } = await supabase
          .from('memberships')
          .select(`
            id,
            role,
            joined_at,
            user_id,
            users!inner(full_name, email)
          `)
          .eq('org_id', membership.org_id)

        if (membersError) {
          console.error('Error loading members:', membersError)
          setError('Failed to load team members: ' + (membersError.message || 'Unknown error'))
        } else {
          const formattedMembers = membersData?.map((member: any) => ({
            id: member.id,
            full_name: member.users?.full_name || 'Unknown User',
            email: member.users?.email || '',
            role: member.role,
            joined_at: member.joined_at,
          })) || []
          setMembers(formattedMembers)
        }

        // Load pending invitations
        const { data: invitationsData, error: invitationsError } = await supabase
          .from('invitations')
          .select('*')
          .eq('organisation', membership.org_id)
          .eq('status', 'pending')

        if (invitationsError) {
          console.error('Error loading invitations:', invitationsError)
          setError('Failed to load invitations: ' + (invitationsError.message || 'Unknown error'))
        } else {
          setPendingInvitations(invitationsData || [])
        }

      } catch (err) {
        console.error('Error loading team data:', err)
        setError('Failed to load team information.')
      } finally {
        setLoading(false)
      }
    }

    loadTeamData()
  }, [router])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteLoading(true)
    setError('')
    setMessage('')

    if (!inviteEmail) {
      setError('Please enter an email address.')
      setInviteLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inviteEmail)) {
      setError('Please enter a valid email address.')
      setInviteLoading(false)
      return
    }

    try {
      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('memberships')
        .select('id, users!inner(email)')
        .eq('org_id', currentOrg)

      const memberEmails = existingMember?.map((m: any) => m.users?.email).filter(Boolean) || []
      if (memberEmails.includes(inviteEmail)) {
        setError('This user is already a member of your team.')
        setInviteLoading(false)
        return
      }

      // Check if invitation already exists
      const { data: existingInvite } = await supabase
        .from('invitations')
        .select('id')
        .eq('organisation', currentOrg)
        .eq('invited_email', inviteEmail)
        .eq('status', 'pending')
        .single()

      if (existingInvite) {
        setError('An invitation has already been sent to this email address.')
        setInviteLoading(false)
        return
      }

      // Create invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('invitations')
        .insert({
          organisation: currentOrg,
          invited_email: inviteEmail,
          role: inviteRole
        })
        .select()
        .single()

      if (inviteError) {
        console.error('Invitation error:', inviteError)
        setError('Failed to send invitation. Please try again.')
        return
      }

      // Add to pending invitations list
      setPendingInvitations(prev => [...prev, invitation])
      setMessage(`Invitation sent to ${inviteEmail}!`)
      setInviteEmail('')
      
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setInviteLoading(false)
    }
  }

  const cancelInvitation = async (invitationId: number) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', invitationId)

      if (error) {
        setError('Failed to cancel invitation.')
        return
      }

      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId))
      setMessage('Invitation cancelled successfully.')
    } catch (err) {
      setError('Failed to cancel invitation.')
    }
  }

  const removeMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return

    try {
      const { error } = await supabase
        .from('memberships')
        .delete()
        .eq('id', memberId)

      if (error) {
        setError('Failed to remove team member.')
        return
      }

      setMembers(prev => prev.filter(member => member.id !== memberId))
      setMessage('Team member removed successfully.')
    } catch (err) {
      setError('Failed to remove team member.')
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-32 mb-6"></div>
        <div className="space-y-4">
          <div className="h-64 bg-slate-200 rounded"></div>
          <div className="h-48 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
        <p className="mt-2 text-slate-600">
          Invite team members and manage access to your organization.
        </p>
      </div>

      {error && (
        <Alert variant="error" title="Error" className="mb-6">
          {error}
        </Alert>
      )}
      {message && (
        <Alert variant="success" title="Success!" className="mb-6">
          {message}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Invite New Member */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-slate-900">Invite Team Member</h2>
              <p className="text-sm text-slate-600">
                Send an invitation to add a new member to your team.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="space-y-4">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value)
                    setError('')
                  }}
                  placeholder="colleague@company.com"
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                />
                
                <Select
                  label="Role"
                  value={inviteRole}
                  onChange={setInviteRole}
                  options={roleOptions}
                  leftIcon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                />
                
                <Button
                  type="submit"
                  loading={inviteLoading}
                  className="w-full"
                >
                  Send Invitation
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Team Members & Pending Invitations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Members */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-slate-900">Team Members ({members.length})</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-600">
                          {member.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{member.full_name}</div>
                        <div className="text-sm text-slate-500">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 capitalize">
                        {member.role}
                      </span>
                      {member.role !== 'owner' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMember(member.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {members.length === 0 && (
                  <p className="text-center text-slate-500 py-8">No team members yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-slate-900">Pending Invitations ({pendingInvitations.length})</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingInvitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-4 border border-amber-200 bg-amber-50 rounded-lg">
                      <div>
                        <div className="font-medium text-slate-900">{invitation.invited_email}</div>
                        <div className="text-sm text-slate-500">
                          Invited {new Date(invitation.created_at).toLocaleDateString()} • Role: {invitation.role}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelInvitation(invitation.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}