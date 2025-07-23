// app/register/page.tsx
'use client';

import React from "react";
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
// HAPUS: Definisi BackgroundGradientAnimation dari sini
// IMPORT komponennya dari file terpisah
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

// Skema Zod untuk validasi form
const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Nama lengkap minimal 2 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
  confirmPassword: z.string().min(6, { message: "Konfirmasi password minimal 6 karakter." }),
  role: z.enum(['umkm', 'investor']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok.",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof registerSchema>;

// Komponen Halaman (hanya default export)
export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          role: data.role,
        },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast({ title: 'Registrasi Gagal', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Registrasi Berhasil', description: 'Silakan periksa email Anda untuk verifikasi.' });
      router.push('/login');
    }
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  return (
    <BackgroundGradientAnimation>
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 w-full">
        <Card className="relative w-full max-w-md space-y-4 p-8 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/20 text-white [filter:drop-shadow(0_15px_25px_rgba(0,0,0,0.3))]">
          <Link href="/" className="absolute top-4 left-4">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-300 hover:bg-white/20 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Kembali ke halaman utama</span>
            </Button>
          </Link>

          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
              Buat Akun Anda
            </CardTitle>
            <CardDescription className="mt-2 text-sm text-gray-200">
              Daftar untuk memulai perjalanan Anda dengan Digi<span className="text-[#C68EFD]">UM</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Nama Lengkap */}
              <div>
                <Label htmlFor="fullName" className="text-gray-200">Nama Lengkap</Label>
                <Input id="fullName" {...register("fullName")} className="bg-white/10 border-white/20 text-white focus:ring-[#C68EFD]"/>
                {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>}
              </div>
              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-gray-200">Alamat Email</Label>
                <Input id="email" type="email" {...register("email")} className="bg-white/10 border-white/20 text-white focus:ring-[#C68EFD]"/>
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </div>
              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} className="bg-white/10 border-white/20 text-white focus:ring-[#C68EFD]"/>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
              </div>
              {/* Konfirmasi Password */}
              <div>
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="bg-white/10 border-white/20 text-white focus:ring-[#C68EFD]"/>
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
              </div>

             {/* Pemilihan Peran */}
              <div className="space-y-2 text-gray-200 pt-2">
                <Label>Saya ingin mendaftar sebagai:</Label>
                <div className="flex gap-4">
                    <div className="flex items-center">
                        <input id="role-umkm" type="radio" value="umkm" {...register("role")} className="h-4 w-4" defaultChecked />
                        <Label htmlFor="role-umkm" className="ml-2">UMKM</Label>
                    </div>
                    <div className="flex items-center">
                        <input id="role-investor" type="radio" value="investor" {...register("role")} className="h-4 w-4" />
                        <Label htmlFor="role-investor" className="ml-2">Investor</Label>
                    </div>
                </div>
                {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>}
              </div>


              <Button type="submit" className="w-full bg-[#8F87F1] hover:bg-[#C68EFD] text-white !mt-6">
                Daftar
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/30 px-2 text-gray-300">
                  Atau lanjutkan dengan
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleGoogleSignIn}>
              {/* SVG Google */}
              Daftar dengan Google
            </Button>

            <div className="mt-6 text-center text-sm text-gray-300">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-medium text-[#C68EFD] hover:text-[#E9A5F1]">
                Masuk
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </BackgroundGradientAnimation>
  );
}