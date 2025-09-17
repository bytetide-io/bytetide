'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { FileUpload } from '@/components/FileUpload'
import { Card } from '@/components/Card'
import { Alert } from '@/components/Alert'
import { UploadedFile, ProjectFile } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'
import clsx from 'clsx'

interface CustomCsvUploadProps {
  projectId: string
  onUploadSuccess?: () => void
  className?: string
}

interface UploadResult {
  name: string
  success: boolean
  error?: string
  size?: number
  path?: string
}

export function CustomCsvUpload({
  projectId,
  onUploadSuccess,
  className
}: CustomCsvUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([])
  const [error, setError] = useState('')

  const handleFilesChange = (files: UploadedFile[]) => {
    setUploadedFiles(files)
    setError('')
    setUploadResults([])
  }

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please select at least one CSV file to upload')
      return
    }

    // Validate that all files are CSV
    const nonCsvFiles = uploadedFiles.filter(file => 
      !file.name.toLowerCase().endsWith('.csv')
    )

    if (nonCsvFiles.length > 0) {
      setError(`Only CSV files are allowed. Please remove: ${nonCsvFiles.map(f => f.name).join(', ')}`)
      return
    }

    setUploading(true)
    setError('')
    setUploadResults([])

    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('You must be logged in to upload files')
      }

      const formData = new FormData()
      uploadedFiles.forEach(uploadedFile => {
        formData.append('files', uploadedFile.file)
      })

      const response = await fetch(`/api/projects/${projectId}/custom-files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload files')
      }

      setUploadResults(data.results || [])
      
      // Check if any uploads succeeded
      const successfulUploads = data.results.filter((result: UploadResult) => result.success)
      
      if (successfulUploads.length > 0) {
        setUploadedFiles([])
        onUploadSuccess?.()
      }

    } catch (error: any) {
      console.error('Upload error:', error)
      setError(error.message || 'Failed to upload files')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className={clsx('p-6', className)}>
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          <h3 className="text-lg font-medium text-slate-900">
            Upload Custom CSV Files
          </h3>
        </div>
        <p className="text-sm text-slate-600">
          Add additional CSV files from other systems to complement your migration data.
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      {uploadResults.length > 0 && (
        <div className="mb-4 space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Upload Results:</h4>
          {uploadResults.map((result, index) => (
            <div
              key={index}
              className={clsx(
                'p-3 rounded-lg border text-sm',
                result.success
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{result.name}</span>
                {result.success ? (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Uploaded</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Failed</span>
                  </div>
                )}
              </div>
              {result.error && (
                <p className="text-xs mt-1 text-red-700">{result.error}</p>
              )}
              {result.success && result.size && (
                <p className="text-xs mt-1 text-green-700">
                  Size: {(result.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <FileUpload
        label="Select CSV Files"
        accept=".csv"
        multiple={true}
        maxSize={50}
        onFilesChange={handleFilesChange}
        disabled={uploading}
        helpText="Only CSV files are supported for custom uploads. Maximum 50MB per file."
      />

      {uploadedFiles.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleUpload}
            loading={uploading}
            disabled={uploading || uploadedFiles.length === 0}
          >
            {uploading ? 'Uploading...' : `Upload ${uploadedFiles.length} File${uploadedFiles.length === 1 ? '' : 's'}`}
          </Button>
        </div>
      )}
    </Card>
  )
}