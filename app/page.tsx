import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating DNA Strands */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-indigo-400 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute bottom-32 left-32 w-5 h-5 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-pink-400 rounded-full animate-bounce opacity-50"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Logo with Glow Effect */}
        <div className="mb-8 group">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <Image
              src="/SNP_Logo.jpg"
              alt="SNPify Logo"
              width={220}
              height={220}
              className="relative mx-auto rounded-3xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
        </div>

        {/* Animated Title */}
        <div className="mb-6">
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
            Welcome to{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                SNPify
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full transform scale-x-0 animate-pulse group-hover:scale-x-100 transition-transform duration-500"></div>
            </span>
          </h1>
          
          {/* Typing Animation Effect */}
          <div className="mt-4 text-lg text-gray-600 font-mono">
            <span className="border-r-2 border-blue-600 animate-pulse pr-1">
              🧬 Platform Analisis Genetik Canggih
            </span>
          </div>
        </div>

        {/* Enhanced Description */}
        <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-4xl mx-auto">
          Advanced SNP Analysis Tool untuk analisis{' '}
          <span className="text-blue-600 font-semibold">Single Nucleotide Polymorphisms</span>{' '}
          pada gen BRCA1 dan BRCA2. Deteksi varian genetik dengan algoritma{' '}
          <span className="text-indigo-600 font-semibold">string matching</span> yang canggih.
        </p>

        {/* Interactive Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200/50">
            <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">99.9%</div>
            <div className="text-sm text-gray-600 font-medium">Akurasi</div>
            <div className="mt-2 w-full bg-blue-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 delay-200"></div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200/50">
            <div className="text-3xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-300">4</div>
            <div className="text-sm text-gray-600 font-medium">Algoritma</div>
            <div className="mt-2 w-full bg-indigo-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 delay-400"></div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200/50">
            <div className="text-3xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">2</div>
            <div className="text-sm text-gray-600 font-medium">Target Gen</div>
            <div className="mt-2 w-full bg-purple-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 delay-600"></div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200/50">
            <div className="text-3xl font-bold text-pink-600 mb-2 group-hover:scale-110 transition-transform duration-300">&lt;30s</div>
            <div className="text-sm text-gray-600 font-medium">Waktu Analisis</div>
            <div className="mt-2 w-full bg-pink-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 delay-800"></div>
            </div>
          </div>
        </div>

        {/* Interactive Call to Action */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link 
            href="/analysis" 
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <span className="relative flex items-center">
              <span className="mr-3 text-2xl">🚀</span>
              Mulai Analisis
              <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>

          <Link 
            href="/docs" 
            className="group relative inline-flex items-center justify-center px-10 py-5 border-3 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 bg-white/50 backdrop-blur-sm"
          >
            <span className="flex items-center">
              <span className="mr-3 text-2xl">📚</span>
              Dokumentasi
              <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
          </Link>
        </div>

        {/* DNA Sequence Animation */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30">
            <div className="text-sm text-gray-600 mb-3 font-medium">Sample DNA Sequence Analysis</div>
            <div className="font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-xl overflow-hidden">
              <div className="whitespace-nowrap overflow-hidden">
                <span className="animate-pulse">
                  &gt; BRCA1_sequence<br/>
                  <span className="text-yellow-400">ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAA</span>
                  <span className="bg-red-500 text-white px-1 animate-pulse">A</span>
                  <span className="text-yellow-400">TCTTAGAGTGTCCCATCT...</span>
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
              <span>🔍 SNP Detected at position 61</span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                Analysis Complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="text-gray-500 text-sm flex flex-col items-center">
          <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span>Scroll untuk eksplorasi</span>
        </div>
      </div>
    </div>
  )
} 