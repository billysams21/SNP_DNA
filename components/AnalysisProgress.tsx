'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { AnalysisResult } from '@/lib/types'

interface AnalysisProgressProps {
  analysisId: string
  onComplete: (result: AnalysisResult) => void
  language?: 'en' | 'id'
}

interface ProgressStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'error'
  progress: number
  duration?: number
}

export default function AnalysisProgress({ analysisId, onComplete, language = 'en' }: AnalysisProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(45)

  const text = {
    en: {
      title: 'SNP Analysis in Progress',
      description: 'Analyzing your genetic data for SNP variants',
      elapsed: 'Elapsed',
      estimated: 'Estimated completion',
      seconds: 'seconds',
      completed: 'Analysis completed successfully!',
      steps: [
        {
          title: 'File Processing',
          description: 'Reading and validating input sequence data'
        },
        {
          title: 'Sequence Alignment',
          description: 'Aligning sequence with BRCA1/BRCA2 reference'
        },
        {
          title: 'Variant Detection',
          description: 'Identifying single nucleotide polymorphisms'
        },
        {
          title: 'Clinical Annotation',
          description: 'Annotating variants with clinical significance'
        },
        {
          title: 'Quality Assessment',
          description: 'Evaluating analysis quality and confidence'
        },
        {
          title: 'Report Generation',
          description: 'Generating comprehensive analysis report'
        }
      ]
    },
    id: {
      title: 'Analisis SNP Sedang Berlangsung',
      description: 'Menganalisis data genetik Anda untuk varian SNP',
      elapsed: 'Waktu berlalu',
      estimated: 'Perkiraan selesai',
      seconds: 'detik',
      completed: 'Analisis berhasil diselesaikan!',
      steps: [
        {
          title: 'Pemrosesan File',
          description: 'Membaca dan memvalidasi data sekuens input'
        },
        {
          title: 'Penyelarasan Sekuens',
          description: 'Menyelaraskan sekuens dengan referensi BRCA1/BRCA2'
        },
        {
          title: 'Deteksi Varian',
          description: 'Mengidentifikasi polimorfisme nukleotida tunggal'
        },
        {
          title: 'Anotasi Klinis',
          description: 'Memberikan anotasi varian dengan signifikansi klinis'
        },
        {
          title: 'Penilaian Kualitas',
          description: 'Mengevaluasi kualitas analisis dan tingkat kepercayaan'
        },
        {
          title: 'Generasi Laporan',
          description: 'Menghasilkan laporan analisis komprehensif'
        }
      ]
    }
  }

  const [steps, setSteps] = useState<ProgressStep[]>(
    text[language].steps.map((step, index) => ({
      id: `step-${index}`,
      title: step.title,
      description: step.description,
      status: index === 0 ? 'running' : 'pending',
      progress: index === 0 ? 0 : 0,
      duration: [8, 12, 10, 8, 5, 7][index] // Estimated duration for each step
    }))
  )

  // Simulate analysis progress
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      
      setSteps(prevSteps => {
        const newSteps = [...prevSteps]
        const runningStepIndex = newSteps.findIndex(step => step.status === 'running')
        
        if (runningStepIndex !== -1) {
          const currentStepProgress = newSteps[runningStepIndex].progress + Math.random() * 15 + 5
          
          if (currentStepProgress >= 100) {
            // Complete current step
            newSteps[runningStepIndex].status = 'completed'
            newSteps[runningStepIndex].progress = 100
            
            // Start next step if available
            if (runningStepIndex < newSteps.length - 1) {
              newSteps[runningStepIndex + 1].status = 'running'
              newSteps[runningStepIndex + 1].progress = 0
              setCurrentStep(runningStepIndex + 1)
            } else {
              // All steps completed
              setOverallProgress(100)
              setTimeout(() => {
                // Simulate analysis result
                const mockResult: AnalysisResult = {
                  id: analysisId,
                  status: 'COMPLETED',
                  variants: [],
                  summary: {
                    totalVariants: 5,
                    pathogenicVariants: 1,
                    likelyPathogenicVariants: 1,
                    uncertainVariants: 1,
                    benignVariants: 2,
                    overallRisk: 'MODERATE',
                    riskScore: 7.5,
                    recommendations: []
                  },
                  metadata: {
                    inputType: 'FASTA',
                    algorithmVersion: '2.1.0',
                    qualityScore: 98.7,
                    processingTime: elapsedTime
                  },
                  progress: 100,
                  startTime: new Date(startTime),
                  endTime: new Date()
                }
                onComplete(mockResult)
              }, 2000)
              return newSteps
            }
          } else {
            newSteps[runningStepIndex].progress = Math.min(currentStepProgress, 100)
          }
        }
        
        // Calculate overall progress
        const totalProgress = newSteps.reduce((acc, step) => acc + step.progress, 0)
        const overall = Math.floor(totalProgress / newSteps.length)
        setOverallProgress(overall)
        
        // Update estimated time
        const remainingSteps = newSteps.filter(step => step.status !== 'completed').length
        const avgStepTime = newSteps.reduce((acc, step) => acc + (step.duration || 0), 0) / newSteps.length
        setEstimatedTime(Math.max(0, remainingSteps * avgStepTime - elapsedTime))
        
        return newSteps
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [analysisId, onComplete, startTime, elapsedTime])

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅'
      case 'running':
        return '⚡'
      case 'error':
        return '❌'
      default:
        return '⏳'
    }
  }

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400'
      case 'running':
        return 'text-cyan-400'
      case 'error':
        return 'text-red-400'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🔬</span>
          {text[language].title}
        </CardTitle>
        <CardDescription>
          {text[language].description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-white">
              {overallProgress}% Complete
            </span>
            <div className="text-sm text-gray-400">
              {text[language].elapsed}: {elapsedTime}s | {text[language].estimated}: {estimatedTime}s
            </div>
          </div>
          
          <div className="relative w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${overallProgress}%` }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-[-100%] animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Step Progress */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-4">
              {/* Step Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step.status === 'completed' 
                  ? 'border-emerald-400 bg-emerald-400/20 text-emerald-400' 
                  : step.status === 'running'
                  ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400 animate-pulse'
                  : step.status === 'error'
                  ? 'border-red-400 bg-red-400/20 text-red-400'
                  : 'border-gray-600 bg-gray-800/50 text-gray-500'
              }`}>
                <span className="text-xs">
                  {getStepIcon(step.status)}
                </span>
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm font-medium transition-colors duration-300 ${getStepColor(step.status)}`}>
                    {step.title}
                  </h3>
                  {step.status === 'running' && (
                    <span className="text-xs text-gray-400 font-mono">
                      {Math.floor(step.progress)}%
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mb-2">
                  {step.description}
                </p>
                
                {step.status === 'running' && (
                  <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Analysis Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700/50">
          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
            <div className="text-lg font-bold text-cyan-400">{analysisId.slice(-8)}</div>
            <div className="text-xs text-gray-500">Analysis ID</div>
          </div>
          
          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
            <div className="text-lg font-bold text-purple-400">BRCA1/2</div>
            <div className="text-xs text-gray-500">Target Genes</div>
          </div>
          
          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
            <div className="text-lg font-bold text-emerald-400">v2.1.0</div>
            <div className="text-xs text-gray-500">Algorithm</div>
          </div>
        </div>

        {/* CSS for shimmer animation */}
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .animate-shimmer {
            animation: shimmer 2s ease-in-out infinite;
          }
        `}</style>
      </CardContent>
    </Card>
  )
}
