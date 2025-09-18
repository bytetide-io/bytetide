export type ItemType = 'giftcard' | 'product' | 'collection' | 'customer' | 'discountCode' | 'order'

export type ProjectStatus = 'submitted' | 'in_progress' | 'in_review' | 'approved' | 'migrating' | 'completed'

export interface Status {
  status: ProjectStatus
  name: string
  description: string
}

export interface Platform {
  id: string
  created_at: string
  name: string
  description: string | null
  files: string[] | null  // For CSV upload migration type
  api: Record<string, string> | null  // For API key migration type  
  plugin: string | null  // For plugin/extension migration type
  video_guide: string | null
  items: ItemType[] | null
}

// Legacy interface for backward compatibility
export interface PlatformRequirements {
  platform: string
  name: string | null
  description: string | null
  required_files: string[]
  optional_files: string[]
  allowed_files: string[] | null
  api_requirements: Record<string, string> | null
  plugin: string | null
  items: ItemType[] | null
}

export interface Project {
  id: string
  org_id: string | null
  domain: string
  source_platform: string
  status: ProjectStatus
  special_demands: string | null
  created_at: string | null
  updated_at: string | null
  started: string | null
  access_token: string | null
  config: Record<string, any> | null
  locations: Record<string, any> | null
  source_api: Record<string, any> | null
  created_by: string | null
  shopify_url: string | null
  quote: string | null
  quote_accepted: boolean | null
  items: ItemType[] | null
}

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface ProjectFile {
  id: string
  project_id: string | null
  file_name: string
  file_type: string
  file_path: string
  upload_date: string | null
  file_size: number
  is_initial: boolean | null
  description?: string | null
}

export interface CreateProjectData {
  domain: string
  source_platform: string
  special_demands?: string
  shopify_url?: string
  shopify_access_token?: string
  items?: ItemType[]
  api_data?: Record<string, string>
}

export interface UploadedFile {
  name: string
  size: number
  type: string
  file: File
  selectedType?: string // Maps to platform requirement file types
  description?: string  // User-provided description for additional files
  customName?: string   // User-provided descriptive name for additional files
}

export interface AdditionalFile {
  name: string        // User-provided descriptive name
  description: string // User-provided description
  file: File         // The actual file
}