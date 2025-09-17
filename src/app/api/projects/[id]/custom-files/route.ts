import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const projectId = resolvedParams.id
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    // Get authenticated user
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    // Create client for user authentication
    const supabaseClient = await createClient()
    
    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
    }

    // Verify user has access to this project
    const { data: membership } = await supabaseAdmin
      .from('memberships')
      .select('org_id, role')
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'User is not part of an organization' }, { status: 403 })
    }

    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('id, org_id')
      .eq('id', projectId)
      .eq('org_id', membership.org_id)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 })
    }

    // Check permissions - members, admins, and owners can upload
    if (!['member', 'admin', 'owner'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const uploadResults = []

    for (const file of files) {
      try {
        // Validate file type
        if (!file.name.toLowerCase().endsWith('.csv')) {
          uploadResults.push({
            name: file.name,
            success: false,
            error: 'Only CSV files are allowed for custom uploads'
          })
          continue
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
          uploadResults.push({
            name: file.name,
            success: false,
            error: 'File size must be less than 50MB'
          })
          continue
        }

        // Create unique file name to match existing structure
        const fileName = `projects/${projectId}/${Date.now()}-${file.name}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabaseAdmin.storage
          .from('projects')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Save file record to database
        const { error: dbError } = await supabaseAdmin
          .from('project_files')
          .insert({
            project_id: projectId,
            file_name: file.name,
            file_type: 'custom-csv',
            file_path: fileName,
            file_size: file.size,
            is_initial: false
          })

        if (dbError) throw dbError

        uploadResults.push({
          name: file.name,
          success: true,
          size: file.size,
          path: fileName
        })

      } catch (error: any) {
        console.error(`Error uploading file ${file.name}:`, error)
        uploadResults.push({
          name: file.name,
          success: false,
          error: error.message || 'Failed to upload file'
        })
      }
    }

    return NextResponse.json({
      success: true,
      results: uploadResults
    })

  } catch (error: any) {
    console.error('Error in custom file upload:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const projectId = resolvedParams.id

    // Get authenticated user
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    // Create client for user authentication
    const supabaseClient = await createClient()
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
    }

    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verify user has access to this project
    const { data: membership } = await supabaseAdmin
      .from('memberships')
      .select('org_id')
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'User is not part of an organization' }, { status: 403 })
    }

    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('id, org_id')
      .eq('id', projectId)
      .eq('org_id', membership.org_id)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 })
    }

    // Fetch custom CSV files
    const { data: customFiles, error } = await supabaseAdmin
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .eq('file_type', 'custom-csv')
      .order('upload_date', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      files: customFiles || []
    })

  } catch (error: any) {
    console.error('Error fetching custom files:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const projectId = resolvedParams.id
    const { fileId } = await request.json()

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
    }

    // Get authenticated user
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
    }

    // Create client for user authentication
    const supabaseClient = await createClient()
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
    }

    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verify user has access and permissions
    const { data: membership } = await supabaseAdmin
      .from('memberships')
      .select('org_id, role')
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'User is not part of an organization' }, { status: 403 })
    }

    // Check permissions - only admins and owners can delete
    if (!['admin', 'owner'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions to delete files' }, { status: 403 })
    }

    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('id, org_id')
      .eq('id', projectId)
      .eq('org_id', membership.org_id)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 })
    }

    // Get file details
    const { data: fileToDelete } = await supabaseAdmin
      .from('project_files')
      .select('file_path')
      .eq('id', fileId)
      .eq('project_id', projectId)
      .eq('file_type', 'custom-csv')
      .single()

    if (!fileToDelete) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Delete from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('projects')
      .remove([fileToDelete.file_path])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
      // Continue with database deletion even if storage fails
    }

    // Delete from database
    const { error: dbError } = await supabaseAdmin
      .from('project_files')
      .delete()
      .eq('id', fileId)

    if (dbError) throw dbError

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error: any) {
    console.error('Error deleting custom file:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}