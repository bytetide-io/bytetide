import {
  validateDomain,
  validateShopifyUrl,
  validateShopifyAccessToken,
  normalizeShopifyUrl,
  normalizeDomain,
} from '../index'

describe('Validation Utilities', () => {
  describe('validateDomain', () => {
    it('validates correct domains', () => {
      expect(validateDomain('example.com')).toBe(true)
      expect(validateDomain('sub.example.com')).toBe(true)
      expect(validateDomain('example-site.co.uk')).toBe(true)
      expect(validateDomain('123.example.com')).toBe(true)
    })

    it('rejects invalid domains', () => {
      expect(validateDomain('')).toBe(false)
      expect(validateDomain('invalid')).toBe(false)
      expect(validateDomain('http://example.com')).toBe(false)
      expect(validateDomain('example.com/')).toBe(false)
      expect(validateDomain('.com')).toBe(false)
      expect(validateDomain('example.')).toBe(false)
    })
  })

  describe('validateShopifyUrl', () => {
    it('validates correct Shopify URLs', () => {
      expect(validateShopifyUrl('mystore.myshopify.com')).toBe(true)
      expect(validateShopifyUrl('test-store.myshopify.com')).toBe(true)
      expect(validateShopifyUrl('store123.myshopify.com')).toBe(true)
    })

    it('rejects invalid Shopify URLs', () => {
      expect(validateShopifyUrl('')).toBe(false)
      expect(validateShopifyUrl('example.com')).toBe(false)
      expect(validateShopifyUrl('https://mystore.myshopify.com')).toBe(false)
      expect(validateShopifyUrl('mystore.shopify.com')).toBe(false)
      expect(validateShopifyUrl('mystore.myshopify')).toBe(false)
      expect(validateShopifyUrl('.myshopify.com')).toBe(false)
    })
  })

  describe('validateShopifyAccessToken', () => {
    it('validates correct access tokens', () => {
      expect(validateShopifyAccessToken('shpat_1234567890abcdef')).toBe(true)
      expect(validateShopifyAccessToken('shppa_1234567890abcdef')).toBe(true)
      expect(validateShopifyAccessToken('shpss_1234567890abcdef')).toBe(true)
      expect(validateShopifyAccessToken('shpca_1234567890abcdef')).toBe(true)
    })

    it('rejects invalid access tokens', () => {
      expect(validateShopifyAccessToken('')).toBe(false)
      expect(validateShopifyAccessToken('invalid')).toBe(false)
      expect(validateShopifyAccessToken('token_1234567890abcdef')).toBe(false)
      expect(validateShopifyAccessToken('shpat_')).toBe(false)
      expect(validateShopifyAccessToken('shpat_123')).toBe(false)
    })
  })

  describe('normalizeShopifyUrl', () => {
    it('normalizes various Shopify URL formats', () => {
      expect(normalizeShopifyUrl('mystore.myshopify.com')).toBe('mystore.myshopify.com')
      expect(normalizeShopifyUrl('https://mystore.myshopify.com')).toBe('mystore.myshopify.com')
      expect(normalizeShopifyUrl('https://mystore.myshopify.com/')).toBe('mystore.myshopify.com')
      expect(normalizeShopifyUrl('http://mystore.myshopify.com')).toBe('mystore.myshopify.com')
      expect(normalizeShopifyUrl('mystore.myshopify.com/admin')).toBe('mystore.myshopify.com')
    })

    it('handles edge cases', () => {
      expect(normalizeShopifyUrl('')).toBe('')
      expect(normalizeShopifyUrl('   mystore.myshopify.com   ')).toBe('mystore.myshopify.com')
      expect(normalizeShopifyUrl('MYSTORE.MYSHOPIFY.COM')).toBe('mystore.myshopify.com')
    })
  })

  describe('normalizeDomain', () => {
    it('normalizes various domain formats', () => {
      expect(normalizeDomain('example.com')).toBe('example.com')
      expect(normalizeDomain('https://example.com')).toBe('example.com')
      expect(normalizeDomain('https://www.example.com')).toBe('example.com')
      expect(normalizeDomain('http://www.example.com/')).toBe('example.com')
      expect(normalizeDomain('https://example.com/path')).toBe('example.com')
    })

    it('handles edge cases', () => {
      expect(normalizeDomain('')).toBe('')
      expect(normalizeDomain('   example.com   ')).toBe('example.com')
      expect(normalizeDomain('EXAMPLE.COM')).toBe('example.com')
      expect(normalizeDomain('www.example.com')).toBe('example.com')
    })

    it('preserves subdomains', () => {
      expect(normalizeDomain('sub.example.com')).toBe('sub.example.com')
      expect(normalizeDomain('https://sub.example.com')).toBe('sub.example.com')
      expect(normalizeDomain('deep.sub.example.com')).toBe('deep.sub.example.com')
    })
  })
})