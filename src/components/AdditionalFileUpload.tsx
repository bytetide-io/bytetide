'use client'

import { useState } from 'react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { AdditionalFile } from '@/lib/types'

interface AdditionalFileUploadProps {
  onFileAdd: (file: AdditionalFile) => void
  disabled?: boolean
}

export function AdditionalFileUpload({ onFileAdd, disabled = false }: AdditionalFileUploadProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file: null as File | null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        file,
        name: prev.name || file.name.split('.')[0] // Use filename as default name if empty
      }))
      setErrors(prev => ({ ...prev, file: '' }))
    }
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'File name is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.file) {
      newErrors.file = 'Please select a file'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onFileAdd({
      name: formData.name.trim(),
      description: formData.description.trim(),
      file: formData.file!
    })

    // Reset form
    setFormData({ name: '', description: '', file: null })
    setShowForm(false)
    setErrors({})
  }

  const handleCancel = () => {
    setFormData({ name: '', description: '', file: null })
    setShowForm(false)
    setErrors({})
  }

  if (!showForm) {
    return (
      <Button
        variant="secondary"
        onClick={() => setShowForm(true)}
        disabled={disabled}
        className="w-full"
      >
        Add Additional File
      </Button>
    )
  }

  return (
    <div className="border border-slate-200 rounded-lg p-4 space-y-4 bg-slate-50">
      <h4 className="font-medium text-slate-900">Add File</h4>
      
      <Input
        label="File Name"
        placeholder="e.g., Customer Mailing List"
        value={formData.name}
        onChange={(e) => {
          setFormData(prev => ({ ...prev, name: e.target.value }))
          setErrors(prev => ({ ...prev, name: '' }))
        }}
        error={errors.name}
        required
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Description *
        </label>
        <textarea
          className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          rows={3}
          placeholder="What does this file contain?"
          value={formData.description}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, description: e.target.value }))
            setErrors(prev => ({ ...prev, description: '' }))
          }}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          File *
        </label>
        <input
          type="file"
          accept=".csv,.xlsx,.json,.xml,.sql,.txt"
          onChange={handleFileSelect}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {errors.file && (
          <p className="text-sm text-red-600">{errors.file}</p>
        )}
        {formData.file && (
          <p className="text-xs text-slate-500">
            Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(1)} MB)
          </p>
        )}
      </div>

      <div className="flex space-x-3">
        <Button onClick={handleSubmit} size="sm">
          Add File
        </Button>
        <Button variant="ghost" onClick={handleCancel} size="sm">
          Cancel
        </Button>
      </div>
    </div>
  )
}