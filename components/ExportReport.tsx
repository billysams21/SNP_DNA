'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { AnalysisResult } from '@/lib/types'

interface ExportReportProps {
  result: AnalysisResult
  language?: 'en' | 'id'
}

export default function ExportReport({ result, language = 'en' }: ExportReportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportedFormat, setExportedFormat] = useState<string | null>(null)

  const text = {
    en: {
      title: 'Export Report',
      description: 'Download your analysis results in various formats',
      formats: {
        pdf: {
          title: 'PDF Report',
          description: 'Comprehensive clinical report with visualizations',
          features: ['Executive summary', 'Detailed results', 'Visualizations', 'Recommendations']
        },
        json: {
          title: 'JSON Data',
          description: 'Raw analysis data in JSON format',
          features: ['Complete dataset', 'Machine readable', 'API compatible', 'Developer friendly']
        },
        csv: {
          title: 'CSV Export',
          description: 'Variant data in spreadsheet format',
          features: ['Tabular format', 'Excel compatible', 'Statistical analysis', 'Data sharing']
        },
        xml: {
          title: 'XML Format',
          description: 'Structured data in XML format',
          features: ['Standards compliant', 'Interoperable', 'Healthcare systems', 'Data exchange']
        }
      },
      export: 'Export',
      exporting: 'Exporting...',
      success: 'Export completed!',
      download: 'Download',
      size: 'File size',
      generated: 'Generated on'
    },
    id: {
      title: 'Ekspor Laporan',
      description: 'Unduh hasil analisis Anda dalam berbagai format',
      formats: {
        pdf: {
          title: 'Laporan PDF',
          description: 'Laporan klinis komprehensif dengan visualisasi',
          features: ['Ringkasan eksekutif', 'Hasil detail', 'Visualisasi', 'Rekomendasi']
        },
        json: {
          title: 'Data JSON',
          description: 'Data analisis mentah dalam format JSON',
          features: ['Dataset lengkap', 'Dapat dibaca mesin', 'Kompatibel API', 'Ramah developer']
        },
        csv: {
          title: 'Ekspor CSV',
          description: 'Data varian dalam format spreadsheet',
          features: ['Format tabular', 'Kompatibel Excel', 'Analisis statistik', 'Berbagi data']
        },
        xml: {
          title: 'Format XML',
          description: 'Data terstruktur dalam format XML',
          features: ['Sesuai standar', 'Interoperabel', 'Sistem kesehatan', 'Pertukaran data']
        }
      },
      export: 'Ekspor',
      exporting: 'Mengekspor...',
      success: 'Ekspor selesai!',
      download: 'Unduh',
      size: 'Ukuran file',
      generated: 'Dibuat pada'
    }
  }

  const exportFormats = [
    {
      id: 'pdf',
      icon: '📄',
      ...text[language].formats.pdf
    },
    {
      id: 'json',
      icon: '📊',
      ...text[language].formats.json
    },
    {
      id: 'csv',
      icon: '📈',
      ...text[language].formats.csv
    },
    {
      id: 'xml',
      icon: '📋',
      ...text[language].formats.xml
    }
  ]

  const handleExport = async (format: string) => {
    setIsExporting(true)
    setExportedFormat(null)

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate mock file data based on format
    let mockFileData = ''
    let filename = ''
    let fileSize = ''

    switch (format) {
      case 'pdf':
        filename = `SNP_Analysis_${result.id}.pdf`
        fileSize = '2.4 MB'
        // In real implementation, you would generate actual PDF
        break
      case 'json':
        filename = `SNP_Analysis_${result.id}.json`
        fileSize = '156 KB'
        mockFileData = JSON.stringify({
          analysisId: result.id,
          summary: result.summary,
          metadata: result.metadata,
          variants: result.variants,
          exportedAt: new Date().toISOString()
        }, null, 2)
        break
      case 'csv':
        filename = `SNP_Variants_${result.id}.csv`
        fileSize = '89 KB'
        mockFileData = `ID,Chromosome,Position,Gene,Clinical_Significance,Impact
1,17,43044295,BRCA1,PATHOGENIC,HIGH
2,13,32315086,BRCA2,LIKELY_PATHOGENIC,MODERATE
3,17,43057135,BRCA1,UNCERTAIN_SIGNIFICANCE,LOW
4,13,32333271,BRCA2,BENIGN,MODIFIER
5,17,43070927,BRCA1,LIKELY_BENIGN,LOW`
        break
      case 'xml':
        filename = `SNP_Analysis_${result.id}.xml`
        fileSize = '234 KB'
        mockFileData = `<?xml version="1.0" encoding="UTF-8"?>
<snp_analysis id="${result.id}">
  <summary>
    <total_variants>${result.summary.totalVariants}</total_variants>
    <pathogenic_variants>${result.summary.pathogenicVariants}</pathogenic_variants>
    <overall_risk>${result.summary.overallRisk}</overall_risk>
    <risk_score>${result.summary.riskScore}</risk_score>
  </summary>
  <metadata>
    <input_type>${result.metadata.inputType}</input_type>
    <algorithm_version>${result.metadata.algorithmVersion}</algorithm_version>
    <quality_score>${result.metadata.qualityScore}</quality_score>
  </metadata>
</snp_analysis>`
        break
    }

    // Trigger download for non-PDF formats
    if (format !== 'pdf' && mockFileData) {
      const blob = new Blob([mockFileData], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    setExportedFormat(format)
    setIsExporting(false)
  }

  const getFileSize = (format: string) => {
    const sizes = {
      pdf: '2.4 MB',
      json: '156 KB',
      csv: '89 KB',
      xml: '234 KB'
    }
    return sizes[format as keyof typeof sizes] || 'Unknown'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📥</span>
          {text[language].title}
        </CardTitle>
        <CardDescription>
          {text[language].description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportFormats.map((format) => (
            <div
              key={format.id}
              className="p-4 border border-gray-700/50 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{format.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white">{format.title}</h3>
                    <p className="text-sm text-gray-400">{format.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {format.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {text[language].size}: {getFileSize(format.id)}
                </div>
                
                {exportedFormat === format.id ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 text-sm">✅ {text[language].success}</span>
                    {format.id !== 'pdf' && (
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={() => handleExport(format.id)}
                      >
                        {text[language].download}
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport(format.id)}
                    disabled={isExporting}
                    loading={isExporting}
                  >
                    {isExporting ? text[language].exporting : text[language].export}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Export Summary */}
        <div className="mt-6 p-4 bg-gray-800/20 rounded-lg border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-300">Analysis Report</h4>
              <p className="text-xs text-gray-500">
                {text[language].generated}: {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'id-ID')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-white">{result.summary.totalVariants} Variants</div>
              <div className="text-xs text-gray-500">ID: {result.id}</div>
            </div>
          </div>
        </div>

        {/* Export Note */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-blue-400 mt-0.5">ℹ️</span>
            <div className="text-sm text-blue-300">
              <strong>Note:</strong> {language === 'en' 
                ? 'Exported files contain sensitive genetic data. Please handle according to your institution\'s data protection policies.'
                : 'File yang diekspor berisi data genetik sensitif. Harap tangani sesuai dengan kebijakan perlindungan data institusi Anda.'
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
