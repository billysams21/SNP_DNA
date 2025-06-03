from typing import List, Tuple, Dict, Optional, Any
import numpy as np
from dataclasses import dataclass
from enum import Enum
import logging

logger = logging.getLogger(__name__)

class AlignmentType(Enum):
    """Types of sequence alignment"""
    GLOBAL = "global"    # Needleman-Wunsch
    LOCAL = "local"      # Smith-Waterman
    SEMI_GLOBAL = "semi_global"

@dataclass
class AlignmentParameters:
    """Parameters for sequence alignment"""
    match_score: int = 2
    mismatch_score: int = -1
    gap_penalty: int = -1
    gap_extension_penalty: int = -0.5
    
@dataclass
class AlignmentResult:
    """Result of sequence alignment"""
    aligned_query: str
    aligned_reference: str
    score: float
    identity: float
    similarity: float
    gaps: int
    start_position: int
    end_position: int
    coverage: float
    cigar: str
    alignment_length: int

class SequenceAligner:
    """Main sequence alignment class"""
    
    def __init__(self, algorithm: str = "smith-waterman", parameters: Optional[AlignmentParameters] = None):
        self.algorithm = algorithm.lower()
        self.parameters = parameters or AlignmentParameters()
        
        # Scoring matrix for nucleotides
        self.scoring_matrix = self._create_scoring_matrix()
    
    def _create_scoring_matrix(self) -> Dict[Tuple[str, str], int]:
        """Create nucleotide scoring matrix"""
        bases = ['A', 'T', 'G', 'C', 'N']
        matrix = {}
        
        for base1 in bases:
            for base2 in bases:
                if base1 == 'N' or base2 == 'N':
                    matrix[(base1, base2)] = 0
                elif base1 == base2:
                    matrix[(base1, base2)] = self.parameters.match_score
                else:
                    matrix[(base1, base2)] = self.parameters.mismatch_score
        
        return matrix
    
    def align(self, query: str, reference: str) -> Dict[str, Any]:
        """Main alignment method"""
        logger.info(f"Starting sequence alignment using {self.algorithm}")
        
        query = query.upper().strip()
        reference = reference.upper().strip()
        
        if self.algorithm == "smith-waterman":
            result = self._smith_waterman_alignment(query, reference)
        elif self.algorithm == "needleman-wunsch":
            result = self._needleman_wunsch_alignment(query, reference)
        elif self.algorithm == "boyer-moore":
            result = self._boyer_moore_alignment(query, reference)
        else:
            # Default to Smith-Waterman for local alignment
            result = self._smith_waterman_alignment(query, reference)
        
        # Calculate additional metrics
        result.update(self._calculate_alignment_metrics(result))
        
        logger.info(f"Alignment completed. Score: {result.get('score', 0):.2f}, Identity: {result.get('identity', 0):.3f}")
        
        return result
    
    def _smith_waterman_alignment(self, query: str, reference: str) -> Dict[str, Any]:
        """Smith-Waterman local alignment algorithm"""
        m, n = len(query), len(reference)
        
        # Initialize scoring matrix
        score_matrix = np.zeros((m + 1, n + 1))
        traceback_matrix = np.zeros((m + 1, n + 1), dtype=int)
        
        # Direction constants for traceback
        DIAGONAL = 1
        UP = 2
        LEFT = 3
        
        max_score = 0
        max_pos = (0, 0)
        
        # Fill scoring matrix
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                # Calculate scores for each direction
                match_score = score_matrix[i-1, j-1] + self.scoring_matrix.get((query[i-1], reference[j-1]), self.parameters.mismatch_score)
                delete_score = score_matrix[i-1, j] + self.parameters.gap_penalty
                insert_score = score_matrix[i, j-1] + self.parameters.gap_penalty
                
                # Take maximum score (including 0 for local alignment)
                score_matrix[i, j] = max(0, match_score, delete_score, insert_score)
                
                # Record traceback direction
                if score_matrix[i, j] == 0:
                    traceback_matrix[i, j] = 0
                elif score_matrix[i, j] == match_score:
                    traceback_matrix[i, j] = DIAGONAL
                elif score_matrix[i, j] == delete_score:
                    traceback_matrix[i, j] = UP
                else:
                    traceback_matrix[i, j] = LEFT
                
                # Track maximum score position
                if score_matrix[i, j] > max_score:
                    max_score = score_matrix[i, j]
                    max_pos = (i, j)
        
        # Traceback to get alignment
        aligned_query, aligned_reference = self._traceback(
            query, reference, traceback_matrix, max_pos, local=True
        )
        
        return {
            "aligned_query": aligned_query,
            "aligned_reference": aligned_reference,
            "score": max_score,
            "matrix": score_matrix,
            "start_position": max_pos[1] - len(aligned_query.replace("-", "")),
            "end_position": max_pos[1]
        }
    
    def _needleman_wunsch_alignment(self, query: str, reference: str) -> Dict[str, Any]:
        """Needleman-Wunsch global alignment algorithm"""
        m, n = len(query), len(reference)
        
        # Initialize scoring matrix
        score_matrix = np.zeros((m + 1, n + 1))
        traceback_matrix = np.zeros((m + 1, n + 1), dtype=int)
        
        # Direction constants
        DIAGONAL = 1
        UP = 2
        LEFT = 3
        
        # Initialize first row and column
        for i in range(1, m + 1):
            score_matrix[i, 0] = score_matrix[i-1, 0] + self.parameters.gap_penalty
            traceback_matrix[i, 0] = UP
        
        for j in range(1, n + 1):
            score_matrix[0, j] = score_matrix[0, j-1] + self.parameters.gap_penalty
            traceback_matrix[0, j] = LEFT
        
        # Fill scoring matrix
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                match_score = score_matrix[i-1, j-1] + self.scoring_matrix.get((query[i-1], reference[j-1]), self.parameters.mismatch_score)
                delete_score = score_matrix[i-1, j] + self.parameters.gap_penalty
                insert_score = score_matrix[i, j-1] + self.parameters.gap_penalty
                
                score_matrix[i, j] = max(match_score, delete_score, insert_score)
                
                if score_matrix[i, j] == match_score:
                    traceback_matrix[i, j] = DIAGONAL
                elif score_matrix[i, j] == delete_score:
                    traceback_matrix[i, j] = UP
                else:
                    traceback_matrix[i, j] = LEFT
        
        # Traceback from bottom-right corner
        aligned_query, aligned_reference = self._traceback(
            query, reference, traceback_matrix, (m, n), local=False
        )
        
        return {
            "aligned_query": aligned_query,
            "aligned_reference": aligned_reference,
            "score": score_matrix[m, n],
            "matrix": score_matrix,
            "start_position": 0,
            "end_position": n
        }
    
    def _boyer_moore_alignment(self, query: str, reference: str) -> Dict[str, Any]:
        """Boyer-Moore based alignment for exact matches"""
        from .string_matching import BoyerMooreSearcher
        
        # Use Boyer-Moore to find exact matches
        searcher = BoyerMooreSearcher(query)
        matches = searcher.search(reference)
        
        if matches:
            # Use first match for alignment
            start_pos = matches[0]
            end_pos = start_pos + len(query)
            
            aligned_query = query
            aligned_reference = reference[start_pos:end_pos]
            
            # Calculate score (all matches for exact match)
            score = len(query) * self.parameters.match_score
            
            return {
                "aligned_query": aligned_query,
                "aligned_reference": aligned_reference,
                "score": score,
                "start_position": start_pos,
                "end_position": end_pos,
                "exact_matches": len(matches)
            }
        else:
            # No exact match found, fall back to Smith-Waterman
            return self._smith_waterman_alignment(query, reference)
    
    def _traceback(self, query: str, reference: str, traceback_matrix: np.ndarray, 
                   start_pos: Tuple[int, int], local: bool = True) -> Tuple[str, str]:
        """Perform traceback to reconstruct alignment"""
        aligned_query = ""
        aligned_reference = ""
        
        i, j = start_pos
        
        while i > 0 or j > 0:
            if local and traceback_matrix[i, j] == 0:
                break
            
            if traceback_matrix[i, j] == 1:  # DIAGONAL
                aligned_query = query[i-1] + aligned_query
                aligned_reference = reference[j-1] + aligned_reference
                i -= 1
                j -= 1
            elif traceback_matrix[i, j] == 2:  # UP
                aligned_query = query[i-1] + aligned_query
                aligned_reference = "-" + aligned_reference
                i -= 1
            elif traceback_matrix[i, j] == 3:  # LEFT
                aligned_query = "-" + aligned_query
                aligned_reference = reference[j-1] + aligned_reference
                j -= 1
            else:
                break
        
        return aligned_query, aligned_reference
    
    def _calculate_alignment_metrics(self, alignment_result: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate additional alignment metrics"""
        aligned_query = alignment_result.get("aligned_query", "")
        aligned_reference = alignment_result.get("aligned_reference", "")
        
        if not aligned_query or not aligned_reference:
            return {
                "identity": 0.0,
                "similarity": 0.0,
                "gaps": 0,
                "coverage": 0.0,
                "cigar": "",
                "alignment_length": 0
            }
        
        # Calculate identity (exact matches)
        matches = sum(1 for a, b in zip(aligned_query, aligned_reference) if a == b and a != "-")
        total_positions = len(aligned_query)
        identity = matches / total_positions if total_positions > 0 else 0.0
        
        # Calculate similarity (matches + conservative substitutions)
        similarity = self._calculate_similarity(aligned_query, aligned_reference)
        
        # Count gaps
        gaps_query = aligned_query.count("-")
        gaps_reference = aligned_reference.count("-")
        total_gaps = gaps_query + gaps_reference
        
        # Calculate coverage
        query_bases = len(aligned_query.replace("-", ""))
        original_query_length = len(alignment_result.get("original_query", aligned_query.replace("-", "")))
        coverage = query_bases / original_query_length if original_query_length > 0 else 0.0
        
        # Generate CIGAR string
        cigar = self._generate_cigar(aligned_query, aligned_reference)
        
        return {
            "identity": identity,
            "similarity": similarity,
            "gaps": total_gaps,
            "coverage": coverage,
            "cigar": cigar,
            "alignment_length": total_positions
        }
    
    def _calculate_similarity(self, aligned_query: str, aligned_reference: str) -> float:
        """Calculate similarity including conservative substitutions"""
        if not aligned_query or not aligned_reference:
            return 0.0
        
        similar_pairs = [
            ("A", "G"), ("G", "A"),  # Purines
            ("C", "T"), ("T", "C")   # Pyrimidines
        ]
        
        matches = 0
        total_positions = 0
        
        for a, b in zip(aligned_query, aligned_reference):
            if a != "-" and b != "-":
                total_positions += 1
                if a == b or (a, b) in similar_pairs:
                    matches += 1
        
        return matches / total_positions if total_positions > 0 else 0.0
    
    def _generate_cigar(self, aligned_query: str, aligned_reference: str) -> str:
        """Generate CIGAR string for alignment"""
        if not aligned_query or not aligned_reference:
            return ""
        
        cigar = ""
        current_op = ""
        current_count = 0
        
        for a, b in zip(aligned_query, aligned_reference):
            if a == "-":
                op = "D"  # Deletion
            elif b == "-":
                op = "I"  # Insertion
            elif a == b:
                op = "M"  # Match
            else:
                op = "X"  # Mismatch
            
            if op == current_op:
                current_count += 1
            else:
                if current_count > 0:
                    cigar += f"{current_count}{current_op}"
                current_op = op
                current_count = 1
        
        if current_count > 0:
            cigar += f"{current_count}{current_op}"
        
        return cigar
    
    def get_alignment_statistics(self, query: str, reference: str) -> Dict[str, Any]:
        """Get comprehensive alignment statistics"""
        alignment = self.align(query, reference)
        
        return {
            "algorithm": self.algorithm,
            "query_length": len(query),
            "reference_length": len(reference),
            "alignment_score": alignment.get("score", 0),
            "identity_percentage": alignment.get("identity", 0) * 100,
            "similarity_percentage": alignment.get("similarity", 0) * 100,
            "coverage_percentage": alignment.get("coverage", 0) * 100,
            "gap_count": alignment.get("gaps", 0),
            "alignment_length": alignment.get("alignment_length", 0),
            "cigar_string": alignment.get("cigar", ""),
            "start_position": alignment.get("start_position", 0),
            "end_position": alignment.get("end_position", 0)
        }

class MultipleSequenceAligner:
    """Multiple sequence alignment for comparing multiple variants"""
    
    def __init__(self, parameters: Optional[AlignmentParameters] = None):
        self.parameters = parameters or AlignmentParameters()
        self.pairwise_aligner = SequenceAligner("smith-waterman", parameters)
    
    def align_multiple(self, sequences: List[str], reference: str) -> Dict[str, Any]:
        """Align multiple sequences to a reference"""
        if not sequences:
            return {"alignments": [], "consensus": "", "statistics": {}}
        
        alignments = []
        for i, seq in enumerate(sequences):
            alignment = self.pairwise_aligner.align(seq, reference)
            alignment["sequence_id"] = i
            alignments.append(alignment)
        
        # Generate consensus sequence
        consensus = self._generate_consensus(alignments)
        
        # Calculate statistics
        statistics = self._calculate_msa_statistics(alignments)
        
        return {
            "alignments": alignments,
            "consensus": consensus,
            "statistics": statistics,
            "reference": reference
        }
    
    def _generate_consensus(self, alignments: List[Dict[str, Any]]) -> str:
        """Generate consensus sequence from multiple alignments"""
        if not alignments:
            return ""
        
        # Find maximum alignment length
        max_length = max(len(alignment.get("aligned_query", "")) for alignment in alignments)
        
        consensus = ""
        for pos in range(max_length):
            bases = []
            for alignment in alignments:
                aligned_seq = alignment.get("aligned_query", "")
                if pos < len(aligned_seq) and aligned_seq[pos] != "-":
                    bases.append(aligned_seq[pos])
            
            if bases:
                # Take most common base
                consensus += max(set(bases), key=bases.count)
            else:
                consensus += "-"
        
        return consensus
    
    def _calculate_msa_statistics(self, alignments: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate multiple sequence alignment statistics"""
        if not alignments:
            return {}
        
        scores = [alignment.get("score", 0) for alignment in alignments]
        identities = [alignment.get("identity", 0) for alignment in alignments]
        
        return {
            "sequence_count": len(alignments),
            "average_score": sum(scores) / len(scores),
            "average_identity": sum(identities) / len(identities),
            "min_identity": min(identities),
            "max_identity": max(identities),
            "total_gaps": sum(alignment.get("gaps", 0) for alignment in alignments)
        }

# Example usage and testing
if __name__ == "__main__":
    # Test sequence alignment
    query = "ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAA"
    reference = "ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCCATCT"
    
    # Test different alignment algorithms
    algorithms = ["smith-waterman", "needleman-wunsch", "boyer-moore"]
    
    for algorithm in algorithms:
        print(f"\n{algorithm.upper()} Alignment:")
        print("=" * 50)
        
        aligner = SequenceAligner(algorithm)
        result = aligner.align(query, reference)
        stats = aligner.get_alignment_statistics(query, reference)
        
        print(f"Score: {stats['alignment_score']:.2f}")
        print(f"Identity: {stats['identity_percentage']:.1f}%")
        print(f"Coverage: {stats['coverage_percentage']:.1f}%")
        print(f"CIGAR: {stats['cigar_string']}")
        print(f"Aligned Query:     {result['aligned_query']}")
        print(f"Aligned Reference: {result['aligned_reference']}")