// app/register/page.tsx
'use client';

import React, { useEffect, useRef, useState } from "react";
import Link from 'next/link'; // Diaktifkan kembali Next.js Link
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation'; // Diaktifkan kembali Next.js useRouter
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client'; // Diaktifkan kembali Supabase client import

// Utility function to combine class names
const cn = (...inputs: (string | boolean | undefined | null)[]) => {
  return inputs.filter(Boolean).join(' ');
};

// --- BackgroundGradientAnimation Component ---
export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(26, 35, 126)",
  gradientBackgroundEnd = "rgb(76, 29, 149)",
  firstColor = "0, 221, 255",
  secondColor = "255, 0, 110",
  thirdColor = "178, 102, 255",
  fourthColor = "0, 128, 255",
  fifthColor = "128, 0, 128",
  pointerColor = "0, 221, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);

  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  useEffect(() => {
    document.body.style.setProperty(
      "--gradient-background-start",
      gradientBackgroundStart
    );
    document.body.style.setProperty(
      "--gradient-background-end",
      gradientBackgroundEnd
    );
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--fourth-color", fourthColor);
    document.body.style.setProperty("--fifth-color", fifthColor);
    document.body.style.setProperty("--pointer-color", pointerColor);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, [gradientBackgroundStart, gradientBackgroundEnd, firstColor, secondColor, thirdColor, fourthColor, fifthColor, pointerColor, size, blendingValue]);

  useEffect(() => {
    let animationFrameId: number;
    function move() {
      if (!interactiveRef.current) {
        return;
      }
      setCurX(prevCurX => prevCurX + (tgX - prevCurX) / 20);
      setCurY(prevCurY => prevCurY + (tgY - prevCurY) / 20);
      interactiveRef.current.style.transform = `translate(${Math.round(
        curX
      )}px, ${Math.round(curY)}px)`;
      animationFrameId = requestAnimationFrame(move);
    }

    animationFrameId = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animationFrameId);
  }, [curX, curY, tgX, tgY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  return (
    <div
      className={cn(
        "h-screen w-screen relative overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={cn("absolute z-20 w-full", className)}>{children}</div>
      <div
        className={cn(
          "gradients-container h-full w-full blur-lg",
          isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]"
        )}
      >
        <motion.div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:center_center]`,
            `opacity-100`
          )}
          animate={{ translateY: ["-50%", "50%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        <motion.div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%-400px)]`,
            `opacity-100`
          )}
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        ></motion.div>
        <motion.div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%+400px)]`,
            `opacity-100`
          )}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        ></motion.div>
        <motion.div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%-200px)]`,
            `opacity-70`
          )}
          animate={{ translateX: ["-50%", "50%", "-50%"], translateY: ["-10%", "10%", "-10%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        <motion.div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]`,
            `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`,
            `[transform-origin:calc(50%-800px)_calc(50%+800px)]`,
            `opacity-100`
          )}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        ></motion.div>

        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2`,
              `opacity-70`
            )}
          ></div>
        )}
      </div>
    </div>
  );
};


// --- RegisterPage Component ---
// Zod schema for form validation
const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Nama lengkap minimal 2 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
  confirmPassword: z.string().min(6, { message: "Konfirmasi password minimal 6 karakter." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok.",
  path: ["confirmPassword"], // Path for the error message
});
type FormData = z.infer<typeof registerSchema>; // Infer type from schema

export default function RegisterPage() {
  const { toast } = useToast(); // Hook for displaying toasts
  const router = useRouter(); // Inisialisasi useRouter
  const supabase = createClient(); // Inisialisasi klien Supabase

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    console.log("Registering user:", data);
    try {
      // Menggunakan Supabase untuk pendaftaran
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`, // Sesuaikan URL callback Anda
        },
      });

      if (error) {
        toast({
          title: 'Registrasi Gagal',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Registrasi Berhasil',
          description: 'Silakan periksa email Anda untuk verifikasi.',
        });
        router.push('/login'); // Arahkan pengguna ke halaman login
      }
    } catch (error: unknown) {
      toast({
        title: "Pendaftaran Gagal",
        description: (error as Error).message || "Terjadi kesalahan yang tidak diketahui.",
        variant: "destructive",
      });
    }
  };

  // Handle Google OAuth sign-in
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`, // Sesuaikan URL callback Anda
        },
      });

      if (error) {
        toast({
          title: "Login Google Gagal",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Mengarahkan ke Google...",
          description: "Anda akan diarahkan ke halaman login Google.",
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Login Google Gagal",
        description: (error as Error).message || "Terjadi kesalahan yang tidak diketahui saat login Google.",
        variant: "destructive",
      });
    }
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
              <div>
                <Label htmlFor="fullName" className="text-gray-200">Nama Lengkap</Label>
                <Input id="fullName" {...register("fullName")} className="bg-white/10 border-white/20 text-white focus:ring-[#C68EFD]"/>
                {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-200">Alamat Email</Label>
                <Input id="email" type="email" {...register("email")} className="bg-white/10 border-white/20 text-white focus:ring-[#C68EFD]"/>
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} className="bg-white/10 border-white/20 text-white focus:ring-[#C68EFD]"/>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="bg-white/10 border-white/20 text-white focus:ring-[#C68EFD]"/>
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
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
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="#4285F4" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 265.2 0 128.5 110.3 19.2 244 19.2c71.2 0 130.2 27.7 175.2 72.2L361.8 142.7C328.2 113.2 290.7 96 244 96c-88.6 0-160.2 71.6-160.2 160.2s71.6 160.2 160.2 160.2c93.1 0 144.3-65.8 149.9-105.2H244v-66.2h244z"></path>
                <path fill="#34A853" d="M24.5 48C31.1 48 36.8 45.8 40.5 43.1L32.6 37.1C30.2 38.7 27.6 39.6 24.5 39.6C18.2 39.6 12.9 35.6 11.1 30.1H3.1V36.3C6.8 43.4 15 48 24.5 48Z"></path>
                <path fill="#FBBC05" d="M11.1 30.1C10.6 28.6 10.3 27.1 10.3 25.5C10.3 23.9 10.6 22.4 11.1 20.9V14.7H3.1C1.2 18.3 0 21.8 0 25.5C0 29.2 1.2 32.7 3.1 36.3L11.1 30.1Z"></path>
                <path fill="#EA4335" d="M24.5 9.5C28 9.5 31.3 10.7 33.8 13.1L40.7 6.2C36.8 2.3 31.1 0 24.5 0C15 0 6.8 4.6 3.1 11.7L11.1 17.9C12.9 12.4 18.2 8.4 24.5 8.4"></path>
              </svg>
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
