'use client';

import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, TrendingUp, AlertCircle, BookMarked, Calculator, ArrowLeftCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/app/contexts/UserContext'; // <-- PERUBAHAN 1: Gunakan useUser dari Context

// --- DEFINISI TIPE ---
interface Transaction {
  id: string;
  created_at: string;
  user_id: string;
  tanggal: string;
  deskripsi: string;
  kategori: string;
  jumlah: number;
}

interface FinancialResults {
  prediction_status: string;
  recommendation: string;
}

interface CurrencyInputProps {
  value: number | '';
  setter: (val: number | '') => void;
  [key: string]: unknown;
}

// --- KOMPONEN INPUT MATA UANG ---
const CurrencyInput = ({ value, setter, ...props }: CurrencyInputProps) => {
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const formatted = new Intl.NumberFormat('id-ID').format(Number(value) || 0);
    if (value !== '' && displayValue.replace(/\./g, '') !== String(value)) {
      setDisplayValue(formatted);
    } else if (value === '') {
      setDisplayValue('');
    } else if (value === 0) {
      setDisplayValue('0');
    }
  }, [value, displayValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/[^0-9]/g, '');
    
    if (numericValue === '') {
        setter('');
        setDisplayValue('');
        return;
    }
    const number = parseInt(numericValue, 10);
    setDisplayValue(new Intl.NumberFormat('id-ID').format(number));
    setter(number);
  };

  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-sm text-gray-500">Rp</span>
      <Input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className="w-full bg-slate-50 border-purple-200/80 rounded-md focus:ring-purple-500 pl-9"
        {...props}
      />
    </div>
  );
};


export default function UnifiedFinancePage() {
  // --- STATE ---
  const supabase = createClient();
  const { user, isLoading: isAuthLoading } = useUser(); // <-- PERUBAHAN 2: Dapatkan user dan status loading dari context
  
  // State Pencatatan
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  // State Analisis
  const [revenue, setRevenue] = useState<number | ''>('');
  const [cogs, setCogs] = useState<number | ''>('');
  const [operatingExpenses, setOperatingExpenses] = useState<number | ''>('');
  const [totalAssets, setTotalAssets] = useState<number | ''>('');
  const [cash, setCash] = useState<number | ''>('');
  const [totalLiabilities, setTotalLiabilities] = useState<number | ''>('');
  const [totalEquity, setTotalEquity] = useState<number | ''>('');
  const [analysisResults, setAnalysisResults] = useState<FinancialResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // --- EFEK & FUNGSI DATA ---
  const fetchTransactions = React.useCallback(async () => {
    if (!user) return; // Cek jika user sudah ada dari context
    setIsLoadingTransactions(true);
    try {
      const { data, error } = await supabase.from('transactions').select('*').order('tanggal', { ascending: false });
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Gagal memuat transaksi:', error);
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [supabase, user]); // Tambahkan user sebagai dependency

  useEffect(() => {
    if (user) {
      fetchTransactions();
    } else if (!isAuthLoading) {
      setTransactions([]);
      setIsLoadingTransactions(false);
    }
  }, [user, isAuthLoading, fetchTransactions]);

  const handleSaveTransaction = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Anda harus login untuk menyimpan transaksi.');
    if (!description || !category || amount === '' || Number(amount) <= 0) {
      return alert('Mohon isi semua field dengan benar.');
    }
    setIsSubmitting(true);
    try {
      const newTransactionData = {
        tanggal: date,
        deskripsi: description,
        kategori: category,
        jumlah: amount,
        user_id: user.id,
      };
      const { data, error } = await supabase.from('transactions').insert(newTransactionData).select().single();
      if (error) throw error;
      setTransactions(prev => [data, ...prev]);
      setDescription('');
      setCategory('');
      setAmount('');
    } catch (error) {
        if (error instanceof Error) {
            alert('Gagal menyimpan transaksi: ' + error.message);
        }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnalyze = async () => {
    if (!user) {
      setAnalysisError('Sesi pengguna tidak ditemukan. Silakan muat ulang halaman atau login kembali.');
      return;
    }
    
    setAnalysisError(null);
    setIsAnalyzing(true);
    setAnalysisResults(null);

    const fieldsToValidate = [
      revenue, cogs, operatingExpenses, totalAssets, cash, totalLiabilities, totalEquity
    ];
    const allFieldsFilled = fieldsToValidate.every(field => field !== '');

    if (!allFieldsFilled) {
      setAnalysisError('Mohon isi semua field dengan angka yang valid.');
      setIsAnalyzing(false);
      return;
    }

    const formData = {
      revenue: Number(revenue),
      cogs: Number(cogs),
      operating_expenses: Number(operatingExpenses),
      total_assets: Number(totalAssets),
      cash: Number(cash),
      total_liabilities: Number(totalLiabilities),
      total_equity: Number(totalEquity),
    };

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // --- PERBAIKAN 3: Balik urutan untuk menghindari overwrite ---
        body: JSON.stringify({
          ...formData,
          user_id: user.id, 
        }),
      });

      const results = await response.json();

      if (!response.ok) {
        throw new Error(results.error || 'Gagal mendapatkan hasil dari API.');
      }
      
      setAnalysisResults(results);
      setRevenue(''); setCogs(''); setOperatingExpenses(''); setTotalAssets('');
      setCash(''); setTotalLiabilities(''); setTotalEquity('');

    } catch (err) {
      if (err instanceof Error) {
        setAnalysisError(err.message);
      } else {
        setAnalysisError('Terjadi kesalahan yang tidak diketahui. Pastikan server backend berjalan.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- UI HELPERS ---
  const analysisInputFields = [
    { id: 'revenue', label: 'Pendapatan (Omzet)', value: revenue, setter: setRevenue },
    { id: 'cogs', label: 'Harga Pokok Penjualan (HPP)', value: cogs, setter: setCogs },
    { id: 'operatingExpenses', label: 'Biaya Operasional', value: operatingExpenses, setter: setOperatingExpenses },
    { id: 'totalAssets', label: 'Total Aset', value: totalAssets, setter: setTotalAssets },
    { id: 'cash', label: 'Kas', value: cash, setter: setCash },
    { id: 'totalLiabilities', label: 'Total Kewajiban (Utang)', value: totalLiabilities, setter: setTotalLiabilities },
    { id: 'totalEquity', label: 'Total Ekuitas (Modal)', value: totalEquity, setter: setTotalEquity, className: 'md:col-span-2' },
  ];

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
        <p className="ml-4 text-lg text-slate-700">Memuat Data Pengguna...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-white flex justify-center items-center p-4">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl">
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-xl shadow-purple-200/50">
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-4xl md:text-5xl font-extrabold text-purple-700">Financial Suite</CardTitle>
            <CardDescription className="text-slate-600 mt-3 max-w-2xl mx-auto">
              {user ? `Selamat datang! Kelola pencatatan dan analisis keuangan Anda.` : 'Mohon login untuk mengelola keuangan Anda.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {!user ? (
              <div className="text-center p-10 bg-purple-50 rounded-lg">
                <AlertCircle className="mx-auto h-12 w-12 text-purple-400" />
                <h3 className="mt-4 text-lg font-medium text-purple-800">Butuh Autentikasi</h3>
                <p className="mt-2 text-sm text-slate-600">Anda harus login untuk menggunakan Financial Suite.</p>
              </div>
            ) : (
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-purple-100/60 p-1 h-11 rounded-lg">
                <TabsTrigger value="bookkeeping" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <BookMarked className="w-4 h-4 mr-2" /> Pencatatan
                </TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <Calculator className="w-4 h-4 mr-2" /> Analisis Cepat
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="bookkeeping" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-purple-900 mb-4">Catat Transaksi</h2>
                    <form onSubmit={handleSaveTransaction} className="space-y-4 p-6 bg-white rounded-xl border border-purple-200/80 shadow-sm">
                      <div className="space-y-1">
                        <Label htmlFor="date">Tanggal</Label>
                        <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="category">Kategori</Label>
                        <Select value={category} onValueChange={setCategory} required>
                          <SelectTrigger><SelectValue placeholder="Pilih kategori..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendapatan Penjualan">Pendapatan Penjualan</SelectItem>
                            <SelectItem value="HPP">Harga Pokok Penjualan (HPP)</SelectItem>
                            <SelectItem value="Biaya Operasional">Biaya Operasional</SelectItem>
                            <SelectItem value="Pendapatan Lain">Pendapatan Lain</SelectItem>
                            <SelectItem value="Beban Lain">Beban Lain</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Input id="description" placeholder="Contoh: Penjualan 10 kaos" value={description} onChange={e => setDescription(e.target.value)} required />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="amount">Jumlah</Label>
                        <CurrencyInput id="amount" value={amount} setter={setAmount} placeholder="0" />
                      </div>
                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : 'Simpan Transaksi'}
                      </Button>
                    </form>
                  </div>
                  <div className="lg:col-span-3">
                    <h3 className="text-2xl font-bold text-purple-900 mb-4">Riwayat Transaksi</h3>
                    <Card className="h-[28rem] overflow-y-auto border-purple-200/80">
                      <Table>
                        <TableHeader className="sticky top-0 bg-purple-50">
                          <TableRow>
                            <TableHead className="text-purple-800">Tanggal</TableHead>
                            <TableHead className="text-purple-800">Deskripsi</TableHead>
                            <TableHead className="text-right text-purple-800">Jumlah</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoadingTransactions ? (
                            <TableRow><TableCell colSpan={3} className="text-center h-24 text-slate-500">Memuat data...</TableCell></TableRow>
                          ) : transactions.length > 0 ? (
                            transactions.map(t => (
                              <TableRow key={t.id} className="border-purple-100/80">
                                <TableCell>{new Date(t.tanggal).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</TableCell>
                                <TableCell>
                                  <div className="font-medium text-slate-800">{t.deskripsi}</div>
                                  <div className="text-xs text-purple-600">{t.kategori}</div>
                                </TableCell>
                                <TableCell className="text-right font-mono text-slate-800">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(t.jumlah)}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow><TableCell colSpan={3} className="text-center h-24 text-slate-500">Belum ada transaksi.</TableCell></TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="mt-6">
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                  {analysisInputFields.map((field) => (
                    <motion.div key={field.id} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className={field.className}>
                      <Label htmlFor={field.id} className="mb-2 block text-slate-800 font-medium">{field.label}</Label>
                      <CurrencyInput
                        id={field.id}
                        value={field.value}
                        setter={field.setter}
                        placeholder="0"
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {analysisError && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center justify-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <p>{analysisError}</p>
                  </motion.div>
                )}

                <Button onClick={handleAnalyze} disabled={isAnalyzing || !user} className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 text-lg rounded-lg shadow-lg">
                  {isAnalyzing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menganalisis...</> : <><TrendingUp className="mr-2 h-5 w-5" /> Hitung & Prediksi Kesehatan</>}
                </Button>
                
                {analysisResults && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-green-800 font-medium">Analisis berhasil! Status kesehatan UMKM Anda adalah: <span className="font-bold">{analysisResults.prediction_status}</span>.</p>
                    <p className="mt-2 text-sm text-gray-600">Lihat rekomendasi lengkap di dashboard Anda.</p>
                    <Button variant="outline" className="mt-4 border-purple-600 text-purple-600 hover:bg-purple-100" onClick={() => window.location.href = '/umkm/dashboard'}>
                      <ArrowLeftCircle className="w-4 h-4 mr-2" /> Kembali ke Dashboard
                    </Button>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}