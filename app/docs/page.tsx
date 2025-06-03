'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { gsap } from 'gsap'

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [language, setLanguage] = useState<'en' | 'id'>('en')
  const [isTransitioning, setIsTransitioning] = useState(false)

  // GSAP refs
  const headerRef = useRef(null)
  const sidebarRef = useRef(null)
  const contentRef = useRef(null)
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)

  // Listen to language changes from parent
  useEffect(() => {
    const handleLanguageChange = (e: CustomEvent) => {
      setLanguage(e.detail)
    }
    
    window.addEventListener('languageChanged', handleLanguageChange as EventListener)
    return () => window.removeEventListener('languageChanged', handleLanguageChange as EventListener)
  }, [])

  // GSAP Animations
  useEffect(() => {
    const tl = gsap.timeline()
    
    // Initial page load animations
    tl.fromTo(titleRef.current, 
      { opacity: 0, y: -50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" }
    )
    .fromTo(descriptionRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    )
    .fromTo(sidebarRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(contentRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    )
  }, [])

  const handleSectionChange = (sectionId: string) => {
    if (sectionId === activeSection) return
    
    setIsTransitioning(true)
    
    // GSAP animation for content transition
    const tl = gsap.timeline()
    
    tl.to(contentRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.2,
      ease: "power2.in"
    })
    .call(() => {
      setActiveSection(sectionId)
    })
    .to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    })
    .call(() => {
      setIsTransitioning(false)
    })
    
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    
    // Remove focus from all buttons to prevent lingering states
    const activeElement = document.activeElement as HTMLElement
    activeElement?.blur()
  }

  const text = {
    en: {
      pageTitle: 'SNPify Documentation',
      pageDescription: 'Complete guide to using the leading SNP analysis platform',
      tableOfContents: 'Table of Contents',
      overview: {
        title: 'Overview',
        heading: 'SNPify Platform Overview',
        description: 'SNPify is an advanced genetic analysis platform specifically designed to analyze Single Nucleotide Polymorphisms (SNPs) in BRCA1 and BRCA2 genes. This platform uses cutting-edge bioinformatics algorithms to provide accurate insights into genetic variants and their clinical significance.',
        purposeTitle: '🎯 Platform Purpose',
        purposes: [
          '• Accurate and fast BRCA1/BRCA2 genetic variant analysis',
          '• Clinical significance interpretation with international standards',
          '• Data visualization that is easy for clinicians to understand',
          '• Report export in various standard formats'
        ]
      },
      gettingStarted: {
        title: 'Getting Started',
        heading: 'Starting Analysis',
        dataPrep: {
          title: '1. Data Preparation',
          description: 'Make sure you have DNA sequence files in supported formats:',
          formats: [
            '• VCF (Variant Call Format) - For processed variant data',
            '• FASTA - For raw DNA sequences',
            '• FASTQ - For data with quality scores',
            '• TXT - For DNA sequences in text format'
          ]
        },
        inputMethod: {
          title: '2. File Upload or Manual Input',
          description: 'Choose one of the input methods:',
          fileUpload: {
            title: 'File Upload',
            desc: 'Drag & drop or browse files from your computer'
          },
          manualInput: {
            title: 'Manual Input',
            desc: 'Paste DNA sequence directly into text area'
          }
        },
        monitoring: {
          title: '3. Monitoring Progress',
          description: 'System will display real-time progress of 6 analysis stages: File Processing → Sequence Alignment → Variant Detection → Clinical Annotation → Quality Assessment → Report Generation'
        }
      },
      fileFormats: {
        title: 'File Formats',
        heading: 'Supported File Formats',
        fasta: {
          title: 'FASTA Format',
          description: 'Standard format for biological sequences'
        },
        vcf: {
          title: 'VCF Format',
          description: 'Standard format for genetic variants'
        },
        fastq: {
          title: 'FASTQ Format',
          description: 'Format with quality scores'
        },
        text: {
          title: 'Text Format',
          description: 'Plain text for simple sequences'
        }
      },
      algorithms: {
        title: 'Algorithms',
        heading: 'Analysis Algorithms',
        description: 'SNPify uses a combination of cutting-edge bioinformatics algorithms to ensure analysis accuracy and speed.',
        sequenceAlignment: {
          title: '1. Sequence Alignment',
          boyerMoore: {
            title: 'Boyer-Moore Algorithm',
            description: 'Efficient string search algorithm with O(n/m) time complexity in best case. Very effective for finding patterns in long DNA sequences.'
          },
          kmp: {
            title: 'Knuth-Morris-Pratt (KMP)',
            description: 'Algorithm with O(n+m) complexity optimal for exact match search with preprocessing.'
          }
        },
        variantDetection: {
          title: '2. Variant Detection',
          description: 'Using machine learning algorithms to identify and classify variants:',
          techniques: [
            '• Hidden Markov Models for structural variant detection',
            '• Support Vector Machine for clinical significance classification',
            '• Random Forest for functional impact prediction'
          ]
        },
        clinicalAnnotation: {
          title: '3. Clinical Annotation',
          description: 'Integration with international clinical databases:',
          databases: {
            clinvar: 'Database of variants with clinical significance',
            dbsnp: 'Single nucleotide polymorphism database',
            cosmic: 'Catalogue of somatic mutations in cancer',
            hgmd: 'Human Gene Mutation Database'
          }
        }
      },
      interpretation: {
        title: 'Result Interpretation',
        heading: 'Analysis Result Interpretation',
        clinicalClassification: {
          title: 'Clinical Significance Classification',
          pathogenic: {
            title: 'Pathogenic',
            description: 'Variants proven to cause disease'
          },
          likelyPathogenic: {
            title: 'Likely Pathogenic',
            description: 'Variants likely to cause disease'
          },
          uncertain: {
            title: 'Uncertain Significance',
            description: 'Clinical significance cannot be determined'
          },
          benign: {
            title: 'Benign',
            description: 'Benign variants that do not cause disease'
          }
        },
        riskAssessment: {
          title: 'Risk Assessment',
          description: 'Overall risk assessment based on combination of all detected variants:',
          high: {
            level: 'HIGH',
            desc: 'High Risk',
            score: 'Score: 7.0-10.0'
          },
          moderate: {
            level: 'MODERATE',
            desc: 'Moderate Risk',
            score: 'Score: 4.0-6.9'
          },
          low: {
            level: 'LOW',
            desc: 'Low Risk',
            score: 'Score: 0.0-3.9'
          }
        }
      },
      apiReference: {
        title: 'API Reference',
        heading: 'API Documentation',
        description: 'SNPify provides RESTful API for integration with external systems.',
        authentication: {
          title: 'Authentication',
          description: 'Use API key for authentication:'
        },
        submitAnalysis: {
          title: 'Submit Analysis',
          description: 'Submit DNA sequence for analysis'
        },
        getResult: {
          title: 'Get Analysis Result',
          description: 'Retrieve analysis results by ID'
        }
      }
    },
    id: {
      pageTitle: 'Dokumentasi SNPify',
      pageDescription: 'Panduan lengkap untuk menggunakan platform analisis SNP terdepan',
      tableOfContents: 'Daftar Isi',
      overview: {
        title: 'Ikhtisar',
        heading: 'Ikhtisar Platform SNPify',
        description: 'SNPify adalah platform analisis genetik canggih yang dirancang khusus untuk menganalisis Single Nucleotide Polymorphisms (SNP) pada gen BRCA1 dan BRCA2. Platform ini menggunakan algoritma bioinformatika terdepan untuk memberikan insight yang akurat tentang varian genetik dan signifikansi klinisnya.',
        purposeTitle: '🎯 Tujuan Platform',
        purposes: [
          '• Analisis varian genetik BRCA1/BRCA2 yang akurat dan cepat',
          '• Interpretasi signifikansi klinis dengan standar internasional',
          '• Visualisasi data yang mudah dipahami oleh klinisi',
          '• Ekspor laporan dalam berbagai format standar'
        ]
      },
      gettingStarted: {
        title: 'Memulai',
        heading: 'Memulai Analisis',
        dataPrep: {
          title: '1. Persiapan Data',
          description: 'Pastikan Anda memiliki file sekuens DNA dalam format yang didukung:',
          formats: [
            '• VCF (Variant Call Format) - Untuk data varian yang sudah diproses',
            '• FASTA - Untuk sekuens DNA mentah',
            '• FASTQ - Untuk data dengan quality scores',
            '• TXT - Untuk sekuens DNA dalam format teks'
          ]
        },
        inputMethod: {
          title: '2. Upload File atau Input Manual',
          description: 'Pilih salah satu metode input:',
          fileUpload: {
            title: 'File Upload',
            desc: 'Drag & drop atau browse file dari komputer Anda'
          },
          manualInput: {
            title: 'Input Manual',
            desc: 'Paste sekuens DNA langsung ke text area'
          }
        },
        monitoring: {
          title: '3. Monitoring Progress',
          description: 'Sistem akan menampilkan progress real-time dari 6 tahap analisis: File Processing → Sequence Alignment → Variant Detection → Clinical Annotation → Quality Assessment → Report Generation'
        }
      },
      fileFormats: {
        title: 'Format File',
        heading: 'Format File yang Didukung',
        fasta: {
          title: 'Format FASTA',
          description: 'Format standar untuk sekuens biologis'
        },
        vcf: {
          title: 'Format VCF',
          description: 'Format standar untuk varian genetik'
        },
        fastq: {
          title: 'Format FASTQ',
          description: 'Format dengan quality scores'
        },
        text: {
          title: 'Format Teks',
          description: 'Plain text untuk sekuens sederhana'
        }
      },
      algorithms: {
        title: 'Algoritma',
        heading: 'Algoritma Analisis',
        description: 'SNPify menggunakan kombinasi algoritma bioinformatika terdepan untuk memastikan akurasi dan kecepatan analisis.',
        sequenceAlignment: {
          title: '1. Sequence Alignment',
          boyerMoore: {
            title: 'Algoritma Boyer-Moore',
            description: 'Algoritma pencarian string yang efisien dengan kompleksitas waktu O(n/m) dalam kasus terbaik. Sangat efektif untuk mencari pola dalam sekuens DNA yang panjang.'
          },
          kmp: {
            title: 'Knuth-Morris-Pratt (KMP)',
            description: 'Algoritma dengan kompleksitas O(n+m) yang optimal untuk pencarian exact match dengan preprocessing.'
          }
        },
        variantDetection: {
          title: '2. Variant Detection',
          description: 'Menggunakan algoritma machine learning untuk mengidentifikasi dan mengklasifikasikan varian:',
          techniques: [
            '• Hidden Markov Models untuk deteksi varian struktural',
            '• Support Vector Machine untuk klasifikasi signifikansi klinis',
            '• Random Forest untuk prediksi dampak fungsional'
          ]
        },
        clinicalAnnotation: {
          title: '3. Clinical Annotation',
          description: 'Integrasi dengan database klinis internasional:',
          databases: {
            clinvar: 'Database varian dengan signifikansi klinis',
            dbsnp: 'Database polimorfisme nukleotida tunggal',
            cosmic: 'Catalogue of somatic mutations in cancer',
            hgmd: 'Human Gene Mutation Database'
          }
        }
      },
      interpretation: {
        title: 'Interpretasi Hasil',
        heading: 'Interpretasi Hasil Analisis',
        clinicalClassification: {
          title: 'Klasifikasi Signifikansi Klinis',
          pathogenic: {
            title: 'Pathogenic',
            description: 'Varian yang terbukti menyebabkan penyakit'
          },
          likelyPathogenic: {
            title: 'Likely Pathogenic',
            description: 'Kemungkinan besar menyebabkan penyakit'
          },
          uncertain: {
            title: 'Uncertain Significance',
            description: 'Signifikansi klinis belum dapat ditentukan'
          },
          benign: {
            title: 'Benign',
            description: 'Varian jinak yang tidak menyebabkan penyakit'
          }
        },
        riskAssessment: {
          title: 'Risk Assessment',
          description: 'Penilaian risiko keseluruhan berdasarkan kombinasi semua varian yang ditemukan:',
          high: {
            level: 'HIGH',
            desc: 'Risiko Tinggi',
            score: 'Skor: 7.0-10.0'
          },
          moderate: {
            level: 'MODERATE',
            desc: 'Risiko Sedang',
            score: 'Skor: 4.0-6.9'
          },
          low: {
            level: 'LOW',
            desc: 'Risiko Rendah',
            score: 'Skor: 0.0-3.9'
          }
        }
      },
      apiReference: {
        title: 'Referensi API',
        heading: 'Dokumentasi API',
        description: 'SNPify menyediakan RESTful API untuk integrasi dengan sistem eksternal.',
        authentication: {
          title: 'Authentication',
          description: 'Gunakan API key untuk autentikasi:'
        },
        submitAnalysis: {
          title: 'Submit Analysis',
          description: 'Submit DNA sequence untuk analisis'
        },
        getResult: {
          title: 'Get Analysis Result',
          description: 'Ambil hasil analisis berdasarkan ID'
        }
      }
    }
  }

  const sections = [
    {
      id: 'overview',
      title: text[language].overview.title,
      icon: '📖',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">{text[language].overview.heading}</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              {text[language].overview.description}
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-blue-300 mb-2">{text[language].overview.purposeTitle}</h3>
              <ul className="space-y-1 text-sm text-blue-200">
                {text[language].overview.purposes.map((purpose, index) => (
                  <li key={index}>{purpose}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'getting-started',
      title: text[language].gettingStarted.title,
      icon: '🚀',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">{text[language].gettingStarted.heading}</h2>
            <div className="space-y-4">
              <div className="border border-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">{text[language].gettingStarted.dataPrep.title}</h3>
                <p className="text-gray-300 text-sm mb-3">
                  {text[language].gettingStarted.dataPrep.description}
                </p>
                <ul className="space-y-1 text-sm text-gray-400">
                  {text[language].gettingStarted.dataPrep.formats.map((format, index) => (
                    <li key={index}>{format}</li>
                  ))}
                </ul>
              </div>
              
              <div className="border border-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">{text[language].gettingStarted.inputMethod.title}</h3>
                <p className="text-gray-300 text-sm mb-3">
                  {text[language].gettingStarted.inputMethod.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-800/30 p-3 rounded">
                    <strong className="text-white">{text[language].gettingStarted.inputMethod.fileUpload.title}</strong>
                    <p className="text-gray-400">{text[language].gettingStarted.inputMethod.fileUpload.desc}</p>
                  </div>
                  <div className="bg-gray-800/30 p-3 rounded">
                    <strong className="text-white">{text[language].gettingStarted.inputMethod.manualInput.title}</strong>
                    <p className="text-gray-400">{text[language].gettingStarted.inputMethod.manualInput.desc}</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">{text[language].gettingStarted.monitoring.title}</h3>
                <p className="text-gray-300 text-sm">
                  {text[language].gettingStarted.monitoring.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'file-formats',
      title: text[language].fileFormats.title,
      icon: '📄',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">{text[language].fileFormats.heading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🧬</span>
                    {text[language].fileFormats.fasta.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">{text[language].fileFormats.fasta.description}</p>
                  <div className="bg-gray-900/50 p-3 rounded font-mono text-xs">
                    {`>BRCA1_sequence
ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAA
AATGTCATTAATGCTATGCAGAAAATCTTAGAGTGT
CCCATCTGGTAAGTCAGGATACAG...`}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    {text[language].fileFormats.vcf.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">{text[language].fileFormats.vcf.description}</p>
                  <div className="bg-gray-900/50 p-3 rounded font-mono text-xs">
                    {`#CHROM	POS	ID	REF	ALT	QUAL
17	43044295	rs80357914	A	G	99
13	32315086	rs28897696	C	T	95`}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    {text[language].fileFormats.fastq.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">{text[language].fileFormats.fastq.description}</p>
                  <div className="bg-gray-900/50 p-3 rounded font-mono text-xs">
                    {`@BRCA1_read_1
ATGGATTTATCTGCTCTTCGCGTT
+
IIIIIIIIIIIIIIIIIIIIIIII`}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    {text[language].fileFormats.text.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">{text[language].fileFormats.text.description}</p>
                  <div className="bg-gray-900/50 p-3 rounded font-mono text-xs">
                    ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAA
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'algorithms',
      title: text[language].algorithms.title,
      icon: '⚙️',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">{text[language].algorithms.heading}</h2>
            <p className="text-gray-300 mb-6">
              {text[language].algorithms.description}
            </p>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-cyan-400">{text[language].algorithms.sequenceAlignment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-white mb-2">{text[language].algorithms.sequenceAlignment.boyerMoore.title}</h4>
                      <p className="text-sm text-gray-400">
                        {text[language].algorithms.sequenceAlignment.boyerMoore.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">{text[language].algorithms.sequenceAlignment.kmp.title}</h4>
                      <p className="text-sm text-gray-400">
                        {text[language].algorithms.sequenceAlignment.kmp.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-cyan-400">{text[language].algorithms.variantDetection.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400">
                      {text[language].algorithms.variantDetection.description}
                    </p>
                    <ul className="space-y-1 text-sm text-gray-400">
                      {text[language].algorithms.variantDetection.techniques.map((technique, index) => (
                        <li key={index}>{technique}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-cyan-400">{text[language].algorithms.clinicalAnnotation.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400 mb-2">
                      {text[language].algorithms.clinicalAnnotation.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-gray-800/30 p-3 rounded">
                        <strong className="text-white">ClinVar</strong>
                        <p className="text-xs text-gray-400">{text[language].algorithms.clinicalAnnotation.databases.clinvar}</p>
                      </div>
                      <div className="bg-gray-800/30 p-3 rounded">
                        <strong className="text-white">dbSNP</strong>
                        <p className="text-xs text-gray-400">{text[language].algorithms.clinicalAnnotation.databases.dbsnp}</p>
                      </div>
                      <div className="bg-gray-800/30 p-3 rounded">
                        <strong className="text-white">COSMIC</strong>
                        <p className="text-xs text-gray-400">{text[language].algorithms.clinicalAnnotation.databases.cosmic}</p>
                      </div>
                      <div className="bg-gray-800/30 p-3 rounded">
                        <strong className="text-white">HGMD</strong>
                        <p className="text-xs text-gray-400">{text[language].algorithms.clinicalAnnotation.databases.hgmd}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'interpretation',
      title: text[language].interpretation.title,
      icon: '📊',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">{text[language].interpretation.heading}</h2>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-cyan-400">{text[language].interpretation.clinicalClassification.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-red-500/10 border border-red-500/30 rounded">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <div>
                        <strong className="text-red-300">{text[language].interpretation.clinicalClassification.pathogenic.title}</strong>
                        <p className="text-sm text-gray-400">{text[language].interpretation.clinicalClassification.pathogenic.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <div>
                        <strong className="text-orange-300">{text[language].interpretation.clinicalClassification.likelyPathogenic.title}</strong>
                        <p className="text-sm text-gray-400">{text[language].interpretation.clinicalClassification.likelyPathogenic.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <div>
                        <strong className="text-yellow-300">{text[language].interpretation.clinicalClassification.uncertain.title}</strong>
                        <p className="text-sm text-gray-400">{text[language].interpretation.clinicalClassification.uncertain.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                      <div>
                        <strong className="text-emerald-300">{text[language].interpretation.clinicalClassification.benign.title}</strong>
                        <p className="text-sm text-gray-400">{text[language].interpretation.clinicalClassification.benign.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-cyan-400">{text[language].interpretation.riskAssessment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400 mb-3">
                      {text[language].interpretation.riskAssessment.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="text-center p-4 bg-red-500/10 border border-red-500/30 rounded">
                        <div className="text-2xl font-bold text-red-400">{text[language].interpretation.riskAssessment.high.level}</div>
                        <div className="text-sm text-red-300">{text[language].interpretation.riskAssessment.high.desc}</div>
                        <div className="text-xs text-gray-400 mt-1">{text[language].interpretation.riskAssessment.high.score}</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded">
                        <div className="text-2xl font-bold text-yellow-400">{text[language].interpretation.riskAssessment.moderate.level}</div>
                        <div className="text-sm text-yellow-300">{text[language].interpretation.riskAssessment.moderate.desc}</div>
                        <div className="text-xs text-gray-400 mt-1">{text[language].interpretation.riskAssessment.moderate.score}</div>
                      </div>
                      <div className="text-center p-4 bg-emerald-500/10 border border-emerald-500/30 rounded">
                        <div className="text-2xl font-bold text-emerald-400">{text[language].interpretation.riskAssessment.low.level}</div>
                        <div className="text-sm text-emerald-300">{text[language].interpretation.riskAssessment.low.desc}</div>
                        <div className="text-xs text-gray-400 mt-1">{text[language].interpretation.riskAssessment.low.score}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'api-reference',
      title: text[language].apiReference.title,
      icon: '🔌',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">{text[language].apiReference.heading}</h2>
            <p className="text-gray-300 mb-6">
              {text[language].apiReference.description}
            </p>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-cyan-400">{text[language].apiReference.authentication.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">{text[language].apiReference.authentication.description}</p>
                  <div className="bg-gray-900/50 p-3 rounded font-mono text-xs">
                    <span className="text-blue-400">Authorization:</span> Bearer YOUR_API_KEY
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-cyan-400">{text[language].apiReference.submitAnalysis.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-gray-900/50 p-3 rounded font-mono text-xs">
                      <span className="text-green-400">POST</span> /api/v1/analysis
                    </div>
                    <p className="text-sm text-gray-400">{text[language].apiReference.submitAnalysis.description}</p>
                    <div className="bg-gray-900/50 p-3 rounded font-mono text-xs">
{`{
  "sequence": "ATGGATTTATCTGCTCTTCGCGTT...",
  "type": "FASTA",
  "gene": "BRCA1",
  "metadata": {
    "patient_id": "P001",
    "sample_id": "S001"
  }
}`}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-cyan-400">{text[language].apiReference.getResult.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-gray-900/50 p-3 rounded font-mono text-xs">
                      <span className="text-blue-400">GET</span> /api/v1/analysis/{`{id}`}
                    </div>
                    <p className="text-sm text-gray-400">{text[language].apiReference.getResult.description}</p>
                    <div className="bg-gray-900/50 p-3 rounded font-mono text-xs">
{`{
  "id": "SNP_12345",
  "status": "COMPLETED",
  "summary": {
    "total_variants": 5,
    "pathogenic_variants": 1,
    "overall_risk": "MODERATE"
  },
  "variants": [...]
}`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 ref={titleRef} className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                {text[language].pageTitle}
              </span>
            </h1>
            <p ref={descriptionRef} className="text-xl text-gray-400 max-w-3xl mx-auto">
              {text[language].pageDescription}
            </p>
          </div>

          {/* Documentation Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div ref={sidebarRef} className="lg:sticky lg:top-32">
                <Card className="backdrop-blur-sm bg-gray-900/60 border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">{text[language].tableOfContents}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-2">
                      {sections.map((section) => (
                        <button
                          key={section.id}
                          type="button"
                          onClick={() => handleSectionChange(section.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center space-x-3 border focus:outline-none focus:ring-0 ${
                            activeSection === section.id
                              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                              : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 border-transparent hover:border-transparent focus:border-transparent'
                          }`}
                        >
                          <span className={`text-lg transition-transform duration-300 ${
                            activeSection === section.id ? 'scale-110' : ''
                          }`}>
                            {section.icon}
                          </span>
                          <span className="text-sm font-medium">{section.title}</span>
                          {activeSection === section.id && (
                            <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                          )}
                        </button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card ref={contentRef} className="backdrop-blur-sm bg-gray-900/60 border-gray-700/50 shadow-2xl">
                <CardContent className="p-8">
                  <div className={`prose prose-invert max-w-none transition-all duration-300 ${
                    isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                  }`}>
                    {sections.find(s => s.id === activeSection)?.content}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 