'use client'

import { useState, useRef } from 'react'
import clsx from 'clsx'
import { UploadedFile } from '@/lib/types'

interface FileUploadProps {
  label?: string
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  requiredFiles?: string[]
  optionalFiles?: string[]
  onFilesChange: (files: UploadedFile[]) => void
  disabled?: boolean
  error?: string
  helpText?: string
}

export function FileUpload({
  label,
  accept,
  multiple = true,
  maxSize = 50,
  requiredFiles = [],
  optionalFiles = [],
  onFilesChange,
  disabled = false,
  error,
  helpText
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return

    const newFiles: UploadedFile[] = []
    const maxSizeBytes = maxSize * 1024 * 1024

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      
      if (file.size > maxSizeBytes) {
        continue // Skip files that are too large
      }

      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        file
      })
    }

    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    const droppedFiles = e.dataTransfer.files
    handleFiles(droppedFiles)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const updateFileType = (index: number, selectedType: string) => {
    const updatedFiles = files.map((file, i) => 
      i === index ? { ...file, selectedType } : file
    )
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.includes('csv')) {
      return (
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v8H6V6z" clipRule="evenodd" />
        </svg>
      )
    }
    return (
      <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8v8H6V6z" clipRule="evenodd" />
      </svg>
    )
  }

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      {/* File requirements info */}
      {(requiredFiles.length > 0 || optionalFiles.length > 0) && (
        <div className="text-sm text-slate-600 space-y-1">
          {requiredFiles.length > 0 && (
            <div>
              <span className="font-medium">Required files:</span> {requiredFiles.join(', ')}
            </div>
          )}
          {optionalFiles.length > 0 && (
            <div>
              <span className="font-medium">Optional files:</span> {optionalFiles.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Drop zone */}
      <div
        className={clsx(
          'relative rounded-lg border-2 border-dashed p-6 transition-all duration-200',
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-slate-300 hover:border-slate-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          <svg
            className={clsx(
              'mx-auto h-12 w-12',
              dragActive ? 'text-blue-500' : 'text-slate-400'
            )}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <p className="text-lg font-medium text-slate-700">
              {dragActive ? 'Drop files here' : 'Upload your files'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Max file size: {maxSize}MB • Accepted: {accept || 'All files'}
            </p>
          </div>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-700">
            Uploaded Files ({files.length})
          </h4>
          <div className="space-y-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                
                {/* File type selection */}
                {(requiredFiles.length > 0 || optionalFiles.length > 0) && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-600">
                      What type of file is this?
                    </label>
                    <select
                      value={file.selectedType || ''}
                      onChange={(e) => updateFileType(index, e.target.value)}
                      disabled={disabled}
                      className="block w-full text-sm rounded border border-slate-200 px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select file type...</option>
                      {requiredFiles.length > 0 && (
                        <optgroup label="Required Files">
                          {requiredFiles.map(fileType => (
                            <option key={fileType} value={fileType}>
                              {fileType}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {optionalFiles.length > 0 && (
                        <optgroup label="Optional Files">
                          {optionalFiles.map(fileType => (
                            <option key={fileType} value={fileType}>
                              {fileType}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                    {file.selectedType && (
                      <p className="text-xs text-green-600 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Mapped to {file.selectedType}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {helpText && !error && (
        <p className="text-sm text-slate-500">{helpText}</p>
      )}
    </div>
  )
}