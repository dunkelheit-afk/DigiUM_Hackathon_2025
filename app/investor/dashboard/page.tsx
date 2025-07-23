'use client';

import React from 'react';
import Image from 'next/image'; // Menggunakan Image dari Next.js untuk optimasi gambar
import { Button } from '@/components/ui/button'; // Asumsi Button dari shadcn/ui atau sejenisnya

// Dummy data untuk UMKM
const dummyUmkm = [
  {
    id: '1',
    name: 'Kopi Kenangan Senja',
    category: 'Kuliner',
    description: 'Menyajikan kopi spesial dengan biji pilihan dari petani lokal, cocok untuk menemani senja Anda.',
    imageUrl: '', // Placeholder image changed to '' (empty string)
  },
  {
    id: '2',
    name: 'Batik Nusantara Jaya',
    category: 'Fashion & Kerajinan',
    description: 'Koleksi batik tulis dan cap dengan motif tradisional dan modern, melestarikan budaya Indonesia.',
    imageUrl: '', // Placeholder image changed to '' (empty string)
  },
  {
    id: '3',
    name: 'Agro Farm Organik',
    category: 'Pertanian',
    description: 'Menyediakan sayuran dan buah-buahan organik segar langsung dari kebun, bebas pestisida.',
    imageUrl: '', // Placeholder image changed to '' (empty string)
  },
  {
    id: '4',
    name: 'Keripik Pedas Juara',
    category: 'Kuliner',
    description: 'Keripik singkong renyah dengan bumbu pedas nampol, bikin nagih!',
    imageUrl: '', // Placeholder image changed to '' (empty string)
  },
  {
    id: '5',
    name: 'Workshop Kayu Kreatif',
    category: 'Kerajinan',
    description: 'Produk kerajinan tangan dari kayu daur ulang dengan desain unik dan fungsional.',
    imageUrl: '', // Placeholder image changed to '' (empty string)
  },
  {
    id: '6',
    name: 'Jasa Laundry Kilat',
    category: 'Jasa',
    description: 'Layanan laundry profesional dengan proses cepat dan hasil bersih maksimal.',
    imageUrl: '', // Placeholder image changed to '' (empty string)
  },
];

export default function UMKMDashboard() {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen rounded-lg shadow-inner">
      <h1 className="text-4xl font-extrabold text-purple-800 mb-8 text-center">
        Jelajahi UMKM Unggulan
      </h1>

      <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
        Temukan berbagai peluang investasi pada UMKM lokal yang inovatif dan berpotensi tinggi.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyUmkm.map((umkm) => (
          <div
            key={umkm.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
          >
            <div className="relative w-full h-48">
              {/* Menggunakan placeholder '' (empty string) dan menambahkan fallback untuk tampilan */}
              <Image
                src={umkm.imageUrl}
                alt={umkm.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-xl"
                // Menambahkan gaya latar belakang jika src adalah ''
                style={{ backgroundColor: umkm.imageUrl === '' ? '#cccccc' : undefined }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/400x250/cccccc/333333?text=Error+Loading+Image`;
                  (e.target as HTMLImageElement).style.backgroundColor = '#cccccc'; // Memastikan latar belakang tetap ada
                }}
              />
              {umkm.imageUrl === '' && ( // Kondisi disesuaikan untuk string kosong
                <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm font-semibold">
                  [Gambar UMKM]
                </div>
              )}
            </div>
            <div className="p-6">
              <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                {umkm.category}
              </span>
              <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">{umkm.name}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{umkm.description}</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                Lihat Detail
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button variant="outline" className="text-purple-700 border-purple-700 hover:bg-purple-50 hover:text-purple-800 transition-colors duration-200">
          Muat Lebih Banyak UMKM
        </Button>
      </div>
    </div>
  );
}
