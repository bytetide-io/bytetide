'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { FileUpload } from '@/components/FileUpload'
import { Card } from '@/components/Card'
import { Alert } from '@/components/Alert'
import { supabase } from '@/lib/supabase/client'
import { Platform, CreateProjectData, UploadedFile, AdditionalFile, ItemType } from '@/lib/types'
import { AdditionalFileUpload } from '@/components/AdditionalFileUpload'
import { useOrganization } from '@/lib/contexts/OrganizationContext'
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

interface NewProjectFormProps {
  onSuccess?: (projectId: string) => void
  onCancel?: () => void
}

export function NewProjectForm({ onSuccess, onCancel }: NewProjectFormProps) {
  const { currentOrganization, loading: orgLoading } = useOrganization()
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [formData, setFormData] = useState<CreateProjectData>({
    domain: '',
    source_platform: '',
    special_demands: '',
    shopify_url: '',
    shopify_access_token: '',
    items: [],
    api_data: {}
  })
  const [files, setFiles] = useState<UploadedFile[]>([])  // Platform-specific required files
  const [additionalFiles, setAdditionalFiles] = useState<AdditionalFile[]>([])  // Additional custom files
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [platformsLoading, setPlatformsLoading] = useState(true)
  const [step, setStep] = useState(1) // 1: Basic Info, 2: Platform Details, 3: Files/API, 4: Review

  const router = useRouter()

  useEffect(() => {
    fetchPlatforms()
  }, [])

  const fetchPlatforms = async () => {
    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .order('name')

      if (error) throw error
      setPlatforms(data || [])
    } catch (error) {
      console.error('Error fetching platforms:', error)
      setErrors({ general: 'Failed to load platforms' })
    } finally {
      setPlatformsLoading(false)
    }
  }

  const platform = platforms.find(p => p.id === selectedPlatform)
  
  // Determine migration type based on platform structure
  const isCSVMigration = platform && platform.files && platform.files.length > 0
  const isAPIMigration = platform && platform.api && !platform.plugin
  const isPluginMigration = platform && platform.plugin && platform.api
  const isCustomMigration = platform && !platform.files && !platform.api && !platform.plugin
  
  const requiresFiles = isCSVMigration || isCustomMigration
  const requiresAPI = isAPIMigration || isPluginMigration
  const requiresPlugin = isPluginMigration

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (stepNumber === 1) {
      if (!formData.domain) {
        newErrors.domain = 'Domain is required'
      } else if (!validateDomain(formData.domain)) {
        newErrors.domain = 'Please enter a valid domain (e.g., example.com)'
      }

      if (!formData.source_platform) {
        newErrors.source_platform = 'Source platform is required'
      }
    }

    if (stepNumber === 2) {
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
    }

    if (stepNumber === 3) {
      // For CSV migration, check if required files are uploaded
      if (isCSVMigration && platform?.files) {
        if (files.length === 0) {
          newErrors.files = 'Please upload the required files'
        } else {
          // Check if all required files are mapped
          const requiredFiles = platform.files
          const mappedFiles = files
            .filter(f => f.selectedType && requiredFiles.includes(f.selectedType))
            .map(f => f.selectedType)

          const missingRequired = requiredFiles.filter(rf => !mappedFiles.includes(rf))
          if (missingRequired.length > 0) {
            newErrors.files = `Please upload files for: ${missingRequired.join(', ')}`
          }

          // Check for unmapped files
          const unmappedFiles = files.filter(f => !f.selectedType)
          if (unmappedFiles.length > 0) {
            newErrors.files = 'Please select a file type for all uploaded files'
          }
        }
      }

      // For API or Plugin migration, check if API credentials are provided
      if (requiresAPI && platform?.api) {
        Object.keys(platform.api).forEach(key => {
          if (!formData.api_data?.[key]) {
            newErrors[`api_${key}`] = `${key} is required`
          }
        })
      }

      // For custom migration, require at least one file with name and description
      if (isCustomMigration) {
        if (files.length === 0) {
          newErrors.files = 'Please upload at least one file for custom migration'
        } else {
          // Check that all files have custom names and descriptions
          const missingMetadata = files.filter(f => !f.customName || !f.description)
          if (missingMetadata.length > 0) {
            newErrors.files = 'All files must have descriptive names and descriptions'
          }
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      if (step === 2 && !requiresFiles && !requiresAPI) {
        setStep(4) // Skip step 3 if no files/API needed
      } else {
        setStep(step + 1)
      }
    }
  }

  const prevStep = () => {
    if (step === 4 && !requiresFiles && !requiresAPI) {
      setStep(2) // Skip step 3 when going back
    } else {
      setStep(step - 1)
    }
  }

  const handlePlatformChange = (platformValue: string) => {
    setSelectedPlatform(platformValue)
    setFormData(prev => ({
      ...prev,
      source_platform: platformValue,
      api_data: {}
    }))
    setFiles([])
    setErrors({})
  }

  const handleItemToggle = (itemValue: string) => {
    const currentItems = formData.items || []
    const newItems = currentItems.includes(itemValue as ItemType)
      ? currentItems.filter(item => item !== itemValue)
      : [...currentItems, itemValue as ItemType]

    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const handleDomainChange = (value: string) => {
    setFormData(prev => ({ ...prev, domain: normalizeDomain(value) }))
    // Clear domain error when user starts typing
    if (errors.domain) {
      setErrors(prev => ({ ...prev, domain: '' }))
    }
  }

  const handleShopifyUrlChange = (value: string) => {
    setFormData(prev => ({ ...prev, shopify_url: normalizeShopifyUrl(value) }))
    // Clear shopify URL error when user starts typing
    if (errors.shopify_url) {
      setErrors(prev => ({ ...prev, shopify_url: '' }))
    }
  }

  const uploadFiles = async (projectId: string) => {
    const uploadedFilePaths: string[] = []

    try {
      // Upload platform-specific required files
      if (files.length > 0) {
        for (const uploadedFile of files) {
          const filePath = `projects/${projectId}/${uploadedFile.name}`

          // Upload to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from('project-files')
            .upload(filePath, uploadedFile.file)

          if (uploadError) {
            console.error('Storage upload error:', uploadError)
            throw new Error(`Failed to upload ${uploadedFile.name}: ${uploadError.message}`)
          }

          uploadedFilePaths.push(filePath)

          // Insert file record
          const { error: insertError } = await supabase
            .from('project_files')
            .insert({
              project_id: projectId,
              file_name: uploadedFile.customName || uploadedFile.name,
              file_type: uploadedFile.selectedType || uploadedFile.type,
              file_path: filePath,
              file_size: uploadedFile.size,
              is_initial: true,
              description: uploadedFile.description || null
            })

          if (insertError) {
            console.error('Database insert error:', insertError)
            throw new Error(`Failed to save file record for ${uploadedFile.name}: ${insertError.message}`)
          }
        }
      }

      // Upload additional custom files
      if (additionalFiles.length > 0) {
        for (const additionalFile of additionalFiles) {
          const filePath = `projects/${projectId}/${additionalFile.file.name}`

          // Upload to Supabase storage
          const { error: uploadError } = await supabase.storage
            .from('project-files')
            .upload(filePath, additionalFile.file)

          if (uploadError) {
            console.error('Storage upload error:', uploadError)
            throw new Error(`Failed to upload ${additionalFile.name}: ${uploadError.message}`)
          }

          uploadedFilePaths.push(filePath)

          // Insert file record with custom name and description
          const { error: insertError } = await supabase
            .from('project_files')
            .insert({
              project_id: projectId,
              file_name: additionalFile.name,
              file_type: 'additional-file',
              file_path: filePath,
              file_size: additionalFile.file.size,
              is_initial: false,
              description: additionalFile.description
            })

          if (insertError) {
            console.error('Database insert error:', insertError)
            throw new Error(`Failed to save file record for ${additionalFile.name}: ${insertError.message}`)
          }
        }
      }
    } catch (error) {
      // Cleanup any uploaded files if something went wrong
      if (uploadedFilePaths.length > 0) {
        console.log('Cleaning up uploaded files after error:', uploadedFilePaths)
        try {
          await supabase.storage
            .from('project-files')
            .remove(uploadedFilePaths)
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded files:', cleanupError)
        }
      }
      
      // Re-throw the original error
      throw error
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(step)) return

    setLoading(true)
    setErrors({})

    let createdProject: any = null

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Use organization from context (already validated above)
      if (!currentOrganization) throw new Error('No organization selected')

      // Create project
      const projectData = {
        org_id: currentOrganization.id,
        domain: formData.domain,
        source_platform: formData.source_platform,
        special_demands: formData.special_demands || null,
        shopify_url: formData.shopify_url,
        access_token: formData.shopify_access_token,
        items: formData.items,
        source_api: requiresAPI ? formData.api_data : null,
        created_by: user.id
      }

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()

      if (projectError) throw projectError
      createdProject = project

      // Upload files if any - if this fails, we need to cleanup the project
      if (files.length > 0 || additionalFiles.length > 0) {
        try {
          await uploadFiles(project.id)
        } catch (uploadError) {
          // File upload failed - cleanup the created project
          console.error('File upload failed, cleaning up project:', uploadError)
          
          try {
            await supabase
              .from('projects')
              .delete()
              .eq('id', project.id)
          } catch (deleteError) {
            console.error('Failed to cleanup project after upload failure:', deleteError)
          }
          
          // Re-throw the original upload error
          throw new Error('Failed to upload files. Please try again.')
        }
      }

      onSuccess?.(project.id)
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Error creating project:', error)
      setErrors({ general: error.message || 'Failed to create project' })
    } finally {
      setLoading(false)
    }
  }

  // Show loading while organization context or platforms are loading
  if (orgLoading || platformsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show error if no organization is available
  if (!currentOrganization) {
    return (
      <Card className="p-8 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Organization Required
        </h2>
        <p className="text-slate-600 mb-6">
          You need to be part of an organization to create projects.
        </p>
        <div className="flex space-x-3 justify-center">
          <Button onClick={() => router.push('/onboarding/create-organization')}>
            Create Organization
          </Button>
          <Button variant="secondary" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </Card>
    )
  }

  const platformOptions = platforms.map(p => ({
    value: p.id,
    label: p.name,
    description: p.description || undefined
  }))

  const progressPercentage = (step / 4) * 100

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm font-medium text-slate-600 mb-2">
          <span>Step {step} of 4</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {errors.general && (
        <Alert variant="error" className="mb-6">
          {errors.general}
        </Alert>
      )}

      <Card className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Basic Information
              </h2>
              <p className="text-slate-600">
                Let&apos;s start with the basics about your migration project.
              </p>
            </div>

            <Input
              label="Source Store Domain"
              placeholder="myshop.com"
              value={formData.domain}
              onChange={(e) => handleDomainChange(e.target.value)}
              error={errors.domain}
              helpText="The domain of the store you're migrating from"
              required
            />

            <Select
              label="Source Platform"
              placeholder="Select your current platform"
              options={platformOptions}
              value={selectedPlatform}
              onChange={handlePlatformChange}
              error={errors.source_platform}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Special Requirements
              </label>
              <textarea
                className="block w-full rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 placeholder-slate-400 shadow-sm transition-all duration-200 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                rows={4}
                placeholder="Any special requirements or notes about your migration..."
                value={formData.special_demands}
                onChange={(e) => setFormData(prev => ({ ...prev, special_demands: e.target.value }))}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Shopify Setup
              </h2>
              <p className="text-slate-600">
                Configure your destination Shopify store.
              </p>
            </div>

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
          </div>
        )}

        {step === 3 && (requiresFiles || requiresAPI || requiresPlugin) && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {isPluginMigration ? 'Plugin Installation & API Setup' 
                 : isAPIMigration ? 'API Configuration' 
                 : isCSVMigration ? 'File Upload' 
                 : 'Custom File Upload'}
              </h2>
              <p className="text-slate-600">
                {isPluginMigration
                  ? 'Install plugin and provide API credentials'
                  : isAPIMigration
                    ? 'Provide your API credentials'
                    : isCSVMigration
                      ? 'Upload your data files'
                      : 'Upload your data files with descriptions'
                }
              </p>
            </div>

            {/* Plugin Installation Section */}
            {isPluginMigration && platform?.plugin && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-slate-900 mb-3">Step 1: Install Plugin</h3>
                <div className="flex space-x-4">
                  <a
                    href={platform.plugin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Download Plugin
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  {platform.video_guide && (
                    <a
                      href={platform.video_guide}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Installation Guide
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m2-7a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* API Credentials Section */}
            {requiresAPI && platform?.api && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900">
                  {isPluginMigration ? 'Step 2: API Credentials' : 'API Credentials'}
                </h3>
                {Object.entries(platform.api).map(([key, instructions]) => (
                  <Input
                    key={key}
                    label={key}
                    type={key.toLowerCase().includes('token') || key.toLowerCase().includes('key') || key.toLowerCase().includes('secret') ? 'password' : 'text'}
                    value={formData.api_data?.[key] || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      api_data: { ...prev.api_data, [key]: e.target.value }
                    }))}
                    error={errors[`api_${key}`]}
                    helpText={instructions}
                    required
                  />
                ))}
              </div>
            )}

            {/* CSV File Upload Section */}
            {isCSVMigration && platform?.files && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-slate-900">Required Files</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Upload: {platform.files.join(', ')}
                  </p>
                </div>

                <FileUpload
                  accept=".csv,.xlsx,.json"
                  maxSize={100}
                  requiredFiles={platform.files}
                  onFilesChange={setFiles}
                  error={errors.files}
                />
              </div>
            )}

            {/* Custom File Upload Section */}
            {isCustomMigration && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-slate-900">Upload Data Files</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Add files with descriptive names and descriptions
                  </p>
                </div>

                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{file.customName || file.name}</p>
                        <p className="text-sm text-slate-600">{file.description}</p>
                        <p className="text-xs text-slate-500">{file.name} ({(file.file.size / 1024 / 1024).toFixed(1)} MB)</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  
                  <AdditionalFileUpload
                    onFileAdd={(file) => {
                      // For custom projects, add to the main files array with metadata
                      const newFile: UploadedFile = {
                        name: file.file.name,
                        size: file.file.size,
                        type: file.file.type,
                        file: file.file,
                        customName: file.name,
                        description: file.description,
                        selectedType: 'custom-file'
                      }
                      setFiles(prev => [...prev, newFile])
                    }}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Additional Files Section - Available for non-custom migration types */}
            {!isCustomMigration && (
              <div className="border-t border-slate-200 pt-6 space-y-4">
                <h3 className="text-lg font-medium text-slate-900">Additional Files (Optional)</h3>
                <p className="text-sm text-slate-600">
                  Mailing lists, customer exports, or other business data
                </p>
              
              <div className="space-y-3">
                {additionalFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-600">{file.description}</p>
                      <p className="text-xs text-slate-500">{file.file.name} ({(file.file.size / 1024 / 1024).toFixed(1)} MB)</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAdditionalFiles(prev => prev.filter((_, i) => i !== index))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                
                <AdditionalFileUpload
                  onFileAdd={(file) => setAdditionalFiles(prev => [...prev, file])}
                  disabled={loading}
                />
              </div>
            </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Review Your Project
              </h2>
              <p className="text-slate-600">
                Please review all details before submitting your migration project.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-slate-900">Source Store</h4>
                  <p className="text-slate-600">{formData.domain}</p>
                  <p className="text-sm text-slate-500">{platform?.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Destination</h4>
                  <p className="text-slate-600">{formData.shopify_url}</p>
                  {formData.shopify_access_token && (
                    <p className="text-xs text-slate-500">
                      Token: {formData.shopify_access_token.substring(0, 8)}...
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900">Data Types</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.items?.map(item => (
                    <span key={item} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {ITEM_OPTIONS.find(opt => opt.value === item)?.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Migration Type Information */}
              <div>
                <h4 className="font-medium text-slate-900">Migration Type</h4>
                <p className="text-slate-600">
                  {isPluginMigration && 'Plugin-based migration with API integration'}
                  {isAPIMigration && 'Direct API integration'}
                  {isCSVMigration && 'File-based migration using CSV uploads'}
                  {isCustomMigration && 'Custom migration - files will be analyzed'}
                </p>
              </div>

              {/* API Credentials (if applicable) */}
              {requiresAPI && platform?.api && Object.keys(formData.api_data || {}).length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900">API Configuration</h4>
                  <div className="space-y-1">
                    {Object.keys(platform.api).map(key => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">{key}</span>
                        <span className="text-slate-500">
                          {formData.api_data?.[key] ? '✓ Configured' : '⚠ Missing'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Platform-specific Files */}
              {files.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900">
                    {isCSVMigration ? 'Required Files' : 'Uploaded Files'}
                  </h4>
                  <div className="space-y-2 mt-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-slate-700 truncate mr-2">{file.name}</span>
                        <div className="flex items-center space-x-2">
                          {file.selectedType ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {file.selectedType}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                              unmapped
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Files */}
              {additionalFiles.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900">Additional Files</h4>
                  <div className="space-y-2 mt-2">
                    {additionalFiles.map((file, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 font-medium">{file.name}</span>
                          <span className="text-xs text-slate-500">
                            {(file.file.size / 1024 / 1024).toFixed(1)} MB
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs">{file.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.special_demands && (
                <div>
                  <h4 className="font-medium text-slate-900">Special Requirements</h4>
                  <p className="text-slate-600 text-sm">{formData.special_demands}</p>
                </div>
              )}
            </div>

            <Alert variant="info">
              <p className="text-sm">
                By submitting this project, you agree that our team will review your requirements and provide a quote within 24 hours. We&apos;ll then begin the migration process once approved.
              </p>
            </Alert>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 border-t border-slate-200">
          <div>
            {step > 1 && (
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={loading}
              >
                Previous
              </Button>
            )}
          </div>

          <div className="flex space-x-3">
            {onCancel && (
              <Button
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}

            {step < 4 ? (
              <Button
                onClick={nextStep}
                disabled={loading}
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                loading={loading}
                disabled={loading}
              >
                Submit Project
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}