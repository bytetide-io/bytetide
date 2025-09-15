import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface JsonlItem {
  id?: string | number
  [key: string]: any
}

const SUPABASE_STORAGE_BASE_URL = 'https://rknpobahcyqdmhissldh.supabase.co/storage/v1/object/public/projects'

async function streamJsonlPagination(
  fileUrl: string,
  page: number,
  itemsPerPage: number = 10
): Promise<{
  items: JsonlItem[]
  totalItems: number
  hasNext: boolean
}> {
  const response = await fetch(fileUrl)
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  if (!response.body) {
    throw new Error('Response body is null')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  
  let buffer = ''
  let lineCount = 0
  let items: JsonlItem[] = []
  let targetStart = (page - 1) * itemsPerPage
  let targetEnd = targetStart + itemsPerPage
  let foundItems = 0
  
  try {
    while (true) {
      const { done, value } = await reader.read()
      
      if (done) break
      
      buffer += decoder.decode(value, { stream: true })
      
      // Process complete lines
      let newlineIndex
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newlineIndex).trim()
        buffer = buffer.slice(newlineIndex + 1)
        
        if (line) {
          // Check if this line is in our target range
          if (lineCount >= targetStart && lineCount < targetEnd) {
            try {
              const item = JSON.parse(line)
              items.push(item)
              foundItems++
            } catch (parseError) {
              console.error(`Error parsing JSONL line ${lineCount}:`, parseError)
            }
          }
          
          lineCount++
          
          // If we have enough items for this page and we're past the target range,
          // we can continue counting for totalItems but stop parsing JSON
          if (foundItems >= itemsPerPage && lineCount >= targetEnd) {
            // Continue reading just to count total lines, but don't parse JSON
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              
              const chunk = decoder.decode(value, { stream: true })
              buffer += chunk
              
              let newlineIndex
              while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
                const line = buffer.slice(0, newlineIndex).trim()
                buffer = buffer.slice(newlineIndex + 1)
                if (line) lineCount++
              }
            }
            break
          }
        }
      }
    }
    
    // Process any remaining content in buffer
    if (buffer.trim()) {
      if (lineCount >= targetStart && lineCount < targetEnd && foundItems < itemsPerPage) {
        try {
          const item = JSON.parse(buffer.trim())
          items.push(item)
        } catch (parseError) {
          console.error(`Error parsing final JSONL line:`, parseError)
        }
      }
      lineCount++
    }
    
  } finally {
    reader.releaseLock()
  }
  
  return {
    items,
    totalItems: lineCount,
    hasNext: lineCount > targetEnd
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ project_id: string }> }
) {
  try {
    const resolvedParams = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const fileType = searchParams.get('type') || 'product'
    const itemsPerPage = 10

    if (page < 1) {
      return NextResponse.json({ error: 'Page must be >= 1' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get the latest preview file for the requested type and project
    const { data: previewFile, error: dbError } = await supabase
      .from('preview_files')
      .select('file_path')
      .eq('project', resolvedParams.project_id)
      .eq('type', fileType)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (dbError || !previewFile) {
      return NextResponse.json({
        items: [],
        pagination: {
          page,
          itemsPerPage,
          totalItems: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false
        },
        fileType,
        exists: false
      })
    }

    // Construct Supabase Storage URL using the file path from database
    const fileUrl = `${SUPABASE_STORAGE_BASE_URL}/${previewFile.file_path}`
    
    try {
      // Use streaming pagination
      const { items, totalItems, hasNext } = await streamJsonlPagination(fileUrl, page, itemsPerPage)
      
      // Check if file exists (if we get no items and we're on page 1, file might not exist)
      if (items.length === 0 && page === 1 && totalItems === 0) {
        return NextResponse.json({
          items: [],
          pagination: {
            page,
            itemsPerPage,
            totalItems: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false
          },
          fileType,
          exists: false
        })
      }
      
      // Calculate pagination info
      const totalPages = Math.ceil(totalItems / itemsPerPage)
      const hasPrevious = page > 1

      return NextResponse.json({
        items,
        pagination: {
          page,
          itemsPerPage,
          totalItems,
          totalPages,
          hasNext,
          hasPrevious
        },
        fileType,
        exists: true
      })
      
    } catch (fetchError: any) {
      if (fetchError.message.includes('HTTP 404')) {
        return NextResponse.json({
          items: [],
          pagination: {
            page,
            itemsPerPage,
            totalItems: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false
          },
          fileType,
          exists: false
        })
      }
      
      console.error(`Error fetching file from Supabase Storage:`, fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch preview data' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in preview API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

