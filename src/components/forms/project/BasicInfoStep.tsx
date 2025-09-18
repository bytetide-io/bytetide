'use client'

import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { Alert } from '@/components/Alert'
import { ProjectFormState, ProjectFormActions } from '@/hooks/useProjectForm'
import { normalizeDomain } from '@/lib/validation'

interface BasicInfoStepProps {
  state: ProjectFormState
  actions: ProjectFormActions
}

export function BasicInfoStep({ state, actions }: BasicInfoStepProps) {
  const { formData, platforms, platformsLoading, errors } = state
  const { updateFormData, setSelectedPlatform } = actions

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeDomain(e.target.value)
    actions.updateFormData({ domain: normalized })
  }

  const handlePlatformChange = (value: string) => {
    setSelectedPlatform(value)
  }

  const platformOptions = platforms.map(platform => ({
    value: platform.id,
    label: platform.name,
    description: platform.description || `Migrate from ${platform.name}`
  }))

  if (platformsLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-slate-600">Loading platforms...</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Basic Information
        </h2>
        <p className="text-sm text-slate-600">
          Tell us about your current store and where you&apos;re migrating from.
        </p>
      </div>

      {errors.general && (
        <Alert variant="error" className="mb-6">
          {errors.general}
        </Alert>
      )}

      <div className="space-y-6">
        <Input
          label="Current Store Domain"
          value={formData.domain}
          onChange={handleDomainChange}
          placeholder="example.com"
          error={errors.domain}
          required
          autoComplete="url"
          helpText="Enter your current store's domain (without http:// or www)"
        />

        <Select
          label="Source Platform"
          value={formData.source_platform}
          onChange={handlePlatformChange}
          options={platformOptions}
          placeholder="Select your current platform..."
          error={errors.source_platform}
          required
          helpText="Which platform are you currently using?"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Special Requirements
            <span className="text-slate-500 font-normal ml-1">(Optional)</span>
          </label>
          <textarea
            value={formData.special_demands || ''}
            onChange={(e) => updateFormData({ special_demands: e.target.value })}
            placeholder="Describe any special requirements, custom fields, or specific data that needs special attention during migration..."
            rows={4}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            This helps our team prepare for any custom configurations or special data handling needed.
          </p>
        </div>
      </div>
    </Card>
  )
}

BasicInfoStep.displayName = 'BasicInfoStep'