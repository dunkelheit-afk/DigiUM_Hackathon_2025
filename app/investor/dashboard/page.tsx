'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image'; // Menggunakan Image dari Next.js untuk optimasi gambar
import { Button } from '@/components/ui/button'; // Asumsi Button dari shadcn/ui atau sejenisnya
import { Input } from '@/components/ui/input'; // Mengimpor komponen Input
import { Search } from 'lucide-react'; // Mengimpor ikon pencarian

// Dummy data untuk UMKM
const dummyUmkm = [
  {
    id: '1',
    name: 'Kopi Kenangan Senja',
    category: 'Kuliner',
    description: 'Menyajikan kopi spesial dengan biji pilihan dari petani lokal, cocok untuk menemani senja Anda.',
    imageUrl: 'https://placehold.co/600x400/A9A2F8/FFFFFF?text=Kopi+Senja',
  },
  {
    id: '2',
    name: 'Batik Nusantara Jaya',
    category: 'Fashion & Kerajinan',
    description: 'Koleksi batik tulis dan cap dengan motif tradisional dan modern, melestarikan budaya Indonesia.',
    imageUrl: 'https://placehold.co/600x400/A9A2F8/FFFFFF?text=Batik+Nusantara',
  },
  {
    id: '3',
    name: 'Agro Farm Organik',
    category: 'Pertanian',
    description: 'Menyediakan sayuran dan buah-buahan organik segar langsung dari kebun, bebas pestisida.',
    imageUrl: 'https://placehold.co/600x400/A9A2F8/FFFFFF?text=Agro+Farm',
  },
  {
    id: '4',
    name: 'Keripik Pedas Juara',
    category: 'Kuliner',
    description: 'Keripik singkong renyah dengan bumbu pedas nampol, bikin nagih!',
    imageUrl: 'https://placehold.co/600x400/A9A2F8/FFFFFF?text=Keripik+Juara',
  },
  {
    id: '5',
    name: 'Workshop Kayu Kreatif',
    category: 'Kerajinan',
    description: 'Produk kerajinan tangan dari kayu daur ulang dengan desain unik dan fungsional.',
    imageUrl: 'https://placehold.co/600x400/A9A2F8/FFFFFF?text=Kayu+Kreatif',
  },
  {
    id: '6',
    name: 'Jasa Laundry Kilat',
    category: 'Jasa',
    description: 'Layanan laundry profesional dengan proses cepat dan hasil bersih maksimal.',
    imageUrl: 'https://placehold.co/600x400/A9A2F8/FFFFFF?text=Laundry+Kilat',
  },
];

export default function UMKMDashboard() {
  // --- BAGIAN BARU: State dan logika untuk pencarian ---
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUmkm = useMemo(() => {
    if (!searchQuery) {
      return dummyUmkm;
    }
    return dummyUmkm.filter(umkm =>
      umkm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      umkm.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);
  // --- AKHIR BAGIAN BARU ---

  return (
    <div className="w-full rounded-3xl shadow-2xl p-6 md:p-8 bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 bg-[length:400%_400%] animate-background-pan">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-4 text-center [text-shadow:_0_2px_4px_rgb(0_0_0_/_20%)]">
          Jelajahi UMKM Unggulan
        </h1>

        <p className="text-lg text-white/80 mb-8 text-center max-w-3xl mx-auto [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">
          Temukan berbagai peluang investasi pada UMKM lokal yang inovatif dan berpotensi tinggi di seluruh Indonesia.
        </p>

        {/* --- BAGIAN BARU: Kolom pencarian --- */}
        <div className="mb-10 max-w-lg mx-auto">
            <div className="relative">
                <Input 
                    type="text"
                    placeholder="Cari nama atau kategori UMKM..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-6 rounded-full bg-white/30 backdrop-blur-lg border border-white/40 text-gray-900 placeholder:text-gray-700 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-700" />
            </div>
        </div>
        {/* --- AKHIR BAGIAN BARU --- */}

        {/* PERUBAHAN: Menggunakan `filteredUmkm` untuk me-render kartu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUmkm.map((umkm) => (
            <div
              key={umkm.id}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-lg hover:backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-white/30 flex flex-col"
            >
              <div className="relative w-full h-48">
                <Image
                  src={umkm.imageUrl}
                  alt={`Gambar untuk ${umkm.name}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/600x400/E9D5FF/333333?text=Gagal+Muat`;
                  }}
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="inline-block bg-white/30 text-purple-900 text-xs font-semibold px-3 py-1 rounded-full mb-3 self-start">
                  {umkm.category}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{umkm.name}</h2>
                <p className="text-gray-800 text-sm mb-4 line-clamp-3 flex-grow">{umkm.description}</p>
                <Button className="w-full mt-auto bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                  Lihat Detail
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* --- BAGIAN BARU: Pesan jika tidak ada hasil pencarian --- */}
        {filteredUmkm.length === 0 && (
            <div className="text-center py-12 bg-white/20 backdrop-blur-lg rounded-2xl mt-8">
                <h3 className="text-xl font-semibold text-gray-900">Tidak Ditemukan</h3>
                <p className="text-gray-800 mt-2">UMKM dengan nama atau kategori &quot;{searchQuery}&quot; tidak ditemukan.</p>
            </div>
        )}
        {/* --- AKHIR BAGIAN BARU --- */}

        <div className="text-center mt-12">
          <Button variant="outline" className="bg-white/30 text-purple-900 border-purple-400 hover:bg-white/50 hover:text-purple-900 transition-colors duration-200">
            Muat Lebih Banyak UMKM
          </Button>
        </div>
      </div>
    </div>
  );
}
