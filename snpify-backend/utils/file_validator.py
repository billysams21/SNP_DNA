import os
import mimetypes
from typing import Optional, Dict, Any
from fastapi import UploadFile

class FileValidator:
    """Validator for uploaded files (without python-magic)"""
    
    def __init__(self):
        self.allowed_extensions = {'.fasta', '.fa', '.fastq', '.fq', '.vcf', '.txt'}
        self.allowed_mime_types = {
            'text/plain',
            'text/x-fasta',
            'application/octet-stream',
            'application/text'
        }
        self.max_file_size = 10 * 1024 * 1024  # 10MB
    
    def validate_file(self, file: UploadFile) -> Dict[str, Any]:
        """Validate uploaded file"""
        errors = []
        warnings = []
        
        # Check file extension
        if file.filename:
            _, ext = os.path.splitext(file.filename.lower())
            if ext not in self.allowed_extensions:
                errors.append(f"Unsupported file extension: {ext}")
        
        # Check file size
        if hasattr(file, 'size') and file.size:
            if file.size > self.max_file_size:
                errors.append(f"File too large: {file.size} bytes (max: {self.max_file_size})")
        
        # Check MIME type (basic validation)
        if file.content_type:
            if not any(allowed in file.content_type for allowed in ['text/', 'application/']):
                warnings.append(f"Unexpected MIME type: {file.content_type}")
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings,
            'file_info': {
                'filename': file.filename,
                'content_type': file.content_type,
                'size': getattr(file, 'size', 0)
            }
        }
    
    def detect_file_format(self, content: str) -> str:
        """Detect file format from content (simple heuristics)"""
        content = content.strip()
        
        if content.startswith('>'):
            return 'FASTA'
        elif content.startswith('@'):
            return 'FASTQ'
        elif content.startswith('#') or '\t' in content:
            return 'VCF'
        else:
            return 'RAW_SEQUENCE'
    
    def validate_content(self, content: str, filename: str = "") -> Dict[str, Any]:
        """Validate file content"""
        errors = []
        warnings = []
        
        if not content or len(content.strip()) == 0:
            errors.append("File is empty")
            return {'valid': False, 'errors': errors, 'warnings': warnings}
        
        # Detect format
        file_format = self.detect_file_format(content)
        
        # Basic content validation
        if file_format == 'FASTA':
            if not content.count('>'):
                errors.append("Invalid FASTA format: No sequence headers found")
        elif file_format == 'FASTQ':
            lines = content.split('\n')
            if len(lines) % 4 != 0:
                warnings.append("FASTQ file may be incomplete")
        
        # Check for valid DNA characters
        sequence_lines = []
        for line in content.split('\n'):
            if not line.startswith('>') and not line.startswith('@') and not line.startswith('+'):
                sequence_lines.append(line.strip().upper())
        
        sequence_content = ''.join(sequence_lines)
        valid_chars = set('ATGCNRYSWKMBDHV-')
        invalid_chars = set(sequence_content) - valid_chars
        
        if invalid_chars:
            warnings.append(f"Found potentially invalid characters: {', '.join(invalid_chars)}")
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings,
            'format': file_format,
            'sequence_length': len(sequence_content)
        }