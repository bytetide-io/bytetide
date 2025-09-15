import { type Metadata } from 'next'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - ByteTide',
    default: 'ByteTide - Premium Data Migration for Shopify Agencies',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full text-base antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
