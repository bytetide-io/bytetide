export const validateDomain = (domain: string): boolean => {
  if (!domain) return false
  
  // Basic domain regex pattern
  const domainPattern = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
  
  // Remove protocol if present
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
  
  return domainPattern.test(cleanDomain)
}

export const validateShopifyUrl = (url: string): boolean => {
  if (!url) return false
  
  // Remove protocol if present and clean trailing slash
  const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  
  // Check if it ends with .myshopify.com
  const shopifyPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\.myshopify\.com$/
  
  return shopifyPattern.test(cleanUrl)
}

export const validateShopifyAccessToken = (token: string): boolean => {
  if (!token) return false
  
  // Shopify access tokens are typically 32+ characters long
  // and contain alphanumeric characters and underscores
  const tokenPattern = /^[a-zA-Z0-9_]{32,}$/
  
  return tokenPattern.test(token)
}

export const normalizeShopifyUrl = (url: string): string => {
  if (!url) return ''
  
  // Remove protocol and trailing slash
  let cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  
  // If it doesn't end with .myshopify.com, add it
  if (!cleanUrl.endsWith('.myshopify.com')) {
    // If it's just the store name, add the domain
    if (!cleanUrl.includes('.')) {
      cleanUrl = `${cleanUrl}.myshopify.com`
    }
  }
  
  return cleanUrl
}

export const normalizeDomain = (domain: string): string => {
  if (!domain) return ''
  
  // Remove protocol and trailing slash
  return domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
}