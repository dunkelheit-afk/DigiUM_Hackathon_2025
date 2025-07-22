// components/sections/Footer.tsx
'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode; }) => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const navbarElement = document.getElementById('main-navbar');
      const navbarHeight = navbarElement ? navbarElement.offsetHeight : 0;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 24;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else if (href === "#hero") {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Link href={href} onClick={handleSmoothScroll} className="text-gray-700 hover:text-[#8F87F1] transition-colors duration-200">
      {children}
    </Link>
  );
};


export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-white text-gray-700 py-12 rounded-t-2xl shadow-2xl">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Kolom 1: Logo dan Deskripsi Singkat */}
        <div className="col-span-1 md:col-span-1 text-center md:text-left">
          <Link href="/" className="font-bold text-2xl transition-colors duration-200">
            <span className="text-black">Digi</span>
            <span className="text-[#8F87F1]">UM</span>
          </Link>
          <p className="text-sm mt-4 leading-relaxed text-gray-600">
            Platform terdepan untuk digitalisasi keuangan UMKM dan koneksi investor.
          </p>
          <div className="flex justify-center md:justify-start space-x-4 mt-6">
            <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-[#8F87F1] transition-all duration-200 will-change-transform hover:scale-110 hover:-translate-y-1">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-[#8F87F1] transition-all duration-200 will-change-transform hover:scale-110 hover:-translate-y-1">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-[#8F87F1] transition-all duration-200 will-change-transform hover:scale-110 hover:-translate-y-1">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-[#8F87F1] transition-all duration-200 will-change-transform hover:scale-110 hover:-translate-y-1">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Kolom 2: Tautan Cepat */}
        <div className="col-span-1 md:col-span-1 text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tautan Cepat</h3>
          <ul className="space-y-2 text-sm">
            <li><FooterLink href="#hero">Beranda</FooterLink></li>
            <li><FooterLink href="#features">Fitur</FooterLink></li>
            <li><FooterLink href="#umkm-showcase">Showcase</FooterLink></li>
            <li><FooterLink href="#testimonials">Testimoni</FooterLink></li>
            <li><FooterLink href="#pricing">Harga</FooterLink></li>
            <li><FooterLink href="#team">Tim</FooterLink></li>
          </ul>
        </div>

        {/* Kolom 3: Sumber Daya */}
        <div className="col-span-1 md:col-span-1 text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sumber Daya</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/blog" className="text-gray-700 hover:text-[#8F87F1] transition-colors duration-200">Blog</Link></li>
            <li><Link href="/help" className="text-gray-700 hover:text-[#8F87F1] transition-colors duration-200">Pusat Bantuan</Link></li>
            <li><Link href="/terms" className="text-gray-700 hover:text-[#8F87F1] transition-colors duration-200">Syarat & Ketentuan</Link></li>
            <li><Link href="/privacy" className="text-gray-700 hover:text-[#8F87F1] transition-colors duration-200">Kebijakan Privasi</Link></li>
          </ul>
        </div>

        {/* Kolom 4: Kontak */}
        <div className="col-span-1 md:col-span-1 text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hubungi Kami</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-center md:justify-start">
              <Mail size={16} className="mr-2 text-gray-500" />
              <a href="mailto:info@digium.com" className="text-gray-700 hover:text-[#8F87F1] transition-colors duration-200">DigiUM@gmail.com</a>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <Phone size={16} className="mr-2 text-gray-500" />
              <a href="tel:+628123456789" className="text-gray-700 hover:text-[#8F87F1] transition-colors duration-200">+62 812-3456-789</a>
            </li>
            <li className="flex items-start justify-center md:justify-start">
              <MapPin size={16} className="mr-2 text-gray-500 mt-1" />
              <span>Jl. Pharmindo, <br/>Bandung, Indonesia</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bagian Copyright */}
      <div className="border-t border-gray-300 mt-10 pt-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} DigiUM. Hak cipta dilindungi undang-undang.
      </div>
    </footer>
  );
}
