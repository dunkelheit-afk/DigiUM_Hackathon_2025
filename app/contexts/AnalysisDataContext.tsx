'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Definisikan struktur data analisis yang akan kita bagikan
interface AnalysisData {
  prediction_status?: string;
  net_profit_margin?: number;
  current_ratio?: number;
  debt_to_equity?: number;
  roa?: number;
  asset_turnover?: number;
  recommendation?: string;
  // Anda bisa menambahkan field lain dari dasbor jika diperlukan
}

// Definisikan tipe untuk konteks
interface AnalysisContextType {
  analysisData: AnalysisData | null;
  setAnalysisData: (data: AnalysisData | null) => void;
}

// Buat konteks dengan nilai default
const AnalysisDataContext = createContext<AnalysisContextType | undefined>(undefined);

// Buat "Provider" yang akan membungkus aplikasi Anda
export const AnalysisDataProvider = ({ children }: { children: ReactNode }) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  return (
    <AnalysisDataContext.Provider value={{ analysisData, setAnalysisData }}>
      {children}
    </AnalysisDataContext.Provider>
  );
};

// Buat "Hook" kustom untuk memudahkan akses data dari komponen lain
export const useAnalysisData = () => {
  const context = useContext(AnalysisDataContext);
  if (context === undefined) {
    throw new Error('useAnalysisData must be used within an AnalysisDataProvider');
  }
  return context;
};
