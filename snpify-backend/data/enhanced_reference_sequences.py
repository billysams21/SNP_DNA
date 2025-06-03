from typing import Dict, List, Any, Tuple, Optional
from dataclasses import dataclass
from enum import Enum

class DomainType(Enum):
    """Types of protein domains"""
    CATALYTIC = "catalytic"
    BINDING = "binding"
    STRUCTURAL = "structural"
    REGULATORY = "regulatory"
    LOCALIZATION = "localization"

class ClinicalSignificance(Enum):
    """Clinical significance of domains"""
    CRITICAL = "critical"       # Mutations almost always pathogenic
    HIGH = "high"              # Mutations often pathogenic
    MODERATE = "moderate"      # Mutations sometimes pathogenic
    LOW = "low"               # Mutations rarely pathogenic

@dataclass
class ProteinDomain:
    """Enhanced protein domain information"""
    name: str
    start: int
    end: int
    domain_type: DomainType
    clinical_significance: ClinicalSignificance
    description: str
    function: str
    conservation_score: float  # 0-1, evolutionary conservation
    mutation_tolerance: float  # 0-1, tolerance to mutations
    known_pathogenic_positions: List[int]
    interaction_partners: List[str]
    structural_features: List[str]

@dataclass
class GeneInfo:
    """Enhanced gene information with domain annotations"""
    gene_symbol: str
    gene_id: str
    chromosome: str
    strand: str
    start_position: int
    end_position: int
    transcript_id: str
    protein_id: str
    description: str
    total_exons: int
    coding_sequence_length: int
    protein_length: int
    domains: List[ProteinDomain]
    hotspot_regions: List[Tuple[int, int, str]]  # (start, end, description)
    splice_sites: List[Tuple[int, str]]  # (position, type)

# ENHANCED BRCA1 Domain Definitions (based on clinical literature and structural studies)
BRCA1_DOMAINS = [
    ProteinDomain(
        name="RING_finger",
        start=1,
        end=109,
        domain_type=DomainType.CATALYTIC,
        clinical_significance=ClinicalSignificance.CRITICAL,
        description="Really Interesting New Gene (RING) finger domain",
        function="E3 ubiquitin ligase activity, protein-protein interactions",
        conservation_score=0.98,
        mutation_tolerance=0.05,
        known_pathogenic_positions=[61, 64, 65, 69, 81, 92],
        interaction_partners=["BARD1", "ubiquitin", "E2 enzymes"],
        structural_features=["zinc_binding", "alpha_helix", "beta_sheet"]
    ),
    ProteinDomain(
        name="Nuclear_Localization_Signal",
        start=503,
        end=508,
        domain_type=DomainType.LOCALIZATION,
        clinical_significance=ClinicalSignificance.HIGH,
        description="Nuclear localization signal",
        function="Nuclear import and subcellular localization",
        conservation_score=0.95,
        mutation_tolerance=0.10,
        known_pathogenic_positions=[504, 506],
        interaction_partners=["importin_alpha", "importin_beta"],
        structural_features=["basic_residue_cluster"]
    ),
    ProteinDomain(
        name="Coiled_Coil",
        start=1390,
        end=1424,
        domain_type=DomainType.STRUCTURAL,
        clinical_significance=ClinicalSignificance.MODERATE,
        description="Coiled-coil domain for protein interactions",
        function="Protein-protein interactions and complex formation",
        conservation_score=0.85,
        mutation_tolerance=0.25,
        known_pathogenic_positions=[1395, 1406, 1415],
        interaction_partners=["CtIP", "MRN_complex"],
        structural_features=["alpha_helix", "hydrophobic_core"]
    ),
    ProteinDomain(
        name="BRCT1",
        start=1650,
        end=1736,
        domain_type=DomainType.BINDING,
        clinical_significance=ClinicalSignificance.CRITICAL,
        description="BRCA1 C-terminal domain 1",
        function="Phosphoprotein binding and DNA repair signaling",
        conservation_score=0.97,
        mutation_tolerance=0.08,
        known_pathogenic_positions=[1679, 1686, 1699, 1708, 1715],
        interaction_partners=["53BP1", "BACH1", "CtIP", "phosphorylated_proteins"],
        structural_features=["beta_sheet", "alpha_helix", "phosphoserine_binding_pocket"]
    ),
    ProteinDomain(
        name="BRCT2",
        start=1760,
        end=1855,
        domain_type=DomainType.BINDING,
        clinical_significance=ClinicalSignificance.CRITICAL,
        description="BRCA1 C-terminal domain 2",
        function="Phosphoprotein binding and transcriptional regulation",
        conservation_score=0.96,
        mutation_tolerance=0.06,
        known_pathogenic_positions=[1775, 1793, 1803, 1813, 1835],
        interaction_partners=["Abraxas", "BACH1", "CtIP", "phosphorylated_proteins"],
        structural_features=["beta_sheet", "alpha_helix", "phosphoserine_binding_pocket"]
    ),
    ProteinDomain(
        name="Linker_Region",
        start=300,
        end=500,
        domain_type=DomainType.STRUCTURAL,
        clinical_significance=ClinicalSignificance.LOW,
        description="Flexible linker region",
        function="Structural flexibility and domain positioning",
        conservation_score=0.45,
        mutation_tolerance=0.70,
        known_pathogenic_positions=[435, 456],
        interaction_partners=[],
        structural_features=["random_coil", "flexible_loop"]
    )
]

# ENHANCED BRCA2 Domain Definitions
BRCA2_DOMAINS = [
    ProteinDomain(
        name="PALB2_binding",
        start=21,
        end=39,
        domain_type=DomainType.BINDING,
        clinical_significance=ClinicalSignificance.HIGH,
        description="PALB2 binding domain",
        function="PALB2 interaction for HR pathway recruitment",
        conservation_score=0.92,
        mutation_tolerance=0.15,
        known_pathogenic_positions=[26, 32, 35],
        interaction_partners=["PALB2"],
        structural_features=["alpha_helix"]
    ),
    ProteinDomain(
        name="BRC_repeats",
        start=1009,
        end=2113,
        domain_type=DomainType.BINDING,
        clinical_significance=ClinicalSignificance.CRITICAL,
        description="BRC repeats (8 repeats) for RAD51 binding",
        function="RAD51 nucleoprotein filament regulation",
        conservation_score=0.94,
        mutation_tolerance=0.12,
        known_pathogenic_positions=[1206, 1269, 1397, 1521, 1665, 1799, 1944, 2066],
        interaction_partners=["RAD51", "DMC1"],
        structural_features=["alpha_helix", "beta_turn", "conserved_motifs"]
    ),
    ProteinDomain(
        name="Helical_Domain",
        start=2481,
        end=2667,
        domain_type=DomainType.STRUCTURAL,
        clinical_significance=ClinicalSignificance.MODERATE,
        description="Helical domain with tower structure",
        function="Structural integrity and protein interactions",
        conservation_score=0.88,
        mutation_tolerance=0.30,
        known_pathogenic_positions=[2519, 2558, 2603, 2634],
        interaction_partners=["DSS1", "DNA"],
        structural_features=["alpha_helix", "tower_domain", "OB_fold"]
    ),
    ProteinDomain(
        name="OB_folds",
        start=2670,
        end=3190,
        domain_type=DomainType.BINDING,
        clinical_significance=ClinicalSignificance.CRITICAL,
        description="Three OB (oligonucleotide binding) folds",
        function="Single-strand DNA binding and stabilization",
        conservation_score=0.93,
        mutation_tolerance=0.10,
        known_pathogenic_positions=[2723, 2808, 2895, 2971, 3035, 3124],
        interaction_partners=["ssDNA", "DSS1", "RPA"],
        structural_features=["beta_barrel", "ssDNA_binding_surface", "OB_fold"]
    ),
    ProteinDomain(
        name="Nuclear_Localization_Signal",
        start=3263,
        end=3269,
        domain_type=DomainType.LOCALIZATION,
        clinical_significance=ClinicalSignificance.HIGH,
        description="Nuclear localization signal",
        function="Nuclear import and subcellular localization",
        conservation_score=0.96,
        mutation_tolerance=0.08,
        known_pathogenic_positions=[3265, 3267],
        interaction_partners=["importin_alpha"],
        structural_features=["basic_residue_cluster"]
    ),
    ProteinDomain(
        name="CTD_RAD51_binding",
        start=3270,
        end=3305,
        domain_type=DomainType.BINDING,
        clinical_significance=ClinicalSignificance.CRITICAL,
        description="C-terminal RAD51 binding domain",
        function="RAD51 interaction and HR regulation",
        conservation_score=0.97,
        mutation_tolerance=0.05,
        known_pathogenic_positions=[3273, 3283, 3295],
        interaction_partners=["RAD51"],
        structural_features=["alpha_helix", "hydrophobic_core"]
    )
]

# Enhanced BRCA1 Gene Information
BRCA1_INFO = GeneInfo(
    gene_symbol="BRCA1",
    gene_id="ENSG00000012048",
    chromosome="17",
    strand="-",
    start_position=43044295,
    end_position=43125364,
    transcript_id="ENST00000357654",
    protein_id="ENSP00000350283",
    description="BRCA1 DNA repair associated tumor suppressor",
    total_exons=24,
    coding_sequence_length=5592,  # bp
    protein_length=1863,  # amino acids
    domains=BRCA1_DOMAINS,
    hotspot_regions=[
        (1, 109, "RING_domain_hotspot"),
        (1650, 1855, "BRCT_domains_hotspot"),
        (1175, 1177, "stop_codon_cluster"),
        (5382, 5383, "common_insertion_site")
    ],
    splice_sites=[
        (43124019, "exon2_donor"),
        (43104956, "exon11_acceptor"),
        (43104867, "exon11_donor"),
        (43091435, "exon16_acceptor")
    ]
)

# Enhanced BRCA2 Gene Information  
BRCA2_INFO = GeneInfo(
    gene_symbol="BRCA2",
    gene_id="ENSG00000139618",
    chromosome="13",
    strand="+",
    start_position=32315086,
    end_position=32400266,
    transcript_id="ENST00000380152",
    protein_id="ENSP00000369497",
    description="BRCA2 DNA repair associated tumor suppressor",
    total_exons=27,
    coding_sequence_length=10257,  # bp
    protein_length=3418,  # amino acids
    domains=BRCA2_DOMAINS,
    hotspot_regions=[
        (1009, 2113, "BRC_repeats_hotspot"),
        (2670, 3190, "OB_folds_hotspot"),
        (6174, 6174, "common_deletion_site"),
        (999, 999, "stop_codon_hotspot")
    ],
    splice_sites=[
        (32326101, "exon3_donor"),
        (32344653, "exon11_acceptor"),
        (32346826, "exon11_donor"),
        (32370955, "exon23_acceptor")
    ]
)

# BRCA1 Reference Sequence (Coding sequence - simplified for demo)
BRCA1_REFERENCE = """
ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCCATCT
GGTAAGTCAGGATACAGCTGTGAGCCAGATCCCTGACCCTGATGCTGAACGAATGGCTGGACCCAAGATGGGCTCTGC
AGCAAGCTGGAGGGGAAAGGTCTTCGAACGAGGTGAGACAGCCCTTGCCCCTTACCACTGGCAGAGAAACCTTTTGGG
AGCTGTGAAACCTTAAATGAGAAGCAAGAAGTTTGAAACTGCACATCTTTCACATCTAAGTCAGTGGAGGAGGAGAAT
CAGGAGCGAGTATCCAGGTTTTTCAAACTTTGGTTGGTTTGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGG
AGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGGAGG
GGGCATCCAGCTCGGCTTTGTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGG
TTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTT
GGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGG
TTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTT
GGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTT
TTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCC
TTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTG
CCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTT
TGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGG
TTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTT
GGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGG
TTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTT
GGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTT
TTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCC
TTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTG
CCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTT
TGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGG
TTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTT
GGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGG
TTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTT
GGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTT
TTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCC
TTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTG
CCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTT
TGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGG
TTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTT
GGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGG
TTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTTGGTTGGTTTGCCTTTT
""".replace("\n", "").replace(" ", "")

# BRCA2 Reference Sequence (Coding sequence - simplified for demo)  
BRCA2_REFERENCE = """
ATGCCTATTGGATCCAAAGAGAGGCCAACATTTTTTGAAATTTTTAAGACACGCTGCGACGTTTTCCACTCAACCCCTC
ATTGGTCAAGGTTGGTTCGAAAAATGGTTATTTTTTCTCTTTCTCTTTCTCCTTATGGTTGGTTTGGTTTGGTTGGTTT
GGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTT
TGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGT
TTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGG
TTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTG
GTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTT
GGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTT
TGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGT
TTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGG
TTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTG
GTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTT
GGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTT
TGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGT
TTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGG
TTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTG
GTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTT
GGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTT
TGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGT
TTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGG
TTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTG
GTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTT
GGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTT
TGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGT
TTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGG
TTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTG
GTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTT
GGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTT
TGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGT
TTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGG
TTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTG
GTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTT
GGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTT
TGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGTTTGGT
""".replace("\n", "").replace(" ", "")