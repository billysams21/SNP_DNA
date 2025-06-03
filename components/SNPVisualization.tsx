'use client'
import { AnalysisResult } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card'

interface SNPVisualizationProps {
  result: AnalysisResult
  language?: 'en' | 'id'
}

export default function SNPVisualization({ result, language = 'en' }: SNPVisualizationProps) {
  // Debug logging
  console.log('🔬 SNPVisualization: Received result:', result);
  console.log('📊 Result summary:', result?.summary);
  console.log('🧬 Raw variants:', result?.variants);
  console.log('📈 Variants length:', result?.variants?.length);
  
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
      noVariants: 'No variants found in this analysis',
      variantDetails: 'Variant Details',
      confidence: 'Confidence',
      frequency: 'Frequency',
      sources: 'Sources',
      mutation: 'Mutation',
      consequence: 'Consequence',
      rsId: 'RS ID'
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
      noVariants: 'Tidak ada varian yang ditemukan dalam analisis ini',
      variantDetails: 'Detail Varian',
      confidence: 'Tingkat Kepercayaan',
      frequency: 'Frekuensi',
      sources: 'Sumber',
      mutation: 'Mutasi',
      consequence: 'Konsekuensi',
      rsId: 'RS ID'
    }
  }

  // SAFELY extract variants with multiple fallbacks and validation
  const variants = result?.variants || [];
  const validVariants = variants.filter(variant => {
    const isValid = variant && 
                   typeof variant.id === 'string' && 
                   typeof variant.position === 'number' &&
                   variant.position > 0;
    if (!isValid) {
      console.warn('⚠️ Invalid variant filtered out:', variant);
    }
    return isValid;
  });

  console.log('✅ Valid variants after filtering:', validVariants);
  console.log('📊 Valid variants count:', validVariants.length);

  // Use validVariants for all calculations
  const actualVariants = validVariants;

  // Debug each variant
  actualVariants.forEach((variant, index) => {
    console.log(`🧬 Variant ${index + 1}:`, {
      id: variant.id,
      position: variant.position,
      chromosome: variant.chromosome,
      gene: variant.gene,
      mutation: variant.mutation,
      clinicalSignificance: variant.clinicalSignificance,
      confidence: variant.confidence
    });
  });

  const getSignificanceColor = (significance: string) => {
    const sig = significance?.toUpperCase() || 'UNKNOWN';
    switch (sig) {
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
    const imp = impact?.toUpperCase() || 'LOW';
    switch (imp) {
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
    const sig = significance?.toUpperCase() || 'UNKNOWN';
    switch (sig) {
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
        return significance || 'Unknown'
    }
  }

  // Calculate distribution from REAL backend data using summary
  const distributionData = [
    { 
      label: text[language].pathogenic, 
      value: result?.summary?.pathogenicVariants || 0, 
      color: 'bg-red-500' 
    },
    { 
      label: text[language].likelyPathogenic, 
      value: result?.summary?.likelyPathogenicVariants || 0, 
      color: 'bg-orange-500' 
    },
    { 
      label: text[language].uncertain, 
      value: result?.summary?.uncertainVariants || 0, 
      color: 'bg-yellow-500' 
    },
    { 
      label: text[language].benign, 
      value: result?.summary?.benignVariants || 0, 
      color: 'bg-emerald-500' 
    }
  ]

  const total = distributionData.reduce((sum, item) => sum + item.value, 0)
  const actualTotal = actualVariants.length;

  console.log('📊 Distribution data:', distributionData);
  console.log('📈 Total from summary:', total);
  console.log('📈 Actual variants count:', actualTotal);

  // Group variants by chromosome for chromosome mapping
  const variantsByChromosome = actualVariants.reduce((acc, variant) => {
    const chr = variant.chromosome || '17';
    if (!acc[chr]) {
      acc[chr] = [];
    }
    acc[chr].push(variant);
    return acc;
  }, {} as Record<string, typeof actualVariants>);

  console.log('🗺️ Variants by chromosome:', variantsByChromosome);

  return (
    <div className="space-y-6">
      {/* Backend Data Indicator with Debug Info */}
      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-green-400">🐍</span>
          <div className="text-sm text-green-300">
            <strong>Live Backend Data:</strong> Showing {actualVariants.length} variants from Python analysis (ID: {result?.id})
          </div>
        </div>
        {/* Debug info */}
        <div className="text-xs text-green-200 mt-1">
          Raw variants: {result?.variants?.length || 0} | Valid variants: {actualVariants.length} | Summary total: {result?.summary?.totalVariants || 0}
        </div>
      </div>

      {/* Variant Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            {text[language].variantDistribution}
          </CardTitle>
          <CardDescription>
            {text[language].clinicalSignificance} - Backend Analysis Results
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Force show distribution even if total is 0 but we have actual variants */}
          {(total > 0 || actualVariants.length > 0) ? (
            <div className="space-y-4">
              {/* Use actual variant count if summary total is 0 */}
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-white">
                  {Math.max(total, actualVariants.length)}
                </div>
                <div className="text-sm text-gray-400">Total Variants Found</div>
                {total !== actualVariants.length && (
                  <div className="text-xs text-yellow-400">
                    (Summary: {total}, Actual: {actualVariants.length})
                  </div>
                )}
              </div>

              {/* Pie chart simulation - use actual data if summary is empty */}
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {distributionData.map((item, index) => {
                      const useTotal = Math.max(total, actualVariants.length);
                      const percentage = useTotal > 0 ? (item.value / useTotal) * 100 : 0;
                      const strokeDasharray = `${percentage} ${100 - percentage}`;
                      const strokeDashoffset = distributionData
                        .slice(0, index)
                        .reduce((acc, prev) => acc + (useTotal > 0 ? (prev.value / useTotal) * 100 : 0), 0);
                      
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
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{Math.max(total, actualVariants.length)}</div>
                      <div className="text-xs text-gray-400">Variants</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend with real data */}
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
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                {text[language].noVariants}
              </div>
              <div className="text-xs text-red-400">
                Debug: Raw variants = {result?.variants?.length || 0}, Valid variants = {actualVariants.length}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chromosome Mapping with Real Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🧬</span>
            {text[language].chromosomeMap}
          </CardTitle>
          <CardDescription>
            Real variant locations from backend analysis
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {Object.keys(variantsByChromosome).length > 0 ? (
              Object.entries(variantsByChromosome).map(([chromosome, chrVariants]) => (
                <div key={chromosome} className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-300">
                    Chromosome {chromosome} - {chrVariants[0]?.gene || 'Unknown Gene'} ({chrVariants.length} variants)
                  </h3>
                  <div className="relative">
                    <div className="w-full h-6 bg-gray-700/50 rounded-full relative overflow-hidden">
                      <div className={`absolute inset-0 ${
                        chromosome === '17' ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20' : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20'
                      }`}></div>
                      {chrVariants.map((variant, index) => {
                        // Calculate position as percentage of chromosome (simplified)
                        const positionPercentage = Math.min(95, Math.max(5, 20 + (index * 15)));
                        
                        return (
                          <div
                            key={variant.id}
                            className={`absolute top-1/2 transform -translate-y-1/2 ${getSignificanceColor(variant.clinicalSignificance)} ${getImpactSize(variant.impact)} rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform group`}
                            style={{ left: `${positionPercentage}%` }}
                            title={`${variant.mutation} at position ${variant.position} - ${variant.clinicalSignificance}`}
                          >
                            {/* Tooltip */}
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              <div>Position: {variant.position}</div>
                              <div>Mutation: {variant.mutation}</div>
                              <div>Impact: {variant.impact}</div>
                              <div>Confidence: {(variant.confidence * 100).toFixed(1)}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{chromosome === '17' ? '43,000,000' : '32,300,000'}</span>
                      <span>{chromosome === '17' ? '43,100,000' : '32,400,000'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <div className="text-gray-500 mb-2">No chromosomal data available</div>
                <div className="text-xs text-red-400">
                  Debug: Variants by chromosome = {JSON.stringify(Object.keys(variantsByChromosome))}
                </div>
              </div>
            )}

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

      {/* Variant Details Table with Real Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            {text[language].variantDetails}
          </CardTitle>
          <CardDescription>
            Complete variant data from Python backend ({actualVariants.length} variants)
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {actualVariants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left py-2 px-3 text-gray-300">{text[language].chromosome}</th>
                    <th className="text-left py-2 px-3 text-gray-300">{text[language].position}</th>
                    <th className="text-left py-2 px-3 text-gray-300">{text[language].gene}</th>
                    <th className="text-left py-2 px-3 text-gray-300">{text[language].mutation}</th>
                    <th className="text-left py-2 px-3 text-gray-300">{text[language].impact}</th>
                    <th className="text-left py-2 px-3 text-gray-300">Significance</th>
                    <th className="text-left py-2 px-3 text-gray-300">{text[language].confidence}</th>
                    <th className="text-left py-2 px-3 text-gray-300">{text[language].rsId}</th>
                  </tr>
                </thead>
                <tbody>
                  {actualVariants.map((variant) => (
                    <tr key={variant.id} className="border-b border-gray-700/30 hover:bg-gray-800/30 group">
                      <td className="py-3 px-3 text-gray-200">{variant.chromosome}</td>
                      <td className="py-3 px-3 text-gray-200 font-mono text-xs">{variant.position.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                          {variant.gene}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-xs">
                        <span className="text-gray-300">{variant.mutation}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          variant.impact === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                          variant.impact === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {variant.impact}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-block w-3 h-3 rounded-full ${getSignificanceColor(variant.clinicalSignificance)}`}></span>
                          <span className="text-gray-200 text-xs">{getSignificanceLabel(variant.clinicalSignificance)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-200">
                        {(variant.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-3">
                        {variant.rsId ? (
                          <a 
                            href={`https://www.ncbi.nlm.nih.gov/snp/${variant.rsId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-xs font-mono underline"
                          >
                            {variant.rsId}
                          </a>
                        ) : (
                          <span className="text-gray-500 text-xs">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                {text[language].noVariants}
              </div>
              <div className="text-xs text-red-400 space-y-1">
                <div>Debug Information:</div>
                <div>• Raw variants from backend: {result?.variants?.length || 0}</div>
                <div>• Valid variants after filtering: {actualVariants.length}</div>
                <div>• Summary total variants: {result?.summary?.totalVariants || 0}</div>
                <div>• Analysis ID: {result?.id || 'N/A'}</div>
                <div>• Analysis status: {result?.status || 'N/A'}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Summary with Debug Info */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-blue-400">ℹ️</span>
          <div className="text-sm text-blue-300">
            <strong>Analysis Complete:</strong> Found {actualVariants.length} variants using {result?.metadata?.algorithmVersion} 
            in {result?.metadata?.processingTime?.toFixed(1)}s with {result?.metadata?.qualityScore?.toFixed(1)}% quality score
          </div>
        </div>
        
        {/* Debug section for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-3 p-3 bg-gray-800/30 rounded text-xs">
            <div className="text-blue-200 mb-1"><strong>Debug Info:</strong></div>
            <div className="text-blue-100 space-y-1">
              <div>• Backend sent {result?.variants?.length || 0} raw variants</div>
              <div>• After validation: {actualVariants.length} valid variants</div>
              <div>• Summary says: {result?.summary?.totalVariants || 0} total variants</div>
              <div>• Distribution total: {total}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}