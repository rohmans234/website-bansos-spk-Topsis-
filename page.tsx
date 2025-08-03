
'use client';

import { useState } from 'react';
import CriteriaInput from '../components/CriteriaInput';
import CandidateInput from '../components/CandidateInput';
import TopsisCalculator from '../components/TopsisCalculator';

interface Criterion {
  id: string;
  name: string;
  weight: number;
  type: 'benefit' | 'cost';
}

interface Candidate {
  id: string;
  name: string;
  values: { [criterionId: string]: number };
}

export default function Home() {
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: '1', name: 'Penghasilan Bulanan', weight: 0.3, type: 'cost' },
    { id: '2', name: 'Jumlah Keluarga', weight: 0.25, type: 'benefit' },
    { id: '3', name: 'Kondisi Rumah', weight: 0.2, type: 'cost' },
    { id: '4', name: 'Status Kesehatan', weight: 0.15, type: 'cost' },
    { id: '5', name: 'Tingkat Pendidikan', weight: 0.1, type: 'cost' }
  ]);

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'Sari Dewi',
      values: { '1': 1200000, '2': 5, '3': 2, '4': 3, '5': 2 }
    },
    {
      id: '2', 
      name: 'Ahmad Rizki',
      values: { '1': 800000, '2': 4, '3': 1, '4': 2, '5': 1 }
    },
    {
      id: '3',
      name: 'Ningsih Wati',
      values: { '1': 1500000, '2': 3, '3': 3, '4': 1, '5': 3 }
    },
    {
      id: '4',
      name: 'Budi Santoso',
      values: { '1': 600000, '2': 6, '3': 1, '4': 4, '5': 1 }
    },
    {
      id: '5',
      name: 'Maya Sari',
      values: { '1': 900000, '2': 4, '3': 2, '4': 2, '5': 2 }
    }
  ]);

  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    setShowResults(true);
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  const canCalculate = criteria.length > 0 && candidates.length > 0 && 
    candidates.every(candidate => 
      criteria.every(criterion => candidate.values[criterion.id] !== undefined)
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <span className="font-[\'Pacifico\'] text-blue-600">Desa Siman</span> Sistem Seleksi Bantuan Sosial
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sistem pendukung keputusan interaktif berbasis TOPSIS untuk memilih penerima bantuan sosial (Bansos) 
              di Desa Siman menggunakan analisis multi-kriteria
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* System Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">
          <div className="flex items-start gap-4">
            <i className="ri-information-line w-6 h-6 flex items-center justify-center text-blue-600 mt-1"></i>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Cara Kerja Metode TOPSIS</h3>
              <p className="text-gray-600 text-sm mb-3">
                TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) mengevaluasi kandidat dengan 
                mengukur jarak mereka dari solusi ideal terbaik dan terburuk di berbagai kriteria.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-green-700">Kriteria Benefit:</span> Nilai lebih tinggi lebih baik (misal: Jumlah Keluarga)
                </div>
                <div>
                  <span className="font-medium text-red-700">Kriteria Cost:</span> Nilai lebih rendah lebih baik (misal: Tingkat Penghasilan)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Criteria Input */}
        <CriteriaInput criteria={criteria} onCriteriaChange={setCriteria} />

        {/* Weight Validation */}
        {criteria.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Bobot:</span>
              <span className={`${Math.abs(totalWeight - 1) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                {totalWeight.toFixed(2)} {Math.abs(totalWeight - 1) < 0.01 ? '✓' : '(Harus 1.0)'}
              </span>
            </div>
            {Math.abs(totalWeight - 1) >= 0.01 && (
              <p className="text-xs text-red-600 mt-1">
                Silakan sesuaikan bobot agar jumlahnya menjadi 1.0 untuk kalkulasi TOPSIS yang akurat
              </p>
            )}
          </div>
        )}

        {/* Candidate Input */}
        <CandidateInput 
          candidates={candidates} 
          criteria={criteria} 
          onCandidatesChange={setCandidates} 
        />

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            disabled={!canCalculate || Math.abs(totalWeight - 1) >= 0.01}
            className={`px-8 py-4 rounded-lg font-bold whitespace-nowrap cursor-pointer text-lg flex items-center gap-3 mx-auto ${canCalculate && Math.abs(totalWeight - 1) < 0.01 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg transform hover:scale-105' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition-all duration-200`}
          >
            <i className="ri-calculator-line w-6 h-6 flex items-center justify-center"></i>
            Hitung Peringkat TOPSIS
          </button>
          {!canCalculate && (
            <p className="text-sm text-red-600 mt-2">
              Pastikan semua kandidat memiliki nilai untuk semua kriteria
            </p>
          )}
        </div>

        {/* Results */}
        {showResults && (
          <div id="results-section">
            <TopsisCalculator candidates={candidates} criteria={criteria} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <i className="ri-government-line w-6 h-6 flex items-center justify-center mr-2"></i>
            <span className="font-[\'Pacifico\'] text-xl">Desa Siman</span>
          </div>
          <p className="text-gray-400 text-sm">
            Sistem Pendukung Keputusan untuk Distribusi Bantuan Sosial • Didukung oleh Metode TOPSIS
          </p>
          <div className="mt-4 text-xs text-gray-500">
            2024 Pemerintah Desa Siman. Semua hak dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}
