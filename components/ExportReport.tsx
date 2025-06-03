'use client'
import { snpifyAPI } from '@/lib/api/client'
import { AnalysisResult } from '@/lib/types'
import { useState } from 'react'
import { Button } from './ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'

interface ExportReportProps {
  result: AnalysisResult
  language?: 'en' | 'id'
}

interface ExportStatus {
  [key: string]: 'idle' | 'exporting' | 'success' | 'error'
}

interface ExportErrors {
  [key: string]: string
}

export default function ExportReport({ result, language = 'en' }: ExportReportProps) {
  const [exportStatus, setExportStatus] = useState<ExportStatus>({})
  const [exportErrors, setExportErrors] = useState<ExportErrors>({})

  const text = {
    en: {
      title: 'Export Report',
      description: 'Download your analysis results from Python backend in various formats',
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
      generated: 'Generated on',
      backendExport: 'Export from Python Backend',
      downloadReady: 'Download Ready',
      exportFailed: 'Export Failed',
      retry: 'Retry'
    },
    id: {
      title: 'Ekspor Laporan',
      description: 'Unduh hasil analisis dari backend Python dalam berbagai format',
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
      generated: 'Dibuat pada',
      backendExport: 'Ekspor dari Backend Python',
      downloadReady: 'Download Siap',
      exportFailed: 'Ekspor Gagal',
      retry: 'Coba Lagi'
    }
  }

  const exportFormats = [
    {
      id: 'json',
      icon: '📊',
      ...text[language].formats.json,
      supported: true
    },
    {
      id: 'csv',
      icon: '📈',
      ...text[language].formats.csv,
      supported: true
    },
    {
      id: 'xml',
      icon: '📋',
      ...text[language].formats.xml,
      supported: true
    },
    {
      id: 'pdf',
      icon: '📄',
      ...text[language].formats.pdf,
      supported: false // PDF not implemented in Python backend yet
    }
  ]

  const handleExport = async (format: string) => {
    console.log(`📥 Starting export for format: ${format}`)
    
    setExportStatus(prev => ({ ...prev, [format]: 'exporting' }))
    setExportErrors(prev => ({ ...prev, [format]: '' }))

    try {
      // Export from Python backend
      const blob = await snpifyAPI.exportResult(result.id, format)
      
      console.log(`✅ Export successful for ${format}`)
      
      // Create download URL and trigger download
      const url = URL.createObjectURL(blob)
      const filename = `SNP_Analysis_${result.id}.${format}`
      
      // Create a temporary link element and trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setExportStatus(prev => ({ ...prev, [format]: 'success' }))
      
    } catch (error: any) {
      console.error(`❌ Export failed for ${format}:`, error)
      setExportStatus(prev => ({ ...prev, [format]: 'error' }))
      setExportErrors(prev => ({ 
        ...prev, 
        [format]: error.message || 'Export failed' 
      }))
    }
  }

  const getFileSize = (format: string) => {
    // Estimate file sizes based on data complexity
    const baseSize = result.variants.length * 100 // Base calculation
    const sizes = {
      json: Math.round(baseSize * 1.5) + ' KB',
      csv: Math.round(baseSize * 0.8) + ' KB', 
      xml: Math.round(baseSize * 2.0) + ' KB',
      pdf: Math.round(baseSize * 3.0) + ' KB'
    }
    return sizes[format as keyof typeof sizes] || 'Unknown'
  }

  const getButtonContent = (format: any) => {
    const status = exportStatus[format.id] || 'idle'
    const error = exportErrors[format.id]

    if (status === 'exporting') {
      return {
        text: text[language].exporting,
        variant: 'secondary' as const,
        disabled: true,
        loading: true
      }
    } else if (status === 'success') {
      return {
        text: text[language].success,
        variant: 'success' as const,
        disabled: false,
        loading: false
      }
    } else if (status === 'error') {
      return {
        text: text[language].retry,
        variant: 'destructive' as const,
        disabled: false,
        loading: false
      }
    } else {
      return {
        text: text[language].export,
        variant: format.supported ? 'outline' as const : 'ghost' as const,
        disabled: !format.supported,
        loading: false
      }
    }
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
        {/* Backend Info */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-blue-400">🐍</span>
            <div className="text-sm text-blue-300">
              <strong>{text[language].backendExport}:</strong> Files will be generated and downloaded from the Python FastAPI backend
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportFormats.map((format) => {
            const buttonProps = getButtonContent(format)
            const status = exportStatus[format.id] || 'idle'
            const error = exportErrors[format.id]

            return (
              <div
                key={format.id}
                className={`p-4 border rounded-xl transition-all duration-200 ${
                  format.supported 
                    ? 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50' 
                    : 'border-gray-700/30 bg-gray-800/10 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{format.icon}</span>
                    <div>
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        {format.title}
                        {!format.supported && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                            Coming Soon
                          </span>
                        )}
                      </h3>
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

                {/* Error Display */}
                {error && (
                  <div className="mb-3 p-2 bg-red-500/10 border border-red-500/50 rounded text-xs text-red-400">
                    {error}
                  </div>
                )}

                {/* Status and Action */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {text[language].size}: {getFileSize(format.id)}
                  </div>
                  
                  <Button
                    size="sm"
                    variant={buttonProps.variant}
                    onClick={() => handleExport(format.id)}
                    disabled={buttonProps.disabled}
                    loading={buttonProps.loading}
                  >
                    {buttonProps.text}
                  </Button>
                </div>

                {/* Success indicator */}
                {status === 'success' && (
                  <div className="mt-2 text-xs text-emerald-400 flex items-center space-x-1">
                    <span>✅</span>
                    <span>{text[language].downloadReady}</span>
                  </div>
                )}
              </div>
            )
          })}
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
                ? 'Exported files are generated by the Python backend and contain real analysis results. Files contain sensitive genetic data - handle according to your institution\'s data protection policies.'
                : 'File yang diekspor dihasilkan oleh backend Python dan berisi hasil analisis sebenarnya. File berisi data genetik sensitif - tangani sesuai dengan kebijakan perlindungan data institusi Anda.'
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}