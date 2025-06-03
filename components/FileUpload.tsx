'use client'
import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { FileUploadData } from '@/lib/types'

interface FileUploadProps {
  onFileUpload: (data: FileUploadData) => void
  onProgress?: (progress: number) => void
  language?: 'en' | 'id'
  maxFileSize?: number
  acceptedTypes?: string[]
}

export default function FileUpload({ 
  onFileUpload, 
  onProgress, 
  language = 'en',
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['.vcf', '.fasta', '.fa', '.txt', '.fastq']
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<'VCF' | 'FASTA' | 'RAW_SEQUENCE'>('FASTA')
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
      description: 'Upload your DNA sequence files for SNP analysis',
      dragText: 'Drag and drop your files here, or click to browse',
      supportedFormats: 'Supported formats: VCF, FASTA, FASTQ, TXT',
      fileType: 'File Type',
      patientId: 'Patient ID (Optional)',
      sampleId: 'Sample ID (Optional)',
      notes: 'Notes (Optional)',
      upload: 'Start Analysis',
      uploading: 'Uploading...',
      fileSelected: 'File selected',
      maxSize: 'Maximum file size: 10MB',
      errors: {
        noFile: 'Please select a file',
        tooLarge: 'File size exceeds 10MB limit',
        invalidType: 'Invalid file type. Please use VCF, FASTA, FASTQ, or TXT files',
        uploadFailed: 'Upload failed. Please try again'
      }
    },
    id: {
      title: 'Upload Data Genetik',
      description: 'Upload file sekuens DNA Anda untuk analisis SNP',
      dragText: 'Drag dan drop file Anda di sini, atau klik untuk browse',
      supportedFormats: 'Format yang didukung: VCF, FASTA, FASTQ, TXT',
      fileType: 'Tipe File',
      patientId: 'ID Pasien (Opsional)',
      sampleId: 'ID Sampel (Opsional)',
      notes: 'Catatan (Opsional)',
      upload: 'Mulai Analisis',
      uploading: 'Mengupload...',
      fileSelected: 'File terpilih',
      maxSize: 'Ukuran file maksimal: 10MB',
      errors: {
        noFile: 'Silakan pilih file',
        tooLarge: 'Ukuran file melebihi batas 10MB',
        invalidType: 'Tipe file tidak valid. Gunakan file VCF, FASTA, FASTQ, atau TXT',
        uploadFailed: 'Upload gagal. Silakan coba lagi'
      }
    }
  }

  const fileTypeOptions = [
    { value: 'VCF', label: 'VCF (Variant Call Format)' },
    { value: 'FASTA', label: 'FASTA' },
    { value: 'RAW_SEQUENCE', label: 'Raw DNA Sequence' }
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
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        onProgress?.(i)
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const uploadData: FileUploadData = {
        file: selectedFile,
        type: fileType,
        metadata: {
          patientId: metadata.patientId || undefined,
          sampleId: metadata.sampleId || undefined,
          notes: metadata.notes || undefined
        }
      }

      onFileUpload(uploadData)
    } catch (err) {
      setError(text[language].errors.uploadFailed)
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

        {/* File Type Selection */}
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
      </CardContent>
    </Card>
  )
}
