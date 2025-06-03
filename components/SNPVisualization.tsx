'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { AnalysisResult } from '@/lib/types'

interface SNPVisualizationProps {
  result: AnalysisResult
  language?: 'en' | 'id'
}

export default function SNPVisualization({ result, language = 'en' }: SNPVisualizationProps) {
  const text = {
    en: {
      title: 'Variant Visualization',
      description: 'Visual representation of your genetic variants',
      variantDistribution: 'Variant Distribution',
      chromosomeMap: 'Chromosome Mapping',
      clinicalSignificance: 'Clinical Significance',
      pathogenic: 'Pathogenic',
      likelyPathogenic: 'Likely Pathogenic',
      uncertain: 'Uncertain',
      benign: 'Benign',
      chromosome: 'Chromosome',
      position: 'Position',
      gene: 'Gene',
      impact: 'Impact',
      noVariants: 'No variants found in this analysis'
    },
    id: {
      title: 'Visualisasi Varian',
      description: 'Representasi visual dari varian genetik Anda',
      variantDistribution: 'Distribusi Varian',
      chromosomeMap: 'Pemetaan Kromosom',
      clinicalSignificance: 'Signifikansi Klinis',
      pathogenic: 'Patogenik',
      likelyPathogenic: 'Kemungkinan Patogenik',
      uncertain: 'Tidak Pasti',
      benign: 'Jinak',
      chromosome: 'Kromosom',
      position: 'Posisi',
      gene: 'Gen',
      impact: 'Dampak',
      noVariants: 'Tidak ada varian yang ditemukan dalam analisis ini'
    }
  }

  // Generate mock variant data for visualization
  const generateMockVariants = () => [
    {
      id: '1',
      chromosome: '17',
      position: 43044295,
      gene: 'BRCA1',
      clinicalSignificance: 'PATHOGENIC',
      impact: 'HIGH'
    },
    {
      id: '2',
      chromosome: '13',
      position: 32315086,
      gene: 'BRCA2',
      clinicalSignificance: 'LIKELY_PATHOGENIC',
      impact: 'MODERATE'
    },
    {
      id: '3',
      chromosome: '17',
      position: 43057135,
      gene: 'BRCA1',
      clinicalSignificance: 'UNCERTAIN_SIGNIFICANCE',
      impact: 'LOW'
    },
    {
      id: '4',
      chromosome: '13',
      position: 32333271,
      gene: 'BRCA2',
      clinicalSignificance: 'BENIGN',
      impact: 'MODIFIER'
    },
    {
      id: '5',
      chromosome: '17',
      position: 43070927,
      gene: 'BRCA1',
      clinicalSignificance: 'LIKELY_BENIGN',
      impact: 'LOW'
    }
  ]

  const variants = generateMockVariants()

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'PATHOGENIC':
        return 'bg-red-500'
      case 'LIKELY_PATHOGENIC':
        return 'bg-orange-500'
      case 'UNCERTAIN_SIGNIFICANCE':
        return 'bg-yellow-500'
      case 'LIKELY_BENIGN':
        return 'bg-blue-500'
      case 'BENIGN':
        return 'bg-emerald-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getImpactSize = (impact: string) => {
    switch (impact) {
      case 'HIGH':
        return 'w-4 h-4'
      case 'MODERATE':
        return 'w-3 h-3'
      case 'LOW':
        return 'w-2 h-2'
      default:
        return 'w-1 h-1'
    }
  }

  const getSignificanceLabel = (significance: string) => {
    switch (significance) {
      case 'PATHOGENIC':
        return text[language].pathogenic
      case 'LIKELY_PATHOGENIC':
        return text[language].likelyPathogenic
      case 'UNCERTAIN_SIGNIFICANCE':
        return text[language].uncertain
      case 'LIKELY_BENIGN':
      case 'BENIGN':
        return text[language].benign
      default:
        return significance
    }
  }

  // Calculate distribution for pie chart simulation
  const distributionData = [
    { label: text[language].pathogenic, value: result.summary.pathogenicVariants, color: 'bg-red-500' },
    { label: text[language].likelyPathogenic, value: result.summary.likelyPathogenicVariants, color: 'bg-orange-500' },
    { label: text[language].uncertain, value: result.summary.uncertainVariants, color: 'bg-yellow-500' },
    { label: text[language].benign, value: result.summary.benignVariants, color: 'bg-emerald-500' }
  ]

  const total = distributionData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      {/* Variant Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            {text[language].variantDistribution}
          </CardTitle>
          <CardDescription>
            {text[language].clinicalSignificance}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {total > 0 ? (
            <div className="space-y-4">
              {/* Pie chart simulation */}
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {distributionData.map((item, index) => {
                      const percentage = (item.value / total) * 100
                      const strokeDasharray = `${percentage} ${100 - percentage}`
                      const strokeDashoffset = distributionData
                        .slice(0, index)
                        .reduce((acc, prev) => acc + (prev.value / total) * 100, 0)
                      
                      return (
                        <circle
                          key={index}
                          cx="50"
                          cy="50"
                          r="15.915"
                          fill="transparent"
                          stroke={`rgb(${item.color === 'bg-red-500' ? '239 68 68' : 
                                          item.color === 'bg-orange-500' ? '249 115 22' :
                                          item.color === 'bg-yellow-500' ? '234 179 8' : '34 197 94'})`}
                          strokeWidth="8"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={-strokeDashoffset}
                          className="transition-all duration-300"
                        />
                      )
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{total}</div>
                      <div className="text-xs text-gray-400">Variants</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-3">
                {distributionData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-300">{item.label}</span>
                    <span className="text-sm font-semibold text-white">({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {text[language].noVariants}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chromosome Mapping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🧬</span>
            {text[language].chromosomeMap}
          </CardTitle>
          <CardDescription>
            BRCA1 and BRCA2 variant locations
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Chromosome 17 (BRCA1) */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-300">Chromosome 17 - BRCA1</h3>
              <div className="relative">
                <div className="w-full h-6 bg-gray-700/50 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20"></div>
                  {variants
                    .filter(v => v.chromosome === '17')
                    .map((variant, index) => (
                      <div
                        key={variant.id}
                        className={`absolute top-1/2 transform -translate-y-1/2 ${getSignificanceColor(variant.clinicalSignificance)} ${getImpactSize(variant.impact)} rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform`}
                        style={{ left: `${20 + index * 15}%` }}
                        title={`Position: ${variant.position}, Impact: ${variant.impact}`}
                      />
                    ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>43,000,000</span>
                  <span>43,100,000</span>
                </div>
              </div>
            </div>

            {/* Chromosome 13 (BRCA2) */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-300">Chromosome 13 - BRCA2</h3>
              <div className="relative">
                <div className="w-full h-6 bg-gray-700/50 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"></div>
                  {variants
                    .filter(v => v.chromosome === '13')
                    .map((variant, index) => (
                      <div
                        key={variant.id}
                        className={`absolute top-1/2 transform -translate-y-1/2 ${getSignificanceColor(variant.clinicalSignificance)} ${getImpactSize(variant.impact)} rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform`}
                        style={{ left: `${30 + index * 15}%` }}
                        title={`Position: ${variant.position}, Impact: ${variant.impact}`}
                      />
                    ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>32,300,000</span>
                  <span>32,400,000</span>
                </div>
              </div>
            </div>

            {/* Legend for chromosome map */}
            <div className="pt-4 border-t border-gray-700/50">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-400">Pathogenic</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-400">Likely Path.</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-400">Uncertain</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-400">Benign</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variant Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Variant Details
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left py-2 px-3 text-gray-300">{text[language].chromosome}</th>
                  <th className="text-left py-2 px-3 text-gray-300">{text[language].position}</th>
                  <th className="text-left py-2 px-3 text-gray-300">{text[language].gene}</th>
                  <th className="text-left py-2 px-3 text-gray-300">{text[language].impact}</th>
                  <th className="text-left py-2 px-3 text-gray-300">Significance</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant) => (
                  <tr key={variant.id} className="border-b border-gray-700/30 hover:bg-gray-800/30">
                    <td className="py-3 px-3 text-gray-200">{variant.chromosome}</td>
                    <td className="py-3 px-3 text-gray-200 font-mono text-xs">{variant.position.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                        {variant.gene}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-200">{variant.impact}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block w-3 h-3 rounded-full ${getSignificanceColor(variant.clinicalSignificance)} mr-2`}></span>
                      <span className="text-gray-200 text-xs">{getSignificanceLabel(variant.clinicalSignificance)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
