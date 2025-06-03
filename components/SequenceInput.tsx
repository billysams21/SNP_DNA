'use client'
import { checkBackendConnection, snpifyAPI, testBackendIntegration } from '@/lib/api/client'
import { SequenceInputData } from '@/lib/types'
import React, { useState } from 'react'
import { Button } from './ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

interface SequenceInputProps {
  onSequenceSubmit: (data: SequenceInputData) => void
  language?: 'en' | 'id'
}

export default function SequenceInput({ onSequenceSubmit, language = 'en' }: SequenceInputProps) {
  const [sequence, setSequence] = useState('')
  const [type, setType] = useState<'DNA' | 'PROTEIN'>('DNA')
  const [gene, setGene] = useState<'BRCA1' | 'BRCA2'>('BRCA1')
  const [algorithm, setAlgorithm] = useState<'boyer-moore' | 'kmp' | 'rabin-karp'>('boyer-moore')
  const [metadata, setMetadata] = useState({
    name: '',
    description: ''
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown')
  const [backendDetails, setBackendDetails] = useState<any>(null)

  const text = {
    en: {
      title: 'Manual Sequence Input',
      description: 'Enter DNA or protein sequence manually for analysis',
      sequenceLabel: 'DNA/Protein Sequence',
      sequencePlaceholder: 'Enter your sequence here (ATCG for DNA, amino acids for protein)...',
      typeLabel: 'Sequence Type',
      geneLabel: 'Target Gene',
      algorithmLabel: 'Analysis Algorithm',
      nameLabel: 'Sequence Name (Optional)',
      namePlaceholder: 'e.g., Patient Sample 001',
      descriptionLabel: 'Description (Optional)',
      descriptionPlaceholder: 'Additional information about this sequence...',
      analyze: 'Start Analysis',
      submitting: 'Starting Analysis...',
      chars: 'characters',
      checkingBackend: 'Checking Python backend...',
      backendConnected: 'Python backend connected',
      backendDisconnected: 'Python backend unavailable - using mock data',
      testBackend: 'Test Backend',
      forceBackend: 'Force Python Backend',
      examples: {
        title: 'Example Sequences:',
        dna: 'DNA: ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAA',
        protein: 'Protein: MDLSALREVQNVINCYAHQSK'
      },
      validation: {
        empty: 'Please enter a sequence',
        tooShort: 'Sequence is too short (minimum 10 characters)',
        invalidDNA: 'Invalid DNA sequence. Use only A, T, G, C characters',
        invalidProtein: 'Invalid protein sequence. Use only standard amino acid codes',
        backendError: 'Failed to start analysis. Please try again.',
        mustUseBackend: 'This analysis requires the Python backend to be running.'
      },
      algorithms: {
        'boyer-moore': 'Boyer-Moore (Fast pattern matching)',
        'kmp': 'Knuth-Morris-Pratt (Efficient for repeats)',
        'rabin-karp': 'Rabin-Karp (Rolling hash based)'
      }
    },
    id: {
      title: 'Input Sekuens Manual',
      description: 'Masukkan sekuens DNA atau protein secara manual untuk analisis',
      sequenceLabel: 'Sekuens DNA/Protein',
      sequencePlaceholder: 'Masukkan sekuens Anda di sini (ATCG untuk DNA, asam amino untuk protein)...',
      typeLabel: 'Tipe Sekuens',
      geneLabel: 'Target Gen',
      algorithmLabel: 'Algoritma Analisis',
      nameLabel: 'Nama Sekuens (Opsional)',
      namePlaceholder: 'contoh: Sampel Pasien 001',
      descriptionLabel: 'Deskripsi (Opsional)',
      descriptionPlaceholder: 'Informasi tambahan tentang sekuens ini...',
      analyze: 'Mulai Analisis',
      submitting: 'Memulai Analisis...',
      chars: 'karakter',
      checkingBackend: 'Memeriksa backend Python...',
      backendConnected: 'Backend Python terhubung',
      backendDisconnected: 'Backend Python tidak tersedia - menggunakan data mock',
      testBackend: 'Test Backend',
      forceBackend: 'Paksa Backend Python',
      examples: {
        title: 'Contoh Sekuens:',
        dna: 'DNA: ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAA',
        protein: 'Protein: MDLSALREVQNVINCYAHQSK'
      },
      validation: {
        empty: 'Silakan masukkan sekuens',
        tooShort: 'Sekuens terlalu pendek (minimal 10 karakter)',
        invalidDNA: 'Sekuens DNA tidak valid. Gunakan hanya karakter A, T, G, C',
        invalidProtein: 'Sekuens protein tidak valid. Gunakan hanya kode asam amino standar',
        backendError: 'Gagal memulai analisis. Silakan coba lagi.',
        mustUseBackend: 'Analisis ini memerlukan backend Python untuk berjalan.'
      },
      algorithms: {
        'boyer-moore': 'Boyer-Moore (Pencarian pola cepat)',
        'kmp': 'Knuth-Morris-Pratt (Efisien untuk pengulangan)',
        'rabin-karp': 'Rabin-Karp (Berbasis rolling hash)'
      }
    }
  }

  const typeOptions = [
    { value: 'DNA', label: 'DNA' },
    { value: 'PROTEIN', label: 'Protein' }
  ]

  const geneOptions = [
    { value: 'BRCA1', label: 'BRCA1' },
    { value: 'BRCA2', label: 'BRCA2' }
  ]

  const algorithmOptions = [
    { value: 'boyer-moore', label: text[language].algorithms['boyer-moore'] },
    { value: 'kmp', label: text[language].algorithms['kmp'] },
    { value: 'rabin-karp', label: text[language].algorithms['rabin-karp'] }
  ]

  // Check backend connection on component mount
  React.useEffect(() => {
    const checkConnection = async () => {
      console.log('🔍 Checking backend connection on component mount...');
      const isConnected = await checkBackendConnection()
      setBackendStatus(isConnected ? 'connected' : 'disconnected')
      
      if (isConnected) {
        try {
          const health = await snpifyAPI.healthCheck()
          setBackendDetails(health)
        } catch (error) {
          console.error('Failed to get backend details:', error)
        }
      }
    }
    checkConnection()
  }, [])

  const handleTestBackend = async () => {
    setError('')
    console.log('🧪 Running backend integration test...')
    
    try {
      const result = await testBackendIntegration()
      if (result.success) {
        setBackendStatus('connected')
        setError('')
        alert('✅ Backend test successful! Analysis ID: ' + result.analysisId)
      } else {
        setBackendStatus('disconnected')
        setError('Backend test failed: ' + result.error)
      }
    } catch (error: any) {
      setBackendStatus('disconnected')
      setError('Backend test failed: ' + error.message)
    }
  }

  const validateSequence = (seq: string, seqType: 'DNA' | 'PROTEIN'): string | null => {
    if (!seq.trim()) {
      return text[language].validation.empty
    }

    if (seq.length < 10) {
      return text[language].validation.tooShort
    }

    if (seqType === 'DNA') {
      const dnaRegex = /^[ATGCN\s\n]+$/i
      if (!dnaRegex.test(seq)) {
        return text[language].validation.invalidDNA
      }
    } else {
      const proteinRegex = /^[ACDEFGHIKLMNPQRSTVWY\s\n]+$/i
      if (!proteinRegex.test(seq)) {
        return text[language].validation.invalidProtein
      }
    }

    return null
  }

  const handleSequenceChange = (value: string) => {
    setSequence(value.toUpperCase())
    setError('')
  }

  const generateMockAnalysisId = (): string => {
    return 'MOCK_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
  }

  const handleSubmit = async () => {
    const cleanSequence = sequence.replace(/\s/g, '')
    const validationError = validateSequence(cleanSequence, type)
    
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      console.log('🚀 Starting analysis submission...')
      
      // Force check backend connection
      const isBackendAvailable = await checkBackendConnection()
      console.log('Backend available:', isBackendAvailable)
      
      if (isBackendAvailable) {
        console.log('✅ Using Python backend for real analysis')
        
        // Use real backend API - FORCE direct connection
        const response = await snpifyAPI.analyzeSequence({
          sequence: cleanSequence,
          gene: gene,
          algorithm: algorithm,
          sequence_type: type,
          metadata: {
            name: metadata.name || undefined,
            description: metadata.description || undefined,
            frontend_version: '1.0.0',
            forced_backend: true
          }
        })

        console.log('🎉 Backend response received:', response)

        // Create data object that matches SequenceInputData interface
        const data: SequenceInputData = {
          sequence: cleanSequence,
          type,
          gene,
          metadata: {
            name: metadata.name || undefined,
            description: metadata.description || undefined,
            analysisId: response.analysis_id,
            algorithm: algorithm,
            useMockData: false // REAL backend data
          }
        }

        onSequenceSubmit(data)
      } else {
        // Backend not available - show error instead of using mock
        console.error('❌ Python backend not available')
        setBackendStatus('disconnected')
        setError(text[language].validation.mustUseBackend + ' Please start the Python backend first.')
        
        // Optional: Still allow mock for testing
        console.warn('🔄 Using mock data as fallback')
        const data: SequenceInputData = {
          sequence: cleanSequence,
          type,
          gene,
          metadata: {
            name: metadata.name || undefined,
            description: metadata.description || undefined,
            analysisId: generateMockAnalysisId(),
            algorithm: algorithm,
            useMockData: true
          }
        }
        onSequenceSubmit(data)
      }
    } catch (error: any) {
      console.error('💥 Analysis submission failed:', error)
      setError(text[language].validation.backendError + ' ' + (error.message || ''))
    } finally {
      setIsSubmitting(false)
    }
  }

  const insertExample = (exampleType: 'DNA' | 'PROTEIN') => {
    const examples = {
      DNA: 'ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAATCTTAGAGTGTCCCATCTGGTAAGTCAGGATACAG',
      PROTEIN: 'MDLSALREVQNVINCYAHQSKMNLEKRSHSIDKIPAFQNLQQGGMVSRIMLGV'
    }
    setSequence(examples[exampleType])
    setType(exampleType)
    setError('')
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🧬</span>
          {text[language].title}
        </CardTitle>
        <CardDescription>
          {text[language].description}
        </CardDescription>
        
        {/* Backend Status Indicator */}
        <div className="flex items-center gap-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            backendStatus === 'connected' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
              : backendStatus === 'disconnected'
              ? 'bg-red-500/20 text-red-400 border border-red-500/50'
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              backendStatus === 'connected' ? 'bg-green-400' : 
              backendStatus === 'disconnected' ? 'bg-red-400' : 'bg-gray-400'
            }`}></div>
            {backendStatus === 'connected' ? text[language].backendConnected :
             backendStatus === 'disconnected' ? text[language].backendDisconnected :
             text[language].checkingBackend}
          </div>
          
          <Button
            onClick={handleTestBackend}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            {text[language].testBackend}
          </Button>
        </div>

        {/* Backend Details */}
        {backendDetails && (
          <div className="text-xs text-gray-400 bg-gray-800/30 p-2 rounded">
            🐍 Python Backend: {backendDetails.version} | Status: {backendDetails.status}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sequence Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            {text[language].sequenceLabel}
          </label>
          <textarea
            className="w-full h-32 px-3 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 font-mono text-sm resize-none"
            placeholder={text[language].sequencePlaceholder}
            value={sequence}
            onChange={(e) => handleSequenceChange(e.target.value)}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{sequence.replace(/\s/g, '').length} {text[language].chars}</span>
            <span>
              {text[language].examples.title}
              <button
                className="ml-2 text-cyan-400 hover:text-cyan-300 underline"
                onClick={() => insertExample('DNA')}
              >
                DNA
              </button>
              {' | '}
              <button
                className="text-cyan-400 hover:text-cyan-300 underline"
                onClick={() => insertExample('PROTEIN')}
              >
                Protein
              </button>
            </span>
          </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {text[language].typeLabel}
            </label>
            <Select
              options={typeOptions}
              value={type}
              onChange={(value) => setType(value as any)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {text[language].geneLabel}
            </label>
            <Select
              options={geneOptions}
              value={gene}
              onChange={(value) => setGene(value as any)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {text[language].algorithmLabel}
            </label>
            <Select
              options={algorithmOptions}
              value={algorithm}
              onChange={(e) => setAlgorithm((e.target?.value ?? e) as 'boyer-moore' | 'kmp' | 'rabin-karp')}
            />
          </div>
        </div>

        {/* Metadata Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {text[language].nameLabel}
            </label>
            <Input
              placeholder={text[language].namePlaceholder}
              value={metadata.name}
              onChange={(e) => setMetadata({...metadata, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {text[language].descriptionLabel}
            </label>
            <Input
              placeholder={text[language].descriptionPlaceholder}
              value={metadata.description}
              onChange={(e) => setMetadata({...metadata, description: e.target.value})}
            />
          </div>
        </div>

        {/* Examples */}
        <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <p className="text-sm font-medium text-gray-300 mb-2">
            {text[language].examples.title}
          </p>
          <div className="space-y-1 text-xs text-gray-400 font-mono">
            <p>{text[language].examples.dna}</p>
            <p>{text[language].examples.protein}</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!sequence.trim() || isSubmitting}
          loading={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? text[language].submitting : text[language].analyze}
        </Button>

        {/* Backend Warning */}
        {backendStatus === 'disconnected' && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400">⚠️</span>
              <div className="text-sm text-yellow-300">
                <strong>Python Backend Required:</strong> To get real analysis results, please start the Python backend:
                <code className="block mt-2 text-xs bg-gray-900/50 p-2 rounded">
                  cd snpify-backend && python main.py
                </code>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}