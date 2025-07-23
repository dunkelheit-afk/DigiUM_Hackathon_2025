// app/(umkm)/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle, TrendingUp, TrendingDown, Menu, Loader2, Info, Scale, Landmark, Banknote, FileText, PiggyBank, HandCoins, Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, Cell
} from 'recharts';
import { useSidebarToggle } from '@/app/contexts/SidebarToggleContext';
import ReactMarkdown from 'react-markdown';

// Mendefinisikan struktur data lengkap yang diharapkan dari API
interface AnalysisData {
  prediction_status: 'Sehat' | 'Cukup Sehat' | 'Rentan' | 'sehat' | 'cukup' | 'rentan';
  net_profit_margin: number;
  current_ratio: number;
  debt_to_equity: number;
  roa: number;
  asset_turnover: number;
  revenue: number;
  cogs: number;
  operating_expenses: number;
  total_assets: number;
  cash: number;
  total_liabilities: number;
  total_equity: number;
  recommendation: string;
}

// --- KOMPONEN-KOMPONEN UI ---

const FinancialSummaryItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: number }) => (
  <div className="flex items-center justify-between py-2 border-b border-purple-100/80 last:border-b-0">
    <div className="flex items-center">
      <Icon className="w-5 h-5 text-purple-600 mr-3" />
      <span className="text-sm text-slate-700">{label}</span>
    </div>
    <span className="font-mono text-sm text-slate-800">
      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)}
    </span>
  </div>
);

const KpiCard = ({ title, value, recommendation, formula, Icon, isGood }: { title: string, value: string, recommendation: string, formula: string, Icon: React.ElementType, isGood: boolean }) => (
  <Card className="bg-white/80 backdrop-blur-sm border-purple-200/80 rounded-2xl shadow-lg shadow-purple-200/50">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-purple-900">{title}</CardTitle>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="w-6 h-6 text-slate-400 hover:bg-purple-100">
            <Info className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 text-sm">
          <p className="font-semibold">Rekomendasi Nilai:</p>
          <p className="mb-2">{recommendation}</p>
          <Separator />
          <p className="font-semibold mt-2">Rumus Perhitungan:</p>
          <p className="italic text-slate-600">{formula}</p>
        </PopoverContent>
      </Popover>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className={`text-xs flex items-center mt-1 ${isGood ? 'text-green-600' : 'text-red-600'}`}>
        <Icon className="w-4 h-4 mr-1"/>
        {isGood ? 'Posisi Baik' : 'Butuh Perhatian'}
      </div>
    </CardContent>
  </Card>
);

const HealthGaugeChart = ({ status }: { status: AnalysisData['prediction_status'] }) => {
  const normalizedStatus = status.toLowerCase();
  const value = normalizedStatus.includes('sehat') ? 100 : normalizedStatus.includes('cukup') ? 66 : 33;
  const color = normalizedStatus.includes('sehat') ? '#22c55e' : normalizedStatus.includes('cukup') ? '#f59e0b' : '#ef4444';
  const data = [{ name: 'Kesehatan', value }];
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={180} endAngle={0} barSize={30}>
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar background dataKey='value' cornerRadius={15}><Cell fill={color} /></RadialBar>
        <text x="50%" y="70%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-slate-800">{displayStatus}</text>
        <text x="50%" y="85%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-slate-500">Status Keseluruhan</text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};


export default function UmkmDashboardPage() {
  const { toggleSidebar } = useSidebarToggle();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/analysis/latest');
        
        // --- PERBAIKAN ERROR HANDLING ---
        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage;
            if (contentType && contentType.includes("application/json")) {
                const errData = await response.json();
                errorMessage = errData.message || "Gagal memuat data analisis.";
            } else {
                errorMessage = `Server error: ${response.status} ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        const data: AnalysisData = await response.json();
        setAnalysisData(data);

      } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Terjadi kesalahan yang tidak diketahui.');
          }
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestAnalysis();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-purple-600"/></div>;
  }
  
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center p-4">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4"/>
        <h2 className="text-2xl font-bold text-slate-800">Data Tidak Tersedia</h2>
        <p className="text-slate-500 mt-2">{error}</p>
        <Button className="mt-6 bg-purple-600 hover:bg-purple-700" onClick={() => window.location.href='/umkm/financial-analysis'}>
          Coba Jalankan Analisis
        </Button>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center p-4">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4"/>
        <h2 className="text-2xl font-bold text-slate-800">Belum Ada Analisis</h2>
        <p className="text-slate-500 mt-2">Anda belum pernah melakukan analisis. Silakan jalankan analisis pertama Anda.</p>
        <Button className="mt-6 bg-purple-600 hover:bg-purple-700" onClick={() => window.location.href='/umkm/financial-analysis'}>
          Jalankan Analisis Pertama
        </Button>
      </div>
    );
  }

  const financialSummaryData = [
    { label: "Pendapatan", value: analysisData.revenue, icon: TrendingUp },
    { label: "Harga Pokok Penjualan", value: analysisData.cogs, icon: TrendingDown },
    { label: "Biaya Operasional", value: analysisData.operating_expenses, icon: FileText },
    { label: "Total Aset", value: analysisData.total_assets, icon: Landmark },
    { label: "Kas", value: analysisData.cash, icon: Banknote },
    { label: "Total Kewajiban", value: analysisData.total_liabilities, icon: Scale },
    { label: "Total Ekuitas", value: analysisData.total_equity, icon: PiggyBank },
  ];

  const kpiCards = [
      { title: "Margin Laba Bersih (NPM)", value: `${(analysisData.net_profit_margin * 100).toFixed(2)}%`, Icon: TrendingUp, isGood: analysisData.net_profit_margin >= 0.1, recommendation: "Diatas atau sama dengan 10%", formula: "(Laba Bersih / Pendapatan) x 100%" },
      { title: "Rasio Lancar (CR)", value: analysisData.current_ratio.toFixed(2), Icon: TrendingUp, isGood: analysisData.current_ratio >= 1.2 && analysisData.current_ratio <= 2.0, recommendation: "Antara 1.2 - 2.0", formula: "Total Aset Lancar / Total Kewajiban Lancar" },
      { title: "Utang thd. Ekuitas (DER)", value: analysisData.debt_to_equity.toFixed(2), Icon: TrendingDown, isGood: analysisData.debt_to_equity < 1.0, recommendation: "Di bawah 1.0", formula: "Total Kewajiban / Total Ekuitas" },
      { title: "Return on Assets (ROA)", value: `${(analysisData.roa * 100).toFixed(2)}%`, Icon: TrendingUp, isGood: analysisData.roa > 0.05, recommendation: "Lebih dari 5%", formula: "(Laba Bersih / Total Aset) x 100%" },
      { title: "Perputaran Aset (TATO)", value: analysisData.asset_turnover.toFixed(2), Icon: HandCoins, isGood: analysisData.asset_turnover > 0.5, recommendation: "Lebih dari 0.5", formula: "Pendapatan / Total Aset" },
  ];

  return (
    <div className="space-y-6 bg-gradient-to-br from-purple-50 via-white to-white p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Kesehatan Finansial</h1>
            <p className="text-slate-500">Selamat datang kembali! Berikut adalah ringkasan bisnis terbaru Anda.</p>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-purple-100/60 hidden md:inline-flex" onClick={toggleSidebar}><Menu className="w-6 h-6" /></Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        <div className="lg:col-span-3 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200/80 rounded-2xl shadow-lg shadow-purple-200/50">
                <CardHeader><CardTitle className="text-purple-900">Status Kesehatan</CardTitle></CardHeader>
                <CardContent className="h-64"><HealthGaugeChart status={analysisData.prediction_status} /></CardContent>
            </Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpiCards.slice(0, 3).map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {kpiCards.slice(3, 5).map(kpi => <KpiCard key={kpi.title} {...kpi} />)}
            </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200/80 rounded-2xl shadow-lg shadow-purple-200/50">
                <CardHeader><CardTitle className="text-purple-900">Ringkasan Finansial</CardTitle></CardHeader>
                <CardContent>
                    {financialSummaryData.map(item => <FinancialSummaryItem key={item.label} {...item} />)}
                </CardContent>
            </Card>
             <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-300">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
                        Rekomendasi AI
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-purple-100 prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown>
                        {analysisData.recommendation}
                    </ReactMarkdown>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}