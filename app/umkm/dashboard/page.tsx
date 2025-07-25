'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/contexts/UserContext';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, AlertCircle, TrendingUp, ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';
import { motion } from 'framer-motion';

// Tipe data untuk hasil analisis tetap sama
interface AnalysisRecord {
  id: string;
  created_at: string;
  prediction_status: string;
  recommendation: string;
  net_profit_margin: number;
  current_ratio: number;
  debt_to_equity: number;
  roa: number;
  asset_turnover: number;
}

// ================== REFACTOR KOMPONEN METRICCARD ==================
// Komponen MetricCard sekarang lebih pintar.
// Ia menerima nilai mentah (raw value) dan mengurus format & statusnya sendiri.
type MetricStatus = 'good' | 'average' | 'bad';

interface MetricCardProps {
  title: string;
  value: number | null | undefined; // Nilai bisa null atau undefined saat loading/error
  formatAs?: 'percentage' | 'decimal'; // Opsi untuk format
  // Tentukan ambang batas untuk status 'good' atau 'average'
  thresholds: {
    good: (v: number) => boolean;
    average?: (v: number) => boolean;
  };
}

const MetricCard = ({ title, value, formatAs = 'decimal', thresholds }: MetricCardProps) => {
  // 1. Menentukan Status (good, average, bad) secara internal
  let status: MetricStatus = 'bad';
  if (value !== null && value !== undefined) {
    if (thresholds.good(value)) {
      status = 'good';
    } else if (thresholds.average && thresholds.average(value)) {
      status = 'average';
    }
  }

  // 2. Memformat Tampilan Nilai secara internal (menangani null/undefined)
  const displayValue = (): string => {
    const numValue = value ?? 0; // Jika value null/undefined, anggap 0
    const formatted = formatAs === 'percentage'
      ? `${(numValue * 100).toFixed(2)}%`
      : numValue.toFixed(2);
    return value === null || value === undefined ? '-' : formatted;
  };

  const statusClasses = {
    good: 'text-green-600',
    average: 'text-yellow-600',
    bad: 'text-red-600',
  };

  return (
    <motion.div
      variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
      className="bg-white/50 p-4 rounded-lg shadow-sm"
    >
      <p className="text-sm text-gray-600">{title}</p>
      <p className={`text-2xl font-bold ${statusClasses[status]}`}>{displayValue()}</p>
    </motion.div>
  );
};


// ================== KOMPONEN UTAMA DASHBOARDPAGE ==================
export default function DashboardPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const supabase = createClient();
  const [latestAnalysis, setLatestAnalysis] = useState<AnalysisRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestAnalysis = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('analysis_records')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        if (error && error.code !== 'PGRST116') throw error;
        setLatestAnalysis(data);
      } catch (err: any) {
        console.error("Gagal memuat analisis terakhir:", err);
        setError("Gagal memuat data analisis terakhir. Coba muat ulang halaman.");
      } finally {
        setIsLoading(false);
      }
    };
    if (!isUserLoading) fetchLatestAnalysis();
  }, [user, isUserLoading, supabase]);

  const getStatusInfo = (status: string | undefined) => {
    switch (status) {
      case 'Sehat':
        return { Icon: ShieldCheck, color: 'text-green-500', bgColor: 'bg-green-50', text: 'Kinerja keuangan Anda sangat baik. Pertahankan!' };
      case 'Cukup Sehat':
        return { Icon: ShieldAlert, color: 'text-yellow-500', bgColor: 'bg-yellow-50', text: 'Kinerja keuangan cukup baik, ada ruang untuk perbaikan.' };
      case 'Rentan':
        return { Icon: ShieldAlert, color: 'text-red-500', bgColor: 'bg-red-50', text: 'Kinerja keuangan perlu perhatian khusus.' };
      default:
        return { Icon: ShieldQuestion, color: 'text-gray-500', bgColor: 'bg-gray-100', text: 'Belum ada data analisis yang ditemukan.' };
    }
  };

  if (isLoading || isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        <p className="ml-4 text-lg">Memuat Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold">Oops, terjadi kesalahan</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }
  
  const { Icon, color, bgColor, text } = getStatusInfo(latestAnalysis?.prediction_status);

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Keuangan</h1>
        <Card className={`mb-8 shadow-lg ${bgColor}`}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Icon className={`h-10 w-10 ${color}`} />
              <div>
                <CardTitle className={`text-2xl font-bold ${color}`}>
                  {latestAnalysis?.prediction_status || 'Belum Dianalisis'}
                </CardTitle>
                <CardDescription className="text-gray-700">{text}</CardDescription>
              </div>
            </div>
          </CardHeader>
          {latestAnalysis && (
             <CardContent>
                <p className="font-semibold text-gray-800">Rekomendasi untuk Anda:</p>
                <p className="text-gray-600 mt-1">{latestAnalysis.recommendation}</p>
             </CardContent>
          )}
        </Card>

        {latestAnalysis ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Detail Metrik Terakhir</h2>
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {/* Logika status dan format sekarang ada di dalam MetricCard */}
              <MetricCard 
                title="Net Profit Margin" 
                value={latestAnalysis.net_profit_margin}
                formatAs="percentage"
                thresholds={{ good: v => v >= 0.1 }}
              />
              <MetricCard 
                title="Current Ratio" 
                value={latestAnalysis.current_ratio}
                thresholds={{ good: v => v >= 1.2 }}
              />
              <MetricCard 
                title="Debt to Equity" 
                value={latestAnalysis.debt_to_equity}
                thresholds={{ good: v => v < 1.0, average: v => v < 1.5 }}
              />
              <MetricCard 
                title="Return on Assets (ROA)" 
                value={latestAnalysis.roa}
                formatAs="percentage"
                thresholds={{ good: v => v > 0.05 }}
              />
              <MetricCard 
                title="Asset Turnover" 
                value={latestAnalysis.asset_turnover}
                thresholds={{ good: v => v > 1.0, average: v => v > 0.5 }}
              />
            </motion.div>
          </div>
        ) : (
          <Card className="text-center p-8">
            <CardHeader>
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <CardTitle>Mulai Analisis Pertama Anda</CardTitle>
              <CardDescription>
                Data hasil analisis keuangan Anda akan muncul di sini setelah Anda menyelesaikannya.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
