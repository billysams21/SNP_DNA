'use client'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [language, setLanguage] = useState<'en' | 'id'>('en')

  const handleLanguageChange = (newLanguage: 'en' | 'id') => {
    setLanguage(newLanguage)
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLanguage }))
  }

  return (
    <>
      <Navbar language={language} onLanguageChange={handleLanguageChange} />
      <main className="pt-20">
        {children}
      </main>
    </>
  )
} 