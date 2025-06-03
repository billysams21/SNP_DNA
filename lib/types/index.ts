// =====================================================
// SNPify - Type Definitions
// =====================================================

// Base Types
export type Gene = 'BRCA1' | 'BRCA2';
export type Algorithm = 'boyer-moore' | 'kmp' | 'rabin-karp' | 'naive';
export type FileFormat = 'fasta' | 'fastq' | 'txt';
export type ExportFormat = 'json' | 'csv' | 'xml' | 'pdf';

// DNA Sequence Types
export interface DNASequence {
  id: string;
  name: string;
  sequence: string;
  length: number;
  description?: string;
  source?: string;
  timestamp: Date;
}

export interface ReferenceSequence extends DNASequence {
  gene: Gene;
  version: string;
  annotation?: AnnotationData[];
}

// SNP Analysis Types
export interface SNPPosition {
  position: number;
  referenceAllele: string;
  alternativeAllele: string;
  quality: number;
  confidence: number;
  type: 'substitution' | 'insertion' | 'deletion';
}

export interface SNPResult {
  id: string;
  position: number;
  referenceAllele: string;
  alternativeAllele: string;
  quality: number;
  confidence: number;
  type: 'substitution' | 'insertion' | 'deletion';
  consequence?: 'synonymous' | 'missense' | 'nonsense' | 'frameshift';
  clinicalSignificance?: 'pathogenic' | 'likely-pathogenic' | 'uncertain' | 'likely-benign' | 'benign';
  frequency?: number;
  chromosome?: string;
  gene: Gene;
}

// Analysis Types
export interface AnalysisRequest {
  sequence: string;
  referenceGene: Gene;
  algorithm: Algorithm;
  parameters?: AnalysisParameters;
}

export interface AnalysisParameters {
  mismatchTolerance?: number;
  minimumQuality?: number;
  windowSize?: number;
  gapPenalty?: number;
  matchScore?: number;
  mismatchScore?: number;
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

export interface AnalysisStatistics {
  totalSNPs: number;
  substitutions: number;
  insertions: number;
  deletions: number;
  pathogenicVariants: number;
  benignVariants: number;
  uncertainVariants: number;
  averageQuality: number;
  sequenceLength: number;
  coverage: number;
  similarity: number;
}

// Alignment Types
export interface AlignmentResult {
  score: number;
  identity: number;
  similarity: number;
  gaps: number;
  alignedSequence: string;
  alignedReference: string;
  startPosition: number;
  endPosition: number;
  cigar?: string;
}

export interface AlignmentMatch {
  position: number;
  length: number;
  score: number;
  type: 'match' | 'mismatch' | 'gap';
}

// Quality Metrics
export interface QualityMetrics {
  overall: number;
  perBase: number[];
  gc_content: number;
  n_count: number;
  ambiguous_bases: number;
  coverage_uniformity: number;
}

// File Processing Types
export interface FileUploadResult {
  success: boolean;
  filename: string;
  size: number;
  format: FileFormat;
  sequences: DNASequence[];
  errors?: string[];
  warnings?: string[];
}

export interface FASTAEntry {
  header: string;
  sequence: string;
  id: string;
  description?: string;
}

// Annotation Types
export interface AnnotationData {
  start: number;
  end: number;
  type: 'exon' | 'intron' | 'utr' | 'coding' | 'regulatory';
  name: string;
  description?: string;
  strand: '+' | '-';
}

// Visualization Types
export interface ChartData {
  position: number;
  value: number;
  category?: string;
  color?: string;
  label?: string;
}

export interface SNPVisualizationData {
  distributionData: ChartData[];
  qualityData: ChartData[];
  typeDistribution: {
    substitutions: number;
    insertions: number;
    deletions: number;
  };
  clinicalSignificance: {
    pathogenic: number;
    benign: number;
    uncertain: number;
  };
}

// Progress Tracking
export interface AnalysisProgress {
  step: string;
  progress: number;
  message: string;
  estimatedTime?: number;
  currentOperation?: string;
}

// Error Handling
export interface ErrorInfo {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// API Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ErrorInfo;
  metadata?: {
    version: string;
    timestamp: Date;
    processingTime: number;
  };
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'url';
  className?: string;
}

export interface SelectProps {
  label?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: number;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  className?: string;
}

// Settings and Configuration
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'id';
  defaultAlgorithm: Algorithm;
  qualityThreshold: number;
  enableNotifications: boolean;
  maxFileSize: number;
  autoSave: boolean;
}

export interface UserPreferences {
  favoriteGenes: Gene[];
  recentAnalyses: string[];
  customAnnotations: AnnotationData[];
  exportSettings: {
    format: ExportFormat;
    includeStatistics: boolean;
    includeAlignment: boolean;
  };
}

// Database Types (if using a database)
export interface AnalysisRecord {
  id: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description?: string;
  inputSequence: string;
  results: AnalysisResult;
  shared: boolean;
  tags: string[];
}

export interface UserSession {
  id: string;
  userId?: string;
  analyses: AnalysisRecord[];
  preferences: UserPreferences;
  createdAt: Date;
  lastActivity: Date;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Constants
export const SUPPORTED_ALGORITHMS: Algorithm[] = ['boyer-moore', 'kmp', 'rabin-karp', 'naive'];
export const SUPPORTED_GENES: Gene[] = ['BRCA1', 'BRCA2'];
export const SUPPORTED_FILE_FORMATS: FileFormat[] = ['fasta', 'fastq', 'txt'];
export const SUPPORTED_EXPORT_FORMATS: ExportFormat[] = ['json', 'csv', 'xml', 'pdf'];

// Default Values
export const DEFAULT_ANALYSIS_PARAMETERS: AnalysisParameters = {
  mismatchTolerance: 2,
  minimumQuality: 20,
  windowSize: 100,
  gapPenalty: -1,
  matchScore: 2,
  mismatchScore: -1,
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'en',
  defaultAlgorithm: 'boyer-moore',
  qualityThreshold: 20,
  enableNotifications: true,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  autoSave: true,
};

// Base Types
export interface SNPVariant {
  id: string;
  position: number;
  chromosome: string;
  gene: 'BRCA1' | 'BRCA2';
  refAllele: string;
  altAllele: string;
  rsId?: string;
  mutation: string;
  consequence: string;
  impact: 'HIGH' | 'MODERATE' | 'LOW' | 'MODIFIER';
  clinicalSignificance: 'PATHOGENIC' | 'LIKELY_PATHOGENIC' | 'UNCERTAIN_SIGNIFICANCE' | 'LIKELY_BENIGN' | 'BENIGN';
  confidence: number;
  frequency?: number;
  sources: string[];
  createdAt: Date;
  updatedAt: Date;
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

// Input Types
export interface FileUploadData {
  file: File;
  type: 'VCF' | 'FASTA' | 'RAW_SEQUENCE';
  metadata?: {
    patientId?: string;
    sampleId?: string;
    notes?: string;
  };
}

export interface SequenceInputData {
  sequence: string;
  type: 'DNA' | 'PROTEIN';
  gene?: 'BRCA1' | 'BRCA2';
  metadata?: {
    name?: string;
    description?: string;
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

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Analysis Statistics
export interface AnalysisStats {
  totalAnalyses: number;
  completedAnalyses: number;
  averageProcessingTime: number;
  accuracyRate: number;
  variantDistribution: {
    pathogenic: number;
    likelyPathogenic: number;
    uncertain: number;
    likelyBenign: number;
    benign: number;
  };
  geneDistribution: {
    brca1: number;
    brca2: number;
  };
}

// User Data Types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'RESEARCHER' | 'ADMIN';
  institution?: string;
  analyses: string[]; // Analysis IDs
  createdAt: Date;
  lastLogin?: Date;
}

// Visualization Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}

export interface VariantVisualization {
  chromosome: string;
  position: number;
  type: string;
  impact: string;
  gene: string;
  color: string;
  size: number;
}

// Algorithm Types
export interface AlgorithmConfig {
  name: string;
  version: string;
  parameters: Record<string, any>;
  weights: {
    frequency: number;
    conservation: number;
    functional: number;
    clinical: number;
  };
}

export interface PredictionScore {
  algorithm: string;
  score: number;
  confidence: number;
  prediction: 'PATHOGENIC' | 'BENIGN';
  features: Record<string, number>;
}

// Report Types
export interface AnalysisReport {
  id: string;
  analysisId: string;
  type: 'PDF' | 'JSON' | 'CSV';
  status: 'GENERATING' | 'READY' | 'FAILED';
  url?: string;
  generatedAt?: Date;
  expiresAt?: Date;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  format: 'PDF' | 'HTML';
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'SUMMARY' | 'VARIANTS_TABLE' | 'CHART' | 'RECOMMENDATIONS' | 'METHODOLOGY';
  config: Record<string, any>;
  order: number;
}

export interface APIAnalysisRequest {
  sequence: string;
  gene: 'BRCA1' | 'BRCA2';
  algorithm: 'boyer-moore' | 'kmp' | 'rabin-karp';
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