'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, TrendingUp, AlertCircle, BookMarked, Calculator, ArrowLeftCircle, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/app/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

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
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className="w-full bg-white/50 border-purple-300/80 rounded-md focus:ring-purple-500 pl-9"
        {...props}
      />
    </div>
  );
};


export default function UnifiedFinancePage() {
  // --- STATE & HOOKS ---
  const supabase = createClient();
  const { user, isLoading: isAuthLoading } = useUser();
  const { toast } = useToast();
  
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
    if (!user) return;
    setIsLoadingTransactions(true);
    try {
      const { data, error } = await supabase.from('transactions').select('*').order('tanggal', { ascending: false });
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Gagal memuat transaksi:', error);
      toast({ title: "Error", description: "Gagal memuat riwayat transaksi.", variant: "destructive" });
    } finally {
      setIsLoadingTransactions(false);
    }
  }, [supabase, user, toast]);

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
    if (!user) return toast({ title: "Akses Ditolak", description: "Anda harus login untuk menyimpan transaksi.", variant: "destructive"});
    
    if (!description || !category || amount === '' || Number(amount) <= 0) {
      return toast({ title: "Input Tidak Lengkap", description: "Mohon isi semua field dengan benar.", variant: "destructive"});
    }
    
    setIsSubmitting(true);
    try {
      const newTransactionData = {
        tanggal: date,
        deskripsi: description,
        kategori: category,
        jumlah: amount,
      };

      const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTransactionData),
      });

      const savedTransaction = await response.json();

      if (!response.ok) {
        throw new Error(savedTransaction.message || 'Gagal menyimpan transaksi.');
      }
      
      // PERUBAHAN: Mengaktifkan kembali auto-render
      if (savedTransaction && Array.isArray(savedTransaction) && savedTransaction.length > 0) {
        setTransactions(prev => [savedTransaction[0], ...prev.filter(t => t.id !== savedTransaction[0].id)]);
      } else {
        console.error("API response for new transaction is not in the expected format:", savedTransaction);
        toast({ title: "Error", description: "Gagal memperbarui daftar transaksi setelah menyimpan.", variant: "destructive"});
      }

      setDescription('');
      setCategory('');
      setAmount('');
      toast({ title: "Sukses!", description: "Transaksi berhasil disimpan." });

    } catch (error) {
        if (error instanceof Error) {
            toast({ title: "Error", description: `Gagal menyimpan: ${error.message}`, variant: "destructive"});
        }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnalyze = async () => {
    if (!user) {
      setAnalysisError('Sesi pengguna tidak ditemukan. Silakan muat ulang halaman.');
      return;
    }
    
    setAnalysisError(null);
    setIsAnalyzing(true);
    setAnalysisResults(null);

    const fieldsToValidate = [revenue, cogs, operatingExpenses, totalAssets, cash, totalLiabilities, totalEquity];
    if (fieldsToValidate.some(field => field === '' || field === null)) {
      setAnalysisError('Mohon isi semua field dengan angka yang valid.');
      setIsAnalyzing(false);
      return;
    }

      const formData = {
        user_id: user.id, // <-- TAMBAHKAN BARIS INI
        revenue: Number(revenue),
        cogs: Number(cogs),
        operating_expenses: Number(operatingExpenses),
        total_assets: Number(totalAssets),
        cash: Number(cash),
        total_liabilities: Number(totalLiabilities),
        total_equity: Number(totalEquity),
      };

    try {
      const predictResponse = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const predictionResults = await predictResponse.json();

      if (!predictResponse.ok) {
        throw new Error(predictionResults.error || 'Gagal mendapatkan hasil prediksi dari server.');
      }
      
      setAnalysisResults(predictionResults);
      toast({ title: "Prediksi Berhasil!", description: `Status kesehatan UMKM Anda: ${predictionResults.prediction_status}` });

      const recordToSave = {
        ...formData,
        prediction_status: predictionResults.prediction_status,
        recommendation: predictionResults.recommendation,
      };

      const saveRecordResponse = await fetch('/api/analysis-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordToSave),
      });

      if (!saveRecordResponse.ok) {
        console.error("Gagal menyimpan catatan analisis ke database.");
        toast({ title: "Peringatan", description: "Hasil analisis berhasil didapat, namun gagal disimpan dalam riwayat.", variant: "destructive" });
      } else {
        console.log("Catatan analisis berhasil disimpan.");
      }

      setRevenue(''); setCogs(''); setOperatingExpenses(''); setTotalAssets('');
      setCash(''); setTotalLiabilities(''); setTotalEquity('');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui.';
      setAnalysisError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

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
    <div className="w-full min-h-screen rounded-3xl p-6 md:p-6 flex items-center justify-center bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-300 bg-[length:400%_400%] animate-background-pan">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-7xl mx-auto">
        <Card className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-4xl md:text-5xl font-extrabold text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_20%)]">Financial Suite</CardTitle>
            <CardDescription className="text-white/80 mt-3 max-w-2xl mx-auto [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">
              {user ? `Selamat datang! Kelola pencatatan dan analisis keuangan Anda.` : 'Mohon login untuk mengelola keuangan Anda.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {!user ? (
              <div className="text-center p-10 bg-white/20 rounded-lg">
                <AlertCircle className="mx-auto h-12 w-12 text-purple-800" />
                <h3 className="mt-4 text-lg font-medium text-purple-900">Butuh Autentikasi</h3>
                <p className="mt-2 text-sm text-gray-800">Anda harus login untuk menggunakan Financial Suite.</p>
              </div>
            ) : (
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/20 p-1 h-11 rounded-lg">
                <TabsTrigger value="bookkeeping" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-800">
                    <BookMarked className="w-4 h-4 mr-2" /> Pencatatan
                </TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-800">
                    <Calculator className="w-4 h-4 mr-2" /> Analisis Cepat
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="bookkeeping" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-white [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)] mb-4">Catat Transaksi</h2>
                    <form onSubmit={handleSaveTransaction} className="space-y-4 p-6 bg-white/20 rounded-xl border border-white/30 shadow-sm">
                      <div className="space-y-1">
                        <Label htmlFor="date" className="text-gray-800">Tanggal</Label>
                        <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required className="bg-white/50 border-purple-300/80"/>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="category" className="text-gray-800">Kategori</Label>
                        <Select value={category} onValueChange={setCategory} required>
                          <SelectTrigger className="bg-white/50 border-purple-300/80"><SelectValue placeholder="Pilih kategori..." /></SelectTrigger>
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
                        <Label htmlFor="description" className="text-gray-800">Deskripsi</Label>
                        <Input id="description" placeholder="Contoh: Penjualan 10 kaos" value={description} onChange={e => setDescription(e.target.value)} required className="bg-white/50 border-purple-300/80"/>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="amount" className="text-gray-800">Jumlah</Label>
                        <CurrencyInput id="amount" value={amount} setter={setAmount} placeholder="0" />
                      </div>
                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : <><Save className="mr-2 h-4 w-4" /> Simpan Transaksi</>}
                      </Button>
                    </form>
                  </div>
                  <div className="lg:col-span-3">
                    <h3 className="text-2xl font-bold text-white [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)] mb-4">Riwayat Transaksi</h3>
                    <Card className="h-[30rem] overflow-y-auto bg-white/20 border-white/30">
                      <Table>
                        <TableHeader className="sticky top-0 bg-white/30 backdrop-blur-sm z-10">
                          <TableRow>
                            <TableHead className="text-purple-900 font-semibold">Tanggal</TableHead>
                            <TableHead className="text-purple-900 font-semibold">Deskripsi</TableHead>
                            <TableHead className="text-right text-purple-900 font-semibold">Jumlah</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoadingTransactions ? (
                            <TableRow><TableCell colSpan={3} className="text-center h-24 text-gray-800">Memuat data...</TableCell></TableRow>
                          ) : transactions.length > 0 ? (
                            transactions.map(t => (
                              t && <TableRow key={t.id} className="border-white/20 hover:bg-white/30">
                                <TableCell className="text-gray-800 font-medium">{new Date(t.tanggal).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</TableCell>
                                <TableCell>
                                  <div className="font-semibold text-gray-900">{t.deskripsi}</div>
                                  <div className="text-xs text-purple-800 font-medium">{t.kategori}</div>
                                </TableCell>
                                <TableCell className="text-right font-mono text-gray-900">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(t.jumlah)}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow><TableCell colSpan={3} className="text-center h-24 text-gray-800">Belum ada transaksi.</TableCell></TableRow>
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
                      <Label htmlFor={field.id} className="mb-2 block text-gray-900 font-medium">{field.label}</Label>
                      <CurrencyInput id={field.id} value={field.value} setter={field.setter} placeholder="0" />
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
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-green-50/50 backdrop-blur-sm border border-green-200 rounded-lg text-center">
                    <p className="text-green-900 font-medium">Status kesehatan UMKM Anda: <span className="font-bold">{analysisResults.prediction_status}</span>.</p>
                    <p className="mt-2 text-sm text-gray-800">Lihat rekomendasi lengkap di dashboard Anda.</p>
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
