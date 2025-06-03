import re
from typing import List, Dict, Any, Optional
from io import StringIO
import logging

logger = logging.getLogger(__name__)

class FASTAParser:
    """Parser for FASTA and FASTQ files"""
    
    def __init__(self):
        self.valid_bases = set('ATGCNRYSWKMBDHV-')  # Including ambiguous bases
    
    def parse_fasta(self, content: str) -> List[Dict[str, str]]:
        """Parse FASTA format content"""
        sequences = []
        current_header = ""
        current_sequence = ""
        
        lines = content.strip().split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if line.startswith('>'):
                # Save previous sequence if exists
                if current_header and current_sequence:
                    sequences.append({
                        'header': current_header,
                        'sequence': current_sequence.upper(),
                        'id': self._extract_sequence_id(current_header),
                        'description': self._extract_description(current_header)
                    })
                
                # Start new sequence
                current_header = line[1:]  # Remove '>'
                current_sequence = ""
            else:
                # Add to current sequence
                current_sequence += line.replace(' ', '').replace('\t', '')
        
        # Don't forget the last sequence
        if current_header and current_sequence:
            sequences.append({
                'header': current_header,
                'sequence': current_sequence.upper(),
                'id': self._extract_sequence_id(current_header),
                'description': self._extract_description(current_header)
            })
        
        # Validate sequences
        validated_sequences = []
        for seq in sequences:
            if self._validate_dna_sequence(seq['sequence']):
                validated_sequences.append(seq)
            else:
                logger.warning(f"Invalid sequence found: {seq['id']}")
        
        return validated_sequences
    
    def parse_fastq(self, content: str) -> List[Dict[str, Any]]:
        """Parse FASTQ format content"""
        sequences = []
        lines = content.strip().split('\n')
        
        i = 0
        while i < len(lines):
            if lines[i].startswith('@'):
                header = lines[i][1:]  # Remove '@'
                sequence = lines[i + 1] if i + 1 < len(lines) else ""
                plus_line = lines[i + 2] if i + 2 < len(lines) else ""
                quality = lines[i + 3] if i + 3 < len(lines) else ""
                
                if plus_line.startswith('+') and len(sequence) == len(quality):
                    sequences.append({
                        'header': header,
                        'sequence': sequence.upper(),
                        'quality': quality,
                        'id': self._extract_sequence_id(header),
                        'description': self._extract_description(header),
                        'avg_quality': self._calculate_avg_quality(quality)
                    })
                
                i += 4
            else:
                i += 1
        
        return sequences
    
    def parse_vcf(self, content: str) -> str:
        """Parse VCF format and extract reference sequence (simplified)"""
        # This is a simplified VCF parser
        # In production, use proper VCF parsing libraries like pysam
        
        lines = content.strip().split('\n')
        reference_sequences = []
        
        for line in lines:
            if line.startswith('#'):
                continue  # Skip header lines
            
            parts = line.split('\t')
            if len(parts) >= 4:
                # VCF format: CHROM POS ID REF ALT QUAL FILTER INFO
                ref_allele = parts[3]
                if self._validate_dna_sequence(ref_allele):
                    reference_sequences.append(ref_allele)
        
        # Combine reference sequences
        return ''.join(reference_sequences)
    
    def _extract_sequence_id(self, header: str) -> str:
        """Extract sequence ID from FASTA header"""
        # Take first word as ID
        return header.split()[0] if header else "unknown"
    
    def _extract_description(self, header: str) -> str:
        """Extract description from FASTA header"""
        parts = header.split(maxsplit=1)
        return parts[1] if len(parts) > 1 else ""
    
    def _validate_dna_sequence(self, sequence: str) -> bool:
        """Validate DNA sequence contains only valid bases"""
        if not sequence:
            return False
        
        sequence = sequence.upper()
        return all(base in self.valid_bases for base in sequence)
    
    def _calculate_avg_quality(self, quality_string: str) -> float:
        """Calculate average quality score from FASTQ quality string"""
        if not quality_string:
            return 0.0
        
        # Convert ASCII to Phred scores (assuming Phred+33 encoding)
        quality_scores = [ord(char) - 33 for char in quality_string]
        return sum(quality_scores) / len(quality_scores)