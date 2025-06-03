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