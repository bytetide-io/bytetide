'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
import { Select } from '@/components/Select'
import { Button } from '@/components/Button'
import { Alert } from '@/components/Alert'

interface PreviewFile {
  id: number
  created_at: string
  file_path: string
  type: string
  length: number
  size: number | null
  project: string
}

interface PreviewData {
  items: any[]
  pagination: {
    page: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
  fileType: string
  exists: boolean
}

interface PreviewClientProps {
  projectId: string
}

const TYPE_LABELS: Record<string, string> = {
  product: 'Products',
  order: 'Orders',
  customer: 'Customers',
  collection: 'Collections',
  giftcard: 'Gift Cards',
  discountCode: 'Discount Codes'
}

// Context View Components
function ProductContextView({ item }: { item: any }) {
  const primaryImage = item.files?.[0]?.originalSource || item.variants?.[0]?.file?.originalSource
  const price = item.variants?.[0]?.price ? `${item.variants[0].price} DKK` : 'No price'
  const totalVariants = item.variants?.length || 0

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {primaryImage && (
          <div className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primaryImage}
              alt={item.title || 'Product image'}
              className="w-20 h-20 object-cover rounded border"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Price:</span> <span className="font-medium">{price}</span>
            </div>
            <div>
              <span className="text-slate-600">Status:</span> <span className={`font-medium ${item.status === 'DRAFT' ? 'text-orange-600' : 'text-green-600'}`}>{item.status}</span>
            </div>
            <div>
              <span className="text-slate-600">Variants:</span> <span className="font-medium">{totalVariants}</span>
            </div>
            <div>
              <span className="text-slate-600">Vendor:</span> <span className="font-medium">{item.vendor || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {item.seo?.description && (
        <div>
          <h5 className="text-sm font-medium text-slate-700 mb-1">Description</h5>
          <p className="text-sm text-slate-600">{item.seo.description}</p>
        </div>
      )}

      {item.tags && item.tags.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-slate-700 mb-1">Tags</h5>
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {totalVariants > 0 && (
        <div>
          <h5 className="text-sm font-medium text-slate-700 mb-2">Variants ({totalVariants})</h5>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {item.variants.slice(0, 5).map((variant: any, index: number) => (
              <div key={index} className="flex justify-between items-center text-xs bg-slate-50 p-2 rounded">
                <span className="text-slate-700">{variant.optionValues?.[0]?.name || `Variant ${index + 1}`}</span>
                <span className="font-medium text-slate-900">{variant.price} DKK</span>
              </div>
            ))}
            {totalVariants > 5 && (
              <div className="text-xs text-slate-500 text-center">+ {totalVariants - 5} more variants</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function OrderContextView({ item }: { item: any }) {
  const total = item.lineItems?.reduce((sum: number, lineItem: any) =>
    sum + (lineItem.priceSet?.shopMoney?.amount || 0) * (lineItem.quantity || 0), 0
  ) || 0

  const shippingTotal = item.shippingLines?.reduce((sum: number, line: any) =>
    sum + (line.priceSet?.shopMoney?.amount || 0), 0
  ) || 0

  const taxTotal = item.taxLines?.reduce((sum: number, line: any) =>
    sum + (line.priceSet?.shopMoney?.amount || 0), 0
  ) || 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">Order #{item.name}</h4>
          <div className="space-y-1 text-sm">
            <div><span className="text-slate-600">Email:</span> <span className="font-medium">{item.email}</span></div>
            <div><span className="text-slate-600">Phone:</span> <span className="font-medium">{item.phone || 'N/A'}</span></div>
            <div><span className="text-slate-600">Status:</span> <span className={`font-medium ${item.financialStatus === 'PAID' ? 'text-green-600' : 'text-orange-600'}`}>{item.financialStatus}</span></div>
            <div><span className="text-slate-600">Currency:</span> <span className="font-medium">{item.currency}</span></div>
          </div>
        </div>

        <div className="text-right">
          <div className="space-y-1 text-sm">
            <div>Subtotal: <span className="font-medium">{total} {item.currency}</span></div>
            <div>Shipping: <span className="font-medium">{shippingTotal} {item.currency}</span></div>
            <div>Tax{item.taxesIncluded == true ? " Included" : ""}: <span className="font-medium">{taxTotal} {item.currency}</span></div>
            <div className="border-t pt-1 mt-2">
              <span className="font-semibold text-lg">Total: {total + shippingTotal} {item.currency}</span>
            </div>
          </div>
        </div>
      </div>

      {item.billingAddress && (
        <div>
          <h5 className="text-sm font-medium text-slate-700 mb-1">Billing Address</h5>
          <div className="text-sm text-slate-600">
            {item.billingAddress.firstName} {item.billingAddress.lastName}<br />
            {item.billingAddress.address1}<br />
            {item.billingAddress.address2 && <>{item.billingAddress.address2}<br /></>}
            {item.billingAddress.zip} {item.billingAddress.city}
          </div>
        </div>
      )}

      {item.lineItems && item.lineItems.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-slate-700 mb-2">Items ({item.lineItems.length})</h5>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {item.lineItems.map((lineItem: any, index: number) => (
              <div key={index} className="flex justify-between items-center text-xs bg-slate-50 p-3 rounded">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-900">{lineItem.title}</div>
                  {lineItem.properties && lineItem.properties.length > 0 && (
                    <div className="text-slate-600 text-xs mt-1">
                      {lineItem.properties.map((prop: any, i: number) => (
                        <div key={i}>{prop.name}: {prop.value}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <div className="font-medium">{lineItem.quantity}x {lineItem.priceSet?.shopMoney?.amount} {item.currency}</div>
                  <div className="text-slate-600">= {(lineItem.priceSet?.shopMoney?.amount || 0) * (lineItem.quantity || 0)} {item.currency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CollectionContextView({ item }: { item: any }) {
  const ruleCount = item.ruleSet?.rules?.length || 0

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-600">Type:</span> <span className="font-medium">
              {item.ruleSet?.appliedDisjunctively ? 'Any condition' : 'All conditions'}
            </span>
          </div>
          <div>
            <span className="text-slate-600">Rules:</span> <span className="font-medium">{ruleCount}</span>
          </div>
        </div>
      </div>

      {item.descriptionHtml && (
        <div>
          <h5 className="text-sm font-medium text-slate-700 mb-1">Description</h5>
          <div className="text-sm text-slate-600 max-h-20 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: item.descriptionHtml.replace(/<[^>]*>/g, '') }} />
        </div>
      )}

      {item.ruleSet?.rules && item.ruleSet.rules.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-slate-700 mb-2">Collection Rules</h5>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {item.ruleSet.rules.map((rule: any, index: number) => (
              <div key={index} className="flex items-center space-x-2 text-xs bg-slate-50 p-2 rounded">
                <span className="font-medium text-slate-700">{rule.column}</span>
                <span className="text-slate-500">{rule.relation.toLowerCase()}</span>
                <span className="font-medium text-slate-900">&quot;{rule.condition}&quot;</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {item.metafields && item.metafields.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-slate-700 mb-2">Metadata</h5>
          <div className="space-y-1 text-xs max-h-24 overflow-y-auto">
            {item.metafields.slice(0, 5).map((field: any, index: number) => (
              <div key={index} className="flex justify-between bg-slate-50 p-2 rounded">
                <span className="text-slate-600">{field.key}:</span>
                <span className="text-slate-900 font-medium">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CustomerContextView({ item }: { item: any }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold text-slate-900 mb-2">
          {item.firstName} {item.lastName}
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-600">Email:</span> <span className="font-medium">{item.email}</span>
          </div>
          <div>
            <span className="text-slate-600">Phone:</span> <span className="font-medium">{item.phone || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-600">Tax Exempt:</span> <span className="font-medium">{item.taxExempt ? 'Yes' : 'No'}</span>
          </div>
          <div>
            <span className="text-slate-600">Locale:</span> <span className="font-medium">{item.locale || 'N/A'}</span>
          </div>
        </div>
      </div>

      {item.addresses && item.addresses.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-slate-700 mb-2">Addresses</h5>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {item.addresses.map((address: any, index: number) => (
              <div key={index} className="text-sm bg-slate-50 p-3 rounded">
                {address.firstName} {address.lastName}<br />
                {address.address1}<br />
                {address.address2 && <>{address.address2}<br /></>}
                {address.zip} {address.city}, {address.country}
              </div>
            ))}
          </div>
        </div>
      )}

      {item.tags && item.tags.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-slate-700 mb-1">Tags</h5>
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DefaultContextView({ item }: { item: any }) {
  const keys = Object.keys(item).filter(key => !['metafields', 'files', 'variants'].includes(key))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 text-sm max-h-40 overflow-y-auto">
        {keys.slice(0, 10).map((key) => (
          <div key={key} className="flex justify-between bg-slate-50 p-2 rounded">
            <span className="text-slate-600 font-medium">{key}:</span>
            <span className="text-slate-900 truncate ml-2">{String(item[key])}</span>
          </div>
        ))}
        {keys.length > 10 && (
          <div className="text-xs text-slate-500 text-center">+ {keys.length - 10} more fields</div>
        )}
      </div>
    </div>
  )
}

export default function PreviewClient({ projectId }: PreviewClientProps) {
  const [availableFiles, setAvailableFiles] = useState<PreviewFile[]>([])
  const [selectedType, setSelectedType] = useState<string>('')
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'context' | 'raw'>('context')

  useEffect(() => {
    fetchAvailableFiles()
  }, [projectId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAvailableFiles = async () => {
    try {
      const response = await fetch(`/api/preview-files/${projectId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch available files')
      }

      const files: PreviewFile[] = await response.json()
      setAvailableFiles(files)

      if (files.length > 0 && !selectedType) {
        setSelectedType(files[0].type)
      }
    } catch (err) {
      setError('Failed to load available preview files')
      console.error('Error fetching files:', err)
    }
  }

  const fetchPreviewData = async (type: string, page: number = 1) => {
    if (!type) return

    setLoading(true)
    setError('')
    setExpandedRow(null) // Reset expanded row when changing pages/types

    try {
      const response = await fetch(`/api/preview/${projectId}?type=${type}&page=${page}`)

      if (!response.ok) {
        throw new Error('Failed to fetch preview data')
      }

      const data: PreviewData = await response.json()
      setPreviewData(data)
      setCurrentPage(page)
    } catch (err) {
      setError('Failed to load preview data')
      console.error('Error fetching preview:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedType) {
      fetchPreviewData(selectedType)
    }
  }, [selectedType]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (newPage: number) => {
    fetchPreviewData(selectedType, newPage)
  }

  const toggleRow = (originalId: string) => {
    setExpandedRow(expandedRow === originalId ? null : originalId)
  }

  const getRowTitle = (item: any) => {
    if (item.original_id) return `ID: ${item.original_id}`
    if (item.id) return `ID: ${item.id}`
    if (item.title) return item.title
    if (item.name) return item.name
    return 'Unnamed Item'
  }

  const getRowSubtitle = (item: any) => {
    const parts: string[] = []
    if (item.title && item.original_id) parts.push(item.title)
    if (item.name && item.original_id && item.title !== item.name) parts.push(item.name)
    if (item.handle) parts.push(`Handle: ${item.handle}`)
    if (item.email) parts.push(item.email)
    if (item.created_at) parts.push(`Created: ${new Date(item.created_at).toLocaleDateString()}`)
    return parts.join(' • ')
  }

  const renderContextView = (item: any, type: string) => {
    switch (type) {
      case 'product':
        return <ProductContextView item={item} />
      case 'order':
        return <OrderContextView item={item} />
      case 'collection':
        return <CollectionContextView item={item} />
      case 'customer':
        return <CustomerContextView item={item} />
      default:
        return <DefaultContextView item={item} />
    }
  }

  const selectOptions = availableFiles.map(file => ({
    value: file.type,
    label: TYPE_LABELS[file.type] || file.type,
    description: `${file.length} items • ${file.size ? Math.round(file.size / 1024) + ' KB' : 'Unknown size'}`
  }))

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}

      {availableFiles.length === 0 && !error && (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-slate-400 text-lg mb-2">No preview files found</div>
              <p className="text-sm text-slate-600">
                Preview files will appear here once your migration data has been processed.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {availableFiles.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Select Data Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedType}
                onChange={setSelectedType}
                options={selectOptions}
                placeholder="Choose data type to preview"
              />
            </CardContent>
          </Card>

          {selectedType && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {TYPE_LABELS[selectedType] || selectedType} Preview
                  </CardTitle>
                  <div className="flex items-center space-x-4">
                    {previewData && (
                      <div className="text-sm text-slate-600">
                        Showing {((previewData.pagination.page - 1) * previewData.pagination.itemsPerPage) + 1}–{Math.min(previewData.pagination.page * previewData.pagination.itemsPerPage, previewData.pagination.totalItems)} of {previewData.pagination.totalItems} items
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewMode('context')}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === 'context'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                          }`}
                      >
                        Context View
                      </button>
                      <button
                        onClick={() => setViewMode('raw')}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === 'raw'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                          }`}
                      >
                        Raw Data
                      </button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
                    <p className="mt-2 text-sm text-slate-600">Loading preview data...</p>
                  </div>
                ) : previewData === null ? (
                  <div className="text-center py-8">
                    <div className="text-slate-400 text-lg mb-2">Select a data type to preview</div>
                    <p className="text-sm text-slate-600">
                      Choose a data type from the dropdown above to start previewing your migration data.
                    </p>
                  </div>
                ) : previewData && previewData.exists ? (
                  <>
                    <div className="space-y-2">
                      {previewData.items.map((item, index) => {
                        const originalId = item.original_id || item.id || `item-${index}`
                        const isExpanded = expandedRow === originalId

                        return (
                          <div key={originalId} className="border border-slate-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleRow(originalId)}
                              className="w-full px-4 py-3 bg-white hover:bg-slate-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                            >
                              <div className="flex items-center justify-between">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                      #{((currentPage - 1) * 10) + index + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium text-slate-900 truncate">
                                        {getRowTitle(item)}
                                      </p>
                                      {getRowSubtitle(item) && (
                                        <p className="text-xs text-slate-500 truncate mt-1">
                                          {getRowSubtitle(item)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                  <svg
                                    className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="border-t border-slate-200 bg-white p-4">
                                {viewMode === 'context' ? (
                                  renderContextView(item.body || item, selectedType)
                                ) : (
                                  <div className="!bg-slate-50 !border-slate-200 border rounded p-3 overflow-x-auto" style={{ backgroundColor: '#f8fafc' }}>
                                    <code className="!text-slate-800 text-xs font-mono whitespace-pre-wrap block !bg-transparent" style={{ color: '#1e293b', backgroundColor: 'transparent' }}>
                                      {JSON.stringify(item.body || item, null, 2)}
                                    </code>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {previewData.pagination.totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200">
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={!previewData.pagination.hasPrevious || loading}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          Previous
                        </Button>

                        <div className="text-sm text-slate-600">
                          Page {currentPage} of {previewData.pagination.totalPages}
                        </div>

                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={!previewData.pagination.hasNext || loading}
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-slate-400 text-lg mb-2">No preview data available</div>
                    <p className="text-sm text-slate-600">
                      The selected data type doesn&apos;t have any preview data available.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}