const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface APIResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

interface SequenceAnalysisRequest {
  sequence: string;
  gene: 'BRCA1' | 'BRCA2';
  algorithm: 'boyer-moore' | 'kmp' | 'rabin-karp' | 'naive';
  sequence_type: 'DNA' | 'PROTEIN';
  metadata?: Record<string, any>;
}

interface FileAnalysisRequest {
  file: File;
  gene: 'BRCA1' | 'BRCA2';
  algorithm: 'boyer-moore' | 'kmp' | 'rabin-karp' | 'naive';
  metadata?: Record<string, any>;
}

class SNPifyAPIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    console.log(`🔗 SNPify API Client initialized with base URL: ${this.baseURL}`);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    console.log(`📡 API Response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
        console.error('❌ API Error:', errorData);
      } catch (e) {
        console.error('❌ Failed to parse error response');
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('✅ API Success:', data);
    return data;
  }

  async healthCheck(): Promise<any> {
    console.log('🔍 Checking backend health...');
    const response = await fetch(`${this.baseURL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  async analyzeSequence(request: SequenceAnalysisRequest): Promise<any> {
    console.log('🧬 Starting sequence analysis...', {
      sequence_length: request.sequence.length,
      gene: request.gene,
      algorithm: request.algorithm,
      type: request.sequence_type
    });
    
    const response = await fetch(`${this.baseURL}/api/analyze/sequence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  async analyzeFile(request: FileAnalysisRequest): Promise<any> {
    console.log('📡 Sending file to backend:', `${this.baseURL}/api/analyze/file`);

    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('gene', request.gene);
    formData.append('algorithm', request.algorithm);
    
    const response = await fetch(`${this.baseURL}/api/analyze/file`, {
      method: 'POST',
      body: formData,
    });
    return this.handleResponse(response);
  }

  async getAnalysisResult(analysisId: string): Promise<any> {
    console.log(`📊 Fetching analysis result for ID: ${analysisId}`);
    const response = await fetch(`${this.baseURL}/api/analysis/${analysisId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  async getAnalysisProgress(analysisId: string): Promise<any> {
    console.log(`⏳ Fetching analysis progress for ID: ${analysisId}`);
    const response = await fetch(`${this.baseURL}/api/analysis/${analysisId}/progress`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  async exportResult(analysisId: string, format: string): Promise<Blob> {
    console.log(`📥 Exporting analysis result: ${analysisId} as ${format}`);
    const response = await fetch(`${this.baseURL}/api/analysis/${analysisId}/export/${format}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }
    
    return response.blob();
  }

  async deleteAnalysis(analysisId: string): Promise<any> {
    console.log(`🗑️ Deleting analysis: ${analysisId}`);
    const response = await fetch(`${this.baseURL}/api/analysis/${analysisId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  async getStatistics(): Promise<any> {
    console.log('📈 Fetching platform statistics...');
    const response = await fetch(`${this.baseURL}/api/statistics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return this.handleResponse(response);
  }
}

export const snpifyAPI = new SNPifyAPIClient();

// Enhanced backend connection checker with detailed logging
export const checkBackendConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testing connection to Python backend...');
    const health = await snpifyAPI.healthCheck();
    console.log('✅ Backend connection successful!', health);
    return true;
  } catch (error: any) {
    console.error('❌ Backend connection failed:', error.message);
    console.warn('🔄 Will fallback to mock data');
    return false;
  }
};

// Test function to verify backend is responding correctly
export const testBackendIntegration = async () => {
  console.log('🧪 Running backend integration test...');
  
  try {
    // Test health endpoint
    const health = await snpifyAPI.healthCheck();
    console.log('✅ Health check passed:', health);
    
    // Test with a small sequence
    const testSequence = 'ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGC';
    const response = await snpifyAPI.analyzeSequence({
      sequence: testSequence,
      gene: 'BRCA1',
      algorithm: 'boyer-moore',
      sequence_type: 'DNA',
      metadata: { test: true }
    });
    
    console.log('✅ Test analysis submitted:', response);
    return { success: true, analysisId: response.analysis_id };
    
  } catch (error: any) {
    console.error('❌ Backend integration test failed:', error);
    return { success: false, error: error.message };
  }
};