'use client'; // This is a Client Component because it uses hooks and interactive charts

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Menu, PieChart as PieIcon, BarChart3,
  Loader2
} from 'lucide-react';
import {
  YAxis, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import { useSidebarToggle } from '@/app/contexts/SidebarToggleContext';

// Define the structure of the data expected from your analysis API
interface AnalysisData {
  prediction_status: 'Healthy' | 'Moderately Healthy' | 'Unhealthy';
  net_profit_margin: number;
  current_ratio: number;
  debt_to_equity: number;
  revenue: number;
  expenses: number;
  net_profit: number;
  assets: number;
  liabilities: number;
  equity: number;
}

// --- CHART COMPONENTS ---

// Main Health Gauge Chart
const HealthGaugeChart = ({ status }: { status: AnalysisData['prediction_status'] }) => {
  const value = status === 'Healthy' ? 100 : status === 'Moderately Healthy' ? 66 : 33;
  const color = status === 'Healthy' ? '#22c55e' : status === 'Moderately Healthy' ? '#f59e0b' : '#ef4444';
  const data = [{ name: 'Health', value }];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart 
        innerRadius="70%" 
        outerRadius="100%" 
        data={data} 
        startAngle={180} 
        endAngle={0}
        barSize={30}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        {/* CORRECTED: The 'clockWise' prop has been removed */}
        <RadialBar background dataKey='value' cornerRadius={15}>
            <Cell fill={color} />
        </RadialBar>
        <text
            x="50%"
            y="70%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-4xl font-bold fill-slate-800"
        >
            {status}
        </text>
         <text
            x="50%"
            y="85%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm fill-slate-500"
        >
            Overall Status
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

// Financial Summary Bar Chart
const FinancialBarChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
      <XAxis type="number" hide />
      <YAxis type="category" dataKey="name" width={80} axisLine={false} tickLine={false} />
      <Tooltip cursor={{fill: '#f3e8ff'}}/>
      <Bar dataKey="value" barSize={25} radius={[0, 10, 10, 0]}>
         <Cell fill="#8884d8" />
         <Cell fill="#82ca9d" />
         <Cell fill="#ffc658" />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

// Equity Structure Pie Chart
const EquityPieChart = ({ data }: { data: any[] }) => {
    const COLORS = ['#a78bfa', '#fb7185', '#d8b4fe'];
    return (
     <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
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
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Gagal memuat data analisis.");
        }
        const data: AnalysisData = await response.json();
        setAnalysisData(data);
      } catch (err: any) {
        setError(err.message || 'Belum ada analisis yang dilakukan. Silakan buka Financial Suite untuk menjalankan analisis.');
        setAnalysisData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestAnalysis();
  }, []);

  // Prepare data for charts based on fetched analysis data
  const financialBarData = analysisData ? [
    { name: 'Revenue', value: analysisData.revenue },
    { name: 'Expenses', value: analysisData.expenses },
    { name: 'Profit', value: analysisData.net_profit },
  ] : [];

  const equityPieData = analysisData ? [
    { name: 'Liabilities', value: analysisData.liabilities },
    { name: 'Equity', value: analysisData.equity },
  ] : [];
  
  const kpiCards = analysisData ? [
      { title: "Net Profit Margin", value: `${(analysisData.net_profit_margin * 100).toFixed(2)}%`, Icon: TrendingUp, good: analysisData.net_profit_margin > 0 },
      { title: "Current Ratio", value: analysisData.current_ratio.toFixed(2), Icon: TrendingUp, good: analysisData.current_ratio > 1.5 },
      { title: "Debt to Equity", value: analysisData.debt_to_equity.toFixed(2), Icon: TrendingDown, good: analysisData.debt_to_equity < 1.0 },
  ] : [];

  const getRecommendation = (status?: string) => {
    switch(status){
        case 'Healthy':
            return "Kerja bagus! Keuangan Anda kuat. Fokus pada peningkatan skala dan eksplorasi peluang pertumbuhan baru sambil menjaga kontrol biaya.";
        case 'Moderately Healthy':
            return "Anda berada di jalur yang benar, tetapi ada ruang untuk perbaikan. Pantau arus kas Anda dengan cermat dan cari cara untuk meningkatkan margin keuntungan.";
        case 'Unhealthy':
            return "Perhatian segera diperlukan. Fokus pada pengurangan pengeluaran yang tidak perlu, perbaiki aliran pendapatan, dan kelola utang secara efektif.";
        default:
            return "Jalankan analisis untuk mendapatkan rekomendasi yang dipersonalisasi.";
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"> <Loader2 className="h-8 w-8 animate-spin text-purple-600"/> </div>;
  }
  
  if (error || !analysisData) {
     return (
        <div className="flex flex-col justify-center items-center h-screen text-center p-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4"/>
            <h2 className="text-2xl font-bold text-slate-800">Data Tidak Tersedia</h2>
            <p className="text-slate-500 mt-2">{error}</p>
            <Button className="mt-6 bg-purple-600 hover:bg-purple-700" onClick={() => window.location.href='/dashboard/finance'}>
                Jalankan Analisis Pertama
            </Button>
        </div>
     )
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-purple-50 via-white to-white p-6 rounded-lg">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Health Dashboard</h1>
            <p className="text-slate-500">Selamat datang kembali! Berikut adalah ringkasan bisnis terbaru Anda.</p>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-purple-100/60 hidden md:inline-flex" onClick={toggleSidebar}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200/80 rounded-2xl shadow-lg shadow-purple-200/50">
                <CardHeader>
                    <CardTitle className="text-purple-900">Status Kesehatan</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                   <HealthGaugeChart status={analysisData.prediction_status} />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kpiCards.map(kpi => (
                    <Card key={kpi.title} className="bg-white/80 backdrop-blur-sm border-purple-200/80 rounded-2xl shadow-lg shadow-purple-200/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-purple-900">{kpi.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-800">{kpi.value}</div>
                            <div className={`text-xs flex items-center mt-1 ${kpi.good ? 'text-green-600' : 'text-red-600'}`}>
                                <kpi.Icon className="w-4 h-4 mr-1"/>
                                {kpi.good ? 'Posisi Baik' : 'Butuh Perhatian'}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200/80 rounded-2xl shadow-lg shadow-purple-200/50">
                <CardHeader>
                    <CardTitle className="text-purple-900">Ringkasan Finansial</CardTitle>
                </CardHeader>
                <CardContent className="h-60">
                    <FinancialBarChart data={financialBarData} />
                </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200/80 rounded-2xl shadow-lg shadow-purple-200/50">
                <CardHeader>
                    <CardTitle className="text-purple-900">Struktur Modal</CardTitle>
                </CardHeader>
                <CardContent className="h-60">
                    <EquityPieChart data={equityPieData} />
                </CardContent>
            </Card>
             <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-300">
                <CardHeader>
                    <CardTitle>Rekomendasi AI</CardTitle>
                </CardHeader>
                <CardContent className="text-purple-100">
                    {getRecommendation(analysisData.prediction_status)}
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}