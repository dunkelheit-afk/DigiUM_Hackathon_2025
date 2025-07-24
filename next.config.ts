import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Konfigurasi untuk meneruskan (proxy) permintaan dari frontend Next.js
   * ke backend server Python. Ini penting agar API prediksi bisa dipanggil.
   */
  async rewrites() {
    return [
      {
        // Setiap permintaan ke path `/api/predict` di aplikasi Next.js...
        source: '/api/predict',
        // ...akan secara internal diteruskan ke server Python yang berjalan di port 5328.
        // Port ini adalah default yang digunakan oleh Vercel untuk backend Python.
        destination: 'http://127.0.0.1:5328/api/predict',
      },
    ];
  },

  /**
   * Konfigurasi untuk mengizinkan Next.js memuat gambar dari domain eksternal.
   * Menggunakan `remotePatterns` lebih aman daripada `domains` yang sudah usang.
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // -- TAMBAHKAN BLOK INI --
      {
        protocol: 'https',
        hostname: 'igsxptrenncbnspoqird.supabase.co',
      },
      // -----------------------
    ],
  },
};

export default nextConfig;