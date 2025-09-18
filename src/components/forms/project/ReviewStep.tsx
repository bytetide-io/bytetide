'use client'

import { Card } from '@/components/Card'
import { Alert } from '@/components/Alert'
import { ProjectFormState } from '@/hooks/useProjectForm'
import clsx from 'clsx'

interface ReviewStepProps {
  state: ProjectFormState
}

export function ReviewStep({ state }: ReviewStepProps) {
  const {
    formData,
    platform,
    files,
    additionalFiles,
    errors,
    isCSVMigration,
    isAPIMigration,
    isPluginMigration,
    isCustomMigration
  } = state

  const migrationType = isCSVMigration ? 'CSV Export' :
    isAPIMigration ? 'API Migration' :
      isPluginMigration ? 'Plugin Migration' :
        isCustomMigration ? 'Custom Migration' : 'Standard Migration'

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {errors.general && (
        <Alert variant="error">
          {errors.general}
        </Alert>
      )}

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Review Your Migration Request
        </h2>

        {/* Project Overview */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Project Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <dt className="text-sm font-medium text-slate-600">Source Domain</dt>
              <dd className="text-sm text-slate-900 mt-1">{formData.domain}</dd>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <dt className="text-sm font-medium text-slate-600">Source Platform</dt>
              <dd className="text-sm text-slate-900 mt-1">{platform?.name || 'Unknown'}</dd>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <dt className="text-sm font-medium text-slate-600">Migration Type</dt>
              <dd className="text-sm text-slate-900 mt-1">{migrationType}</dd>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <dt className="text-sm font-medium text-slate-600">Shopify Store</dt>
              <dd className="text-sm text-slate-900 mt-1">{formData.shopify_url}</dd>
            </div>
          </div>
        </div>

        {/* Data Types */}
        {formData.items && formData.items.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Data Types to Migrate</h3>
            <div className="flex flex-wrap gap-2">
              {formData.items.map(item => (
                <span
                  key={item}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* API Configuration */}
        {isAPIMigration || isPluginMigration && platform?.api && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">
              API Configuration
            </h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="space-y-2">
                {Object.entries(platform.api).map(([key, config]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">
                      {config.label || key}:
                    </span>
                    <span className="text-sm text-slate-900">
                      {config.type === 'password'
                        ? '••••••••••••'
                        : formData.api?.[key] || 'Not set'
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">
              {isCSVMigration ? 'Required Files' : 'Data Files'}
            </h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {file.customName || file.name}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>{formatFileSize(file.file.size)}</span>
                        {file.selectedType && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {file.selectedType}
                          </span>
                        )}
                      </div>
                      {file.description && (
                        <p className="text-xs text-slate-600 mt-1">{file.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Files */}
        {additionalFiles.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Additional Files</h3>
            <div className="space-y-3">
              {additionalFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{file.name}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>{formatFileSize(file.file.size)}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Additional CSV
                        </span>
                      </div>
                      {file.description && (
                        <p className="text-xs text-slate-600 mt-1">{file.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special Requirements */}
        {formData.special_demands && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Special Requirements</h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-900 whitespace-pre-wrap">
                {formData.special_demands}
              </p>
            </div>
          </div>
        )}

        {/* Next Steps Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="flex-shrink-0 w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">What happens next?</h4>
              <p className="text-sm text-blue-700 mt-1">
                After submitting, our data engineering team will review your migration request and begin preparing your data.
                You&apos;ll receive updates via email as we progress through each phase of the migration.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

ReviewStep.displayName = 'ReviewStep'