'use client'
import { snpifyAPI } from '@/lib/api/client'
import { FileUploadData } from '@/lib/types'
import React, { useRef, useState } from 'react'
import { Button } from './ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

interface FileUploadProps {
  onFileUpload: (data: FileUploadData) => void
  onProgress?: (progress: number) => void
  language?: 'en' | 'id'
  maxFileSize?: number
  acceptedTypes?: string[]
  defaultGene?: 'BRCA1' | 'BRCA2'
  defaultAlgorithm?: 'boyer-moore' | 'kmp' | 'rabin-karp'
}

export default function FileUpload({ 
  onFileUpload, 
  onProgress, 
  language = 'en',
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['.vcf', '.fasta', '.fa', '.txt', '.fastq'],
  defaultGene = 'BRCA1',
  defaultAlgorithm = 'boyer-moore'
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<'VCF' | 'FASTA' | 'RAW_SEQUENCE'>('FASTA')
  const [selectedGene, setSelectedGene] = useState<'BRCA1' | 'BRCA2'>(defaultGene)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'boyer-moore' | 'kmp' | 'rabin-karp'>(defaultAlgorithm)
  const [metadata, setMetadata] = useState({
    patientId: '',
    sampleId: '',
    notes: ''
  })
  const [error, setError] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const text = {
    en: {
      title: 'Upload Genetic Data',
      description: 'Upload your DNA sequence files for SNP analysis using Python backend',
      dragText: 'Drag and drop your files here, or click to browse',
      supportedFormats: 'Supported formats: VCF, FASTA, FASTQ, TXT',
      fileType: 'File Type',
      targetGene: 'Target Gene',
      algorithm: 'Analysis Algorithm',
      patientId: 'Patient ID (Optional)',
      sampleId: 'Sample ID (Optional)',
      notes: 'Notes (Optional)',
      upload: 'Start Analysis',
      uploading: 'Starting Analysis...',
      fileSelected: 'File selected',
      maxSize: 'Maximum file size: 10MB',
      backendStatus: 'Python Backend Analysis',
      algorithms: {
        'boyer-moore': 'Boyer-Moore (Fast pattern matching)',
        'kmp': 'Knuth-Morris-Pratt (Efficient for repeats)', 
        'rabin-karp': 'Rabin-Karp (Rolling hash based)'
      },
      errors: {
        noFile: 'Please select a file',
        tooLarge: 'File size exceeds 10MB limit',
        invalidType: 'Invalid file type. Please use VCF, FASTA, FASTQ, or TXT files',
        uploadFailed: 'Upload failed. Please try again'
      }
    },
    id: {
      title: 'Upload Data Genetik',
      description: 'Upload file sekuens DNA Anda untuk analisis SNP menggunakan backend Python',
      dragText: 'Drag dan drop file Anda di sini, atau klik untuk browse',
      supportedFormats: 'Format yang didukung: VCF, FASTA, FASTQ, TXT',
      fileType: 'Tipe File',
      targetGene: 'Target Gen',
      algorithm: 'Algoritma Analisis',
      patientId: 'ID Pasien (Opsional)',
      sampleId: 'ID Sampel (Opsional)',
      notes: 'Catatan (Opsional)',
      upload: 'Mulai Analisis',
      uploading: 'Memulai Analisis...',
      fileSelected: 'File terpilih',
      maxSize: 'Ukuran file maksimal: 10MB',
      backendStatus: 'Analisis Backend Python',
      algorithms: {
        'boyer-moore': 'Boyer-Moore (Pencarian pola cepat)',
        'kmp': 'Knuth-Morris-Pratt (Efisien untuk pengulangan)',
        'rabin-karp': 'Rabin-Karp (Berbasis rolling hash)'
      },
      errors: {
        noFile: 'Silakan pilih file',
        tooLarge: 'Ukuran file melebihi batas 10MB',
        invalidType: 'Tipe file tidak valid. Gunakan file VCF, FASTA, FASTQ, atau TXT',
        uploadFailed: 'Upload gagal. Silakan coba lagi'
      }
    }
  }

  React.useEffect(() => {
    console.log('🔧 FileUpload.tsx LOADED - NEW VERSION with snpifyAPI integration')
    console.log('🔧 Version: 2024-FIXED with backend API calls')
  }, [])

  const fileTypeOptions = [
    { value: 'VCF', label: 'VCF (Variant Call Format)' },
    { value: 'FASTA', label: 'FASTA' },
    { value: 'RAW_SEQUENCE', label: 'Raw DNA Sequence' }
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

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return text[language].errors.tooLarge
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedTypes.includes(extension)) {
      return text[language].errors.invalidType
    }

    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const error = validateFile(file)
      if (error) {
        setError(error)
        return
      }
      setSelectedFile(file)
      setError('')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const error = validateFile(file)
      if (error) {
        setError(error)
        return
      }
      setSelectedFile(file)
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(text[language].errors.noFile)
      return
    }

    setIsUploading(true)
    setError('')

    try {
      console.log('📄 Starting file upload to backend...');
      console.log('🔧 snpifyAPI available:', !!snpifyAPI)
      console.log('🔧 snpifyAPI.analyzeFile available:', !!snpifyAPI.analyzeFile)
      
      // Create file analysis request
      const fileAnalysisRequest = {
        file: selectedFile,
        gene: selectedGene,
        algorithm: selectedAlgorithm,
        metadata: {
          patientId: metadata.patientId || undefined,
          sampleId: metadata.sampleId || undefined,
          notes: metadata.notes || undefined,
          fileName: selectedFile.name,
          fileSize: selectedFile.size
        }
      }

      // Call backend API directly
      const response = await snpifyAPI.analyzeFile(fileAnalysisRequest)
      console.log('✅ File analysis started:', response)

      // Create upload data with analysis ID for progress tracking
      const uploadData: FileUploadData = {
        file: selectedFile,
        type: fileType,
        metadata: {
          patientId: metadata.patientId || undefined,
          sampleId: metadata.sampleId || undefined,
          notes: metadata.notes || undefined,
          analysisId: response.analysis_id, // Pass the analysis ID
          algorithm: fileAnalysisRequest.algorithm,
          useMockData: false // Real backend analysis
        }
      }

      // Call the parent callback with analysis ID
      onFileUpload(uploadData)
      
    } catch (err: any) {
      console.error('❌ File upload failed:', err)
      setError(text[language].errors.uploadFailed + ': ' + (err.message || ''))
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📄</span>
          {text[language].title}
        </CardTitle>
        <CardDescription>
          {text[language].description}
        </CardDescription>
        
        {/* Backend Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/50">
            <div className="w-2 h-2 rounded-full mr-2 bg-green-400"></div>
            {text[language].backendStatus}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* File Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
            isDragOver 
              ? 'border-cyan-400 bg-cyan-400/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedTypes.join(',')}
            onChange={handleFileChange}
            aria-label="File upload input"
            title="Select files to upload"
          />
          
          <div className="space-y-4">
            <div className="text-4xl text-gray-400">
              {selectedFile ? '📄' : '📁'}
            </div>
            
            {selectedFile ? (
              <div className="space-y-2">
                <p className="text-lg font-medium text-white">
                  {text[language].fileSelected}: {selectedFile.name}
                </p>
                <p className="text-sm text-gray-400">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            ) : (
              <>
                <p className="text-lg text-gray-300">
                  {text[language].dragText}
                </p>
                <p className="text-sm text-gray-500">
                  {text[language].supportedFormats}
                </p>
                <p className="text-xs text-gray-600">
                  {text[language].maxSize}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {text[language].fileType}
            </label>
            <Select
              options={fileTypeOptions}
              value={fileType}
              onChange={(value) => setFileType(value as any)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {text[language].targetGene}
            </label>
            <Select
              options={geneOptions}
              value={selectedGene}
              onChange={(value) => setSelectedGene(value as any)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {text[language].algorithm}
            </label>
            <Select
              options={algorithmOptions}
              value={selectedAlgorithm}
              onChange={(value) => setSelectedAlgorithm(value as any)}
            />
          </div>
        </div>

        {/* Metadata Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {text[language].patientId}
            </label>
            <Input
              placeholder="P001"
              value={metadata.patientId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetadata({...metadata, patientId: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {text[language].sampleId}
            </label>
            <Input
              placeholder="S001"
              value={metadata.sampleId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetadata({...metadata, sampleId: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {text[language].notes}
            </label>
            <Input
              placeholder={language === 'en' ? 'Additional notes...' : 'Catatan tambahan...'}
              value={metadata.notes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMetadata({...metadata, notes: e.target.value})}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          loading={isUploading}
          className="w-full"
          size="lg"
        >
          {isUploading ? text[language].uploading : text[language].upload}
        </Button>

        {/* Analysis Configuration Summary */}
        {selectedFile && (
          <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Analysis Configuration</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div>File: {selectedFile.name}</div>
              <div>Size: {formatFileSize(selectedFile.size)}</div>
              <div>Gene: {selectedGene}</div>
              <div>Algorithm: {selectedAlgorithm}</div>
              <div>Type: {fileType}</div>
              <div>Backend: Python FastAPI</div>
            </div>
          </div>
        )}

        {/* Important Notes */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-blue-400 mt-0.5">ℹ️</span>
            <div className="text-sm text-blue-300">
              <strong>Note:</strong> {language === 'en' 
                ? 'Your file will be processed by our Python backend using clinical-grade algorithms. Analysis typically takes 15-30 seconds depending on file size.'
                : 'File Anda akan diproses oleh backend Python menggunakan algoritma tingkat klinis. Analisis biasanya memakan waktu 15-30 detik tergantung ukuran file.'
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}