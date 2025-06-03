'use client'
import React, { useState, useEffect, useRef } from 'react'
import FileUpload from '../../components/FileUpload'
import SequenceInput from '../../components/SequenceInput'
import AnalysisProgress from '../../components/AnalysisProgress'
import SNPVisualization from '../../components/SNPVisualization'
import StatisticsSummary from '../../components/StatisticsSummary'
import ExportReport from '../../components/ExportReport'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { FileUploadData, SequenceInputData, AnalysisResult } from '../../lib/types'
import { gsap } from 'gsap'

type AnalysisStep = 'input' | 'processing' | 'results'
type InputMethod = 'file' | 'sequence'

export default function AnalysisPage() {
  const [language, setLanguage] = useState<'en' | 'id'>('en')
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('input')
  const [inputMethod, setInputMethod] = useState<InputMethod>('file')
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
      description: 'Advanced genetic analysis for BRCA1 and BRCA2 variants',
      inputMethod: 'Choose Input Method',
      fileUpload: 'File Upload',
      fileUploadDesc: 'Upload VCF, FASTA, or FASTQ files',
      sequenceInput: 'Manual Input',
      sequenceInputDesc: 'Enter DNA sequence manually',
      backToInput: 'Start New Analysis',
      steps: {
        input: 'Input',
        processing: 'Processing',
        results: 'Results'
      }
    },
    id: {
      title: 'Platform Analisis SNP',
      description: 'Analisis genetik canggih untuk varian BRCA1 dan BRCA2',
      inputMethod: 'Pilih Metode Input',
      fileUpload: 'Upload File',
      fileUploadDesc: 'Upload file VCF, FASTA, atau FASTQ',
      sequenceInput: 'Input Manual',
      sequenceInputDesc: 'Masukkan sekuens DNA secara manual',
      backToInput: 'Mulai Analisis Baru',
      steps: {
        input: 'Input',
        processing: 'Proses',
        results: 'Hasil'
      }
    }
  }

  const generateAnalysisId = (): string => {
    return 'SNP_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
  }

  const handleFileUpload = async (data: FileUploadData) => {
    const newAnalysisId = generateAnalysisId()
    setAnalysisId(newAnalysisId)
    setCurrentStep('processing')
    
    // Here you would typically send the file to your backend
    console.log('File upload data:', data)
  }

  const handleSequenceSubmit = async (data: SequenceInputData) => {
    const newAnalysisId = generateAnalysisId()
    setAnalysisId(newAnalysisId)
    setCurrentStep('processing')
    
    // Here you would typically send the sequence to your backend
    console.log('Sequence input data:', data)
  }

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result)
    setCurrentStep('results')
  }

  const handleNewAnalysis = () => {
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
                      </div>
                    </CardContent>
                  </Card>

                  {/* Input Component */}
                  <div className="mt-8">
                    {inputMethod === 'file' ? (
                      <FileUpload
                        onFileUpload={handleFileUpload}
                        onProgress={setUploadProgress}
                        language={language}
                      />
                    ) : (
                      <SequenceInput
                        onSequenceSubmit={handleSequenceSubmit}
                        language={language}
                      />
                    )}
                  </div>
                </div>
              )}

              {currentStep === 'processing' && (
                <div className="space-y-8">
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
                      <span className="text-emerald-400 font-medium">Analysis Completed</span>
                    </div>
                    <Button onClick={handleNewAnalysis} variant="outline" className="ml-4">
                      {text[language].backToInput}
                    </Button>
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