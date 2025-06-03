from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any, Literal
import uuid
import time
import asyncio
import json
import logging
from datetime import datetime
from pathlib import Path
import io
import hashlib
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="SNPify API",
    description="Advanced SNP Analysis Platform for BRCA1 and BRCA2 Genetic Variants",
    version="2.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://snpify.com", "*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models with v2 syntax
class SequenceAnalysisRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    
    sequence: str = Field(..., min_length=10, description="DNA sequence to analyze")
    gene: Literal["BRCA1", "BRCA2"] = Field(..., description="Target gene")
    algorithm: Literal["boyer-moore", "kmp", "rabin-karp"] = Field(default="boyer-moore")
    sequence_type: Literal["DNA", "PROTEIN"] = Field(default="DNA")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class FileAnalysisRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    
    file_type: Literal["VCF", "FASTA", "RAW_SEQUENCE"] = Field(...)
    gene: Literal["BRCA1", "BRCA2"] = Field(...)
    algorithm: Literal["boyer-moore", "kmp", "rabin-karp"] = Field(default="boyer-moore")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

class SNPVariant(BaseModel):
    id: str
    position: int
    chromosome: str
    gene: str
    ref_allele: str
    alt_allele: str
    rs_id: Optional[str] = None
    mutation: str
    consequence: str
    impact: str
    clinical_significance: str
    confidence: float
    frequency: Optional[float] = None
    sources: List[str]
    created_at: datetime
    updated_at: datetime

class AnalysisSummary(BaseModel):
    total_variants: int
    pathogenic_variants: int
    likely_pathogenic_variants: int
    uncertain_variants: int
    benign_variants: int
    overall_risk: str
    risk_score: float
    recommendations: List[str]

class AnalysisMetadata(BaseModel):
    input_type: str
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    processing_time: Optional[float] = None
    algorithm_version: str = "2.1.0"
    quality_score: float
    coverage: Optional[float] = None
    read_depth: Optional[int] = None

class AnalysisResult(BaseModel):
    id: str
    status: str
    variants: List[SNPVariant]
    summary: AnalysisSummary
    metadata: AnalysisMetadata
    progress: float
    start_time: datetime
    end_time: Optional[datetime] = None
    error: Optional[str] = None

# In-memory storage for analysis results
analysis_storage: Dict[str, AnalysisResult] = {}
progress_storage: Dict[str, Dict[str, Any]] = {}

# Analysis progress steps
ANALYSIS_STEPS = [
    {"id": "file_processing", "name": "File Processing", "weight": 15},
    {"id": "sequence_alignment", "name": "Sequence Alignment", "weight": 25},
    {"id": "variant_detection", "name": "Variant Detection", "weight": 30},
    {"id": "clinical_annotation", "name": "Clinical Annotation", "weight": 15},
    {"id": "quality_assessment", "name": "Quality Assessment", "weight": 10},
    {"id": "report_generation", "name": "Report Generation", "weight": 5}
]

# Simplified reference sequences (for demo purposes)
BRCA1_REFERENCE = """
ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCCATCT
GGTAAGTCAGGATACAGCTGTGAGCCAGATCCCTGACCCTGATGCTGAACGAATGGCTGGACCCAAGATGGGCTCTGC
AGCAAGCTGGAGGGGAAAGGTCTTCGAACGAGGTGAGACAGCCCTTGCCCCTTACCACTGGCAGAGAAACCTTTTGGG
AGCTGTGAAACCTTAAATGAGAAGCAAGAAGTTTGAAACTGCACATCTTTCACATCTAAGTCAGTGGAGGAGGAGAAT
""".replace("\n", "").replace(" ", "")

BRCA2_REFERENCE = """
ATGCCTATTGGATCCAAAGAGAGGCCAACATTTTTTGAAATTTTTAAGACACGCTGCGACGTTTTCCACTCAACCCCTC
ATTGGTCAAGGTTGGTTCGAAAAATGGTTATTTTTTCTCTTTCTCTTTCTCCTTATGGTTGGTTTGGTTTGGTTGGTTT
GGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTT
""".replace("\n", "").replace(" ", "")

# Create storage directories
os.makedirs("storage/uploads", exist_ok=True)
os.makedirs("storage/results", exist_ok=True)
os.makedirs("storage/exports", exist_ok=True)

async def update_progress(analysis_id: str, step: str, progress: float, message: str):
    """Update analysis progress"""
    if analysis_id not in progress_storage:
        progress_storage[analysis_id] = {
            "current_step": step,
            "progress": progress,
            "message": message,
            "steps": {s["id"]: 0 for s in ANALYSIS_STEPS}
        }
    
    progress_storage[analysis_id]["current_step"] = step
    progress_storage[analysis_id]["message"] = message
    progress_storage[analysis_id]["steps"][step] = progress
    
    # Calculate overall progress
    total_progress = 0
    for step_info in ANALYSIS_STEPS:
        step_progress = progress_storage[analysis_id]["steps"][step_info["id"]]
        total_progress += (step_progress / 100) * step_info["weight"]
    
    progress_storage[analysis_id]["progress"] = total_progress
    
    # Update analysis storage if exists
    if analysis_id in analysis_storage:
        analysis_storage[analysis_id].progress = total_progress

async def perform_snp_analysis(
    analysis_id: str,
    sequence: str,
    gene: str,
    algorithm: str,
    input_type: str,
    metadata: Dict[str, Any]
) -> AnalysisResult:
    """Perform comprehensive SNP analysis"""
    
    start_time = datetime.now()
    
    try:
        # Step 1: File Processing
        await update_progress(analysis_id, "file_processing", 20, "Validating sequence format...")
        await asyncio.sleep(1)
        
        # Clean and validate sequence
        cleaned_sequence = sequence.upper().replace(" ", "").replace("\n", "")
        if not all(base in "ATGCN" for base in cleaned_sequence):
            raise ValueError("Invalid DNA sequence. Only A, T, G, C, N characters allowed.")
        
        await update_progress(analysis_id, "file_processing", 80, "Processing sequence data...")
        await asyncio.sleep(1)
        await update_progress(analysis_id, "file_processing", 100, "File processing completed")
        
        # Step 2: Sequence Alignment
        await update_progress(analysis_id, "sequence_alignment", 10, "Loading reference sequence...")
        reference_seq = BRCA1_REFERENCE if gene == "BRCA1" else BRCA2_REFERENCE
        
        await update_progress(analysis_id, "sequence_alignment", 40, "Performing sequence alignment...")
        # Simulate alignment process
        alignment_result = {
            "score": 95.0,
            "identity": 0.98,
            "coverage": 95.0
        }
        await asyncio.sleep(2)
        
        await update_progress(analysis_id, "sequence_alignment", 100, "Sequence alignment completed")
        
        # Step 3: Variant Detection
        await update_progress(analysis_id, "variant_detection", 20, "Initializing SNP detection...")
        
        await update_progress(analysis_id, "variant_detection", 60, "Scanning for variants...")
        # Simulate variant detection
        mock_variants = [
            SNPVariant(
                id=str(uuid.uuid4()),
                position=100,
                chromosome="17" if gene == "BRCA1" else "13",
                gene=gene,
                ref_allele="A",
                alt_allele="G",
                rs_id="rs80357914",
                mutation="A>G",
                consequence="missense_variant",
                impact="MODERATE",
                clinical_significance="PATHOGENIC",
                confidence=0.95,
                frequency=0.0001,
                sources=["ClinVar", "dbSNP"],
                created_at=datetime.now(),
                updated_at=datetime.now()
            ),
            SNPVariant(
                id=str(uuid.uuid4()),
                position=250,
                chromosome="17" if gene == "BRCA1" else "13",
                gene=gene,
                ref_allele="C",
                alt_allele="T",
                rs_id="rs80357915",
                mutation="C>T",
                consequence="synonymous_variant",
                impact="LOW",
                clinical_significance="BENIGN",
                confidence=0.88,
                frequency=0.001,
                sources=["ClinVar", "dbSNP"],
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
        ]
        await asyncio.sleep(2)
        
        await update_progress(analysis_id, "variant_detection", 100, "Variant detection completed")
        
        # Step 4: Clinical Annotation
        await update_progress(analysis_id, "clinical_annotation", 30, "Annotating clinical significance...")
        await asyncio.sleep(1)
        await update_progress(analysis_id, "clinical_annotation", 100, "Clinical annotation completed")
        
        # Step 5: Quality Assessment
        await update_progress(analysis_id, "quality_assessment", 50, "Evaluating analysis quality...")
        quality_score = 98.7
        await asyncio.sleep(1)
        await update_progress(analysis_id, "quality_assessment", 100, "Quality assessment completed")
        
        # Step 6: Report Generation
        await update_progress(analysis_id, "report_generation", 60, "Generating analysis summary...")
        
        # Calculate summary statistics
        pathogenic_count = sum(1 for v in mock_variants if v.clinical_significance == "PATHOGENIC")
        likely_pathogenic_count = sum(1 for v in mock_variants if v.clinical_significance == "LIKELY_PATHOGENIC")
        uncertain_count = sum(1 for v in mock_variants if v.clinical_significance == "UNCERTAIN_SIGNIFICANCE")
        benign_count = sum(1 for v in mock_variants if v.clinical_significance in ["BENIGN", "LIKELY_BENIGN"])
        
        # Calculate risk score
        risk_score = pathogenic_count * 3.0 + likely_pathogenic_count * 2.0 + uncertain_count * 0.5
        overall_risk = "HIGH" if risk_score >= 7.0 else "MODERATE" if risk_score >= 4.0 else "LOW"
        
        summary = AnalysisSummary(
            total_variants=len(mock_variants),
            pathogenic_variants=pathogenic_count,
            likely_pathogenic_variants=likely_pathogenic_count,
            uncertain_variants=uncertain_count,
            benign_variants=benign_count,
            overall_risk=overall_risk,
            risk_score=risk_score,
            recommendations=[
                "Genetic counseling recommended",
                "Continue routine screening",
                "Discuss findings with healthcare provider"
            ]
        )
        
        await update_progress(analysis_id, "report_generation", 100, "Report generation completed")
        
        # Create final result
        end_time = datetime.now()
        processing_time = (end_time - start_time).total_seconds()
        
        result = AnalysisResult(
            id=analysis_id,
            status="COMPLETED",
            variants=mock_variants,
            summary=summary,
            metadata=AnalysisMetadata(
                input_type=input_type,
                file_name=metadata.get("file_name"),
                file_size=len(sequence),
                processing_time=processing_time,
                quality_score=quality_score,
                coverage=alignment_result.get("coverage", 95.0),
                read_depth=metadata.get("read_depth", 100)
            ),
            progress=100.0,
            start_time=start_time,
            end_time=end_time
        )
        
        # Store result
        analysis_storage[analysis_id] = result
        
        return result
        
    except Exception as e:
        logger.error(f"Analysis failed for {analysis_id}: {str(e)}")
        error_result = AnalysisResult(
            id=analysis_id,
            status="FAILED",
            variants=[],
            summary=AnalysisSummary(
                total_variants=0,
                pathogenic_variants=0,
                likely_pathogenic_variants=0,
                uncertain_variants=0,
                benign_variants=0,
                overall_risk="UNKNOWN",
                risk_score=0.0,
                recommendations=[]
            ),
            metadata=AnalysisMetadata(
                input_type=input_type,
                quality_score=0.0
            ),
            progress=0.0,
            start_time=start_time,
            error=str(e)
        )
        
        analysis_storage[analysis_id] = error_result
        raise HTTPException(status_code=500, detail=str(e))

# API Endpoints

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "SNPify API v2.1.0",
        "description": "Advanced SNP Analysis Platform for BRCA1 and BRCA2",
        "status": "operational",
        "version": "2.1.0"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.1.0",
        "services": {
            "string_matching": "operational",
            "snp_detection": "operational",
            "clinical_annotation": "operational"
        }
    }

@app.post("/api/analyze/sequence")
async def analyze_sequence(
    request: SequenceAnalysisRequest,
    background_tasks: BackgroundTasks
):
    """Analyze DNA sequence for SNP variants"""
    
    # Generate analysis ID
    analysis_id = f"SNP_{int(time.time() * 1000)}_{str(uuid.uuid4())[:8]}"
    
    # Initialize analysis record
    analysis_storage[analysis_id] = AnalysisResult(
        id=analysis_id,
        status="PROCESSING",
        variants=[],
        summary=AnalysisSummary(
            total_variants=0,
            pathogenic_variants=0,
            likely_pathogenic_variants=0,
            uncertain_variants=0,
            benign_variants=0,
            overall_risk="UNKNOWN",
            risk_score=0.0,
            recommendations=[]
        ),
        metadata=AnalysisMetadata(
            input_type="RAW_SEQUENCE",
            quality_score=0.0
        ),
        progress=0.0,
        start_time=datetime.now()
    )
    
    # Start background analysis
    background_tasks.add_task(
        perform_snp_analysis,
        analysis_id,
        request.sequence,
        request.gene,
        request.algorithm,
        "RAW_SEQUENCE",
        request.metadata or {}
    )
    
    return {
        "analysis_id": analysis_id,
        "status": "PROCESSING",
        "message": "Analysis started successfully",
        "estimated_time": "45 seconds"
    }

@app.post("/api/analyze/file")
async def analyze_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    gene: Literal["BRCA1", "BRCA2"] = "BRCA1",
    algorithm: Literal["boyer-moore", "kmp", "rabin-karp"] = "boyer-moore",
    metadata: str = "{}"
):
    """Analyze uploaded file for SNP variants"""
    
    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    allowed_extensions = {'.fasta', '.fa', '.fastq', '.fq', '.vcf', '.txt'}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_ext}")
    
    # Generate analysis ID
    analysis_id = f"SNP_{int(time.time() * 1000)}_{str(uuid.uuid4())[:8]}"
    
    # Read file content
    try:
        content = await file.read()
        sequence = content.decode('utf-8').strip()
        
        # Simple parsing based on file type
        if sequence.startswith('>'):
            # FASTA format - extract sequence
            lines = sequence.split('\n')
            sequence = ''.join(line for line in lines if not line.startswith('>'))
        elif sequence.startswith('@'):
            # FASTQ format - extract sequence (simplified)
            lines = sequence.split('\n')
            sequence = lines[1] if len(lines) > 1 else ""
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading file: {str(e)}")
    
    # Initialize analysis record
    analysis_storage[analysis_id] = AnalysisResult(
        id=analysis_id,
        status="PROCESSING",
        variants=[],
        summary=AnalysisSummary(
            total_variants=0,
            pathogenic_variants=0,
            likely_pathogenic_variants=0,
            uncertain_variants=0,
            benign_variants=0,
            overall_risk="UNKNOWN",
            risk_score=0.0,
            recommendations=[]
        ),
        metadata=AnalysisMetadata(
            input_type="FASTA",
            file_name=file.filename,
            file_size=len(content),
            quality_score=0.0
        ),
        progress=0.0,
        start_time=datetime.now()
    )
    
    # Start background analysis
    try:
        file_metadata = json.loads(metadata) if metadata else {}
        file_metadata["file_name"] = file.filename
        
        background_tasks.add_task(
            perform_snp_analysis,
            analysis_id,
            sequence,
            gene,
            algorithm,
            "FASTA",
            file_metadata
        )
    except json.JSONDecodeError:
        file_metadata = {"file_name": file.filename}
        background_tasks.add_task(
            perform_snp_analysis,
            analysis_id,
            sequence,
            gene,
            algorithm,
            "FASTA",
            file_metadata
        )
    
    return {
        "analysis_id": analysis_id,
        "status": "PROCESSING",
        "message": "File analysis started successfully",
        "file_name": file.filename,
        "file_size": len(content),
        "estimated_time": "60 seconds"
    }

@app.get("/api/analysis/{analysis_id}")
async def get_analysis_result(analysis_id: str):
    """Get analysis result by ID"""
    
    if analysis_id not in analysis_storage:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    result = analysis_storage[analysis_id]
    return result

@app.get("/api/analysis/{analysis_id}/progress")
async def get_analysis_progress(analysis_id: str):
    """Get analysis progress"""
    
    if analysis_id not in progress_storage:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    progress = progress_storage[analysis_id]
    return {
        "analysis_id": analysis_id,
        "progress": progress["progress"],
        "current_step": progress["current_step"],
        "message": progress["message"],
        "steps": [
            {
                "id": step["id"],
                "name": step["name"],
                "progress": progress["steps"][step["id"]],
                "weight": step["weight"]
            }
            for step in ANALYSIS_STEPS
        ]
    }

@app.get("/api/analysis/{analysis_id}/export/{format}")
async def export_analysis_result(analysis_id: str, format: Literal["json", "csv", "xml"]):
    """Export analysis result in specified format"""
    
    if analysis_id not in analysis_storage:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    result = analysis_storage[analysis_id]
    
    try:
        if format == "json":
            content = result.model_dump_json(indent=2)
            filename = f"SNP_Analysis_{analysis_id}.json"
            media_type = "application/json"
        elif format == "csv":
            # Simple CSV export
            import csv
            import io
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Write header
            writer.writerow(['ID', 'Position', 'Gene', 'Mutation', 'Clinical_Significance'])
            
            # Write data
            for variant in result.variants:
                writer.writerow([
                    variant.id,
                    variant.position,
                    variant.gene,
                    variant.mutation,
                    variant.clinical_significance
                ])
            
            content = output.getvalue()
            filename = f"SNP_Variants_{analysis_id}.csv"
            media_type = "text/csv"
        elif format == "xml":
            # Simple XML export
            content = f"""<?xml version="1.0" encoding="UTF-8"?>
<analysis id="{analysis_id}">
    <summary>
        <total_variants>{result.summary.total_variants}</total_variants>
        <overall_risk>{result.summary.overall_risk}</overall_risk>
    </summary>
    <variants>
        {' '.join(f'<variant id="{v.id}" position="{v.position}" gene="{v.gene}" />' for v in result.variants)}
    </variants>
</analysis>"""
            filename = f"SNP_Analysis_{analysis_id}.xml"
            media_type = "application/xml"
        
        # Save to file
        export_path = Path(f"storage/exports/{filename}")
        with open(export_path, "w") as f:
            f.write(content)
        
        return FileResponse(
            path=export_path,
            filename=filename,
            media_type=media_type
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

@app.get("/api/statistics")
async def get_platform_statistics():
    """Get platform usage statistics"""
    
    total_analyses = len(analysis_storage)
    completed_analyses = sum(1 for r in analysis_storage.values() if r.status == "COMPLETED")
    
    if completed_analyses > 0:
        avg_processing_time = sum(
            r.metadata.processing_time for r in analysis_storage.values() 
            if r.status == "COMPLETED" and r.metadata.processing_time
        ) / completed_analyses
    else:
        avg_processing_time = 0.0
    
    return {
        "total_analyses": total_analyses,
        "completed_analyses": completed_analyses,
        "success_rate": (completed_analyses / total_analyses * 100) if total_analyses > 0 else 0,
        "average_processing_time": round(avg_processing_time, 2),
        "supported_algorithms": ["boyer-moore", "kmp", "rabin-karp"],
        "supported_genes": ["BRCA1", "BRCA2"],
        "version": "2.1.0"
    }

@app.delete("/api/analysis/{analysis_id}")
async def delete_analysis(analysis_id: str):
    """Delete analysis result"""
    
    if analysis_id not in analysis_storage:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    del analysis_storage[analysis_id]
    if analysis_id in progress_storage:
        del progress_storage[analysis_id]
    
    return {"message": "Analysis deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)