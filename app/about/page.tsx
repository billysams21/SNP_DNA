'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { gsap } from 'gsap'
import Image from 'next/image'

export default function AboutPage() {
  const [language, setLanguage] = useState<'en' | 'id'>('en')

  // GSAP refs
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)
  const teamRef = useRef(null)
  const missionRef = useRef(null)

  // Listen to language changes from parent
  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent) => {
      setLanguage(e.detail)
    }
    
    window.addEventListener('languageChanged', handleLanguageChange as EventListener)
    return () => window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
  }, [])

  // GSAP Animations
  useEffect(() => {
    const tl = gsap.timeline()
    
    if (titleRef.current) {
      tl.fromTo(titleRef.current, 
        { opacity: 0, y: -50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
      )
    }
    
    if (descriptionRef.current) {
      tl.fromTo(descriptionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      )
    }
    
    if (missionRef.current) {
      tl.fromTo(missionRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      )
    }
    
    if (teamRef.current) {
      tl.fromTo(teamRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.6"
      )
    }
  }, [])

  const pageText = {
    en: {
      pageTitle: 'About SNPify',
      pageDescription: 'Meet the brilliant minds behind the innovative SNP analysis platform',
      missionTitle: 'Our Mission',
      mission: 'To revolutionize genetic analysis by providing accessible, accurate, and comprehensive SNP analysis tools for researchers, clinicians, and healthcare professionals worldwide.',
      visionTitle: 'Our Vision',
      vision: 'Empowering personalized medicine through cutting-edge bioinformatics and making genetic insights accessible to everyone.',
      teamTitle: 'Meet Our Team',
      teamDescription: 'A passionate team of developers and researchers dedicated to advancing genetic analysis technology.',
      contact: 'Contact',
      ctaTitle: 'Ready to Start Your Genetic Analysis?',
      ctaDescription: 'Join thousands of researchers and clinicians who trust SNPify for their genetic analysis needs.',
      ctaButton: 'Start Analysis'
    },
    id: {
      pageTitle: 'Tentang SNPify',
      pageDescription: 'Berkenalan dengan minds jenius di balik platform analisis SNP yang inovatif',
      missionTitle: 'Misi Kami',
      mission: 'Merevolusi analisis genetik dengan menyediakan tools analisis SNP yang accessible, akurat, dan komprehensif untuk peneliti, klinisi, dan profesional kesehatan di seluruh dunia.',
      visionTitle: 'Visi Kami',
      vision: 'Memberdayakan personalized medicine melalui bioinformatika terdepan dan membuat insight genetik dapat diakses oleh semua orang.',
      teamTitle: 'Tim Kami',
      teamDescription: 'Tim yang passionate terdiri dari developer dan peneliti yang berdedikasi untuk memajukan teknologi analisis genetik.',
      contact: 'Kontak',
      ctaTitle: 'Siap Memulai Analisis Genetik Anda?',
      ctaDescription: 'Bergabunglah dengan ribuan peneliti dan klinisi yang mempercayai SNPify untuk kebutuhan analisis genetik mereka.',
      ctaButton: 'Mulai Analisis'
    }
  }

  const teamMembers = [
    {
      id: 'dzulfaqor',
      name: 'Dzulfaqor',
      role: language === 'en' ? 'Frontend Developer' : 'Frontend Developer',
      description: language === 'en' 
        ? 'Passionate frontend developer specializing in modern web technologies. Focused on creating intuitive and responsive user interfaces for complex bioinformatics applications.'
        : 'Frontend developer yang passionate dan spesialisasi dalam teknologi web modern. Fokus pada pembuatan user interface yang intuitif dan responsif untuk aplikasi bioinformatika yang kompleks.',
      skills: ['React', 'Next.js', 'TypeScript', 'UI/UX Design', 'GSAP Animations'],
      image: '/member/Dzulfaqor.jpg',
      gradient: 'from-cyan-400 to-blue-500',
      email: 'dzulfaqor@snpify.com',
      linkedin: 'www.linkedin.com/in/dzulfaqor-ali-d-85bb241a1',
      github: 'github.com/dzulfaqorali196'
    },
    {
      id: 'billy',
      name: 'Billy',
      role: language === 'en' ? 'Backend Developer' : 'Backend Developer',
      description: language === 'en'
        ? 'Expert backend developer with deep knowledge in bioinformatics algorithms and high-performance computing. Specialized in building scalable analysis pipelines.'
        : 'Backend developer expert dengan pengetahuan mendalam dalam algoritma bioinformatika dan high-performance computing. Spesialisasi dalam membangun pipeline analisis yang scalable.',
      skills: ['Python', 'Node.js', 'PostgreSQL', 'Docker', 'Bioinformatics'],
      image: '/member/billy.jpg',
      gradient: 'from-purple-400 to-pink-500',
      email: 'billy@snpify.com',
      linkedin: 'linkedin.com/in/billy',
      github: 'github.com/billy'
    },
    {
      id: 'alvin',
      name: 'Alvin',
      role: language === 'en' ? 'Researcher' : 'Researcher',
      description: language === 'en'
        ? 'Dedicated bioinformatics researcher with expertise in genomics and computational biology. Leading the scientific validation and algorithm development.'
        : 'Peneliti bioinformatika yang berdedikasi dengan expertise dalam genomics dan computational biology. Memimpin validasi scientific dan pengembangan algoritma.',
      skills: ['Genomics', 'Machine Learning', 'R', 'Biostatistics', 'Data Analysis'],
      image: '/member/alvin.jpg',
      gradient: 'from-green-400 to-teal-500',
      email: 'alvin@snpify.com',
      linkedin: 'linkedin.com/in/alvin',
      github: 'github.com/alvin'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 ref={titleRef} className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                {pageText[language].pageTitle}
              </span>
            </h1>
            <p ref={descriptionRef} className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              {pageText[language].pageDescription}
            </p>
          </div>

          <div ref={missionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  {pageText[language].missionTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {pageText[language].mission}
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-gradient-to-br from-cyan-900/40 to-teal-900/40 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">🔬</span>
                  {pageText[language].visionTitle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  {pageText[language].vision}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {pageText[language].teamTitle}
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                {pageText[language].teamDescription}
              </p>
            </div>

            <div ref={teamRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.id} className="group backdrop-blur-sm bg-gray-900/60 border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${member.gradient}`}></div>
                  
                  <CardHeader className="text-center pb-4">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <div className={`absolute inset-0 bg-gradient-to-r ${member.gradient} rounded-full p-1`}>
                        <div className="w-full h-full bg-gray-900 rounded-full p-1">
                          <Image
                            src={member.image}
                            alt={member.name}
                            width={120}
                            height={120}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://ui-avatars.com/api/?name=${member.name}&background=random&color=fff&size=120`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-white">
                      {member.name}
                    </CardTitle>
                    <CardDescription className={`text-lg font-semibold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                      {member.role}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {member.description}
                    </p>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-800/60 text-xs text-gray-300 rounded-full border border-gray-700/50"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-700/50">
                      <h4 className="text-sm font-semibold text-white mb-2">{pageText[language].contact}:</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2 text-gray-400">
                          <span>📧</span>
                          <a 
                            href={`mailto:${member.email}`}
                            className="hover:text-cyan-400 transition-colors duration-200"
                          >
                            {member.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <span>🔗</span>
                          <a 
                            href={`https://${member.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-cyan-400 transition-colors duration-200"
                          >
                            {member.linkedin}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <span>🐙</span>
                          <a 
                            href={`https://${member.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-cyan-400 transition-colors duration-200"
                          >
                            {member.github}
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Card className="backdrop-blur-sm bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-cyan-900/40 border-purple-500/30 max-w-4xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {pageText[language].ctaTitle}
                </h3>
                <p className="text-gray-300 mb-6">
                  {pageText[language].ctaDescription}
                </p>
                <Button 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300"
                  onClick={() => window.location.href = '/analysis'}
                >
                  {pageText[language].ctaButton}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 