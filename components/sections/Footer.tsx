// components/sections/Footer.tsx
'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-white text-gray-700 py-12 rounded-t-2xl shadow-2xl">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Logo and Short Description */}
        <div className="col-span-1 md:col-span-1 text-center md:text-left">
          <Link href="#hero" className="font-bold text-2xl transition-colors duration-200"> {/* Link to Hero Section */}
            <span className="text-gray-900 hover:text-gray-700">Digi</span>
            <span className="text-purple-600 hover:text-purple-700">UM</span>
          </Link>
          <p className="text-sm mt-4 leading-relaxed text-gray-600">
            The leading platform for MSME financial digitalization and investor connections.
          </p>
          <div className="flex justify-center md:justify-start space-x-4 mt-6">
            <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-purple-600 transition-all duration-200 will-change-transform hover:scale-110 hover:-translate-y-1">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-purple-600 transition-all duration-200 will-change-transform hover:scale-110 hover:-translate-y-1">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-purple-600 transition-all duration-200 will-change-transform hover:scale-110 hover:-translate-y-1">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-purple-600 transition-all duration-200 will-change-transform hover:scale-110 hover:-translate-y-1">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div className="col-span-1 md:col-span-1 text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#hero" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">Home</Link></li> {/* Link to Hero Section */}
            <li><Link href="#umkm-showcase" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">Top MSMEs</Link></li> {/* Link to UMKM Showcase Section */}
            <li><Link href="#features" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">Services</Link></li> {/* Link to Features Section */}
            <li><Link href="#team" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">About</Link></li> {/* Link to Team Section */}
          </ul>
        </div>

        {/* Column 3: Services */}
        <div className="col-span-1 md:col-span-1 text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Services</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#digital-accounting" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">Digital Accounting</Link></li> {/* Link to specific feature */}
            <li><Link href="#msme-showcase-feature" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">MSME Showcase</Link></li> {/* Link to specific feature */}
            <li><Link href="#funding-feature" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">Funding</Link></li> {/* Link to specific feature */}
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="col-span-1 md:col-span-1 text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-center md:justify-start">
              <Mail size={16} className="mr-2 text-gray-500" />
              <a href="mailto:info@digium.com" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">DigiUM@gmail.com</a>
            </li>
            <li className="flex items-center justify-center md:justify-start">
              <Phone size={16} className="mr-2 text-gray-500" />
              <a href="tel:+628123456789" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">+62 812-3456-789</a>
            </li>
            <li className="flex items-start justify-center md:justify-start">
              <MapPin size={16} className="mr-2 text-gray-500 mt-1" />
              <span>Jl. Pharmindo, <br/>Bandung, Indonesia</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-300 mt-10 pt-6 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} DigiUM. All rights reserved.
      </div>
    </footer>
  );
}
