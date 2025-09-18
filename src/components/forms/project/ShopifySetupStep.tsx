'use client'

import { Card } from '@/components/Card'
import { Input } from '@/components/Input'
import { Alert } from '@/components/Alert'
import { ProjectFormState, ProjectFormActions } from '@/hooks/useProjectForm'
import { normalizeShopifyUrl } from '@/lib/validation'
import { ItemType } from '@/lib/types'
import clsx from 'clsx'

interface ShopifySetupStepProps {
  state: ProjectFormState
  actions: ProjectFormActions
}

const ITEM_OPTIONS = [
  { value: 'product', label: 'Products', description: 'Product catalog and variants' },
  { value: 'collection', label: 'Collections', description: 'Product categories and collections' },
  { value: 'customer', label: 'Customers', description: 'Customer accounts and profiles' },
  { value: 'order', label: 'Orders', description: 'Order history and transactions' },
  { value: 'discountCode', label: 'Discount Codes', description: 'Coupons and promotional codes' },
  { value: 'giftcard', label: 'Gift Cards', description: 'Gift card balances and codes' }
]

export function ShopifySetupStep({ state, actions }: ShopifySetupStepProps) {
  const { formData, errors } = state
  const { updateFormData } = actions

  const handleShopifyUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeShopifyUrl(e.target.value)
    updateFormData({ shopify_url: normalized })
  }

  const handleItemToggle = (itemValue: ItemType) => {
    const currentItems = formData.items || []
    const isSelected = currentItems.includes(itemValue)
    
    const newItems = isSelected
      ? currentItems.filter(item => item !== itemValue)
      : [...currentItems, itemValue]
    
    updateFormData({ items: newItems })
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Shopify Store Setup
        </h2>
        <p className="text-sm text-slate-600">
          Configure your destination Shopify store and select what data to migrate.
        </p>
      </div>

      <div className="space-y-6">
        <Input
          label="Shopify Store URL"
          value={formData.shopify_url}
          onChange={handleShopifyUrlChange}
          placeholder="mystore.myshopify.com"
          error={errors.shopify_url}
          required
          autoComplete="url"
          helpText="Your new Shopify store URL (the .myshopify.com address)"
        />

        <Input
          label="Shopify Access Token"
          type="password"
          value={formData.shopify_access_token}
          onChange={(e) => updateFormData({ shopify_access_token: e.target.value })}
          placeholder="shpat_..."
          error={errors.shopify_access_token}
          required
          helpText="Your Shopify private app access token with appropriate permissions"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Data Types to Migrate *
          </label>
          {errors.items && (
            <Alert variant="error" className="mb-4">
              {errors.items}
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ITEM_OPTIONS.map((option) => {
              const isSelected = formData.items?.includes(option.value as ItemType) || false
              
              return (
                <label
                  key={option.value}
                  className={clsx(
                    'relative flex items-start p-4 border rounded-lg cursor-pointer transition-colors',
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleItemToggle(option.value as ItemType)}
                    className="sr-only"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <div
                        className={clsx(
                          'flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center mr-3',
                          isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-slate-300'
                        )}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className={clsx(
                          'text-sm font-medium',
                          isSelected ? 'text-blue-900' : 'text-slate-900'
                        )}>
                          {option.label}
                        </p>
                        <p className={clsx(
                          'text-xs mt-1',
                          isSelected ? 'text-blue-700' : 'text-slate-500'
                        )}>
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </label>
              )
            })}
          </div>
          
          <p className="mt-2 text-xs text-slate-500">
            Select all data types you want to migrate to your new Shopify store.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="flex-shrink-0 w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong>Access Token Setup:</strong> You&apos;ll need to create a private app in your Shopify admin with the appropriate permissions for the data types you&apos;ve selected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

ShopifySetupStep.displayName = 'ShopifySetupStep'