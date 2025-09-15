import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string }> }
) {
  try {
    const resolvedParams = await params
    const supabase = await createClient()

    // Get the most recent preview file for each type for the given project
    const { data: previewFiles, error } = await supabase
      .from('preview_files')
      .select('*')
      .eq('project', resolvedParams.project_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch preview files' },
        { status: 500 }
      )
    }

    if (!previewFiles || previewFiles.length === 0) {
      return NextResponse.json([])
    }

    // Get the latest file for each type
    const latestFilesByType = new Map<string, typeof previewFiles[0]>()
    
    for (const file of previewFiles) {
      const existingFile = latestFilesByType.get(file.type)
      if (!existingFile || new Date(file.created_at) > new Date(existingFile.created_at)) {
        latestFilesByType.set(file.type, file)
      }
    }

    const result = Array.from(latestFilesByType.values()).sort((a, b) => {
      const typeOrder = ['product', 'order', 'customer', 'collection', 'giftcard', 'discountCode']
      return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching preview files:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}