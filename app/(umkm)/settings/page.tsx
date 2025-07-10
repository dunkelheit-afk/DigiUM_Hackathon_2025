// app/(umkm)/settings/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Save, User, Building2, Lock, Loader2 } from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext'; // Impor hook useUser
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const { user, profile, isLoading, refetchProfile } = useUser(); // Gunakan data dari context
  const supabase = createClient();

  // State lokal untuk menampung input dari form
  const [fullName, setFullName] = useState('');
  const [umkmName, setUmkmName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Isi form dengan data dari context saat pertama kali load
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUmkmName(profile.umkm_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSaveAll = async () => {
    if (!user) return alert("Sesi tidak ditemukan, mohon login ulang.");
    setIsSaving(true);

    // --- PERUBAHAN UTAMA ADA DI SINI ---
    // Menggunakan .upsert() bukan .update()
    // Upsert akan meng-update jika data ada, atau membuat baru jika tidak ada.
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id, // Pastikan ID disertakan untuk pencocokan
        full_name: fullName,
        umkm_name: umkmName,
        phone: phone,
        updated_at: new Date().toISOString(),
      })
      .select() // Diperlukan setelah upsert
      .single();

    if (error) {
      alert('Gagal menyimpan perubahan: ' + error.message);
    } else {
      alert('Perubahan berhasil disimpan!');
      // Panggil refetch untuk memperbarui data di seluruh aplikasi, termasuk sidebar
      refetchProfile(); 
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-purple-600"/></div>;
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
        <Button onClick={handleSaveAll} disabled={isSaving} className="bg-purple-600 text-white hover:bg-purple-700">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Simpan Semua Perubahan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800"><User className="mr-2 h-5 w-5 text-purple-600" /> Profil Pribadi</CardTitle>
          <CardDescription className="text-gray-600">Kelola informasi pribadi Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email">Alamat Email</Label>
            <Input id="email" type="email" value={user?.email || ''} disabled className="bg-gray-100 cursor-not-allowed" />
          </div>
          <div>
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800"><Building2 className="mr-2 h-5 w-5 text-purple-600" /> Informasi Bisnis</CardTitle>
          <CardDescription className="text-gray-600">Kelola detail UMKM Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="umkmName">Nama UMKM</Label>
            <Input id="umkmName" value={umkmName} onChange={(e) => setUmkmName(e.target.value)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
