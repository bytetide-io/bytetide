import { FadeIn } from '@/components/FadeIn'

interface ProjectCardProps {
  title: string
  platform: string
  productCount: string
  status: 'in-progress' | 'pending' | 'completed'
  progress: number
  statusColor: string
}

function ProjectCard({ title, platform, productCount, status, progress, statusColor }: ProjectCardProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'in-progress': return 'IN PROGRESS'
      case 'pending': return 'PENDING REVIEW'
      case 'completed': return 'COMPLETED'
      default: return 'UNKNOWN'
    }
  }

  return (
    <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`w-3 h-3 rounded-full mt-1 ${statusColor}`}></div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{platform} • {productCount}</p>
            <p className={`text-xs font-medium mt-2 ${status === 'in-progress' ? 'text-green-600' : status === 'pending' ? 'text-amber-600' : 'text-blue-600'}`}>
              {getStatusText(status)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{progress}%</p>
          <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
            <div 
              className={`h-2 rounded-full ${status === 'in-progress' ? 'bg-green-500' : status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MigrationStepProps {
  title: string
  status: 'completed' | 'in-progress' | 'pending'
  isLast?: boolean
}

function MigrationStep({ title, status, isLast }: MigrationStepProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          status === 'completed' ? 'bg-green-500' : 
          status === 'in-progress' ? 'bg-amber-500' : 'bg-gray-300'
        }`}>
          {status === 'completed' && (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {status === 'in-progress' && (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          )}
        </div>
        {!isLast && <div className="w-px h-8 bg-gray-300 mt-2"></div>}
      </div>
      <div className="flex-1 pb-8">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className={`text-xs font-medium mt-1 ${
          status === 'completed' ? 'text-green-600' : 
          status === 'in-progress' ? 'text-amber-600' : 'text-gray-500'
        }`}>
          {status === 'completed' ? 'COMPLETE' : 
           status === 'in-progress' ? 'IN PROGRESS' : 'PENDING'}
        </p>
      </div>
    </div>
  )
}

export function DashboardProjectOverview() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 -mx-8 -mt-8 px-8 py-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-semibold text-gray-900">ByteTide</span>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Sidebar and Main Content */}
      <div className="flex gap-8 mt-6">
        {/* Sidebar */}
        <div className="w-48 bg-white rounded-lg border border-gray-200 p-4">
          <div className="space-y-2">
            <div className="bg-black text-white px-3 py-2 rounded-md text-sm font-medium">
              Projects
            </div>
            <div className="text-gray-600 px-3 py-2 text-sm">Team</div>
            <div className="text-gray-600 px-3 py-2 text-sm">Settings</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Active Projects</h2>
            <p className="text-sm text-gray-600 mt-1">Managed by our data engineering team</p>
          </div>

          <div className="space-y-4">
            <ProjectCard 
              title="Fashion Boutique Migration"
              platform="WooCommerce → Shopify"
              productCount="12,450 products"
              status="in-progress"
              progress={85}
              statusColor="bg-green-500"
            />
            <ProjectCard 
              title="Tech Store Replatform"
              platform="Magento → Shopify"
              productCount="8,230 products"
              status="pending"
              progress={45}
              statusColor="bg-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardProgressTracking() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 -mx-8 -mt-8 px-8 py-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-semibold text-gray-900">ByteTide</span>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Migration Progress</h2>
          <p className="text-sm text-gray-600 mt-1">Fashion Boutique - WooCommerce to Shopify</p>
          <p className="text-xs text-blue-600 mt-1">✓ Managed by: Senior Data Engineer Sarah Chen</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Overall Progress</h3>
              <p className="text-sm text-gray-600 mt-1">85% Complete • Est. completion: 2 days</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">85%</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>

        {/* Migration Steps */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Migration Steps</h3>
          <div className="space-y-0">
            <MigrationStep 
              title="Data extraction and validation"
              status="completed"
            />
            <MigrationStep 
              title="Product catalog migration (12,450 products)"
              status="completed"
            />
            <MigrationStep 
              title="Customer data and order history"
              status="completed"
            />
            <MigrationStep 
              title="SEO redirects and URL mapping"
              status="in-progress"
            />
            <MigrationStep 
              title="Final testing and go-live"
              status="pending"
              isLast
            />
          </div>
        </div>

        {/* Team Note */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <span className="font-medium">Team Update:</span> Our data engineers have completed the complex variant mapping and are now implementing the custom redirect rules. Quality assurance in progress.
          </p>
        </div>
      </div>
    </div>
  )
}