// =====================================================
// SNPify - Type Definitions (Fixed)
// =====================================================

// Base Types
export type Gene = 'BRCA1' | 'BRCA2';
export type Algorithm = 'boyer-moore' | 'kmp' | 'rabin-karp' | 'naive';
export type BackendAlgorithm = 'boyer-moore' | 'kmp' | 'rabin-karp'; // Algorithms supported by backend
export type FileFormat = 'fasta' | 'fastq' | 'txt';
export type ExportFormat = 'json' | 'csv' | 'xml' | 'pdf';

// SNP Variant Types (Fixed naming to match backend)
export interface SNPVariant {
  id: string;
  position: number;
  chromosome: string;
  gene: 'BRCA1' | 'BRCA2';
  refAllele: string;        // Frontend uses refAllele
  altAllele: string;        // Frontend uses altAllele
  ref_allele?: string;      // Backend compatibility
  alt_allele?: string;      // Backend compatibility
  rsId?: string;
  rs_id?: string;           // Backend compatibility
  mutation: string;
  consequence: string;
  impact: 'HIGH' | 'MODERATE' | 'LOW' | 'MODIFIER';
  clinicalSignificance: 'PATHOGENIC' | 'LIKELY_PATHOGENIC' | 'UNCERTAIN_SIGNIFICANCE' | 'LIKELY_BENIGN' | 'BENIGN';
  clinical_significance?: string; // Backend compatibility
  confidence: number;
  frequency?: number;
  sources: string[];
  createdAt: Date;
  updatedAt: Date;
  created_at?: Date;        // Backend compatibility
  updated_at?: Date;        // Backend compatibility
}

export interface AnalysisSummary {
  totalVariants: number;
  pathogenicVariants: number;
  likelyPathogenicVariants: number;
  uncertainVariants: number;
  benignVariants: number;
  overallRisk: 'HIGH' | 'MODERATE' | 'LOW';
  riskScore: number;
  recommendations: string[];
}

export interface AnalysisMetadata {
  inputType: 'VCF' | 'FASTA' | 'RAW_SEQUENCE';
  fileName?: string;
  fileSize?: number;
  processingTime?: number;
  algorithmVersion: string;
  qualityScore: number;
  coverage?: number;
  readDepth?: number;
}

export interface AnalysisResult {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  variants: SNPVariant[];
  summary: AnalysisSummary;
  metadata: AnalysisMetadata;
  progress: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

// Input Types (Extended metadata)
export interface FileUploadData {
  file: File;
  type: 'VCF' | 'FASTA' | 'RAW_SEQUENCE';
  metadata?: {
    patientId?: string;
    sampleId?: string;
    notes?: string;
    analysisId?: string;
    algorithm?: BackendAlgorithm; // Use BackendAlgorithm for API calls
    useMockData?: boolean;
  };
}

export interface SequenceInputData {
  sequence: string;
  type: 'DNA' | 'PROTEIN';
  gene?: 'BRCA1' | 'BRCA2';
  metadata?: {
    name?: string;
    description?: string;
    analysisId?: string;        // Added for backend integration
    algorithm?: BackendAlgorithm; // Use BackendAlgorithm for API calls
    useMockData?: boolean;      // Added for fallback detection
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
    requestId: string;
  };
}

// Backend API Types
export interface APIAnalysisRequest {
  sequence: string;
  gene: 'BRCA1' | 'BRCA2';
  algorithm: BackendAlgorithm; // Use BackendAlgorithm for consistency
  sequence_type: 'DNA' | 'PROTEIN';
  metadata?: Record<string, any>;
}

export interface APIAnalysisResponse {
  analysis_id: string;
  status: string;
  message: string;
  estimated_time: string;
}

export interface APIAnalysisProgress {
  analysis_id: string;
  progress: number;
  current_step: string;
  message: string;
  steps: Array<{
    id: string;
    name: string;
    progress: number;
    weight: number;
  }>;
}

// Utility function to convert backend variant to frontend format
export const convertBackendVariant = (backendVariant: any): SNPVariant => {
  return {
    id: backendVariant.id,
    position: backendVariant.position,
    chromosome: backendVariant.chromosome,
    gene: backendVariant.gene,
    refAllele: backendVariant.ref_allele || backendVariant.refAllele,
    altAllele: backendVariant.alt_allele || backendVariant.altAllele,
    rsId: backendVariant.rs_id || backendVariant.rsId,
    mutation: backendVariant.mutation,
    consequence: backendVariant.consequence,
    impact: backendVariant.impact,
    clinicalSignificance: backendVariant.clinical_significance || backendVariant.clinicalSignificance,
    confidence: backendVariant.confidence,
    frequency: backendVariant.frequency,
    sources: backendVariant.sources || [],
    createdAt: new Date(backendVariant.created_at || backendVariant.createdAt || Date.now()),
    updatedAt: new Date(backendVariant.updated_at || backendVariant.updatedAt || Date.now())
  };
};

// Constants
export const SUPPORTED_ALGORITHMS: Algorithm[] = ['boyer-moore', 'kmp', 'rabin-karp', 'naive'];
export const BACKEND_ALGORITHMS: BackendAlgorithm[] = ['boyer-moore', 'kmp', 'rabin-karp'];
export const SUPPORTED_GENES: Gene[] = ['BRCA1', 'BRCA2'];
export const SUPPORTED_FILE_FORMATS: FileFormat[] = ['fasta', 'fastq', 'txt'];
export const SUPPORTED_EXPORT_FORMATS: ExportFormat[] = ['json', 'csv', 'xml', 'pdf'];

// Default Values
export const DEFAULT_ANALYSIS_PARAMETERS = {
  mismatchTolerance: 2,
  minimumQuality: 20,
  windowSize: 100,
  gapPenalty: -1,
  matchScore: 2,
  mismatchScore: -1,
};

export const DEFAULT_APP_SETTINGS = {
  theme: 'light' as const,
  language: 'en' as const,
  defaultAlgorithm: 'boyer-moore' as BackendAlgorithm,
  qualityThreshold: 20,
  enableNotifications: true,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  autoSave: true,
};

export const convertBackendResult = (backendResult: any): AnalysisResult => {
  console.log('🔄 Converting backend result:', backendResult);
  
  const data = backendResult.data || backendResult;
  
  return {
    id: data.id,
    status: data.status || 'COMPLETED',
    
    variants: (data.variants || []).map((variant: any) => {
      console.log('🧬 Converting variant:', variant);
      return {
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
      };
    }),
    
    summary: {
      totalVariants: data.summary?.total_variants || data.variants?.length || 0,
      pathogenicVariants: data.summary?.pathogenic_variants || 0,
      likelyPathogenicVariants: data.summary?.likely_pathogenic_variants || 0,
      uncertainVariants: data.summary?.uncertain_variants || data.variants?.length || 0,
      benignVariants: data.summary?.benign_variants || 0,
      overallRisk: data.summary?.overall_risk || 'LOW',
      riskScore: data.summary?.risk_score || 0,
      recommendations: data.summary?.recommendations || []
    },
    
    // FIXED: Ensure metadata is properly mapped
    metadata: {
      inputType: data.metadata?.input_type || 'RAW_SEQUENCE',
      fileName: data.metadata?.file_name,
      fileSize: data.metadata?.file_size,
      processingTime: data.metadata?.processing_time,
      algorithmVersion: data.metadata?.algorithm_version || '2.1.0',
      qualityScore: data.metadata?.quality_score || 95,
      coverage: data.metadata?.coverage,
      readDepth: data.metadata?.read_depth
    },
    
    progress: data.progress || 100,
    startTime: new Date(data.start_time || data.startTime || Date.now()),
    endTime: data.end_time ? new Date(data.end_time) : new Date(),
    error: data.error
  };
};

export const debugAnalysisResult = (result: any, analysisId: string) => {
  console.group(`🔍 Analysis Result Debug - ${analysisId}`);
  
  console.log('📊 Raw backend result:', result);
  console.log('🧬 Variants array:', result?.variants);
  console.log('📈 Summary object:', result?.summary);
  console.log('📋 Metadata object:', result?.metadata);
  
  // Check for specific Boyer-Moore issues
  if (result?.metadata?.algorithm_version) {
    console.log('⚙️ Algorithm used:', result.metadata.algorithm_version);
  }
  
  // Validate data completeness
  const issues = [];
  if (!result?.variants || result.variants.length === 0) {
    issues.push('❌ No variants found');
  }
  if (!result?.summary) {
    issues.push('❌ Summary missing');
  }
  if (!result?.metadata) {
    issues.push('❌ Metadata missing');
  }
  
  if (issues.length > 0) {
    console.error('🚨 Data Issues Found:', issues);
  } else {
    console.log('✅ All data structures present');
  }
  
  console.groupEnd();
};