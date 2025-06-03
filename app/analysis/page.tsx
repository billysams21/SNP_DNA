'use client'
import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import AnalysisProgress from '../../components/AnalysisProgress'
import ExportReport from '../../components/ExportReport'
import FileUpload from '../../components/FileUpload'
import SequenceInput from '../../components/SequenceInput'
import SNPVisualization from '../../components/SNPVisualization'
import StatisticsSummary from '../../components/StatisticsSummary'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { AnalysisResult, FileUploadData, SequenceInputData } from '../../lib/types'

type AnalysisStep = 'input' | 'processing' | 'results'
type InputMethod = 'file' | 'sequence'

export default function AnalysisPage() {
  const [language, setLanguage] = useState<'en' | 'id'>('en')
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('input')
  const [inputMethod, setInputMethod] = useState<InputMethod>('sequence') // Default to sequence for manual input
  const [analysisId, setAnalysisId] = useState<string>('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // GSAP refs
  const headerRef = useRef(null)
  const stepsRef = useRef(null)
  const contentRef = useRef(null)
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)

  // Listen to language changes from parent
  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent) => {
      setLanguage(e.detail)
    }
    
    window.addEventListener('languageChanged', handleLanguageChange as EventListener)
    return () => window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
  }, [])

  // GSAP Animations for page load
  useEffect(() => {
    const tl = gsap.timeline()
    
    tl.fromTo(titleRef.current, 
      { opacity: 0, y: -40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
    )
    .fromTo(descriptionRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(stepsRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo(contentRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    )
  }, [])

  // GSAP Animation for step transitions
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      )
    }
  }, [currentStep])

  const text = {
    en: {
      title: 'SNP Analysis Platform',
      description: 'Advanced genetic analysis for BRCA1 and BRCA2 variants using Python backend',
      inputMethod: 'Choose Input Method',
      fileUpload: 'File Upload',
      fileUploadDesc: 'Upload VCF, FASTA, or FASTQ files',
      sequenceInput: 'Manual Input',
      sequenceInputDesc: 'Enter DNA sequence manually',
      backToInput: 'Start New Analysis',
      analysisCompleted: 'Analysis Completed Successfully',
      analysisCompletedDesc: 'Your genetic analysis has been completed by the Python backend',
      steps: {
        input: 'Input',
        processing: 'Processing',
        results: 'Results'
      }
    },
    id: {
      title: 'Platform Analisis SNP',
      description: 'Analisis genetik canggih untuk varian BRCA1 dan BRCA2 menggunakan backend Python',
      inputMethod: 'Pilih Metode Input',
      fileUpload: 'Upload File',
      fileUploadDesc: 'Upload file VCF, FASTA, atau FASTQ',
      sequenceInput: 'Input Manual',
      sequenceInputDesc: 'Masukkan sekuens DNA secara manual',
      backToInput: 'Mulai Analisis Baru',
      analysisCompleted: 'Analisis Berhasil Diselesaikan',
      analysisCompletedDesc: 'Analisis genetik Anda telah diselesaikan oleh backend Python',
      steps: {
        input: 'Input',
        processing: 'Proses',
        results: 'Hasil'
      }
    }
  }

  const handleFileUpload = async (data: FileUploadData) => {
    console.log('📄 File upload initiatedooo:', data)
    const id = data.metadata?.analysisId
    if (id) {
      setAnalysisId(id)
      setCurrentStep('processing')
    } else {
      console.error('❌ No analysis ID received from file upload')
    }
  } 

  const handleSequenceSubmit = async (data: SequenceInputData) => {
    console.log('🧬 Sequence submission initiated:', data)
    console.log('📋 Analysis ID from metadata:', data.metadata?.analysisId)
    console.log('🔄 Using mock data:', data.metadata?.useMockData)
    
    // Use the analysis ID that was generated in SequenceInput component
    const newAnalysisId = data.metadata?.analysisId || 'SNP_SEQ_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
    
    console.log('🆔 Setting analysis ID:', newAnalysisId)
    setAnalysisId(newAnalysisId)
    setCurrentStep('processing')
  }

  const handleAnalysisComplete = (result: AnalysisResult) => {
    console.log('✅ Analysis completed - received result:', result)
    console.log('📊 Result summary:', {
      id: result.id,
      status: result.status,
      totalVariants: result.variants?.length || 0,
      pathogenicVariants: result.summary?.pathogenicVariants || 0,
      qualityScore: result.metadata?.qualityScore || 0,
      processingTime: result.metadata?.processingTime || 0
    })
    
    // Store the REAL result from backend (no conversion needed, AnalysisProgress handles it)
    setAnalysisResult(result)
    setCurrentStep('results')
  }

  const handleNewAnalysis = () => {
    console.log('🔄 Starting new analysis - resetting state')
    setCurrentStep('input')
    setAnalysisId('')
    setAnalysisResult(null)
    setUploadProgress(0)
  }

  const getStepNumber = (step: AnalysisStep): number => {
    const stepMap = { input: 1, processing: 2, results: 3 }
    return stepMap[step]
  }

  const isStepCompleted = (step: AnalysisStep): boolean => {
    const stepNumbers = { input: 1, processing: 2, results: 3 }
    return stepNumbers[step] < getStepNumber(currentStep)
  }

  const isStepActive = (step: AnalysisStep): boolean => {
    return step === currentStep
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 ref={titleRef} className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {text[language].title}
              </span>
            </h1>
            <p ref={descriptionRef} className="text-xl text-gray-400 max-w-3xl mx-auto">
              {text[language].description}
            </p>
            
            {/* Backend Connection Indicator */}
            {(currentStep === 'processing' || currentStep === 'results') && (
              <div className="inline-flex items-center mt-4 px-4 py-2 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/50">
                <div className="w-2 h-2 rounded-full mr-2 bg-green-400"></div>
                🐍 Python Backend Analysis
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div ref={stepsRef} className="flex justify-center mb-12">
            <div className="flex items-center space-x-8">
              {(['input', 'processing', 'results'] as AnalysisStep[]).map((step, index) => (
                <div key={step} className="flex items-center">
                  {index > 0 && (
                    <div className={`w-20 h-0.5 ${
                      isStepCompleted(step) ? 'bg-cyan-400' : 'bg-gray-600'
                    }`} />
                  )}
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                      isStepActive(step)
                        ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                        : isStepCompleted(step)
                        ? 'border-emerald-400 bg-emerald-400/20 text-emerald-400'
                        : 'border-gray-600 bg-gray-800/50 text-gray-500'
                    }`}>
                      {isStepCompleted(step) ? '✓' : getStepNumber(step)}
                    </div>
                    <span className={`ml-3 text-sm font-medium ${
                      isStepActive(step) ? 'text-cyan-400' : isStepCompleted(step) ? 'text-emerald-400' : 'text-gray-500'
                    }`}>
                      {text[language].steps[step]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div ref={contentRef} className="max-w-4xl mx-auto">
            <Card className="backdrop-blur-sm bg-gray-900/60 border-gray-700/50 shadow-2xl">
              {currentStep === 'input' && (
                <div className="space-y-8">
                  {/* Input Method Selection */}
                  <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                      <CardTitle className="text-center">{text[language].inputMethod}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          onClick={() => setInputMethod('sequence')}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                            inputMethod === 'sequence'
                              ? 'border-cyan-400 bg-cyan-400/10'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="text-2xl mb-2">🧬</div>
                          <h3 className="font-semibold text-white mb-1">{text[language].sequenceInput}</h3>
                          <p className="text-sm text-gray-400">{text[language].sequenceInputDesc}</p>
                        </button>

                        <button
                          onClick={() => setInputMethod('file')}
                          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                            inputMethod === 'file'
                              ? 'border-cyan-400 bg-cyan-400/10'
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="text-2xl mb-2">📄</div>
                          <h3 className="font-semibold text-white mb-1">{text[language].fileUpload}</h3>
                          <p className="text-sm text-gray-400">{text[language].fileUploadDesc}</p>
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Input Component */}
                  <div className="mt-8">
                    {inputMethod === 'sequence' ? (
                      <SequenceInput
                        onSequenceSubmit={handleSequenceSubmit}
                        language={language}
                      />
                    ) : (
                      <FileUpload
                        onFileUpload={handleFileUpload}
                        language={language}
                      />
                    )}
                  </div>
                </div>
              )}

              {currentStep === 'processing' && (
                <div className="space-y-8">
                  {/* Real Analysis Progress - No Mock Logic */}
                  <AnalysisProgress
                    analysisId={analysisId}
                    onComplete={handleAnalysisComplete}
                    language={language}
                  />
                </div>
              )}

              {currentStep === 'results' && analysisResult && (
                <div className="space-y-8">
                  {/* Results Header */}
                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full mb-4">
                      <span className="text-emerald-400 mr-2">✅</span>
                      <span className="text-emerald-400 font-medium">
                        {text[language].analysisCompleted}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4">
                      {text[language].analysisCompletedDesc}
                    </p>
                    <div className="flex justify-center items-center space-x-4">
                      <div className="text-xs text-gray-500">
                        Analysis ID: <span className="font-mono text-cyan-400">{analysisResult.id}</span>
                      </div>
                      <Button onClick={handleNewAnalysis} variant="outline">
                        {text[language].backToInput}
                      </Button>
                    </div>
                  </div>

                  {/* Backend Data Confirmation */}
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">🐍</span>
                      <div className="text-sm text-green-300">
                        <strong>Python Backend Results:</strong> Analysis completed with {analysisResult.variants?.length || 0} variants 
                        found in {analysisResult.metadata?.processingTime?.toFixed(1) || 'N/A'}s 
                        (Quality: {analysisResult.metadata?.qualityScore?.toFixed(1) || 'N/A'}%)
                      </div>
                    </div>
                  </div>

                  {/* Results Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Statistics Summary */}
                    <div className="lg:col-span-1">
                      <StatisticsSummary 
                        result={analysisResult} 
                        language={language}
                      />
                    </div>

                    {/* Visualization */}
                    <div className="lg:col-span-2">
                      <SNPVisualization 
                        result={analysisResult} 
                        language={language}
                      />
                    </div>
                  </div>

                  {/* Export Report */}
                  <div className="mt-8">
                    <ExportReport 
                      result={analysisResult} 
                      language={language}
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}