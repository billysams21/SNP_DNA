import re
from typing import List, Dict, Any, Optional
from io import StringIO
import logging

logger = logging.getLogger(__name__)

class FASTAParser:
    """ FASTA parser that handles various FASTA formats and edge cases"""
    
    def __init__(self):
        self.valid_dna_bases = set('ATGCNRYSWKMBDHV-')
        self.valid_protein_bases = set('ACDEFGHIKLMNPQRSTVWYXBZJUO*-')
        
    def parse_fasta_content(self, content: str) -> List[Dict[str, Any]]:
        """Parse FASTA content and return structured sequence data"""
        try:
            sequences = []
            lines = content.strip().split('\n')
            
            current_header = ""
            current_sequence = []
            
            for line_num, line in enumerate(lines):
                line = line.strip()
                
                # Skip empty lines
                if not line:
                    continue
                
                if line.startswith('>'):
                    # Save previous sequence if exists
                    if current_header and current_sequence:
                        seq_data = self._create_sequence_record(
                            current_header, 
                            ''.join(current_sequence),
                            len(sequences) + 1
                        )
                        sequences.append(seq_data)
                    
                    # Start new sequence
                    current_header = line[1:].strip()  # Remove '>' and whitespace
                    current_sequence = []
                    
                else:
                    # Add sequence line (remove spaces, tabs, numbers)
                    cleaned_line = re.sub(r'[^A-Za-z-]', '', line).upper()
                    if cleaned_line:
                        current_sequence.append(cleaned_line)
            
            # Don't forget the last sequence
            if current_header and current_sequence:
                seq_data = self._create_sequence_record(
                    current_header, 
                    ''.join(current_sequence),
                    len(sequences) + 1
                )
                sequences.append(seq_data)
            
            logger.info(f"✅ Successfully parsed {len(sequences)} sequences from FASTA")
            return sequences
            
        except Exception as e:
            logger.error(f"❌ FASTA parsing failed: {str(e)}")
            raise ValueError(f"FASTA parsing error: {str(e)}")
    
    def _create_sequence_record(self, header: str, sequence: str, seq_id: int) -> Dict[str, Any]:
        """Create a structured sequence record"""
        
        # Clean and validate sequence
        clean_sequence = sequence.replace(' ', '').replace('\t', '').upper()
        
        # Extract information from header
        seq_info = self._parse_header(header)
        
        # Determine sequence type
        seq_type = self._determine_sequence_type(clean_sequence)
        
        # Calculate basic statistics
        stats = self._calculate_sequence_stats(clean_sequence, seq_type)
        
        # Validate sequence
        is_valid, validation_notes = self._validate_sequence(clean_sequence, seq_type)
        
        return {
            'id': f"SEQ_{seq_id:03d}",
            'header': header,
            'sequence': clean_sequence,
            'length': len(clean_sequence),
            'type': seq_type,
            'description': seq_info['description'],
            'organism': seq_info.get('organism', 'Unknown'),
            'gene': seq_info.get('gene', 'Unknown'),
            'accession': seq_info.get('accession', ''),
            'statistics': stats,
            'is_valid': is_valid,
            'validation_notes': validation_notes,
            'quality_score': self._calculate_quality_score(clean_sequence, is_valid)
        }
    
    def _parse_header(self, header: str) -> Dict[str, str]:
        """Extract information from FASTA header"""
        info = {
            'description': header,
            'organism': 'Unknown',
            'gene': 'Unknown',
            'accession': ''
        }
        
        # Try to extract organism
        organism_patterns = [
            r'Homo sapiens',
            r'Human',
            r'Mus musculus',
            r'Mouse'
        ]
        
        for pattern in organism_patterns:
            if re.search(pattern, header, re.IGNORECASE):
                info['organism'] = pattern.replace(' ', '_')
                break
        
        # Try to extract gene name
        gene_patterns = [
            r'BRCA1',
            r'BRCA2', 
            r'TP53',
            r'keratin',
            r'Keratin'
        ]
        
        for pattern in gene_patterns:
            if re.search(pattern, header, re.IGNORECASE):
                info['gene'] = pattern.upper()
                break
        
        # Try to extract accession number
        accession_match = re.search(r'gi\|(\d+)', header)
        if accession_match:
            info['accession'] = f"gi|{accession_match.group(1)}"
        
        return info
    
    def _determine_sequence_type(self, sequence: str) -> str:
        """Determine if sequence is DNA, RNA, or Protein"""
        if not sequence:
            return 'UNKNOWN'
        
        # Count bases
        dna_count = sum(1 for base in sequence if base in 'ATGC')
        rna_count = sum(1 for base in sequence if base in 'AUGC')
        protein_count = sum(1 for base in sequence if base in 'ACDEFGHIKLMNPQRSTVWYXBZJUO')
        
        total_length = len(sequence)
        
        # Calculate percentages
        dna_percentage = dna_count / total_length
        protein_percentage = protein_count / total_length
        
        # Decision logic
        if dna_percentage >= 0.85:
            return 'DNA'
        elif 'U' in sequence and rna_count / total_length >= 0.85:
            return 'RNA'
        elif protein_percentage >= 0.60:
            return 'PROTEIN'
        else:
            return 'DNA'  # Default assumption for genetic analysis
    
    def _calculate_sequence_stats(self, sequence: str, seq_type: str) -> Dict[str, Any]:
        """Calculate sequence statistics"""
        if not sequence:
            return {}
        
        stats = {
            'length': len(sequence),
            'type': seq_type
        }
        
        if seq_type in ['DNA', 'RNA']:
            # Nucleotide composition
            stats.update({
                'A_count': sequence.count('A'),
                'T_count': sequence.count('T') if seq_type == 'DNA' else 0,
                'U_count': sequence.count('U') if seq_type == 'RNA' else 0,
                'G_count': sequence.count('G'),
                'C_count': sequence.count('C'),
                'N_count': sequence.count('N'),
                'gap_count': sequence.count('-')
            })
            
            # GC content
            gc_count = stats['G_count'] + stats['C_count']
            valid_bases = len(sequence) - stats['N_count'] - stats['gap_count']
            stats['gc_content'] = (gc_count / valid_bases * 100) if valid_bases > 0 else 0
            
            # AT/AU content
            at_count = stats['A_count'] + (stats['T_count'] if seq_type == 'DNA' else stats['U_count'])
            stats['at_content'] = (at_count / valid_bases * 100) if valid_bases > 0 else 0
            
        elif seq_type == 'PROTEIN':
            # Amino acid composition
            amino_acids = 'ACDEFGHIKLMNPQRSTVWY'
            for aa in amino_acids:
                stats[f'{aa}_count'] = sequence.count(aa)
            
            # Special characters
            stats['stop_count'] = sequence.count('*')
            stats['gap_count'] = sequence.count('-')
            stats['unknown_count'] = sequence.count('X')
        
        return stats
    
    def _validate_sequence(self, sequence: str, seq_type: str) -> tuple[bool, List[str]]:
        """Validate sequence and return status with notes"""
        notes = []
        is_valid = True
        
        if not sequence:
            return False, ["Empty sequence"]
        
        if len(sequence) < 10:
            notes.append("Very short sequence (< 10 bases)")
            is_valid = False
        
        # Type-specific validation
        if seq_type in ['DNA', 'RNA']:
            valid_bases = self.valid_dna_bases
            if seq_type == 'RNA':
                valid_bases = valid_bases - {'T'} | {'U'}
            
            invalid_chars = set(sequence) - valid_bases
            if invalid_chars:
                notes.append(f"Invalid characters found: {', '.join(invalid_chars)}")
                is_valid = False
            
            # Check for too many N's
            n_percentage = sequence.count('N') / len(sequence) * 100
            if n_percentage > 20:
                notes.append(f"High N content: {n_percentage:.1f}%")
            
            # Check for unusual composition
            gc_count = sequence.count('G') + sequence.count('C')
            gc_percentage = gc_count / len(sequence) * 100
            if gc_percentage < 10 or gc_percentage > 90:
                notes.append(f"Unusual GC content: {gc_percentage:.1f}%")
        
        elif seq_type == 'PROTEIN':
            invalid_chars = set(sequence) - self.valid_protein_bases
            if invalid_chars:
                notes.append(f"Invalid amino acids: {', '.join(invalid_chars)}")
                is_valid = False
        
        if not notes:
            notes.append("Sequence passed all validation checks")
        
        return is_valid, notes
    
    def _calculate_quality_score(self, sequence: str, is_valid: bool) -> float:
        """Calculate overall quality score for the sequence"""
        if not is_valid:
            return 0.0
        
        score = 100.0
        
        # Length penalty
        if len(sequence) < 50:
            score -= 20
        elif len(sequence) < 100:
            score -= 10
        
        # Composition penalties
        n_percentage = sequence.count('N') / len(sequence) * 100
        score -= min(30, n_percentage * 2)  # Penalty for N's
        
        # GC content (for DNA/RNA)
        if 'G' in sequence or 'C' in sequence:
            gc_count = sequence.count('G') + sequence.count('C')
            gc_percentage = gc_count / len(sequence) * 100
            
            # Optimal GC content is around 40-60%
            if gc_percentage < 20 or gc_percentage > 80:
                score -= 15
            elif gc_percentage < 30 or gc_percentage > 70:
                score -= 5
        
        return max(0.0, min(100.0, score))
    
    def select_best_sequence_for_analysis(self, sequences: List[Dict[str, Any]], 
                                        target_gene: str = None) -> Dict[str, Any]:
        """Select the best sequence for genetic analysis"""
        
        if not sequences:
            raise ValueError("No sequences found")
        
        if len(sequences) == 1:
            return sequences[0]
        
        # Scoring criteria
        scored_sequences = []
        
        for seq in sequences:
            score = 0
            
            # Quality score (0-100)
            score += seq['quality_score']
            
            # Length bonus (longer is generally better for genetic analysis)
            if seq['length'] > 1000:
                score += 20
            elif seq['length'] > 500:
                score += 10
            elif seq['length'] > 200:
                score += 5
            
            # Gene match bonus
            if target_gene and target_gene.upper() in seq.get('gene', '').upper():
                score += 50
            
            # DNA sequence bonus (preferred for SNP analysis)
            if seq['type'] == 'DNA':
                score += 30
            elif seq['type'] == 'RNA':
                score += 20
            
            # Validation bonus
            if seq['is_valid']:
                score += 25
            
            # Organism bonus (human preferred)
            if 'Homo_sapiens' in seq.get('organism', '') or 'Human' in seq.get('organism', ''):
                score += 15
            
            scored_sequences.append((score, seq))
        
        # Sort by score (highest first) and return best
        scored_sequences.sort(key=lambda x: x[0], reverse=True)
        best_sequence = scored_sequences[0][1]
        
        logger.info(f"✅ Selected sequence: {best_sequence['id']} (score: {scored_sequences[0][0]:.1f})")
        return best_sequence
    
    def prepare_sequence_for_analysis(self, sequence_data: Dict[str, Any]) -> str:
        """Prepare sequence for SNP analysis"""
        
        sequence = sequence_data['sequence']
        seq_type = sequence_data['type']
        
        # Clean sequence
        cleaned = sequence.replace('-', '').replace('N', 'A')  # Conservative replacement
        
        # Convert RNA to DNA if needed
        if seq_type == 'RNA':
            cleaned = cleaned.replace('U', 'T')
        
        # For protein sequences, we can't do SNP analysis
        if seq_type == 'PROTEIN':
            raise ValueError("Cannot perform SNP analysis on protein sequences. Please provide DNA sequence.")
        
        logger.info(f"✅ Prepared {len(cleaned)}bp sequence for analysis")
        return cleaned


# Integration function for the main API
def parse_fasta_file_content(content: str, target_gene: str = None) -> tuple[str, Dict[str, Any]]:
    """
    Parse FASTA file and return the best sequence for analysis
    Returns: (prepared_sequence, sequence_metadata)
    """
    
    try:
        parser = FASTAParser()
        
        # Parse all sequences
        sequences = parser.parse_fasta_content(content)
        
        if not sequences:
            raise ValueError("No valid sequences found in FASTA file")
        
        # Select best sequence
        best_sequence = parser.select_best_sequence_for_analysis(sequences, target_gene)
        
        # Prepare for analysis
        prepared_sequence = parser.prepare_sequence_for_analysis(best_sequence)
        
        # Return prepared sequence and metadata
        return prepared_sequence, {
            'original_header': best_sequence['header'],
            'sequence_id': best_sequence['id'],
            'organism': best_sequence['organism'],
            'gene': best_sequence['gene'],
            'length': best_sequence['length'],
            'type': best_sequence['type'],
            'quality_score': best_sequence['quality_score'],
            'validation_notes': best_sequence['validation_notes'],
            'statistics': best_sequence['statistics'],
            'total_sequences_in_file': len(sequences)
        }
        
    except Exception as e:
        logger.error(f"❌ FASTA parsing failed: {str(e)}")
        raise ValueError(f"Failed to parse FASTA file: {str(e)}")