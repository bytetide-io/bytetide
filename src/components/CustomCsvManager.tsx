'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Alert } from '@/components/Alert'
import { CustomCsvUpload } from '@/components/CustomCsvUpload'
import { ProjectFile } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'
import clsx from 'clsx'

interface CustomCsvManagerProps {
  projectId: string
  className?: string
}

export function CustomCsvManager({
  projectId,
  className
}: CustomCsvManagerProps) {
  const [customFiles, setCustomFiles] = useState<ProjectFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomFiles()
  }, [projectId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCustomFiles = async () => {
    try {
      setLoading(true)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('You must be logged in')
      }

      const response = await fetch(`/api/projects/${projectId}/custom-files`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch custom files')
      }

      setCustomFiles(data.files || [])
    } catch (error: any) {
      console.error('Error fetching custom files:', error)
      setError(error.message || 'Failed to load custom files')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(fileId)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('You must be logged in')
      }

      const response = await fetch(`/api/projects/${projectId}/custom-files`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete file')
      }

      // Remove the file from local state
      setCustomFiles(prev => prev.filter(file => file.id !== fileId))
      
    } catch (error: any) {
      console.error('Error deleting file:', error)
      setError(error.message || 'Failed to delete file')
    } finally {
      setDeleting(null)
    }
  }

  const handleUploadSuccess = () => {
    setShowUpload(false)
    fetchCustomFiles()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Card className={clsx('p-6', className)}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-slate-600">Loading custom files...</span>
        </div>
      </Card>
    )
  }

  return (
    <div className={clsx('space-y-4', className)}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-slate-900">
                Custom CSV Files
              </h3>
            </div>
            <p className="text-sm text-slate-600">
              Additional CSV files uploaded for this project
            </p>
          </div>

          <Button
            onClick={() => setShowUpload(!showUpload)}
            variant={showUpload ? "secondary" : "primary"}
            size="sm"
          >
            {showUpload ? 'Cancel' : 'Add Files'}
          </Button>
        </div>

        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Custom Files List */}
        {customFiles.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No custom CSV files uploaded yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Click &quot;Add Files&quot; to upload additional CSV data
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {customFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v8H6V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {file.file_name}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-slate-500">
                        {formatFileSize(file.file_size)}
                      </span>
                      <span className="text-xs text-slate-500">
                        Uploaded {formatDate(file.upload_date)}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Custom CSV
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteFile(file.id)}
                    disabled={deleting === file.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deleting === file.id ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-300 border-t-red-600"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Upload Component */}
      {showUpload && (
        <CustomCsvUpload
          projectId={projectId}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  )
}