'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Platform, CreateProjectData, UploadedFile, AdditionalFile } from '@/lib/types'
import { validateDomain, validateShopifyUrl, validateShopifyAccessToken, normalizeShopifyUrl } from '@/lib/validation'

export interface ProjectFormState {
  // Data
  platforms: Platform[]
  selectedPlatform: string
  formData: CreateProjectData
  files: UploadedFile[]
  additionalFiles: AdditionalFile[]

  // UI State
  step: number
  errors: Record<string, string>
  loading: boolean
  platformsLoading: boolean

  // Computed values
  platform: Platform | undefined
  isCSVMigration: boolean
  isAPIMigration: boolean
  isPluginMigration: boolean
  isCustomMigration: boolean
  requiresFiles: boolean
  requiresAPI: boolean
  requiresPlugin: boolean
}

export interface ProjectFormActions {
  // Data actions
  setSelectedPlatform: (platformId: string) => void
  updateFormData: (updates: Partial<CreateProjectData>) => void
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>
  setAdditionalFiles: React.Dispatch<React.SetStateAction<AdditionalFile[]>>

  // Navigation
  nextStep: () => void
  prevStep: () => void
  setStep: (step: number) => void

  // Validation
  validateStep: (stepNumber: number) => boolean
  setErrors: (errors: Record<string, string>) => void

  // API actions
  fetchPlatforms: () => Promise<void>
  submitProject: (orgId: string) => Promise<string>
}

const initialFormData: CreateProjectData = {
  domain: '',
  source_platform: '',
  special_demands: '',
  shopify_url: '',
  shopify_access_token: '',
  items: [],
  api: {}
}

export function useProjectForm(): [ProjectFormState, ProjectFormActions] {
  // State
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [selectedPlatform, setSelectedPlatformState] = useState('')
  const [formData, setFormData] = useState<CreateProjectData>(initialFormData)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [additionalFiles, setAdditionalFiles] = useState<AdditionalFile[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [platformsLoading, setPlatformsLoading] = useState(true)
  const [step, setStep] = useState(1)

  // Computed values
  const platform = platforms.find(p => p.id === selectedPlatform)
  const isCSVMigration = platform && platform.files && platform.files.length > 0
  const isAPIMigration = platform && platform.api && !platform.plugin
  const isPluginMigration = platform && platform.plugin && platform.api
  const isCustomMigration = platform && !platform.files && !platform.api && !platform.plugin
  const requiresFiles = isCSVMigration || isCustomMigration
  const requiresAPI = isAPIMigration || isPluginMigration
  const requiresPlugin = isPluginMigration

  // Actions
  const fetchPlatforms = useCallback(async () => {
    try {
      setPlatformsLoading(true)
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
  }, [])

  const setSelectedPlatform = useCallback((platformId: string) => {
    setSelectedPlatformState(platformId)
    setFormData(prev => ({
      ...prev,
      source_platform: platformId,
      api: {}
    }))
    setFiles([])
    setErrors({})
  }, [])

  const updateFormData = useCallback((updates: Partial<CreateProjectData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }, [])

  const validateStep = useCallback((stepNumber: number): boolean => {
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
          if (!formData.api?.[key]) {
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
  }, [formData, files, platform, isCSVMigration, isCustomMigration, requiresAPI])

  const nextStep = useCallback(() => {
    if (validateStep(step)) {
      if (step === 2 && !requiresFiles && !requiresAPI) {
        setStep(4) // Skip step 3 if no files/API needed
      } else {
        setStep(step + 1)
      }
    }
  }, [step, validateStep, requiresFiles, requiresAPI])

  const prevStep = useCallback(() => {
    if (step === 4 && !requiresFiles && !requiresAPI) {
      setStep(2) // Skip step 3 when going back
    } else {
      setStep(step - 1)
    }
  }, [step, requiresFiles, requiresAPI])

  const uploadProjectFiles = useCallback(async (projectId: string) => {
    // Upload platform-specific files
    for (const file of files) {
      const fileName = `${projectId}/${file.name}`

      const { error: storageError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file.file)

      if (storageError) {
        throw new Error(`Failed to upload ${file.name}: ${storageError.message}`)
      }

      // Save file record to database
      const { error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          file_name: file.customName || file.name,
          file_size: file.file.size,
          file_type: file.selectedType || 'unknown',
          description: file.description || null,
          upload_date: new Date().toISOString()
        })

      if (dbError) {
        // Try to cleanup the uploaded file
        await supabase.storage
          .from('project-files')
          .remove([fileName])
        throw new Error(`Failed to save file record for ${file.name}: ${dbError.message}`)
      }
    }

    // Upload additional files
    for (const file of additionalFiles) {
      const fileName = `${projectId}/${file.name}`

      const { error: storageError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file.file)

      if (storageError) {
        throw new Error(`Failed to upload ${file.name}: ${storageError.message}`)
      }

      // Save file record to database
      const { error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          file_name: file.name,
          file_size: file.file.size,
          file_type: 'custom-csv',
          description: file.description || null,
          upload_date: new Date().toISOString()
        })

      if (dbError) {
        // Try to cleanup the uploaded file
        await supabase.storage
          .from('project-files')
          .remove([fileName])
        throw new Error(`Failed to save file record for ${file.name}: ${dbError.message}`)
      }
    }
  }, [files, additionalFiles])

  const submitProject = useCallback(async (orgId: string): Promise<string> => {
    try {
      setLoading(true)
      setErrors({})

      // Prepare project data
      const projectData = {
        ...formData,
        access_token: formData.shopify_access_token, // Map shopify_access_token to access_token column
        source_api: formData.api, // Map api field to source_api column
        shopify_access_token: undefined, // Remove form field to prevent schema error
        api: undefined, // Remove api field to prevent schema error
        org_id: orgId,
        status: 'submitted' as const
      }

      // Create project first
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()

      if (projectError) throw projectError

      // Upload files and additional files
      if (files.length > 0 || additionalFiles.length > 0) {
        try {
          await uploadProjectFiles(project.id)
        } catch (uploadError) {
          // DELETE the project if file uploads fail
          await supabase
            .from('projects')
            .delete()
            .eq('id', project.id)
          throw new Error('Failed to upload files. Please try again.')
        }
      }

      return project.id
    } finally {
      setLoading(false)
    }
  }, [formData, files, additionalFiles, uploadProjectFiles])

  // Initialize platforms on mount
  useEffect(() => {
    fetchPlatforms()
  }, [fetchPlatforms])

  const state: ProjectFormState = {
    platforms,
    selectedPlatform,
    formData,
    files,
    additionalFiles,
    step,
    errors,
    loading,
    platformsLoading,
    platform,
    isCSVMigration: !!isCSVMigration,
    isAPIMigration: !!isAPIMigration,
    isPluginMigration: !!isPluginMigration,
    isCustomMigration: !!isCustomMigration,
    requiresFiles: !!requiresFiles,
    requiresAPI: !!requiresAPI,
    requiresPlugin: !!requiresPlugin
  }

  const actions: ProjectFormActions = {
    setSelectedPlatform,
    updateFormData,
    setFiles,
    setAdditionalFiles,
    nextStep,
    prevStep,
    setStep,
    validateStep,
    setErrors,
    fetchPlatforms,
    submitProject
  }

  return [state, actions]
}