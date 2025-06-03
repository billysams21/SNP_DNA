'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { SequenceInputData } from '@/lib/types'

interface SequenceInputProps {
  onSequenceSubmit: (data: SequenceInputData) => void
  language?: 'en' | 'id'
}

export default function SequenceInput({ onSequenceSubmit, language = 'en' }: SequenceInputProps) {
  const [sequence, setSequence] = useState('')
  const [type, setType] = useState<'DNA' | 'PROTEIN'>('DNA')
  const [gene, setGene] = useState<'BRCA1' | 'BRCA2'>('BRCA1')
  const [metadata, setMetadata] = useState({
    name: '',
    description: ''
  })
  const [error, setError] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const text = {
    en: {
      title: 'Manual Sequence Input',
      description: 'Enter DNA or protein sequence manually for analysis',
      sequenceLabel: 'DNA/Protein Sequence',
      sequencePlaceholder: 'Enter your sequence here (ATCG for DNA, amino acids for protein)...',
      typeLabel: 'Sequence Type',
      geneLabel: 'Target Gene',
      nameLabel: 'Sequence Name (Optional)',
      namePlaceholder: 'e.g., Patient Sample 001',
      descriptionLabel: 'Description (Optional)',
      descriptionPlaceholder: 'Additional information about this sequence...',
      analyze: 'Start Analysis',
      validating: 'Validating...',
      chars: 'characters',
      examples: {
        title: 'Example Sequences:',
        dna: 'DNA: ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAA',
        protein: 'Protein: MDLSALREVQNVINCYAHQSK'
      },
      validation: {
        empty: 'Please enter a sequence',
        tooShort: 'Sequence is too short (minimum 10 characters)',
        invalidDNA: 'Invalid DNA sequence. Use only A, T, G, C characters',
        invalidProtein: 'Invalid protein sequence. Use only standard amino acid codes'
      }
    },
    id: {
      title: 'Input Sekuens Manual',
      description: 'Masukkan sekuens DNA atau protein secara manual untuk analisis',
      sequenceLabel: 'Sekuens DNA/Protein',
      sequencePlaceholder: 'Masukkan sekuens Anda di sini (ATCG untuk DNA, asam amino untuk protein)...',
      typeLabel: 'Tipe Sekuens',
      geneLabel: 'Target Gen',
      nameLabel: 'Nama Sekuens (Opsional)',
      namePlaceholder: 'contoh: Sampel Pasien 001',
      descriptionLabel: 'Deskripsi (Opsional)',
      descriptionPlaceholder: 'Informasi tambahan tentang sekuens ini...',
      analyze: 'Mulai Analisis',
      validating: 'Memvalidasi...',
      chars: 'karakter',
      examples: {
        title: 'Contoh Sekuens:',
        dna: 'DNA: ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAA',
        protein: 'Protein: MDLSALREVQNVINCYAHQSK'
      },
      validation: {
        empty: 'Silakan masukkan sekuens',
        tooShort: 'Sekuens terlalu pendek (minimal 10 karakter)',
        invalidDNA: 'Sekuens DNA tidak valid. Gunakan hanya karakter A, T, G, C',
        invalidProtein: 'Sekuens protein tidak valid. Gunakan hanya kode asam amino standar'
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

  const validateSequence = (seq: string, seqType: 'DNA' | 'PROTEIN'): string | null => {
    if (!seq.trim()) {
      return text[language].validation.empty
    }

    if (seq.length < 10) {
      return text[language].validation.tooShort
    }

    if (seqType === 'DNA') {
      const dnaRegex = /^[ATGC\s\n]+$/i
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

  const handleSubmit = async () => {
    const cleanSequence = sequence.replace(/\s/g, '')
    const validationError = validateSequence(cleanSequence, type)
    
    if (validationError) {
      setError(validationError)
      return
    }

    setIsValidating(true)
    setError('')

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const data: SequenceInputData = {
      sequence: cleanSequence,
      type,
      gene,
      metadata: {
        name: metadata.name || undefined,
        description: metadata.description || undefined
      }
    }

    onSequenceSubmit(data)
    setIsValidating(false)
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

        {/* Type and Gene Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          disabled={!sequence.trim() || isValidating}
          loading={isValidating}
          className="w-full"
          size="lg"
        >
          {isValidating ? text[language].validating : text[language].analyze}
        </Button>
      </CardContent>
    </Card>
  )
}
