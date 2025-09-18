'use client'

import { Card } from '@/components/Card'
import { Alert } from '@/components/Alert'
import { FileUpload } from '@/components/FileUpload'
import { AdditionalFileUpload } from '@/components/AdditionalFileUpload'
import { Input } from '@/components/Input'
import { ProjectFormState, ProjectFormActions } from '@/hooks/useProjectForm'
import { AdditionalFile } from '@/lib/types'
import clsx from 'clsx'

interface FileUploadStepProps {
  state: ProjectFormState
  actions: ProjectFormActions
}

export function FileUploadStep({ state, actions }: FileUploadStepProps) {
  const {
    platform,
    formData,
    files,
    additionalFiles,
    errors,
    isCSVMigration,
    isAPIMigration,
    isPluginMigration,
    isCustomMigration,
    requiresFiles,
    requiresAPI
  } = state

  const { updateFormData, setFiles, setAdditionalFiles } = actions

  const handleAddAdditionalFile = (file: AdditionalFile) => {
    setAdditionalFiles(prev => [...prev, file])
  }

  const handleRemoveAdditionalFile = (index: number) => {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleApiDataChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({
      api: {
        ...formData.api,
        [key]: e.target.value
      }
    })
  }

  // Show different UI based on migration type
  if (!requiresFiles && !requiresAPI) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Additional Setup Required</h3>
          <p className="text-sm text-slate-600">
            This platform migration doesn&apos;t require file uploads or API configuration.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* API Configuration Section */}
      {requiresAPI && platform?.api && (
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              API Configuration
            </h2>
            <p className="text-sm text-slate-600">
              {isPluginMigration
                ? 'Configure API credentials for the migration plugin.'
                : 'Enter your API credentials to connect to your current platform.'
              }
            </p>
          </div>

          {errors.general && (
            <Alert variant="error" className="mb-6">
              {errors.general}
            </Alert>
          )}

          <div className="space-y-4">
            {Object.entries(platform.api).map(([key, config]) => (
              <Input
                key={key}
                label={config.label || key}
                type={config.type === 'password' ? 'password' : 'text'}
                value={formData.api?.[key] || ''}
                onChange={handleApiDataChange(key)}
                placeholder={config.placeholder || `Enter ${key}...`}
                error={errors[`api_${key}`]}
                required
                helpText={config.description}
              />
            ))}
          </div>

          {isPluginMigration && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <svg className="flex-shrink-0 w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <strong>Plugin Migration:</strong> This platform requires installing a migration plugin.
                    We&apos;ll provide installation instructions after you submit the project.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* File Upload Section */}
      {requiresFiles && (
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              {isCSVMigration ? 'Required Files' : 'Data Files'}
            </h2>
            <p className="text-sm text-slate-600">
              {isCSVMigration
                ? 'Upload the required CSV files exported from your current platform.'
                : 'Upload your data files with descriptive names and descriptions.'
              }
            </p>
          </div>

          {errors.files && (
            <Alert variant="error" className="mb-6">
              {errors.files}
            </Alert>
          )}

          <FileUpload
            onFilesChange={setFiles}
            requiredFiles={platform?.files || []}
            isCustomProject={isCustomMigration}
          />

          {isCSVMigration && platform?.files && (
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-900 mb-2">Required File Types:</h4>
              <div className="flex flex-wrap gap-2">
                {platform.files.map((fileType) => (
                  <span
                    key={fileType}
                    className={clsx(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      files.some(f => f.selectedType === fileType)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-700'
                    )}
                  >
                    {fileType}
                    {files.some(f => f.selectedType === fileType) && (
                      <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Additional Files Section */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Additional Files
            <span className="text-slate-500 font-normal text-sm ml-2">(Optional)</span>
          </h2>
          <p className="text-sm text-slate-600">
            Upload any additional CSV files or documentation that might help with the migration.
          </p>
        </div>

        <AdditionalFileUpload
          onFileAdd={handleAddAdditionalFile}
        />

        {/* Show uploaded additional files */}
        {additionalFiles.length > 0 && (
          <div className="mt-4 space-y-3">
            {additionalFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-600">{file.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveAdditionalFile(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

FileUploadStep.displayName = 'FileUploadStep'