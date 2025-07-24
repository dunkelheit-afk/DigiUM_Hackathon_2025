'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Upload, User, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/app/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
// PERBAIKAN: Menghapus import Separator yang tidak digunakan
// import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  // --- STATE & HOOKS ---
  const supabase = createClient();
  const { user, profile, isLoading: isAuthLoading, refetchProfile } = useUser();
  const { toast } = useToast();
  
  // State untuk form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [umkmName, setUmkmName] = useState('');
  const [umkmCategory, setUmkmCategory] = useState('');
  const [umkmDescription, setUmkmDescription] = useState('');
  const [umkmImageUrl, setUmkmImageUrl] = useState<string | null>(null);
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Efek untuk mengisi form dengan data profil yang sudah ada
  useEffect(() => {
    if (profile) {
      // PERBAIKAN: Menggunakan 'as any' untuk sementara waktu agar TypeScript tidak error.
      // Solusi permanen adalah dengan memperbarui tipe data 'Profile' di UserContext Anda.
      const userProfile = profile as any; 
      setFullName(userProfile.full_name || '');
      setPhone(userProfile.phone || '');
      setUmkmName(userProfile.umkm_name || '');
      setUmkmCategory(userProfile.umkm_category || '');
      setUmkmDescription(userProfile.umkm_description || '');
      setUmkmImageUrl(userProfile.umkm_image_url || null);
    }
  }, [profile]);

  // Fungsi untuk menangani upload gambar
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }
    
    const file = event.target.files[0];
    setImageFile(file);
    setUmkmImageUrl(URL.createObjectURL(file));
  };

  // Fungsi untuk menyimpan semua perubahan
  const handleSaveAll = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Error", description: "Sesi tidak ditemukan.", variant: "destructive" });
        return;
    }

    setSaving(true);
    // PERBAIKAN: Menggunakan 'as any' di sini juga untuk konsistensi
    let newImageUrl = (profile as any)?.umkm_image_url;

    try {
        if (imageFile) {
            setUploading(true);
            const filePath = `public/${user.id}-${Date.now()}-${imageFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from('umkm-profiles')
                .upload(filePath, imageFile, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('umkm-profiles')
                .getPublicUrl(filePath);
            
            newImageUrl = urlData.publicUrl;
            setUploading(false);
        }

        const updates = {
            id: user.id, // Pastikan ID disertakan untuk upsert
            full_name: fullName,
            phone: phone,
            umkm_name: umkmName,
            umkm_category: umkmCategory,
            umkm_description: umkmDescription,
            umkm_image_url: newImageUrl,
            updated_at: new Date(),
        };

        const { error } = await supabase.from('profiles').upsert(updates).select().single();

        if (error) throw error;

        toast({
            title: "Profil Disimpan!",
            description: "Informasi Anda telah berhasil diperbarui.",
        });
        refetchProfile(); // Panggil refetch untuk memperbarui data di seluruh aplikasi

    } catch (error) {
        console.error("Error updating profile:", error);
        toast({
            title: "Gagal Menyimpan",
            description: (error as Error).message,
            variant: "destructive",
        });
    } finally {
        setSaving(false);
        setUploading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="w-full min-h-screen p-6 rounded-3xl md:p-6 flex items-center justify-center bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-300 bg-[length:400%_400%] animate-background-pan">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-6 rounded-3xl md:p-6 flex items-center justify-center bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-300 bg-[length:400%_400%] animate-background-pan">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto">
        <form onSubmit={handleSaveAll}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-white [text-shadow:_0_2px_4px_rgb(0_0_0_/_20%)]">Pengaturan</h1>
                <Button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg">
                    {saving ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menyimpan...</> : <><Save className="mr-2 h-5 w-5" /> Simpan Semua</>}
                </Button>
            </div>

            <div className="space-y-8">
                {/* Kartu Profil Pribadi */}
                <Card className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center text-gray-900"><User className="mr-2 h-5 w-5 text-purple-800" /> Profil Pribadi</CardTitle>
                        <CardDescription className="text-gray-800/80">Kelola informasi pribadi Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="fullName" className="text-gray-900 font-medium">Nama Lengkap</Label>
                            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-white/50 border-purple-300/80" />
                        </div>
                        <div>
                            <Label htmlFor="email" className="text-gray-900 font-medium">Alamat Email</Label>
                            <Input id="email" type="email" value={user?.email || ''} disabled className="bg-gray-200/50 cursor-not-allowed border-gray-300/80" />
                        </div>
                        <div>
                            <Label htmlFor="phone" className="text-gray-900 font-medium">Nomor Telepon</Label>
                            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-white/50 border-purple-300/80" />
                        </div>
                    </CardContent>
                </Card>

                {/* Kartu Informasi Bisnis */}
                <Card className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center text-gray-900"><Building2 className="mr-2 h-5 w-5 text-purple-800" /> Informasi Bisnis</CardTitle>
                        <CardDescription className="text-gray-800/80">Lengkapi detail UMKM Anda agar dapat dilihat oleh investor.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/50 shadow-md">
                                <Image 
                                    src={umkmImageUrl || `https://placehold.co/128x128/E9D5FF/333333?text=Foto`}
                                    alt="Preview Gambar UMKM"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <Button asChild variant="outline" className="bg-white/30 text-purple-900 border-purple-400 hover:bg-white/50">
                                <label htmlFor="umkm-image">
                                    <Upload className="w-4 h-4 mr-2" />
                                    {uploading ? 'Mengunggah...' : 'Ubah Gambar'}
                                    <input type="file" id="umkm-image" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                </label>
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="umkmName" className="text-gray-900 font-medium">Nama UMKM</Label>
                                <Input id="umkmName" value={umkmName} onChange={(e) => setUmkmName(e.target.value)} placeholder="Contoh: Kopi Kenangan Senja" className="bg-white/50 border-purple-300/80" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="umkmCategory" className="text-gray-900 font-medium">Kategori Usaha</Label>
                                <Select value={umkmCategory} onValueChange={setUmkmCategory}>
                                    <SelectTrigger className="bg-white/50 border-purple-300/80">
                                        <SelectValue placeholder="Pilih kategori usaha..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Kuliner">Kuliner</SelectItem>
                                        <SelectItem value="Fashion & Kerajinan">Fashion & Kerajinan</SelectItem>
                                        <SelectItem value="Pertanian">Pertanian</SelectItem>
                                        <SelectItem value="Jasa">Jasa</SelectItem>
                                        <SelectItem value="Teknologi">Teknologi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="umkmDescription" className="text-gray-900 font-medium">Deskripsi Singkat Usaha</Label>
                            <Textarea id="umkmDescription" value={umkmDescription} onChange={(e) => setUmkmDescription(e.target.value)} placeholder="Jelaskan tentang usaha Anda..." className="bg-white/50 border-purple-300/80 min-h-[120px]" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
      </motion.div>
    </div>
  );
}
