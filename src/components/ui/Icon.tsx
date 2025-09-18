'use client'

import { 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  AlertTriangle, 
  CheckCircle,
  X,
  XCircle,
  Menu,
  Upload,
  Download,
  File,
  FileText,
  Plus,
  Minus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Settings,
  User,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Globe,
  Lock,
  Unlock,
  Home,
  Building,
  CreditCard,
  ShoppingCart,
  Package,
  Tag,
  Percent,
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  RotateCcw,
  Save,
  Copy,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Info,
  HelpCircle,
  Star,
  Heart,
  Bookmark,
  Share,
  MoreHorizontal,
  MoreVertical,
  Loader2
} from 'lucide-react'
import clsx from 'clsx'

const iconMap = {
  // Navigation
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'external-link': ExternalLink,
  
  // Status & Feedback
  'alert-triangle': AlertTriangle,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'info': Info,
  'help-circle': HelpCircle,
  
  // Actions
  'x': X,
  'plus': Plus,
  'minus': Minus,
  'edit': Edit,
  'trash': Trash2,
  'save': Save,
  'copy': Copy,
  'refresh': RefreshCw,
  'undo': RotateCcw,
  
  // UI Elements
  'menu': Menu,
  'eye': Eye,
  'eye-off': EyeOff,
  'search': Search,
  'filter': Filter,
  'settings': Settings,
  'more-horizontal': MoreHorizontal,
  'more-vertical': MoreVertical,
  
  // Files & Upload
  'upload': Upload,
  'download': Download,
  'file': File,
  'file-text': FileText,
  
  // Users & Social
  'user': User,
  'users': Users,
  'mail': Mail,
  'phone': Phone,
  'map-pin': MapPin,
  'star': Star,
  'heart': Heart,
  'bookmark': Bookmark,
  'share': Share,
  
  // Time & Calendar
  'calendar': Calendar,
  'clock': Clock,
  
  // Business & Commerce
  'globe': Globe,
  'home': Home,
  'building': Building,
  'credit-card': CreditCard,
  'shopping-cart': ShoppingCart,
  'package': Package,
  'tag': Tag,
  'percent': Percent,
  
  // Analytics
  'bar-chart': BarChart3,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  
  // Security
  'lock': Lock,
  'unlock': Unlock,
  
  // Loading
  'loader': Loader2
} as const

export type IconName = keyof typeof iconMap

interface IconProps {
  name: IconName
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  /**
   * Whether the icon should spin (useful for loading states)
   */
  spin?: boolean
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
} as const

/**
 * Unified icon component using Lucide React icons.
 * 
 * @example
 * <Icon name="chevron-down" size="sm" className="text-slate-500" />
 * <Icon name="loader" size="md" spin />
 */
export function Icon({ 
  name, 
  size = 'md', 
  className, 
  spin = false,
  ...props 
}: IconProps) {
  const IconComponent = iconMap[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`)
    return null
  }
  
  return (
    <IconComponent 
      className={clsx(
        sizeClasses[size],
        spin && 'animate-spin',
        className
      )}
      {...props}
    />
  )
}

Icon.displayName = 'Icon'

// Export the icon names for TypeScript autocomplete
export { iconMap }