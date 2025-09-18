'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { Alert } from '@/components/Alert'
import { useOrganization } from '@/lib/contexts/OrganizationContext'
import { useProjectForm } from '@/hooks/useProjectForm'
import { BasicInfoStep } from './BasicInfoStep'
import { ShopifySetupStep } from './ShopifySetupStep'
import { FileUploadStep } from './FileUploadStep'
import { ReviewStep } from './ReviewStep'
import clsx from 'clsx'

interface NewProjectFormProps {
  onSuccess?: (projectId: string) => void
  onCancel?: () => void
}

const STEPS = [
  { number: 1, title: 'Basic Info', description: 'Store details and platform' },
  { number: 2, title: 'Shopify Setup', description: 'Destination store configuration' },
  { number: 3, title: 'Data & Files', description: 'Files and API configuration' },
  { number: 4, title: 'Review', description: 'Confirm migration details' }
]

export function NewProjectForm({ onSuccess, onCancel }: NewProjectFormProps) {
  const { currentOrganization, loading: orgLoading } = useOrganization()
  const [state, actions] = useProjectForm()
  const router = useRouter()

  const {
    step,
    loading,
    errors,
    requiresFiles,
    requiresAPI
  } = state

  const {
    nextStep,
    prevStep,
    validateStep,
    submitProject
  } = actions

  // Show step 3 if files or API are required
  const showStep3 = requiresFiles || requiresAPI
  const maxStep = showStep3 ? 4 : 3
  const adjustedStep = step > 2 && !showStep3 ? step - 1 : step

  const handleSubmit = async () => {
    if (!currentOrganization) {
      actions.setErrors({ general: 'No organization available' })
      return
    }

    if (!validateStep(4)) {
      return
    }

    try {
      const projectId = await submitProject(currentOrganization.id)
      
      if (onSuccess) {
        onSuccess(projectId)
      } else {
        router.push(`/dashboard/projects/${projectId}`)
      }
    } catch (error: any) {
      console.error('Error creating project:', error)
      actions.setErrors({ 
        general: error.message || 'Failed to create project. Please try again.' 
      })
    }
  }

  const canGoNext = () => {
    if (step === 2 && !showStep3) return true // Can skip to review if no step 3 needed
    return step < maxStep
  }

  const canGoPrev = () => {
    return step > 1
  }

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center space-x-8">
            {STEPS.slice(0, maxStep).map((stepItem, index) => {
              const stepNumber = index + 1
              const isCurrentStep = adjustedStep === stepNumber
              const isCompletedStep = adjustedStep > stepNumber
              const isAccessibleStep = stepNumber <= adjustedStep

              return (
                <li key={stepItem.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={clsx(
                        'flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium transition-colors',
                        isCurrentStep
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : isCompletedStep
                          ? 'border-green-600 bg-green-600 text-white'
                          : 'border-slate-300 bg-white text-slate-500'
                      )}
                    >
                      {isCompletedStep ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        stepNumber
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p
                        className={clsx(
                          'text-sm font-medium',
                          isAccessibleStep ? 'text-slate-900' : 'text-slate-500'
                        )}
                      >
                        {stepItem.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {stepItem.description}
                      </p>
                    </div>
                  </div>
                  {index < maxStep - 1 && (
                    <div
                      className={clsx(
                        'w-16 h-0.5 ml-8 -mt-8',
                        isCompletedStep ? 'bg-green-600' : 'bg-slate-300'
                      )}
                    />
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {step === 1 && <BasicInfoStep state={state} actions={actions} />}
        {step === 2 && <ShopifySetupStep state={state} actions={actions} />}
        {step === 3 && <FileUploadStep state={state} actions={actions} />}
        {step === 4 && <ReviewStep state={state} />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center space-x-3">
          {canGoPrev() && (
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={loading}
            >
              Previous
            </Button>
          )}
          
          {onCancel && (
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {canGoNext() ? (
            <Button
              variant="primary"
              onClick={nextStep}
              disabled={loading}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={loading}
            >
              Submit Migration Request
            </Button>
          )}
        </div>
      </div>

      {/* Global Error Display */}
      {errors.general && (
        <Alert variant="error" className="mt-6">
          {errors.general}
        </Alert>
      )}
    </div>
  )
}

NewProjectForm.displayName = 'NewProjectForm'