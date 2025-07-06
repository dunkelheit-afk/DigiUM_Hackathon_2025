// app/login/page.tsx
'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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

// Define validation schema using Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // <--- Tambahkan ini: Validasi saat nilai input berubah
  });

  // Function to handle form submission
  const onSubmit = (data: FormData) => {
    console.log("Login data:", data);
    // Here you would typically send data to your backend for authentication

    // Example: Show a success toast notification
    toast({
      title: "Login Successful!",
      description: "You have been logged in. Redirecting...",
      variant: "default",
    });

    // Example: Show an error toast notification (e.g., from backend response)
    // toast({
    //   title: "Login Failed",
    //   description: "Invalid credentials. Please try again.",
    //   variant: "destructive", // Requires 'destructive' variant in your toast.tsx
    // });

    // Simulate redirection
    setTimeout(() => {
      console.log("Redirecting to dashboard...");
    }, 2000);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{ backgroundImage: `url('/bsvbg.jpg')` }} // Background image
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
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email Input */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm
                             transition-all duration-200 focus:ring-2"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 font-medium bg-red-50 p-2 rounded-md">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm
                             transition-all duration-200 focus:ring-2"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 font-medium bg-red-50 p-2 rounded-md">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200">
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
              >
                Sign In
              </Button>
            </div>
          </form>

          {/* Register Link */}
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
