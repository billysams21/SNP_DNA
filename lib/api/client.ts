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
  algorithm: 'boyer-moore' | 'kmp' | 'rabin-karp';
  sequence_type: 'DNA' | 'PROTEIN';
  metadata?: Record<string, any>;
}

interface FileAnalysisRequest {
  file: File;
  gene: 'BRCA1' | 'BRCA2';
  algorithm: 'boyer-moore' | 'kmp' | 'rabin-karp';
  metadata?: Record<string, any>;
}

class SNPifyAPIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || response.statusText);
    }
    return response.json();
  }

  async healthCheck(): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/health`);
    return this.handleResponse(response);
  }

  async analyzeSequence(request: SequenceAnalysisRequest): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/analyze/sequence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    return this.handleResponse(response);
  }

  async analyzeFile(request: FileAnalysisRequest): Promise<any> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('gene', request.gene);
    formData.append('algorithm', request.algorithm);
    
    if (request.metadata) {
      formData.append('metadata', JSON.stringify(request.metadata));
    }

    const response = await fetch(`${this.baseURL}/api/analyze/file`, {
      method: 'POST',
      body: formData,
    });
    return this.handleResponse(response);
  }

  async getAnalysisResult(analysisId: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/analysis/${analysisId}`);
    return this.handleResponse(response);
  }

  async getAnalysisProgress(analysisId: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/analysis/${analysisId}/progress`);
    return this.handleResponse(response);
  }

  async exportResult(analysisId: string, format: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/api/analysis/${analysisId}/export/${format}`);
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }
    
    return response.blob();
  }

  async deleteAnalysis(analysisId: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/analysis/${analysisId}`, {
      method: 'DELETE',
    });
    return this.handleResponse(response);
  }

  async getStatistics(): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/statistics`);
    return this.handleResponse(response);
  }
}

export const snpifyAPI = new SNPifyAPIClient();