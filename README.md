# SNPify 🧬

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/snpify/snpify)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0+-black.svg)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SNPify** adalah aplikasi web canggih untuk analisis Single Nucleotide Polymorphism (SNP) dengan fokus khusus pada gen BRCA1 dan BRCA2. Platform ini menyediakan tools komprehensif untuk deteksi, visualisasi, dan analisis varian genetik yang berkaitan dengan predisposisi kanker payudara dan ovarium.

## ✨ Fitur Utama

### 🔬 Analisis Genetik Mendalam
- **String Matching Algorithms**: Implementasi algoritma Boyer-Moore, KMP, dan Rabin-Karp
- **SNP Detection**: Deteksi otomatis varian genetik dengan tingkat akurasi tinggi
- **Sequence Alignment**: Alignment sekuens DNA dengan referensi BRCA1/BRCA2

### 📊 Visualisasi Interaktif
- **SNP Visualization**: Grafik interaktif untuk memvisualisasikan distribusi SNP
- **Comparative Analysis**: Perbandingan sekuens dengan database referensi
- **Statistical Summary**: Ringkasan statistik komprehensif hasil analisis

### 💾 Manajemen Data
- **FASTA File Support**: Upload dan parsing file FASTA
- **Export Functionality**: Export hasil analisis dalam berbagai format
- **Real-time Progress**: Monitoring progress analisis secara real-time

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 atau lebih tinggi
- NPM atau Yarn package manager

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/snpify/snpify.git
   cd snpify
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Setup environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local dengan konfigurasi yang sesuai
   ```

4. **Run development server**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. **Buka browser**
   ```
   http://localhost:3000
   ```

## 📁 Struktur Proyek

```
snpify/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   ├── api/               # API routes
│   │   └── analyze/       # Analysis endpoints
│   └── analysis/          # Analysis pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── FileUpload.tsx    # File upload component
│   ├── SequenceInput.tsx # Sequence input form
│   ├── SNPVisualization.tsx # SNP charts
│   └── ...
├── lib/                  # Core libraries
│   ├── algorithms/       # Genetic algorithms
│   ├── data/            # Reference data
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript types
├── public/              # Static assets
│   └── references/      # FASTA reference files
└── tests/               # Test suites
```

## 🧬 Algoritma yang Diimplementasikan

### String Matching
- **Boyer-Moore**: Efisien untuk pencarian pattern panjang
- **Knuth-Morris-Pratt (KMP)**: Optimal untuk pattern dengan repetisi
- **Rabin-Karp**: Menggunakan rolling hash untuk pencarian cepat

### SNP Detection
- **Mismatch Detection**: Identifikasi perbedaan nukleotida
- **Quality Scoring**: Penilaian kualitas varian yang ditemukan
- **Frequency Analysis**: Analisis frekuensi allele

### Sequence Alignment
- **Local Alignment**: Smith-Waterman algorithm
- **Global Alignment**: Needleman-Wunsch algorithm
- **Multiple Sequence Alignment**: Progressive alignment

## 🎯 Use Cases

1. **Penelitian Kanker**: Analisis varian BRCA1/BRCA2 untuk penelitian kanker herediter
2. **Konseling Genetik**: Membantu konselor genetik dalam interpretasi hasil
3. **Edukasi**: Platform pembelajaran untuk mahasiswa bioinformatika
4. **Screening**: Tools untuk screening awal risiko genetik

## 🔧 API Documentation

### Analysis Endpoint
```typescript
POST /api/analyze
Content-Type: application/json

{
  "sequence": "ATCGATCGATCG...",
  "referenceGene": "BRCA1" | "BRCA2",
  "algorithm": "boyer-moore" | "kmp" | "rabin-karp"
}
```

### Response Format
```typescript
{
  "status": "success",
  "data": {
    "snps": Array<SNPResult>,
    "statistics": AnalysisStatistics,
    "alignment": AlignmentResult
  }
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Tim Pengembang

● 18222017 Dzulfaqor Ali Dipanegara 
● 18222039 Billy Samuel Setiawan 
● 18222079 Alvin Fadhilah Akmal 

## 🔗 Links

- [Documentation](https://docs.snpify.com)
- [Issues](https://github.com/snpify/snpify/issues)
- [Discussions](https://github.com/snpify/snpify/discussions)

---

**SNPify** - Advancing Genetic Analysis Through Technology 🧬✨

