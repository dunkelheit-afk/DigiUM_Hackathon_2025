'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog'; // DialogDescription dihapus dari sini
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, AlertTriangle } from 'lucide-react'; // Ikon yang tidak terpakai dihapus

// --- Tipe Data (Tetap sama) ---
interface UmkmProfile {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string | null;
}

interface AnalysisData {
  prediction_status: 'Sehat' | 'Cukup' | 'Rentan';
  net_profit_margin: number;
  current_ratio: number;
  debt_to_equity: number;
  recommendation: string;
}

const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;
const formatRatio = (value: number) => value.toFixed(2);

// --- Komponen Dashboard Utama (Seluruh sisa kode tetap sama) ---
export default function UMKMDashboard() {
  const [umkmList, setUmkmList] = useState<UmkmProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedUmkm, setSelectedUmkm] = useState<UmkmProfile | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  useEffect(() => {
    const fetchUmkmProfiles = async () => {
       setIsLoading(true);
       setError(null);
       try {
         const response = await fetch('/api/umkm-profiles');
         if (!response.ok) {
           const errorData = await response.json();
           throw new Error(errorData.message || 'Gagal memuat data UMKM.');
         }
         const data = await response.json();
         const formattedData = data.map((profile: any) => ({
             id: profile.id,
             name: profile.umkm_name,
             category: profile.umkm_category,
             description: profile.umkm_description,
             imageUrl: profile.umkm_image_url,
         }));
         setUmkmList(formattedData);
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
    fetchUmkmProfiles();
  }, []);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (!selectedUmkm) return;
      
      setIsModalLoading(true);
      setAnalysisData(null);
      try {
        const response = await fetch(`/api/analysis/latest/${selectedUmkm.id}`);
        if (!response.ok) {
          if (response.status === 404) {
             setAnalysisData(null);
             return;
          }
          throw new Error('Gagal mengambil data analisis.');
        }
        const data: AnalysisData = await response.json();
        setAnalysisData(data);
      } catch (error) {
        console.error("Fetch analysis error:", error);
      } finally {
        setIsModalLoading(false);
      }
    };
    fetchAnalysisData();
  }, [selectedUmkm]);

  const { filteredUmkm, categories } = useMemo(() => {
    const categories = ['Semua', ...new Set(umkmList.map(u => u.category).filter(Boolean))];
    let filtered = umkmList;

    if (selectedCategory !== 'Semua') {
      filtered = filtered.filter(umkm => umkm.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(umkm =>
        umkm.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return { filteredUmkm: filtered, categories };
  }, [searchQuery, umkmList, selectedCategory]);

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-purple-600"/><p className="ml-4">Memuat data UMKM...</p></div>;
  if (error) return <div className="flex flex-col justify-center items-center h-screen text-center p-4"><AlertTriangle className="h-12 w-12 text-yellow-500 mb-4"/><h2 className="text-2xl font-bold text-slate-800">Gagal Memuat Data</h2><p className="text-slate-500 mt-2">{error}</p></div>;

  return (
    <Dialog onOpenChange={() => setSelectedUmkm(null)}>
      <div className="w-full rounded-3xl p-6 md:p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 text-center">Jelajahi UMKM Unggulan</h1>
        <p className="text-lg text-gray-500 mb-8 text-center max-w-3xl mx-auto">Temukan peluang investasi pada UMKM lokal yang inovatif dan berpotensi tinggi.</p>
        
        <div className="mb-10 flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <div className="relative flex-grow">
            <Input type="text" placeholder="Cari nama UMKM..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-6 rounded-full bg-white/80 border-gray-300 focus:ring-2 focus:ring-purple-400"/>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px] py-6 rounded-full bg-white/80 border-gray-300 focus:ring-2 focus:ring-purple-400">
              <SelectValue placeholder="Filter Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredUmkm.map((umkm) => (
            <div key={umkm.id} className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-white/30 flex flex-col">
              <div className="relative w-full h-48"><Image src={umkm.imageUrl || 'https://placehold.co/600x400/E9D5FF/333333?text=Gambar'} alt={`Gambar ${umkm.name}`} layout="fill" objectFit="cover" /></div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-purple-700 mb-2">{umkm.category}</span>
                <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{umkm.name}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{umkm.description}</p>
                <DialogTrigger asChild>
                  <Button onClick={() => setSelectedUmkm(umkm)} className="w-full mt-auto bg-purple-600 hover:bg-purple-700">Lihat Detail</Button>
                </DialogTrigger>
              </div>
            </div>
          ))}
        </div>
        {filteredUmkm.length === 0 && <div className="text-center py-12 bg-white/30 rounded-2xl mt-8"><h3 className="text-xl font-semibold text-gray-800">Tidak Ditemukan</h3><p className="text-gray-600 mt-2">UMKM yang Anda cari tidak ditemukan.</p></div>}
      </div>

      <DialogContent className="sm:max-w-[600px] bg-white/80 backdrop-blur-xl border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">{selectedUmkm?.name}</DialogTitle>
          <span className="text-sm font-semibold text-purple-700 pt-1">{selectedUmkm?.category}</span>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-gray-700 text-base leading-relaxed">{selectedUmkm?.description}</p>
          <hr/>
          <h3 className="text-lg font-bold text-gray-800">Ringkasan Analisis Finansial</h3>
          {isModalLoading ? (
            <div className="flex items-center justify-center h-24"><Loader2 className="h-6 w-6 animate-spin text-purple-600" /></div>
          ) : analysisData ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100">
                  <span className="font-semibold text-gray-700">Status Kesehatan</span>
                  <Badge variant={analysisData.prediction_status === 'Sehat' ? 'default' : analysisData.prediction_status === 'Rentan' ? 'destructive' : 'secondary'} className="bg-green-100 text-green-800">
                      {analysisData.prediction_status}
                  </Badge>
              </div>
              <div className="flex justify-between items-center"><span className="text-gray-600">Margin Laba Bersih</span><span className="font-mono font-semibold text-gray-800">{formatPercent(analysisData.net_profit_margin)}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-600">Rasio Lancar</span><span className="font-mono font-semibold text-gray-800">{formatRatio(analysisData.current_ratio)}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-600">Utang thd. Ekuitas</span><span className="font-mono font-semibold text-gray-800">{formatRatio(analysisData.debt_to_equity)}</span></div>
              <div className="mt-4 p-3 rounded-lg bg-purple-50 border border-purple-200">
                <p className="text-sm text-purple-800">{analysisData.recommendation}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">Belum ada data analisis untuk UMKM ini.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}