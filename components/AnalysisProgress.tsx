'use client'
import { snpifyAPI } from '@/lib/api/client'
import { AnalysisResult } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'

interface AnalysisProgressProps {
  analysisId: string
  onComplete: (result: AnalysisResult) => void
  language?: 'en' | 'id'
}

interface ProgressStep {
  id: string
  name: string
  progress: number
  weight: number
}

interface BackendProgressData {
  analysis_id: string
  progress: number
  current_step: string
  message: string
  steps: ProgressStep[]
}

export default function AnalysisProgress({ analysisId, onComplete, language = 'en' }: AnalysisProgressProps) {
  const [progressData, setProgressData] = useState<BackendProgressData | null>(null)
  const [overallProgress, setOverallProgress] = useState(0)
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [debugInfo, setDebugInfo] = useState<any>({})
  const maxRetries = 5

  const text = {
    en: {
      title: 'SNP Analysis in Progress',
      description: 'Analyzing your genetic data using Python backend algorithms',
      elapsed: 'Elapsed',
      estimated: 'Estimated completion',
      seconds: 'seconds',
      completed: 'Analysis completed successfully!',
      error: 'Analysis failed',
      retrying: 'Retrying...',
      connecting: 'Connecting to Python backend...',
      fetchingProgress: 'Fetching analysis progress...',
      fetchingResults: 'Fetching final results...',
      steps: {
        file_processing: 'File Processing',
        sequence_alignment: 'Sequence Alignment', 
        variant_detection: 'Variant Detection',
        clinical_annotation: 'Clinical Annotation',
        quality_assessment: 'Quality Assessment',
        report_generation: 'Report Generation'
      }
    },
    id: {
      title: 'Analisis SNP Sedang Berlangsung',
      description: 'Menganalisis data genetik menggunakan algoritma backend Python',
      elapsed: 'Waktu berlalu',
      estimated: 'Perkiraan selesai',
      seconds: 'detik',
      completed: 'Analisis berhasil diselesaikan!',
      error: 'Analisis gagal',
      retrying: 'Mencoba lagi...',
      connecting: 'Menghubungkan ke backend Python...',
      fetchingProgress: 'Mengambil progress analisis...',
      fetchingResults: 'Mengambil hasil akhir...',
      steps: {
        file_processing: 'Pemrosesan File',
        sequence_alignment: 'Penyelarasan Sekuens',
        variant_detection: 'Deteksi Varian',
        clinical_annotation: 'Anotasi Klinis',
        quality_assessment: 'Penilaian Kualitas',
        report_generation: 'Generasi Laporan'
      }
    }
  }

  // Enhanced result conversion function from file 2
  const convertBackendToFrontend = (backendResult: any): AnalysisResult => {
    console.log('🔄 Converting backend result for frontend:', backendResult);
    
    // Ensure we have the data
    const data = backendResult.data || backendResult;
    
    // Convert variants with proper mapping
    const variants = (data.variants || []).map((variant: any) => ({
      id: variant.id,
      position: variant.position,
      chromosome: variant.chromosome,
      gene: variant.gene,
      refAllele: variant.ref_allele || variant.refAllele,
      altAllele: variant.alt_allele || variant.altAllele,
      rsId: variant.rs_id || variant.rsId,
      mutation: variant.mutation,
      consequence: variant.consequence,
      impact: variant.impact,
      clinicalSignificance: variant.clinical_significance || variant.clinicalSignificance,
      confidence: variant.confidence,
      frequency: variant.frequency,
      sources: variant.sources || [],
      createdAt: new Date(variant.created_at || variant.createdAt || Date.now()),
      updatedAt: new Date(variant.updated_at || variant.updatedAt || Date.now())
    }));

    // CRITICAL FIX: Ensure summary data is properly extracted
    const summary = {
      totalVariants: data.summary?.total_variants || variants.length,
      pathogenicVariants: data.summary?.pathogenic_variants || 0,
      likelyPathogenicVariants: data.summary?.likely_pathogenic_variants || 0,
      uncertainVariants: data.summary?.uncertain_variants || variants.length,
      benignVariants: data.summary?.benign_variants || 0,
      overallRisk: data.summary?.overall_risk || 'LOW',
      riskScore: data.summary?.risk_score || 0,
      recommendations: data.summary?.recommendations || []
    };

    // CRITICAL FIX: Ensure metadata is properly mapped
    const metadata = {
      inputType: data.metadata?.input_type || 'RAW_SEQUENCE',
      fileName: data.metadata?.file_name,
      fileSize: data.metadata?.file_size,
      processingTime: data.metadata?.processing_time,
      algorithmVersion: data.metadata?.algorithm_version || '2.1.0',
      qualityScore: data.metadata?.quality_score || 95,
      coverage: data.metadata?.coverage,
      readDepth: data.metadata?.read_depth
    };

    const result: AnalysisResult = {
      id: data.id,
      status: data.status || 'COMPLETED',
      variants,
      summary,
      metadata,
      progress: data.progress || 100,
      startTime: new Date(data.start_time || data.startTime || Date.now()),
      endTime: data.end_time ? new Date(data.end_time) : new Date(),
      error: data.error
    };

    console.log('✅ Converted result:', result);
    console.log('📊 Summary check:', result.summary);
    console.log('📋 Metadata check:', result.metadata);
    
    return result;
  };

  // Clear any cached data when analysisId changes
  useEffect(() => {
    console.log(`🔄 AnalysisProgress: New analysis started for ID: ${analysisId}`)
    setProgressData(null)
    setOverallProgress(0)
    setError(null)
    setRetryCount(0)
    setIsPolling(true)
    setDebugInfo({ analysisId, startTime: new Date().toISOString() })
  }, [analysisId])

  // Fetch analysis progress from Python backend
  useEffect(() => {
    if (!analysisId || !isPolling) return

    let pollInterval: NodeJS.Timeout

    const fetchProgress = async () => {
      try {
        console.log(`📊 Fetching progress for analysis: ${analysisId}`)
        
        // Get progress from Python backend
        const progress = await snpifyAPI.getAnalysisProgress(analysisId)
        console.log('📈 Progress received:', progress)
        
        setProgressData(progress)
        setOverallProgress(progress.progress)
        setError(null)
        setRetryCount(0) // Reset retry count on success
        
        // Update debug info
        setDebugInfo((prev: Record<string, any>) => ({
          ...prev,
          lastProgressUpdate: new Date().toISOString(),
          currentProgress: progress.progress,
          currentStep: progress.current_step
        }))

        // Check if analysis is complete
        if (progress.progress >= 100) {
          console.log('🎉 Analysis completed, fetching final result...')
          setIsPolling(false)
          
          try {
            // Add small delay to ensure backend has finished writing result
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Fetch final result from Python backend
            const result = await snpifyAPI.getAnalysisResult(analysisId)
            console.log('📋 Raw backend result received:', result)
            
            if (result.status === 'COMPLETED') {
              // CRITICAL: Use our enhanced conversion function
              const convertedResult = convertBackendToFrontend(result);
              
              // Additional validation for Boyer-Moore specific issues
              if (convertedResult.summary.totalVariants === 0 && convertedResult.variants.length > 0) {
                console.warn('⚠️ Summary mismatch detected - fixing...');
                convertedResult.summary.totalVariants = convertedResult.variants.length;
                convertedResult.summary.uncertainVariants = convertedResult.variants.length;
              }
              
              if (!convertedResult.metadata.inputType) {
                console.warn('⚠️ Missing input type - fixing...');
                convertedResult.metadata.inputType = 'RAW_SEQUENCE';
              }
              
              console.log('✅ Final converted result for frontend:', convertedResult)
              console.log('📊 Final variant count:', convertedResult.variants.length)
              
              // Update debug info with final result
              setDebugInfo((prev: Record<string, any>) => ({
                ...prev,
                finalResult: {
                  totalVariants: convertedResult.variants.length,
                  summary: convertedResult.summary,
                  completedAt: new Date().toISOString()
                }
              }))
              
              onComplete(convertedResult)
              return
            } else if (result.status === 'FAILED') {
              setError(result.error || 'Analysis failed in backend')
              setIsPolling(false)
              return
            }
          } catch (resultError: any) {
            console.error('❌ Error fetching final result:', resultError)
            setError('Failed to fetch analysis result: ' + resultError.message)
            setIsPolling(false)
            return
          }
        }
      } catch (err: any) {
        console.error('❌ Error fetching progress:', err)
        
        // Implement retry logic
        if (retryCount < maxRetries) {
          console.log(`🔄 Retrying... (${retryCount + 1}/${maxRetries})`)
          setRetryCount(prev => prev + 1)
          setError(`${text[language].retrying} (${retryCount + 1}/${maxRetries})`)
        } else {
          console.error('💥 Max retries reached, stopping polling')
          setError('Backend connection failed after multiple retries: ' + err.message)
          setIsPolling(false)
        }
      }
    }

    // Initial fetch
    fetchProgress()

    // Poll for progress updates every 2 seconds
    if (isPolling) {
      pollInterval = setInterval(fetchProgress, 2000)
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [analysisId, onComplete, isPolling, retryCount, maxRetries, text, language])

  // Update elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  const getStepIcon = (step: ProgressStep, currentStep: string) => {
    if (step.progress >= 100) {
      return '✅'
    } else if (step.id === currentStep) {
      return '⚡'
    } else {
      return '⏳'
    }
  }

  const getStepColor = (step: ProgressStep, currentStep: string) => {
    if (step.progress >= 100) {
      return 'text-emerald-400'
    } else if (step.id === currentStep) {
      return 'text-cyan-400'
    } else {
      return 'text-gray-500'
    }
  }

  const estimateTimeRemaining = () => {
    if (!progressData || overallProgress === 0) return 60
    
    const remainingProgress = 100 - overallProgress
    const progressRate = overallProgress / elapsedTime
    
    if (progressRate === 0) return 60
    
    return Math.max(5, Math.round(remainingProgress / progressRate))
  }

  if (error && retryCount >= maxRetries) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <span className="text-2xl">❌</span>
            {text[language].error}
          </CardTitle>
          <CardDescription className="text-red-300">
            Python Backend Connection Failed
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
          
          {/* Debug Information */}
          <div className="p-4 bg-gray-800/50 border border-gray-600/50 rounded-lg">
            <h4 className="text-white font-medium mb-2">Debug Information:</h4>
            <pre className="text-xs text-gray-400 overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              Analysis ID: <span className="font-mono text-cyan-400">{analysisId}</span>
            </p>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">⚠️</span>
                <div className="text-sm text-yellow-300">
                  <strong>Make sure Python backend is running:</strong>
                  <code className="block mt-2 text-xs bg-gray-900/50 p-2 rounded">
                    cd snpify-backend && python main.py
                  </code>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
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
              {Math.round(overallProgress)}% Complete
            </span>
            <div className="text-sm text-gray-400">
              {text[language].elapsed}: {elapsedTime}s | {text[language].estimated}: {estimateTimeRemaining()}s
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
          {progressData?.steps.map((step) => (
            <div key={step.id} className="flex items-start space-x-4">
              {/* Step Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                step.progress >= 100
                  ? 'border-emerald-400 bg-emerald-400/20 text-emerald-400' 
                  : step.id === progressData.current_step
                  ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400 animate-pulse'
                  : 'border-gray-600 bg-gray-800/50 text-gray-500'
              }`}>
                <span className="text-xs">
                  {getStepIcon(step, progressData.current_step)}
                </span>
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm font-medium transition-colors duration-300 ${getStepColor(step, progressData.current_step)}`}>
                    {text[language].steps[step.id as keyof typeof text.en.steps] || step.name}
                  </h3>
                  {step.id === progressData.current_step && step.progress < 100 && (
                    <span className="text-xs text-gray-400 font-mono">
                      {Math.floor(step.progress)}%
                    </span>
                  )}
                </div>
                
                {step.id === progressData.current_step && (
                  <p className="text-xs text-gray-500 mb-2">
                    {progressData.message}
                  </p>
                )}
                
                {step.id === progressData.current_step && step.progress < 100 && (
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
            <div className="text-lg font-bold text-purple-400">Python</div>
            <div className="text-xs text-gray-500">Backend Engine</div>
          </div>
          
          <div className="text-center p-3 bg-gray-800/30 rounded-lg">
            <div className="text-lg font-bold text-emerald-400">v2.1.0</div>
            <div className="text-xs text-gray-500">Algorithm</div>
          </div>
        </div>

        {/* Current Step Message */}
        {progressData && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">🐍</span>
              <div className="text-sm text-blue-300">
                <strong>Python Backend:</strong> {text[language].steps[progressData.current_step as keyof typeof text.en.steps] || progressData.current_step}
              </div>
            </div>
            <div className="text-sm text-blue-200 mt-1 ml-6">
              {progressData.message}
            </div>
          </div>
        )}

        {/* Debug Information (Development Mode) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 bg-gray-800/30 border border-gray-600/30 rounded-lg">
            <h4 className="text-white font-medium mb-2">Debug Info:</h4>
            <pre className="text-xs text-gray-400 overflow-auto max-h-32">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        {/* Retry indicator */}
        {error && retryCount < maxRetries && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">🔄</span>
              <div className="text-sm text-yellow-300">
                {error}
              </div>
            </div>
          </div>
        )}

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