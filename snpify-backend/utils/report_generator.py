import json
import csv
import xml.etree.ElementTree as ET
from typing import Any, Dict
from datetime import datetime
from io import StringIO, BytesIO
import logging

# For PDF generation (optional)
try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib import colors
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False
    logging.warning("ReportLab not available. PDF export disabled.")

logger = logging.getLogger(__name__)

class ReportGenerator:
    """Generate analysis reports in various formats"""
    
    def __init__(self):
        self.timestamp = datetime.now()
    
    def generate_json_report(self, analysis_result: Any) -> str:
        """Generate JSON report"""
        report_data = {
            "report_info": {
                "generated_at": self.timestamp.isoformat(),
                "version": "2.1.0",
                "format": "JSON"
            },
            "analysis": {
                "id": analysis_result.id,
                "status": analysis_result.status,
                "start_time": analysis_result.start_time.isoformat() if analysis_result.start_time else None,
                "end_time": analysis_result.end_time.isoformat() if analysis_result.end_time else None,
                "processing_time": analysis_result.metadata.processing_time
            },
            "summary": {
                "total_variants": analysis_result.summary.total_variants,
                "pathogenic_variants": analysis_result.summary.pathogenic_variants,
                "likely_pathogenic_variants": analysis_result.summary.likely_pathogenic_variants,
                "uncertain_variants": analysis_result.summary.uncertain_variants,
                "benign_variants": analysis_result.summary.benign_variants,
                "overall_risk": analysis_result.summary.overall_risk,
                "risk_score": analysis_result.summary.risk_score,
                "recommendations": analysis_result.summary.recommendations
            },
            "variants": [
                {
                    "id": variant.id,
                    "position": variant.position,
                    "chromosome": variant.chromosome,
                    "gene": variant.gene,
                    "reference_allele": variant.ref_allele,
                    "alternative_allele": variant.alt_allele,
                    "rs_id": variant.rs_id,
                    "mutation": variant.mutation,
                    "consequence": variant.consequence,
                    "impact": variant.impact,
                    "clinical_significance": variant.clinical_significance,
                    "confidence": variant.confidence,
                    "frequency": variant.frequency,
                    "sources": variant.sources
                }
                for variant in analysis_result.variants
            ],
            "metadata": {
                "input_type": analysis_result.metadata.input_type,
                "file_name": analysis_result.metadata.file_name,
                "algorithm_version": analysis_result.metadata.algorithm_version,
                "quality_score": analysis_result.metadata.quality_score,
                "coverage": analysis_result.metadata.coverage
            }
        }
        
        return json.dumps(report_data, indent=2, ensure_ascii=False)
    
    def generate_csv_report(self, analysis_result: Any) -> str:
        """Generate CSV report"""
        output = StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            'Variant_ID', 'Position', 'Chromosome', 'Gene', 'Reference_Allele',
            'Alternative_Allele', 'RS_ID', 'Mutation', 'Consequence', 'Impact',
            'Clinical_Significance', 'Confidence', 'Frequency', 'Sources'
        ])
        
        # Write variant data
        for variant in analysis_result.variants:
            writer.writerow([
                variant.id,
                variant.position,
                variant.chromosome,
                variant.gene,
                variant.ref_allele,
                variant.alt_allele,
                variant.rs_id or '',
                variant.mutation,
                variant.consequence,
                variant.impact,
                variant.clinical_significance,
                variant.confidence,
                variant.frequency or '',
                ';'.join(variant.sources)
            ])
        
        return output.getvalue()
    
    def generate_xml_report(self, analysis_result: Any) -> str:
        """Generate XML report"""
        root = ET.Element("snp_analysis")
        root.set("id", analysis_result.id)
        root.set("generated_at", self.timestamp.isoformat())
        
        # Analysis info
        analysis_info = ET.SubElement(root, "analysis_info")
        ET.SubElement(analysis_info, "status").text = analysis_result.status
        ET.SubElement(analysis_info, "processing_time").text = str(analysis_result.metadata.processing_time)
        ET.SubElement(analysis_info, "quality_score").text = str(analysis_result.metadata.quality_score)
        
        # Summary
        summary = ET.SubElement(root, "summary")
        ET.SubElement(summary, "total_variants").text = str(analysis_result.summary.total_variants)
        ET.SubElement(summary, "pathogenic_variants").text = str(analysis_result.summary.pathogenic_variants)
        ET.SubElement(summary, "overall_risk").text = analysis_result.summary.overall_risk
        ET.SubElement(summary, "risk_score").text = str(analysis_result.summary.risk_score)
        
        # Variants
        variants_elem = ET.SubElement(root, "variants")
        for variant in analysis_result.variants:
            variant_elem = ET.SubElement(variants_elem, "variant")
            variant_elem.set("id", variant.id)
            
            ET.SubElement(variant_elem, "position").text = str(variant.position)
            ET.SubElement(variant_elem, "chromosome").text = variant.chromosome
            ET.SubElement(variant_elem, "gene").text = variant.gene
            ET.SubElement(variant_elem, "reference_allele").text = variant.ref_allele
            ET.SubElement(variant_elem, "alternative_allele").text = variant.alt_allele
            ET.SubElement(variant_elem, "clinical_significance").text = variant.clinical_significance
            ET.SubElement(variant_elem, "confidence").text = str(variant.confidence)
        
        return ET.tostring(root, encoding='unicode')
    
    def generate_pdf_report(self, analysis_result: Any) -> bytes:
        """Generate PDF report"""
        if not PDF_AVAILABLE:
            raise RuntimeError("PDF generation not available. Install reportlab package.")
        
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.darkblue,
            spaceAfter=30
        )
        story.append(Paragraph("SNPify Analysis Report", title_style))
        story.append(Spacer(1, 12))
        
        # Analysis Information
        story.append(Paragraph("Analysis Information", styles['Heading2']))
        info_data = [
            ['Analysis ID:', analysis_result.id],
            ['Status:', analysis_result.status],
            ['Processing Time:', f"{analysis_result.metadata.processing_time:.2f} seconds"],
            ['Quality Score:', f"{analysis_result.metadata.quality_score:.1f}%"],
            ['Generated:', self.timestamp.strftime("%Y-%m-%d %H:%M:%S")]
        ]
        
        info_table = Table(info_data, colWidths=[2*inch, 3*inch])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(info_table)
        story.append(Spacer(1, 12))
        
        # Summary
        story.append(Paragraph("Analysis Summary", styles['Heading2']))
        summary_data = [
            ['Metric', 'Value'],
            ['Total Variants', str(analysis_result.summary.total_variants)],
            ['Pathogenic Variants', str(analysis_result.summary.pathogenic_variants)],
            ['Likely Pathogenic', str(analysis_result.summary.likely_pathogenic_variants)],
            ['Uncertain Significance', str(analysis_result.summary.uncertain_variants)],
            ['Benign Variants', str(analysis_result.summary.benign_variants)],
            ['Overall Risk', analysis_result.summary.overall_risk],
            ['Risk Score', f"{analysis_result.summary.risk_score:.1f}/10.0"]
        ]
        
        summary_table = Table(summary_data, colWidths=[2.5*inch, 2*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(summary_table)
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer.read()