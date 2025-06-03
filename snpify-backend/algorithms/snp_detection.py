from typing import List, Dict, Tuple, Optional, Any
import re
import random
from dataclasses import dataclass
from enum import Enum
import logging

logger = logging.getLogger(__name__)

class ClinicalSignificance(Enum):
    """Clinical significance classifications based on ACMG guidelines"""
    PATHOGENIC = "PATHOGENIC"
    LIKELY_PATHOGENIC = "LIKELY_PATHOGENIC"
    UNCERTAIN_SIGNIFICANCE = "UNCERTAIN_SIGNIFICANCE"
    LIKELY_BENIGN = "LIKELY_BENIGN"
    BENIGN = "BENIGN"

class VariantImpact(Enum):
    """Variant impact levels"""
    HIGH = "HIGH"           # Loss of function
    MODERATE = "MODERATE"   # Missense variants
    LOW = "LOW"            # Synonymous variants
    MODIFIER = "MODIFIER"   # Non-coding variants

class VariantType(Enum):
    """Types of genetic variants"""
    SNV = "SNV"                    # Single Nucleotide Variant
    INSERTION = "INSERTION"        # Insertion
    DELETION = "DELETION"          # Deletion
    INDEL = "INDEL"               # Insertion/Deletion
    SUBSTITUTION = "SUBSTITUTION"  # Substitution

@dataclass
class Variant:
    """Represents a genetic variant"""
    position: int
    reference: str
    alternative: str
    variant_type: VariantType
    quality_score: float
    read_depth: int = 100
    
    @property
    def mutation_notation(self) -> str:
        """Return mutation in standard notation"""
        return f"{self.reference}>{self.alternative}"

@dataclass
class SNPResult:
    """Complete SNP analysis result"""
    variant: Variant
    gene: str
    chromosome: str
    rs_id: Optional[str]
    consequence: str
    impact: VariantImpact
    clinical_significance: ClinicalSignificance
    confidence: float
    frequency: Optional[float]
    annotations: Dict[str, Any]

class SNPDetector:
    """Main SNP detection class implementing various algorithms"""
    
    def __init__(self, gene: str, algorithm: str = "boyer-moore"):
        self.gene = gene.upper()
        self.algorithm = algorithm
        self.chromosome = "17" if gene == "BRCA1" else "13"
        
        # Known pathogenic variants (simplified database)
        self.known_variants = self._load_known_variants()
        
        # Quality thresholds
        self.min_quality_score = 20.0
        self.min_read_depth = 10
        self.min_confidence = 0.7
    
    def _load_known_variants(self) -> Dict[int, Dict[str, Any]]:
        """Load known pathogenic variants for the gene"""
        # Simplified known variants database
        # In production, this would query ClinVar, dbSNP, etc.
        
        brca1_variants = {
            68: {
                "rs_id": "rs80357914",
                "ref": "A", "alt": "G",
                "clinical_significance": ClinicalSignificance.PATHOGENIC,
                "frequency": 0.0001,
                "consequence": "missense_variant",
                "impact": VariantImpact.HIGH
            },
            185: {
                "rs_id": "rs80357906",
                "ref": "A", "alt": "G", 
                "clinical_significance": ClinicalSignificance.PATHOGENIC,
                "frequency": 0.0002,
                "consequence": "frameshift_variant",
                "impact": VariantImpact.HIGH
            },
            1135: {
                "rs_id": "rs80357713",
                "ref": "G", "alt": "A",
                "clinical_significance": ClinicalSignificance.LIKELY_PATHOGENIC,
                "frequency": 0.0001,
                "consequence": "missense_variant", 
                "impact": VariantImpact.MODERATE
            }
        }
        
        brca2_variants = {
            617: {
                "rs_id": "rs80359550",
                "ref": "T", "alt": "G",
                "clinical_significance": ClinicalSignificance.PATHOGENIC,
                "frequency": 0.0001,
                "consequence": "missense_variant",
                "impact": VariantImpact.HIGH
            },
            999: {
                "rs_id": "rs80359564", 
                "ref": "C", "alt": "T",
                "clinical_significance": ClinicalSignificance.LIKELY_PATHOGENIC,
                "frequency": 0.0002,
                "consequence": "nonsense_variant",
                "impact": VariantImpact.HIGH
            }
        }
        
        return brca1_variants if self.gene == "BRCA1" else brca2_variants
    
    def detect_variants(self, query_sequence: str, reference_sequence: str, alignment_result: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Main variant detection method"""
        logger.info(f"Starting variant detection for {self.gene} using {self.algorithm}")
        
        variants = []
        
        # Align sequences and find differences
        aligned_query, aligned_ref = self._align_sequences(query_sequence, reference_sequence)
        
        # Detect SNVs (Single Nucleotide Variants)
        snvs = self._detect_snvs(aligned_query, aligned_ref)
        variants.extend(snvs)
        
        # Detect indels
        indels = self._detect_indels(aligned_query, aligned_ref)
        variants.extend(indels)
        
        # Filter variants by quality
        filtered_variants = self._filter_variants(variants)
        
        logger.info(f"Detected {len(filtered_variants)} high-quality variants")
        return filtered_variants
    
    def _align_sequences(self, query: str, reference: str) -> Tuple[str, str]:
        """Simple sequence alignment for variant detection"""
        # For simplicity, we'll use a basic alignment
        # In production, use proper alignment algorithms like Smith-Waterman
        
        min_length = min(len(query), len(reference))
        max_length = max(len(query), len(reference))
        
        # Pad shorter sequence
        if len(query) < max_length:
            query += "-" * (max_length - len(query))
        if len(reference) < max_length:
            reference += "-" * (max_length - len(reference))
        
        return query[:max_length], reference[:max_length]
    
    def _detect_snvs(self, aligned_query: str, aligned_ref: str) -> List[Dict[str, Any]]:
        """Detect single nucleotide variants"""
        snvs = []
        
        for i, (query_base, ref_base) in enumerate(zip(aligned_query, aligned_ref)):
            if query_base != ref_base and query_base != "-" and ref_base != "-":
                # Calculate quality scores
                quality_score = self._calculate_base_quality(i, query_base, ref_base)
                read_depth = random.randint(50, 200)  # Simulated read depth
                
                variant_data = {
                    "position": i + 1,
                    "ref": ref_base,
                    "alt": query_base,
                    "type": "substitution",
                    "quality": quality_score,
                    "read_depth": read_depth,
                    "confidence": min(quality_score / 40.0, 1.0)
                }
                
                # Add consequence prediction
                consequence = self._predict_consequence(i + 1, ref_base, query_base)
                variant_data.update(consequence)
                
                snvs.append(variant_data)
        
        return snvs
    
    def _detect_indels(self, aligned_query: str, aligned_ref: str) -> List[Dict[str, Any]]:
        """Detect insertions and deletions"""
        indels = []
        i = 0
        
        while i < len(aligned_query):
            query_base = aligned_query[i]
            ref_base = aligned_ref[i]
            
            if query_base == "-":
                # Deletion in query (insertion in reference)
                deletion_length = 0
                deleted_bases = ""
                j = i
                
                while j < len(aligned_query) and aligned_query[j] == "-":
                    deleted_bases += aligned_ref[j]
                    deletion_length += 1
                    j += 1
                
                if deletion_length > 0:
                    quality_score = self._calculate_indel_quality(i + 1, deletion_length)
                    
                    indel_data = {
                        "position": i + 1,
                        "ref": deleted_bases,
                        "alt": "-",
                        "type": "deletion",
                        "quality": quality_score,
                        "read_depth": random.randint(30, 150),
                        "confidence": min(quality_score / 35.0, 1.0),
                        "consequence": "frameshift_variant" if deletion_length % 3 != 0 else "inframe_deletion",
                        "impact": VariantImpact.HIGH if deletion_length % 3 != 0 else VariantImpact.MODERATE
                    }
                    
                    indels.append(indel_data)
                    i = j
                
            elif ref_base == "-":
                # Insertion in query
                insertion_length = 0
                inserted_bases = ""
                j = i
                
                while j < len(aligned_ref) and aligned_ref[j] == "-":
                    inserted_bases += aligned_query[j]
                    insertion_length += 1
                    j += 1
                
                if insertion_length > 0:
                    quality_score = self._calculate_indel_quality(i + 1, insertion_length)
                    
                    indel_data = {
                        "position": i + 1,
                        "ref": "-",
                        "alt": inserted_bases,
                        "type": "insertion", 
                        "quality": quality_score,
                        "read_depth": random.randint(30, 150),
                        "confidence": min(quality_score / 35.0, 1.0),
                        "consequence": "frameshift_variant" if insertion_length % 3 != 0 else "inframe_insertion",
                        "impact": VariantImpact.HIGH if insertion_length % 3 != 0 else VariantImpact.MODERATE
                    }
                    
                    indels.append(indel_data)
                    i = j
            else:
                i += 1
        
        return indels
    
    def _calculate_base_quality(self, position: int, query_base: str, ref_base: str) -> float:
        """Calculate quality score for a base substitution"""
        # Simplified quality calculation
        # In production, this would use actual sequencing quality scores
        
        base_quality = 30.0  # Default Phred score
        
        # Adjust based on position (quality tends to be lower at ends)
        if position < 50 or position > 1000:
            base_quality -= 5.0
        
        # Adjust based on base types (some substitutions are more reliable)
        transition_pairs = [("A", "G"), ("G", "A"), ("C", "T"), ("T", "C")]
        if (query_base, ref_base) in transition_pairs:
            base_quality += 2.0  # Transitions are more common
        else:
            base_quality -= 1.0  # Transversions are less common
        
        # Add some randomness to simulate real data
        base_quality += random.uniform(-3.0, 3.0)
        
        return max(0.0, base_quality)
    
    def _calculate_indel_quality(self, position: int, length: int) -> float:
        """Calculate quality score for indels"""
        base_quality = 25.0  # Indels generally have lower quality
        
        # Longer indels are less reliable
        base_quality -= length * 2.0
        
        # Position effects
        if position < 100:
            base_quality -= 3.0
        
        base_quality += random.uniform(-2.0, 2.0)
        
        return max(0.0, base_quality)
    
    def _predict_consequence(self, position: int, ref_base: str, alt_base: str) -> Dict[str, Any]:
        """Predict functional consequence of variant"""
        # Simplified consequence prediction
        # In production, use tools like VEP, SnpEff, etc.
        
        consequences = ["synonymous_variant", "missense_variant", "nonsense_variant", "splice_site_variant"]
        impacts = [VariantImpact.LOW, VariantImpact.MODERATE, VariantImpact.HIGH, VariantImpact.HIGH]
        
        # Simple heuristics for consequence prediction
        if position % 3 == 0:  # Simplified codon boundary logic
            if alt_base in ["A", "T"] and ref_base in ["G", "C"]:
                consequence = "nonsense_variant"
                impact = VariantImpact.HIGH
            else:
                consequence = "missense_variant"
                impact = VariantImpact.MODERATE
        else:
            consequence = "synonymous_variant"
            impact = VariantImpact.LOW
        
        return {
            "consequence": consequence,
            "impact": impact
        }
    
    def _filter_variants(self, variants: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Filter variants based on quality thresholds"""
        filtered = []
        
        for variant in variants:
            if (variant["quality"] >= self.min_quality_score and
                variant["read_depth"] >= self.min_read_depth and
                variant["confidence"] >= self.min_confidence):
                filtered.append(variant)
        
        return filtered
    
    def annotate_clinical_significance(self, variant: Dict[str, Any]) -> str:
        """Annotate variant with clinical significance"""
        position = variant["position"]
        
        # Check against known variants database
        if position in self.known_variants:
            known_var = self.known_variants[position]
            if (known_var["ref"] == variant["ref"] and 
                known_var["alt"] == variant["alt"]):
                return known_var["clinical_significance"].value
        
        # Predict clinical significance based on consequence and impact
        consequence = variant.get("consequence", "")
        impact = variant.get("impact", VariantImpact.LOW)
        
        if "nonsense" in consequence or "frameshift" in consequence:
            return ClinicalSignificance.PATHOGENIC.value
        elif "missense" in consequence and impact == VariantImpact.HIGH:
            return ClinicalSignificance.LIKELY_PATHOGENIC.value
        elif "missense" in consequence:
            return ClinicalSignificance.UNCERTAIN_SIGNIFICANCE.value
        elif "synonymous" in consequence:
            return ClinicalSignificance.BENIGN.value
        else:
            return ClinicalSignificance.UNCERTAIN_SIGNIFICANCE.value
    
    def calculate_quality_score(self, sequence: str, variants: List[Dict[str, Any]], alignment_result: Dict[str, Any]) -> float:
        """Calculate overall analysis quality score"""
        if not variants:
            return 95.0  # High quality if no variants found
        
        # Calculate average variant quality
        avg_variant_quality = sum(v["quality"] for v in variants) / len(variants)
        
        # Calculate sequence quality metrics
        sequence_quality = self._calculate_sequence_quality(sequence)
        
        # Calculate alignment quality
        alignment_quality = alignment_result.get("identity", 0.95) * 100
        
        # Combine scores
        overall_quality = (
            avg_variant_quality * 0.4 +
            sequence_quality * 0.3 +
            alignment_quality * 0.3
        )
        
        return min(100.0, max(0.0, overall_quality))
    
    def _calculate_sequence_quality(self, sequence: str) -> float:
        """Calculate sequence quality metrics"""
        if not sequence:
            return 0.0
        
        # Calculate GC content
        gc_count = sequence.count("G") + sequence.count("C")
        gc_content = gc_count / len(sequence)
        
        # Calculate N content (ambiguous bases)
        n_count = sequence.count("N")
        n_percentage = n_count / len(sequence)
        
        # Quality score based on GC content and N percentage
        gc_score = 100.0 if 0.3 <= gc_content <= 0.7 else 80.0
        n_score = max(0, 100.0 - (n_percentage * 1000))
        
        return (gc_score + n_score) / 2
    
    def calculate_risk_score(self, variants: List[Any]) -> float:
        """Calculate risk score based on detected variants"""
        if not variants:
            return 0.0
        
        risk_score = 0.0
        
        for variant in variants:
            # Risk weights based on clinical significance
            if variant.clinical_significance == "PATHOGENIC":
                risk_score += 3.0
            elif variant.clinical_significance == "LIKELY_PATHOGENIC":
                risk_score += 2.0
            elif variant.clinical_significance == "UNCERTAIN_SIGNIFICANCE":
                risk_score += 0.5
            
            # Additional risk based on impact
            if hasattr(variant, 'impact'):
                if variant.impact == "HIGH":
                    risk_score += 1.0
                elif variant.impact == "MODERATE":
                    risk_score += 0.5
        
        return min(10.0, risk_score)
    
    def generate_recommendations(self, overall_risk: str, variants: List[Any]) -> List[str]:
        """Generate clinical recommendations based on analysis results"""
        recommendations = []
        
        if overall_risk == "HIGH":
            recommendations.extend([
                "Immediate genetic counseling recommended",
                "Consider enhanced screening protocols",
                "Discuss preventive options with healthcare provider",
                "Family screening may be indicated"
            ])
        elif overall_risk == "MODERATE":
            recommendations.extend([
                "Genetic counseling recommended", 
                "Regular monitoring advised",
                "Discuss findings with healthcare provider"
            ])
        else:
            recommendations.extend([
                "Continue standard screening recommendations",
                "Regular follow-up as clinically indicated"
            ])
        
        # Add variant-specific recommendations
        pathogenic_count = sum(1 for v in variants if hasattr(v, 'clinical_significance') and v.clinical_significance == "PATHOGENIC")
        
        if pathogenic_count > 0:
            recommendations.append(f"Found {pathogenic_count} pathogenic variant(s) - urgent clinical review needed")
        
        return recommendations