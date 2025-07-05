// app/login/layout.tsx
import React from 'react';

// Ini adalah layout untuk rute /login.
// Biasanya digunakan untuk membungkus halaman login dengan layout khusus
// yang mungkin berbeda dari layout global (misalnya tanpa Navbar atau Footer).
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Anda bisa menambahkan styling atau komponen di sini yang hanya berlaku untuk halaman login.
    // Misalnya, div dengan background atau center alignment.
    // Untuk saat ini, kita hanya meneruskan children.
    <>{children}</>
  );
}
