// app/login/page.tsx
'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation'; // <-- Import useRouter

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
import { createClient } from '@/lib/supabase/client'; // <-- Import Supabase client

// Skema validasi Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password cannot be empty." }), // Minimal 1 karakter
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter(); // <-- Inisialisasi router

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // --- FUNGSI ON SUBMIT DIPERBARUI ---
  const onSubmit = async (data: FormData) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      toast({
        title: "Login Failed",
        description: result.error || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login Successful!",
        description: "You are being redirected to your dashboard.",
        variant: "default",
      });
      // Arahkan ke dashboard setelah berhasil login
      router.push('/dashboard');
      router.refresh(); // Refresh halaman untuk memastikan state server terbaru
    }
  };

  // --- FUNGSI UNTUK GOOGLE SIGN-IN ---
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
    <div
      className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{ backgroundImage: `url('/bsvbg.jpg')` }}
    >
      <Card
        className="w-full max-w-md space-y-8 p-8 shadow-lg rounded-2xl
                   transition-all duration-700 ease-out hover:shadow-xl hover:scale-[1.01] hover:ring-4 hover:ring-purple-300 hover:ring-offset-2 hover:ring-offset-gray-50
                   animate-in fade-in zoom-in-50"
      >
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-gray-900">
            Welcome Back!
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-gray-600">
            Sign in to your Digi<span className="text-purple-600">UM</span> account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Sign In
            </Button>
          </form>

           <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
            <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 2.04-4.82 2.04-5.82 0-9.6-4.82-9.6-9.6s3.78-9.6 9.6-9.6c2.58 0 4.6.96 6.18 2.4l2.16-2.16C19.38 1.18 16.38 0 12.48 0 5.82 0 .12 5.7 .12 12.36s5.7 12.36 12.36 12.36c6.66 0 11.7-4.44 11.7-11.52 0-.78-.06-1.56-.18-2.34H12.48z"></path></svg>
            Sign In with Google
          </Button>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-purple-600 hover:text-purple-500">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}