// app/auth/choose-role/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/contexts/UserContext'; //
import { createClient } from '@/lib/supabase/client'; //
import { Button } from '@/components/ui/button'; //
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; //
import { Label } from '@/components/ui/label'; //
import { useToast } from '@/hooks/use-toast'; //
import { Loader2, Building, Briefcase } from 'lucide-react';

export default function ChooseRolePage() {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const supabase = createClient();
  const { toast } = useToast();

  const [selectedRole, setSelectedRole] = useState<'umkm' | 'investor'>('umkm');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Jika pengguna tidak login setelah loading selesai, arahkan ke halaman login.
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Error', description: 'Sesi pengguna tidak ditemukan.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    // Update peran DAN tandai bahwa pemilihan peran sudah selesai
    const { error } = await supabase
      .from('profiles')
      .update({
        role: selectedRole,
        has_selected_role: true // Ini adalah flag penting untuk middleware
      })
      .eq('id', user.id);

    setIsSubmitting(false);

    if (error) {
      toast({ title: 'Gagal Menyimpan Peran', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Berhasil!', description: 'Peran Anda telah disimpan.' });

      // **PERUBAHAN DI SINI**
      // Arahkan ke dasbor yang sesuai setelah peran dipilih
      const redirectUrl = selectedRole === 'investor' ? '/investor/dashboard' : '/umkm/dashboard';
      router.push(redirectUrl);
      router.refresh();
    }
  };

  // Tampilkan loading spinner selagi data user dimuat
  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-purple-600">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Satu Langkah Lagi!</CardTitle>
          <CardDescription>Pilih peran Anda untuk menyelesaikan pendaftaran.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div role="radiogroup" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Label
                htmlFor="role-umkm"
                className={`flex flex-col items-center justify-center cursor-pointer rounded-lg border-2 p-6 transition-all ${
                  selectedRole === 'umkm' ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio" id="role-umkm" name="role" value="umkm"
                  checked={selectedRole === 'umkm'}
                  onChange={() => setSelectedRole('umkm')}
                  className="sr-only"
                />
                <Building className="h-10 w-10 mb-2 text-purple-600" />
                <span className="font-semibold text-gray-700">UMKM</span>
              </Label>
              <Label
                htmlFor="role-investor"
                className={`flex flex-col items-center justify-center cursor-pointer rounded-lg border-2 p-6 transition-all ${
                  selectedRole === 'investor' ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio" id="role-investor" name="role" value="investor"
                  checked={selectedRole === 'investor'}
                  onChange={() => setSelectedRole('investor')}
                  className="sr-only"
                />
                <Briefcase className="h-10 w-10 mb-2 text-purple-600" />
                <span className="font-semibold text-gray-700">Investor</span>
              </Label>
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Selesai & Lanjutkan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}