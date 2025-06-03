import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from './ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SNPify - Advanced SNP Analysis Tool',
  description: 'Professional tool for analyzing Single Nucleotide Polymorphisms (SNPs) in BRCA1 and BRCA2 genes. Detect genetic variants with advanced string matching algorithms.',
  keywords: ['SNP', 'genetic analysis', 'BRCA1', 'BRCA2', 'bioinformatics', 'DNA sequencing', 'variant analysis'],
  authors: [{ name: 'SNPify Team' }],
  creator: 'SNPify Team',
  openGraph: {
    title: 'SNPify - Advanced SNP Analysis Tool',
    description: 'Professional tool for analyzing Single Nucleotide Polymorphisms (SNPs) in BRCA1 and BRCA2 genes.',
    url: 'https://snpify.com',
    siteName: 'SNPify',
    images: [
      {
        url: '/SNP_Logo.png',
        width: 1200,
        height: 630,
        alt: 'SNPify Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SNPify - Advanced SNP Analysis Tool',
    description: 'Professional tool for analyzing Single Nucleotide Polymorphisms (SNPs) in BRCA1 and BRCA2 genes.',
    images: ['/SNP_Logo.png'],
  },
  icons: {
    icon: '/SNP_Logo.png',
    shortcut: '/SNP_Logo.png',
    apple: '/SNP_Logo.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}