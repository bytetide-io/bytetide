import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const projectId = resolvedParams.id

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's organization
    const { data: membership, error: membershipError } = await supabase
      .from('memberships')
      .select('org_id')
      .eq('user_id', user.id)
      .single()

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'User is not part of an organization' },
        { status: 403 }
      )
    }

    // Get the project and verify ownership and status
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, status, org_id')
      .eq('id', projectId)
      .eq('org_id', membership.org_id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // Check if project status allows deletion (only "submitted" status)
    if (project.status !== 'submitted') {
      return NextResponse.json(
        { 
          error: 'Project can only be deleted when status is "submitted"',
          currentStatus: project.status
        },
        { status: 400 }
      )
    }

    // Begin transaction-like operations
    // First, delete related project files from storage and database
    const { data: projectFiles, error: filesError } = await supabase
      .from('project_files')
      .select('file_path')
      .eq('project_id', projectId)

    if (!filesError && projectFiles && projectFiles.length > 0) {
      // Delete files from storage
      const filePaths = projectFiles.map(file => file.file_path)
      const { error: storageError } = await supabase.storage
        .from('project-files')
        .remove(filePaths)

      if (storageError) {
        console.error('Error deleting files from storage:', storageError)
        // Continue with deletion even if storage cleanup fails
      }

      // Delete file records from database
      const { error: fileDbError } = await supabase
        .from('project_files')
        .delete()
        .eq('project_id', projectId)

      if (fileDbError) {
        return NextResponse.json(
          { error: 'Failed to delete project files' },
          { status: 500 }
        )
      }
    }

    // Delete preview files if they exist
    const { data: previewFiles, error: previewFilesError } = await supabase
      .from('preview_files')
      .select('file_path')
      .eq('project_id', projectId)

    if (!previewFilesError && previewFiles && previewFiles.length > 0) {
      // Delete preview files from storage
      const previewFilePaths = previewFiles.map(file => file.file_path)
      const { error: previewStorageError } = await supabase.storage
        .from('preview-files')
        .remove(previewFilePaths)

      if (previewStorageError) {
        console.error('Error deleting preview files from storage:', previewStorageError)
        // Continue with deletion even if storage cleanup fails
      }

      // Delete preview file records from database
      const { error: previewDbError } = await supabase
        .from('preview_files')
        .delete()
        .eq('project_id', projectId)

      if (previewDbError) {
        return NextResponse.json(
          { error: 'Failed to delete preview files' },
          { status: 500 }
        )
      }
    }

    // Delete preview records
    const { error: previewsError } = await supabase
      .from('previews')
      .delete()
      .eq('project_id', projectId)

    if (previewsError) {
      console.error('Error deleting previews:', previewsError)
      // Continue with deletion even if preview cleanup fails
    }

    // Finally, delete the project itself
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('org_id', membership.org_id)

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete project' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}