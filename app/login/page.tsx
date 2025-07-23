// app/login/page.tsx
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
// IMPORT komponennya dari file terpisah
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

const loginSchema = z.object({
  email: z.string().email({ message: "Alamat email tidak valid." }),
  password: z.string().min(1, { message: "Password tidak boleh kosong." }),
});
type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    // Diperbarui untuk menggunakan Supabase Auth
    const { error } = await createClient().auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast({
        title: "Login Gagal",
        description: error.message || "Kredensial tidak valid. Silakan coba lagi.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login Berhasil!",
        description: "Anda sedang diarahkan...",
        variant: "default",
      });
      // Middleware akan menangani pengarahan ke dasbor yang benar
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  return (
    <BackgroundGradientAnimation>
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-screen">
        <Card className="relative w-full max-w-md space-y-8 p-8 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/20 text-white [filter:drop-shadow(0_15px_25px_rgba(0,0,0,0.3))]">
          <Link href="/" className="absolute top-4 left-4">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-300 hover:bg-white/20 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
              Selamat Datang!
            </CardTitle>
            <CardDescription className="mt-2 text-sm text-gray-200">
              Masuk ke akun Digi<span className="text-[#C68EFD]">UM</span> Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <Label htmlFor="email" className="text-gray-200">Alamat Email</Label>
                <Input id="email" type="email" {...register("email")} className="bg-white/10 border-white/20 text-white focus:ring-[#C68EFD]"/>
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <Input id="password" type="password" {...register("password")} className="bg-white/10 border-white/20 text-white focus:ring-[#C68EFD]"/>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-[#8F87F1] hover:bg-[#C68EFD] text-white">
                Masuk
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
              Masuk dengan Google
            </Button>

            <div className="mt-6 text-center text-sm text-gray-300">
              Belum punya akun?{" "}
              <Link href="/register" className="font-medium text-[#C68EFD] hover:text-[#E9A5F1]">
                Daftar
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </BackgroundGradientAnimation>
  );
}