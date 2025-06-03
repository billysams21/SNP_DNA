'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function HomePage() {
  const [language, setLanguage] = useState<'en' | 'id'>('en')
  const [currentCommand, setCurrentCommand] = useState('')
  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'info', text: 'SNPify Analysis Terminal v2.1.0' },
    { type: 'info', text: 'Type "help" for available commands' },
    { type: 'prompt', text: '$ ' }
  ])
  const [isTyping, setIsTyping] = useState(false)
  
  // GSAP refs
  const titleRef = useRef(null)
  const badgeRef = useRef(null)
  const descriptionRef = useRef(null)
  const statsRef = useRef(null)
  const buttonsRef = useRef(null)
  const terminalRef = useRef(null)
  const card1Ref = useRef(null)
  const card2Ref = useRef(null)
  const card3Ref = useRef(null)
  const card4Ref = useRef(null)

  const text = {
    en: {
      badge: 'Leading Genetic Analysis Platform',
      title: 'Welcome to',
      description: 'Advanced SNP Analysis Tool for analyzing',
      snp: 'Single Nucleotide Polymorphisms',
      genes: 'in BRCA1 and BRCA2 genes with advanced',
      ai: 'AI-powered',
      technology: 'technology.',
      stats: {
        accuracy: 'Analysis Accuracy',
        algorithms: 'Advanced Algorithms',
        genes: 'Target Genes',
        time: 'Processing Time'
      },
      buttons: {
        analyze: 'Start Analysis',
        docs: 'Documentation'
      },
      terminal: {
        title: 'SNP Analysis Terminal',
        mode: 'Interactive Mode',
        pathogenic: 'Pathogenic variant detected',
        confidence: 'Confidence: 98.7%',
        help: 'Try commands:',
        processing: 'Processing...',
        placeholder: 'Type a command...',
        cleared: 'Terminal cleared',
        commands: {
          help: 'Available commands:',
          analyze: '  analyze - Run SNP analysis',
          demo: '  demo    - Show demo analysis',
          stats: '  stats   - Show platform statistics',
          clear: '  clear   - Clear terminal',
          version: '  version - Show version info',
          starting: 'Starting SNP analysis...',
          loading: 'Loading BRCA1 reference sequence...',
          scanning: 'Scanning for variants...',
          detected: '🔍 SNP detected at position 61: C→A (rs80357914)',
          completed: 'Analysis completed - Pathogenic variant found!',
          demoRunning: 'Running demo analysis on sample data...',
          sequence: 'ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAA[A]TCTTAGAGTGTCCCATCT...',
          classification: 'Variant classification: Pathogenic',
          confidenceScore: 'Confidence score: 98.7%',
          statsTitle: 'Platform Statistics:',
          statsAccuracy: '• Accuracy: 99.9%',
          algorithms: '• Algorithms: 4 advanced methods',
          targetGenes: '• Target genes: BRCA1, BRCA2',
          processTime: '• Processing time: <30 seconds',
          versionTitle: 'SNPify Analysis Platform',
          versionNum: 'Version: 2.1.0',
          build: 'Build: Production',
          status: 'Status: All systems operational',
          notFound: 'Command not found:'
        }
      }
    },
    id: {
      badge: 'Platform Analisis Genetik Terdepan',
      title: 'Selamat datang di',
      description: 'Advanced SNP Analysis Tool untuk analisis',
      snp: 'Single Nucleotide Polymorphisms',
      genes: 'pada gen BRCA1 dan BRCA2 dengan teknologi',
      ai: 'AI-powered',
      technology: 'yang canggih.',
      stats: {
        accuracy: 'Akurasi Analisis',
        algorithms: 'Algoritma Canggih',
        genes: 'Target Gen',
        time: 'Waktu Proses'
      },
      buttons: {
        analyze: 'Mulai Analisis',
        docs: 'Dokumentasi'
      },
      terminal: {
        title: 'Terminal Analisis SNP',
        mode: 'Mode Interaktif',
        pathogenic: 'Varian patogenik terdeteksi',
        confidence: 'Tingkat kepercayaan: 98.7%',
        help: 'Coba perintah:',
        processing: 'Memproses...',
        placeholder: 'Ketik perintah...',
        cleared: 'Terminal dibersihkan',
        commands: {
          help: 'Perintah yang tersedia:',
          analyze: '  analyze - Jalankan analisis SNP',
          demo: '  demo    - Tampilkan demo analisis',
          stats: '  stats   - Tampilkan statistik platform',
          clear: '  clear   - Bersihkan terminal',
          version: '  version - Tampilkan info versi',
          starting: 'Memulai analisis SNP...',
          loading: 'Memuat sekuens referensi BRCA1...',
          scanning: 'Memindai varian...',
          detected: '🔍 SNP terdeteksi pada posisi 61: C→A (rs80357914)',
          completed: 'Analisis selesai - Varian patogenik ditemukan!',
          demoRunning: 'Menjalankan demo analisis pada data sampel...',
          sequence: 'ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAA[A]TCTTAGAGTGTCCCATCT...',
          classification: 'Klasifikasi varian: Patogenik',
          confidenceScore: 'Skor kepercayaan: 98.7%',
          statsTitle: 'Statistik Platform:',
          statsAccuracy: '• Akurasi: 99.9%',
          algorithms: '• Algoritma: 4 metode canggih',
          targetGenes: '• Target gen: BRCA1, BRCA2',
          processTime: '• Waktu pemrosesan: <30 detik',
          versionTitle: 'Platform Analisis SNPify',
          versionNum: 'Versi: 2.1.0',
          build: 'Build: Production',
          status: 'Status: Semua sistem operasional',
          notFound: 'Perintah tidak ditemukan:'
        }
      }
    }
  }

  const getCommands = () => ({
    help: [
      { type: 'success', text: text[language].terminal.commands.help },
      { type: 'info', text: text[language].terminal.commands.analyze },
      { type: 'info', text: text[language].terminal.commands.demo },
      { type: 'info', text: text[language].terminal.commands.stats },
      { type: 'info', text: text[language].terminal.commands.clear },
      { type: 'info', text: text[language].terminal.commands.version }
    ],
    analyze: [
      { type: 'info', text: text[language].terminal.commands.starting },
      { type: 'success', text: text[language].terminal.commands.loading },
      { type: 'warning', text: text[language].terminal.commands.scanning },
      { type: 'error', text: text[language].terminal.commands.detected },
      { type: 'success', text: text[language].terminal.commands.completed }
    ],
    demo: [
      { type: 'info', text: text[language].terminal.commands.demoRunning },
      { type: 'success', text: text[language].terminal.commands.sequence },
      { type: 'warning', text: text[language].terminal.commands.classification },
      { type: 'success', text: text[language].terminal.commands.confidenceScore }
    ],
    stats: [
      { type: 'success', text: text[language].terminal.commands.statsTitle },
      { type: 'info', text: text[language].terminal.commands.statsAccuracy },
      { type: 'info', text: text[language].terminal.commands.algorithms },
      { type: 'info', text: text[language].terminal.commands.targetGenes },
      { type: 'info', text: text[language].terminal.commands.processTime }
    ],
    version: [
      { type: 'info', text: text[language].terminal.commands.versionTitle },
      { type: 'info', text: text[language].terminal.commands.versionNum },
      { type: 'info', text: text[language].terminal.commands.build },
      { type: 'success', text: text[language].terminal.commands.status }
    ]
  })

  // GSAP Animations
  useEffect(() => {
    const tl = gsap.timeline()
    
    // Initial animations
    tl.fromTo(badgeRef.current, 
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
    .fromTo(titleRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(descriptionRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    )
    .fromTo([card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current],
      { opacity: 0, y: 40, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 },
      "-=0.4"
    )
    .fromTo(buttonsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(terminalRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 1, ease: "power2.out" },
      "-=0.8"
    )

    // Interactive card animations
    const cards = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current]
    
    cards.forEach((card) => {
      if (card) {
        const cardElement = card as HTMLElement
        
        const handleMouseEnter = () => {
          gsap.to(card, {
            scale: 1.05,
            y: -5,
            duration: 0.3,
            ease: "power2.out"
          })
        }
        
        const handleMouseLeave = () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          })
        }
        
        cardElement.addEventListener('mouseenter', handleMouseEnter)
        cardElement.addEventListener('mouseleave', handleMouseLeave)
        
        // Store handlers for cleanup
        ;(cardElement as any)._handleMouseEnter = handleMouseEnter
        ;(cardElement as any)._handleMouseLeave = handleMouseLeave
      }
    })

    return () => {
      cards.forEach((card) => {
        if (card) {
          const cardElement = card as HTMLElement
          cardElement.removeEventListener('mouseenter', (cardElement as any)._handleMouseEnter)
          cardElement.removeEventListener('mouseleave', (cardElement as any)._handleMouseLeave)
        }
      })
    }
  }, [])

  // Listen to language changes from parent
  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent) => {
      setLanguage(e.detail)
    }
    
    window.addEventListener('languageChanged', handleLanguageChange as EventListener)
    return () => window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
  }, [])

  // Update terminal output when language changes
  useEffect(() => {
    setTerminalOutput([
      { type: 'info', text: 'SNPify Analysis Terminal v2.1.0' },
      { type: 'info', text: language === 'en' ? 'Type "help" for available commands' : 'Ketik "help" untuk perintah yang tersedia' },
      { type: 'prompt', text: '$ ' }
    ])
  }, [language])

  const handleCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim()
    const commands = getCommands()
    setIsTyping(true)
    
    setTimeout(() => {
      setTerminalOutput(prev => [
        ...prev.slice(0, -1), // Remove the prompt
        { type: 'command', text: `$ ${cmd}` },
        ...(commands[command as keyof typeof commands] || [{ 
          type: 'error', 
          text: `${text[language].terminal.commands.notFound} ${cmd}. ${language === 'en' ? 'Type "help" for available commands.' : 'Ketik "help" untuk perintah yang tersedia.'}` 
        }]),
        { type: 'prompt', text: '$ ' }
      ])
      setIsTyping(false)
    }, 1000)
  }

  const clearTerminal = () => {
    setTerminalOutput([
      { type: 'info', text: text[language].terminal.cleared },
      { type: 'prompt', text: '$ ' }
    ])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentCommand.trim()) {
      if (currentCommand.toLowerCase() === 'clear') {
        clearTerminal()
      } else {
        handleCommand(currentCommand)
      }
      setCurrentCommand('')
    }
  }

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Split Layout - Balanced Proportional */}
      <div className="relative z-10 min-h-screen max-h-screen flex items-start justify-center pt-4 lg:pt-6 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-4 lg:p-6 items-start">
          
          {/* Left Side - Balanced Content */}
          <div className="flex flex-col justify-start space-y-2 lg:space-y-3">
          
          {/* Hero Badge */}
            <div ref={badgeRef} className="inline-flex items-center w-fit px-3 lg:px-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-full border border-gray-600 backdrop-blur-sm">
            <span className="text-sm font-semibold text-gray-400 mr-2">🧬</span>
              <span className="text-xs lg:text-sm font-medium text-gray-300">{text[language].badge}</span>
          </div>
          
            {/* Main Title Proportional */}
            <div>
              <h1 ref={titleRef} className={`font-black text-white leading-tight mb-1 lg:mb-2 tracking-tight ${
                language === 'id' 
                  ? 'text-3xl sm:text-4xl lg:text-5xl' 
                  : 'text-4xl lg:text-6xl'
              }`}>
              {text[language].title}{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                SNPify
              </span>
            </h1>
            
              <p ref={descriptionRef} className={`text-gray-400 leading-relaxed ${
                language === 'id' 
                  ? 'text-base lg:text-lg max-w-full' 
                  : 'text-lg lg:text-xl max-w-2xl'
              }`}>
              {text[language].description}{' '}
              <span className="text-cyan-400 font-semibold">{text[language].snp}</span>{' '}
              {text[language].genes}{' '}
              <span className="text-blue-400 font-semibold">{text[language].ai}</span>{' '}
              {text[language].technology}
            </p>
          </div>

            {/* Interactive Stats Grid - Balanced */}
            <div ref={statsRef} className="grid grid-cols-2 gap-3 lg:gap-4">
              {/* Analysis Accuracy Card */}
              <div ref={card1Ref} className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-gray-700/50 hover:border-cyan-500/60 transition-all duration-500 cursor-pointer transform-gpu overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-xl lg:text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1.5 lg:mb-2 group-hover:scale-105 transition-transform duration-300">
                    99.9%
                  </div>
                  <div className={`font-medium text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-2 lg:mb-3 ${
                    language === 'id' ? 'text-sm leading-tight' : 'text-sm'
                  }`}>
                    {text[language].stats.accuracy}
                  </div>
                  
                  {/* Enhanced Progress Bar with Fill Animation */}
                  <div className="relative w-full bg-gray-700/60 rounded-full h-2 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700/30 to-gray-600/30 rounded-full"></div>
                    <div 
                      className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-2000 ease-out group-hover:shadow-lg group-hover:shadow-cyan-500/50 relative overflow-hidden"
                      style={{
                        width: '0%',
                        animation: 'fillProgress 2s ease-out 0.5s forwards'
                      }}
                    >
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] animate-shimmer"></div>
                    </div>
                  </div>
                </div>
                
                {/* CSS Animation Keyframes */}
                <style jsx>{`
                  @keyframes fillProgress {
                    from { width: 0%; }
                    to { width: 99.9%; }
                  }
                  
                  @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                  }
                  
                  .animate-shimmer {
                    animation: shimmer 1.5s ease-in-out infinite;
                  }
                `}</style>
              </div>

              {/* Advanced Algorithms Card */}
              <div ref={card2Ref} className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-gray-700/50 hover:border-purple-500/60 transition-all duration-500 cursor-pointer transform-gpu overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-xl lg:text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-1.5 lg:mb-2 group-hover:scale-105 transition-transform duration-300">
                    4
                  </div>
                  <div className={`font-medium text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-2 lg:mb-3 ${
                    language === 'id' ? 'text-sm leading-tight' : 'text-sm'
                  }`}>
                    {text[language].stats.algorithms}
            </div>

                  {/* Enhanced Animated Dots */}
                  <div className="flex space-x-2">
                {[...Array(4)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full transition-all duration-300 group-hover:animate-bounce group-hover:shadow-lg group-hover:shadow-purple-500/50 relative overflow-hidden"
                        style={{
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '0.6s'
                        }}
                      >
                        {/* Inner Glow */}
                        <div className="absolute inset-0.5 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Genes Card */}
              <div ref={card3Ref} className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-gray-700/50 hover:border-emerald-500/60 transition-all duration-500 cursor-pointer transform-gpu overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-xl lg:text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-1.5 lg:mb-2 group-hover:scale-105 transition-transform duration-300">
                    2
                  </div>
                  <div className={`font-medium text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-2 lg:mb-3 ${
                    language === 'id' ? 'text-sm leading-tight' : 'text-sm'
                  }`}>
                    {text[language].stats.genes}
            </div>

                  {/* Enhanced Gene Badges */}
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-400 text-xs rounded-full border border-emerald-500/40 font-medium transition-all duration-300 group-hover:border-emerald-400/60 group-hover:bg-gradient-to-r group-hover:from-emerald-500/30 group-hover:to-emerald-600/30 group-hover:text-emerald-300 group-hover:shadow-lg group-hover:shadow-emerald-500/25">
                      BRCA1
                    </span>
                    <span className="px-2 py-1 bg-gradient-to-r from-teal-500/20 to-teal-600/20 text-teal-400 text-xs rounded-full border border-teal-500/40 font-medium transition-all duration-300 group-hover:border-teal-400/60 group-hover:bg-gradient-to-r group-hover:from-teal-500/30 group-hover:to-teal-600/30 group-hover:text-teal-300 group-hover:shadow-lg group-hover:shadow-teal-500/25">
                      BRCA2
                    </span>
                  </div>
                </div>
              </div>

              {/* Processing Time Card */}
              <div ref={card4Ref} className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-gray-700/50 hover:border-orange-500/60 transition-all duration-500 cursor-pointer transform-gpu overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-xl lg:text-2xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-1.5 lg:mb-2 group-hover:scale-105 transition-transform duration-300">
                    &lt;30s
                  </div>
                  <div className={`font-medium text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mb-2 lg:mb-3 ${
                    language === 'id' ? 'text-sm leading-tight' : 'text-sm'
                  }`}>
                    {text[language].stats.time}
                  </div>
                  
                  {/* Enhanced Loading Spinner with Multiple Rings */}
                  <div className="flex items-center">
                    <div className="relative w-4 h-4 flex-shrink-0">
                      {/* Outer Ring */}
                      <div className="absolute inset-0 w-full h-full border-2 border-orange-400/20 rounded-full"></div>
                      
                      {/* Main Spinning Ring */}
                      <div className="absolute inset-0 w-full h-full border-2 border-transparent border-t-orange-400 border-r-orange-400 rounded-full animate-spin"></div>
                      
                      {/* Inner Ring - Counter Rotation */}
                      <div className="absolute inset-1 w-2 h-2 border border-transparent border-b-orange-300 border-l-orange-300 rounded-full animate-spin-reverse"></div>
                      
                      {/* Outer Glow Effect */}
                      <div className="absolute inset-0 w-full h-full bg-orange-400/10 rounded-full animate-pulse group-hover:bg-orange-400/20 transition-colors duration-300"></div>
                    </div>
                    
                    <span className={`text-orange-400 ml-3 font-medium group-hover:text-orange-300 transition-colors duration-300 animate-pulse ${
                      language === 'id' ? 'text-sm leading-tight' : 'text-sm'
                    }`}>
                      {text[language].terminal.processing}
                    </span>
              </div>
            </div>

                {/* Additional CSS for Counter Rotation */}
                <style jsx>{`
                  @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                  }
                  
                  .animate-spin-reverse {
                    animation: spin-reverse 1s linear infinite;
                  }
                `}</style>
            </div>
          </div>

            {/* CTA Buttons - Consistent Size */}
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-3">
            <Link 
              href="/analysis" 
                className="group inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-3 text-base"
              >
                <span className="mr-2 text-base">🚀</span>
              {text[language].buttons.analyze}
                <svg className="ml-2 group-hover:translate-x-1 transition-transform duration-300 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <Link 
              href="/docs" 
                className="group inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 bg-gray-800/30 backdrop-blur-sm hover:bg-gray-700/30 transform hover:scale-105 border-2 border-cyan-500/50 text-cyan-400 hover:border-cyan-400 hover:text-cyan-300 px-6 py-3 text-base"
              >
                <span className="mr-2 text-base">📚</span>
              {text[language].buttons.docs}
            </Link>
          </div>
        </div>

          {/* Right Side - Terminal Moved Up */}
          <div className="flex justify-center items-start pt-16 lg:pt-20 h-screen">
            <div ref={terminalRef} className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl h-[380px] lg:h-[420px] w-full max-w-lg flex flex-col">
            
            {/* Terminal Header */}
              <div className="flex items-center justify-between p-3 lg:p-4 border-b border-gray-700/50">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
                <div className="text-sm font-medium text-gray-400">{text[language].terminal.title}</div>
                <div className="text-xs text-gray-500">{text[language].terminal.mode}</div>
            </div>
            
            {/* Terminal Content */}
              <div className="flex-1 p-3 lg:p-4 font-mono text-sm overflow-y-auto">
              <div className="space-y-1">
                {terminalOutput.map((line, index) => (
                  <div key={index} className={`
                    ${line.type === 'command' ? 'text-white font-bold' : ''}
                    ${line.type === 'info' ? 'text-cyan-300' : ''}
                    ${line.type === 'success' ? 'text-green-400' : ''}
                    ${line.type === 'warning' ? 'text-yellow-400' : ''}
                    ${line.type === 'error' ? 'text-orange-400' : ''}
                    ${line.type === 'prompt' ? 'text-gray-400 inline' : ''}
                  `}>
                    {line.text}
                    {line.type === 'prompt' && (
                      <input
                        type="text"
                        value={currentCommand}
                        onChange={(e) => setCurrentCommand(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="bg-transparent border-none outline-none text-white ml-1 flex-1"
                          placeholder={isTyping ? text[language].terminal.processing : text[language].terminal.placeholder}
                        disabled={isTyping}
                        autoFocus
                      />
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="text-cyan-400 animate-pulse">
                    <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse"></span>
                  </div>
                )}
              </div>
            </div>

            {/* Terminal Footer */}
              <div className="p-3 border-t border-gray-700/50 text-xs text-gray-500 text-center">
              {text[language].terminal.help} <span className="text-cyan-400">help</span>, <span className="text-green-400">analyze</span>, <span className="text-yellow-400">demo</span>, <span className="text-purple-400">stats</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 