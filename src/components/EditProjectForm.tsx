'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Card } from '@/components/Card'
import { Alert } from '@/components/Alert'
import { AdditionalFileUpload } from '@/components/AdditionalFileUpload'
import { supabase } from '@/lib/supabase/client'
import { Project, ItemType, ProjectFile, Platform, AdditionalFile } from '@/lib/types'
import { validateDomain, validateShopifyUrl, validateShopifyAccessToken, normalizeShopifyUrl, normalizeDomain } from '@/lib/validation'
import clsx from 'clsx'

const ITEM_OPTIONS = [
  { value: 'product', label: 'Products', description: 'Product catalog and variants' },
  { value: 'collection', label: 'Collections', description: 'Product categories and collections' },
  { value: 'customer', label: 'Customers', description: 'Customer accounts and profiles' },
  { value: 'order', label: 'Orders', description: 'Order history and transactions' },
  { value: 'discountCode', label: 'Discount Codes', description: 'Coupons and promotional codes' },
  { value: 'giftcard', label: 'Gift Cards', description: 'Gift card balances and codes' }
]

interface EditProjectFormProps {
  project: Project
  onSuccess?: () => void
  onCancel?: () => void
}

export function EditProjectForm({ project, onSuccess, onCancel }: EditProjectFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({
    domain: project.domain || '',
    shopify_url: project.shopify_url || '',
    shopify_access_token: project.access_token || '',
    special_demands: project.special_demands || '',
    items: project.items || [],
    ...Object.keys(project.source_api || {}).reduce((acc, key) => {
      acc[`api_${key}`] = project.source_api?.[key] || ''
      return acc
    }, {} as Record<string, string>)
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [newFiles, setNewFiles] = useState<AdditionalFile[]>([])
  const [existingFiles, setExistingFiles] = useState<ProjectFile[]>([])
  const [platform, setPlatform] = useState<Platform | null>(null)

  const router = useRouter()

  // Determine migration type based on platform structure
  const isCSVMigration = platform && platform.files && platform.files.length > 0
  const isAPIMigration = platform && platform.api && !platform.plugin
  const isPluginMigration = platform && platform.plugin && platform.api
  const isCustomMigration = platform && !platform.files && !platform.api && !platform.plugin
  
  const requiresFiles = isCSVMigration || isCustomMigration
  const requiresAPI = isAPIMigration || isPluginMigration

  useEffect(() => {
    fetchExistingFiles()
    fetchPlatform()
  }, [project.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchExistingFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', project.id)
        .order('upload_date', { ascending: false })

      if (error) throw error
      setExistingFiles(data || [])
    } catch (error) {
      console.error('Error fetching existing files:', error)
    }
  }

  const fetchPlatform = async () => {
    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .eq('id', project.source_platform)
        .single()

      if (error) throw error
      setPlatform(data)
    } catch (error) {
      console.error('Error fetching platform:', error)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.domain) {
      newErrors.domain = 'Domain is required'
    } else if (!validateDomain(formData.domain)) {
      newErrors.domain = 'Please enter a valid domain (e.g., example.com)'
    }

    if (!formData.shopify_url) {
      newErrors.shopify_url = 'Shopify URL is required'
    } else if (!validateShopifyUrl(normalizeShopifyUrl(formData.shopify_url))) {
      newErrors.shopify_url = 'Please enter a valid Shopify URL (e.g., mystore.myshopify.com)'
    }

    if (!formData.shopify_access_token) {
      newErrors.shopify_access_token = 'Shopify access token is required'
    } else if (!validateShopifyAccessToken(formData.shopify_access_token)) {
      newErrors.shopify_access_token = 'Please enter a valid Shopify access token'
    }

    if (!formData.items || formData.items.length === 0) {
      newErrors.items = 'Please select at least one data type to migrate'
    }

    // API-specific validation for API-based projects
    if (requiresAPI && platform?.api) {
      Object.keys(platform.api).forEach(key => {
        if (!formData[`api_${key}`]) {
          newErrors[`api_${key}`] = `${key} is required`
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDomainChange = (value: string) => {
    setFormData(prev => ({ ...prev, domain: normalizeDomain(value) }))
    if (errors.domain) {
      setErrors(prev => ({ ...prev, domain: '' }))
    }
  }

  const handleShopifyUrlChange = (value: string) => {
    setFormData(prev => ({ ...prev, shopify_url: normalizeShopifyUrl(value) }))
    if (errors.shopify_url) {
      setErrors(prev => ({ ...prev, shopify_url: '' }))
    }
  }

  const handleItemToggle = (itemValue: string) => {
    const currentItems = formData.items || []
    const newItems = currentItems.includes(itemValue as ItemType)
      ? currentItems.filter((item: ItemType) => item !== itemValue)
      : [...currentItems, itemValue as ItemType]

    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const handleFileAdd = (file: AdditionalFile) => {
    setNewFiles(prev => [...prev, file])
    if (errors.files) {
      setErrors(prev => ({ ...prev, files: '' }))
    }
  }

  const uploadNewFiles = async (): Promise<void> => {
    if (newFiles.length === 0) return

    for (const newFile of newFiles) {
      // Upload file to Supabase Storage  
      const fileName = `projects/${project.id}/${Date.now()}-${newFile.file.name}`
      const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(fileName, newFile.file)

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        throw new Error(`Failed to upload ${newFile.name}: ${uploadError.message}`)
      }

      // Save file record to database
      const { error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: project.id,
          file_name: newFile.name,
          file_type: 'additional-file',
          file_path: fileName,
          file_size: newFile.file.size,
          is_initial: false,
          description: newFile.description
        })

      if (dbError) {
        console.error('Database insert error:', dbError)
        // Try to cleanup the uploaded file
        try {
          await supabase.storage
            .from('project-files')
            .remove([fileName])
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded file:', cleanupError)
        }
        throw new Error(`Failed to save file record for ${newFile.name}: ${dbError.message}`)
      }
    }
  }

  const deleteFile = async (fileId: string) => {
    try {
      const fileToDelete = existingFiles.find(f => f.id === fileId)
      if (!fileToDelete) return

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('project-files')
        .remove([fileToDelete.file_path])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId)

      if (dbError) throw dbError

      // Update local state
      setExistingFiles(prev => prev.filter(f => f.id !== fileId))
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      // Handle new file uploads
      if (newFiles.length > 0) {
        await uploadNewFiles()
      }

      // Prepare update data
      const updateData: any = {
        domain: formData.domain,
        shopify_url: formData.shopify_url,
        access_token: formData.shopify_access_token,
        special_demands: formData.special_demands || null,
        items: formData.items,
        updated_at: new Date().toISOString()
      }

      // Add API-specific data for API-based projects
      if (requiresAPI && platform?.api) {
        const apiData: Record<string, string> = {}
        Object.keys(platform.api).forEach(key => {
          const value = formData[`api_${key}`]
          if (value) apiData[key] = value
        })
        updateData.source_api = apiData
      }

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', project.id)

      if (error) throw error

      onSuccess?.()
    } catch (error: any) {
      console.error('Error updating project:', error)
      setErrors({ general: error.message || 'Failed to update project' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Edit Project
        </h2>
        <p className="text-slate-600">
          Update your project settings.
        </p>
      </div>

      {errors.general && (
        <Alert variant="error" className="mb-6">
          {errors.general}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Source Store Domain"
          placeholder="myshop.com"
          value={formData.domain}
          onChange={(e) => handleDomainChange(e.target.value)}
          error={errors.domain}
          helpText="The domain of the store you're migrating from"
          required
        />

        <Input
          label="Shopify Store URL"
          placeholder="mynewstore.myshopify.com"
          value={formData.shopify_url}
          onChange={(e) => handleShopifyUrlChange(e.target.value)}
          error={errors.shopify_url}
          helpText="The URL of your new Shopify store"
          required
        />

        <Input
          label="Shopify Access Token"
          type="password"
          placeholder="shpat_..."
          value={formData.shopify_access_token}
          onChange={(e) => setFormData(prev => ({ ...prev, shopify_access_token: e.target.value }))}
          error={errors.shopify_access_token}
          helpText="Your private app access token for the Shopify store"
          required
        />

        {/* API Credentials Section for API-based projects */}
        {requiresAPI && platform?.api && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <h3 className="text-lg font-medium text-blue-900">API Settings</h3>
            </div>
            <p className="text-sm text-blue-700">Update your API credentials.</p>

            {Object.entries(platform.api).map(([key, config]) => (
              <Input
                key={key}
                label={config.label || key}
                type={config.type === 'password' ? 'password' : 'text'}
                value={formData[`api_${key}`] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [`api_${key}`]: e.target.value }))}
                placeholder={config.placeholder || `Enter ${key}...`}
                error={errors[`api_${key}`]}
                helpText={config.description}
                required
              />
            ))}
          </div>
        )}

        {/* File Management Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-slate-900">Project Files</h3>
            <p className="text-sm text-slate-600">Manage your project files</p>
          </div>

          {/* Existing Files */}
          {existingFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-700">Current Files</h4>
              <div className="space-y-2">
                {existingFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{file.file_name}</p>
                        {file.description && (
                          <p className="text-xs text-slate-600">{file.description}</p>
                        )}
                        <p className="text-xs text-slate-500">
                          {file.file_type} • {(file.file_size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteFile(file.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Files to Upload */}
          {newFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-700">New Files to Upload</h4>
              <div className="space-y-2">
                {newFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{file.name}</p>
                        <p className="text-xs text-slate-600">{file.description}</p>
                        <p className="text-xs text-slate-500">
                          {file.file.name} • {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setNewFiles(prev => prev.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New File */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700">Add New File</h4>
            <AdditionalFileUpload
              onFileAdd={handleFileAdd}
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            What data do you want to migrate? *
          </label>
          {errors.items && (
            <p className="text-sm text-red-600">{errors.items}</p>
          )}
          <div className="grid grid-cols-1 gap-3">
            {ITEM_OPTIONS.map(option => {
              const isSelected = formData.items?.includes(option.value as ItemType) || false
              return (
                <label
                  key={option.value}
                  className={clsx(
                    'relative flex cursor-pointer rounded-lg border p-4 transition-all',
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => handleItemToggle(option.value)}
                  />
                  <div className="flex items-center">
                    <div className={clsx(
                      'flex h-5 w-5 items-center justify-center rounded border',
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300'
                    )}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-slate-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-slate-500">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Special Requirements
          </label>
          <textarea
            className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            rows={3}
            placeholder="Any special requirements..."
            value={formData.special_demands}
            onChange={(e) => setFormData(prev => ({ ...prev, special_demands: e.target.value }))}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Update Project
          </Button>
        </div>
      </form>
    </Card>
  )
}