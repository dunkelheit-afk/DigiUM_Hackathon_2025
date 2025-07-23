// app/login/page.tsx
'use client';

import React, { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
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
import { createClient } from '@/lib/supabase/client';

// Utility function to combine class names
const cn = (...inputs: (string | boolean | undefined | null)[]) => {
  return inputs.filter(Boolean).join(' ');
};

// --- BackgroundGradientAnimation Component (Diintegrasikan dan Diperbaiki) ---
const BackgroundGradientAnimation = ({
  children,
  containerClassName,
}: {
  children?: React.ReactNode;
  containerClassName?: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const curX = useRef(0);
  const curY = useRef(0);
  const tgX = useRef(0);
  const tgY = useRef(0);

  useEffect(() => {
    document.body.style.setProperty("--gradient-background-start", "rgb(26, 35, 126)");
    document.body.style.setProperty("--gradient-background-end", "rgb(76, 29, 149)");
    document.body.style.setProperty("--first-color", "0, 221, 255");
    document.body.style.setProperty("--second-color", "255, 0, 110");
    document.body.style.setProperty("--third-color", "178, 102, 255");
    document.body.style.setProperty("--fourth-color", "0, 128, 255");
    document.body.style.setProperty("--fifth-color", "128, 0, 128");
    document.body.style.setProperty("--pointer-color", "0, 221, 255");
    document.body.style.setProperty("--size", "80%");
    document.body.style.setProperty("--blending-value", "hard-light");
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    function move() {
      if (!interactiveRef.current) return;
      curX.current += (tgX.current - curX.current) / 20;
      curY.current += (tgY.current - curY.current) / 20;
      interactiveRef.current.style.transform = `translate(${Math.round(curX.current)}px, ${Math.round(curY.current)}px)`;
      animationFrameId = requestAnimationFrame(move);
    }
    animationFrameId = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      tgX.current = event.clientX - rect.left;
      tgY.current = event.clientY - rect.top;
    }
  };

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  return (
    <div
      className={cn("h-screen w-screen relative overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]", containerClassName)}
      onMouseMove={handleMouseMove}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className="absolute z-20 w-full">{children}</div>
      <div className={cn("gradients-container h-full w-full blur-lg", isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]")}>
        <motion.div
          className={cn(`absolute [background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)_no-repeat]`, `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`, `[transform-origin:center_center]`, `opacity-100`)}
          animate={{ translateY: ["-50%", "50%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={cn(`absolute [background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]`, `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`, `[transform-origin:calc(50%-400px)]`, `opacity-100`)}
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={cn(`absolute [background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]`, `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`, `[transform-origin:calc(50%+400px)]`, `opacity-100`)}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={cn(`absolute [background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]`, `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`, `[transform-origin:calc(50%-200px)]`, `opacity-70`)}
          animate={{ translateX: ["-50%", "50%", "-50%"], translateY: ["-10%", "10%", "-10%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={cn(`absolute [background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]`, `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]`, `[transform-origin:calc(50%-800px)_calc(50%+800px)]`, `opacity-100`)}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <div ref={interactiveRef} className={cn(`absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`, `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2`, `opacity-70`)}></div>
      </div>
    </div>
  );
};


// --- LoginPage Component ---
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
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      toast({
        title: "Login Gagal",
        description: result.error || "Kredensial tidak valid. Silakan coba lagi.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login Berhasil!",
        description: "Anda sedang diarahkan ke dashboard.",
        variant: "default",
      });
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <BackgroundGradientAnimation>
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-screen">
        <Card className="relative w-full max-w-md space-y-8 p-8 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/20 text-white [filter:drop-shadow(0_15px_25px_rgba(0,0,0,0.3))]">
          <Link href="/" className="absolute top-4 left-4">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-300 hover:bg-white/20 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Kembali ke halaman utama</span>
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
              <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M48 24.4C48 22.9 47.9 21.4 47.6 20H24.5V28.5H38.2C37.5 32.1 35.7 35.1 32.6 37.1V43.1H40.5C45.5 38.2 48 31.9 48 24.4Z" fill="#4285F4"/>
                <path d="M24.5 48C31.1 48 36.8 45.8 40.5 43.1L32.6 37.1C30.2 38.7 27.6 39.6 24.5 39.6C18.2 39.6 12.9 35.6 11.1 30.1H3.1V36.3C6.8 43.4 15 48 24.5 48Z" fill="#34A853"/>
                <path d="M11.1 30.1C10.6 28.6 10.3 27.1 10.3 25.5C10.3 23.9 10.6 22.4 11.1 20.9V14.7H3.1C1.2 18.3 0 21.8 0 25.5C0 29.2 1.2 32.7 3.1 36.3L11.1 30.1Z" fill="#FBBC05"/>
                <path d="M24.5 9.5C28 9.5 31.3 10.7 33.8 13.1L40.7 6.2C36.8 2.3 31.1 0 24.5 0C15 0 6.8 4.6 3.1 11.7L11.1 17.9C12.9 12.4 18.2 8.4 24.5 8.4" fill="#EA4335"/>
              </svg>
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
