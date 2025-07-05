// hooks/useInView.ts
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname dari Next.js

/**
 * Hook untuk mendeteksi apakah elemen terlihat di viewport.
 * Menggunakan Intersection Observer API.
 *
 * @param options Opsi untuk Intersection Observer (misalnya, threshold).
 * @returns [ref, inView] - ref untuk elemen yang akan diobservasi, dan boolean inView.
 */
export function useInView(options?: IntersectionObserverInit) {
  // Mengubah tipe ref menjadi HTMLDivElement | null untuk mengatasi type error
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const pathname = usePathname(); // Mendapatkan path URL saat ini

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup function: hentikan observasi saat komponen di-unmount
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options, pathname]); // Tambahkan 'pathname' sebagai dependensi untuk me-reset observer pada navigasi

  return [ref, inView] as const;
}
