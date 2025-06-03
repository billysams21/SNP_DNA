'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { AnalysisResult } from '@/lib/types'

interface StatisticsSummaryProps {
  result: AnalysisResult
  language?: 'en' | 'id'
}

export default function StatisticsSummary({ result, language = 'en' }: StatisticsSummaryProps) {
  const text = {
    en: {
      title: 'Analysis Summary',
      description: 'Key findings from your genetic analysis',
      totalVariants: 'Total Variants',
      pathogenic: 'Pathogenic',
      likelyPathogenic: 'Likely Pathogenic',
      uncertain: 'Uncertain Significance',
      benign: 'Benign',
      overallRisk: 'Overall Risk Assessment',
      riskScore: 'Risk Score',
      qualityScore: 'Quality Score',
      processingTime: 'Processing Time',
      analysisId: 'Analysis ID',
      completedAt: 'Completed At',
      algorithms: 'Algorithm Version',
      inputType: 'Input Type',
      seconds: 'seconds',
      risk: {
        HIGH: 'High Risk',
        MODERATE: 'Moderate Risk', 
        LOW: 'Low Risk'
      },
      riskDescriptions: {
        HIGH: 'Significant pathogenic variants detected. Consult with genetic counselor.',
        MODERATE: 'Some variants of concern identified. Medical follow-up recommended.',
        LOW: 'No significant pathogenic variants found. Continue routine screening.'
      }
    },
    id: {
      title: 'Ringkasan Analisis',
      description: 'Temuan kunci dari analisis genetik Anda',
      totalVariants: 'Total Varian',
      pathogenic: 'Patogenik',
      likelyPathogenic: 'Kemungkinan Patogenik',
      uncertain: 'Signifikansi Tidak Pasti',
      benign: 'Jinak',
      overallRisk: 'Penilaian Risiko Keseluruhan',
      riskScore: 'Skor Risiko',
      qualityScore: 'Skor Kualitas',
      processingTime: 'Waktu Pemrosesan',
      analysisId: 'ID Analisis',
      completedAt: 'Diselesaikan Pada',
      algorithms: 'Versi Algoritma',
      inputType: 'Tipe Input',
      seconds: 'detik',
      risk: {
        HIGH: 'Risiko Tinggi',
        MODERATE: 'Risiko Sedang',
        LOW: 'Risiko Rendah'
      },
      riskDescriptions: {
        HIGH: 'Varian patogenik signifikan terdeteksi. Konsultasi dengan konselor genetik.',
        MODERATE: 'Beberapa varian yang perlu diperhatikan diidentifikasi. Follow-up medis direkomendasikan.',
        LOW: 'Tidak ada varian patogenik signifikan ditemukan. Lanjutkan skrining rutin.'
      }
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'text-red-400 bg-red-500/20 border-red-500/50'
      case 'MODERATE':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50'
      case 'LOW':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/50'
    }
  }

  const getQualityColor = (score: number) => {
    if (score >= 95) return 'text-emerald-400'
    if (score >= 85) return 'text-cyan-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            {text[language].title}
          </CardTitle>
          <CardDescription>
            {text[language].description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Risk Assessment */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-300">
              {text[language].overallRisk}
            </h3>
            <div className={`p-4 rounded-lg border ${getRiskColor(result.summary.overallRisk)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">
                  {text[language].risk[result.summary.overallRisk]}
                </span>
                <span className="text-sm opacity-75">
                  {text[language].riskScore}: {result.summary.riskScore}/10
                </span>
              </div>
              <p className="text-xs opacity-90">
                {text[language].riskDescriptions[result.summary.overallRisk]}
              </p>
            </div>
          </div>

          {/* Variant Distribution */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">
              {text[language].totalVariants}: {result.summary.totalVariants}
            </h3>
            
            <div className="space-y-2">
              {/* Pathogenic */}
              <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <span className="text-sm text-red-300">{text[language].pathogenic}</span>
                <span className="font-semibold text-red-400">{result.summary.pathogenicVariants}</span>
              </div>
              
              {/* Likely Pathogenic */}
              <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <span className="text-sm text-orange-300">{text[language].likelyPathogenic}</span>
                <span className="font-semibold text-orange-400">{result.summary.likelyPathogenicVariants}</span>
              </div>
              
              {/* Uncertain */}
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <span className="text-sm text-yellow-300">{text[language].uncertain}</span>
                <span className="font-semibold text-yellow-400">{result.summary.uncertainVariants}</span>
              </div>
              
              {/* Benign */}
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <span className="text-sm text-emerald-300">{text[language].benign}</span>
                <span className="font-semibold text-emerald-400">{result.summary.benignVariants}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Quality Metrics
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Quality Score */}
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <span className="text-sm text-gray-300">{text[language].qualityScore}</span>
            <span className={`font-bold ${getQualityColor(result.metadata.qualityScore)}`}>
              {result.metadata.qualityScore}%
            </span>
          </div>
          
          {/* Processing Time */}
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <span className="text-sm text-gray-300">{text[language].processingTime}</span>
            <span className="font-semibold text-cyan-400">
              {result.metadata.processingTime} {text[language].seconds}
            </span>
          </div>
          
          {/* Algorithm Version */}
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <span className="text-sm text-gray-300">{text[language].algorithms}</span>
            <span className="font-semibold text-purple-400">
              {result.metadata.algorithmVersion}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">ℹ️</span>
            Analysis Details
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Analysis ID */}
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <span className="text-sm text-gray-300">{text[language].analysisId}</span>
            <span className="font-mono text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
              {result.id}
            </span>
          </div>
          
          {/* Input Type */}
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <span className="text-sm text-gray-300">{text[language].inputType}</span>
            <span className="font-semibold text-blue-400">
              {result.metadata.inputType}
            </span>
          </div>
          
          {/* Completion Time */}
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <span className="text-sm text-gray-300">{text[language].completedAt}</span>
            <span className="text-xs text-gray-400">
              {result.endTime ? formatDate(result.endTime) : formatDate(new Date())}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
