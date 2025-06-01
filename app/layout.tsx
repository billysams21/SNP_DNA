import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

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
        url: '/SNP_Logo.jpg',
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
    images: ['/SNP_Logo.jpg'],
  },
  icons: {
    icon: '/SNP_Logo.jpg',
    shortcut: '/SNP_Logo.jpg',
    apple: '/SNP_Logo.jpg',
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
      <body className={`${inter.className} h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900 antialiased`}>
        {/* Header Navigation */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🧬</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    SNPify
                  </h1>
                  <p className="text-xs text-gray-500">Advanced SNP Analysis</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                  Home
                </a>
                <a href="/analysis" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                  Analysis
                </a>
                <a href="/docs" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                  Documentation
                </a>
                <a href="/about" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                  About
                </a>
              </nav>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button className="hidden sm:inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                  Sign In
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 h-full">
          {children}
        </main>
      </body>
    </html>
  )
}
