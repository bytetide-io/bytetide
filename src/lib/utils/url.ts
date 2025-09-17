/**
 * Get the base URL for the application
 * Uses environment variable in production, falls back to window.location.origin in development
 */
export function getBaseUrl(): string {
  // Use environment variable if available (production)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  // Fallback to window location (development/client-side)
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Server-side fallback (should not happen in normal cases)
  return 'http://localhost:3000'
}

/**
 * Get the full URL for a given path
 */
export function getFullUrl(path: string): string {
  const baseUrl = getBaseUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}