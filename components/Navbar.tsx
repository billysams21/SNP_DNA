'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NavbarProps {
  language: 'en' | 'id'
  onLanguageChange: (lang: 'en' | 'id') => void
}

export default function Navbar({ language, onLanguageChange }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const text = {
    en: {
      home: 'Home',
      analysis: 'Analysis',
      documentation: 'Documentation',
      about: 'About',
      getStarted: 'Get Started',
      subtitle: 'Advanced Genetic Analysis'
    },
    id: {
      home: 'Beranda',
      analysis: 'Analisis',
      documentation: 'Dokumentasi',
      about: 'Tentang',
      getStarted: 'Mulai Sekarang',
      subtitle: 'Analisis Genetik Canggih'
    }
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl' 
        : 'bg-gray-900/90 backdrop-blur-md border-b border-gray-800/30'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section - Pojok Kiri */}
          <Link href="/" className="flex items-center space-x-4 flex-shrink-0 cursor-pointer">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-2 rounded-2xl border border-gray-700/50 group-hover:border-cyan-500/50 transition-all duration-300">
                <Image
                  src="/SNP_Logo.png"
                  alt="SNPify Logo"
                  width={60}
                  height={60}
                  className="rounded-xl"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col mt-4">
              <h1 className="text-2xl font-black text-white tracking-tight leading-none">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">SNP</span>
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ify</span>
              </h1>
              <p className="text-xs text-gray-400 font-semibold tracking-wider leading-none mt-1">
                {text[language].subtitle}
              </p>
            </div>
          </Link>

          {/* Navigation Links - Tengah (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              {language === 'en' ? 'Home' : 'Beranda'}
            </Link>
            <Link href="/analysis" className="text-gray-300 hover:text-white transition-colors">
              {language === 'en' ? 'Analysis' : 'Analisis'}
            </Link>
            <Link href="/docs" className="text-gray-300 hover:text-white transition-colors">
              {language === 'en' ? 'Documentation' : 'Dokumentasi'}
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              {language === 'en' ? 'About' : 'Tentang'}
            </Link>
          </nav>

          {/* Action Buttons - Pojok Kanan */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            
            {/* Language Toggle */}
            <div className="relative">
              <button 
                onClick={() => onLanguageChange(language === 'en' ? 'id' : 'en')}
                className="group relative px-4 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 hover:border-cyan-500/50 rounded-xl text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium text-sm backdrop-blur-sm"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span className="font-bold">{language.toUpperCase()}</span>
                  <div className="w-1 h-1 rounded-full bg-current opacity-50"></div>
                  <span className="text-xs opacity-70">{language === 'en' ? 'ID' : 'EN'}</span>
                </div>
              </button>
            </div>

            {/* Get Started Button */}
            <Link 
              href="/analysis"
              className="group relative px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <span className="relative flex items-center space-x-2">
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{text[language].getStarted}</span>
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-3 rounded-xl text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50 transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-gray-800/50 bg-gray-900/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="grid grid-cols-2 gap-3">
            {[
              { key: 'home', href: '/' },
              { key: 'analysis', href: '/analysis' },
              { key: 'documentation', href: '/docs' },
              { key: 'about', href: '/about' }
            ].map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
              >
                <span className="font-medium">{text[language][item.key as keyof typeof text.en]}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
} 