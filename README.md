# DigiUM: Platform Pemberdayaan UMKM Indonesia

**DigiUM (Digital UMKM)** adalah platform web inovatif yang dirancang untuk memberdayakan Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia melalui digitalisasi keuangan. Proyek ini merupakan bagian dari **BI-OJK Hackathon 2025**.

Platform ini menyediakan alat pembukuan digital yang intuitif, analisis kesehatan keuangan otomatis berbasis *Rule-Based AI*, serta fitur *showcase* untuk meningkatkan visibilitas bisnis UMKM ke calon investor dan lembaga keuangan.

## Latar Belakang

Mayoritas UMKM di Indonesia masih menghadapi tantangan dalam pencatatan keuangan yang baik. Hal ini menyebabkan kesulitan dalam menilai kondisi bisnis, mengakses pembiayaan, dan mengelola risiko. DigiUM hadir sebagai solusi untuk menjembatani kesenjangan ini dengan teknologi yang mudah diakses dan digunakan.

## Tautan Proposal

Untuk pemahaman yang lebih mendalam mengenai latar belakang, tujuan, model bisnis, dan detail teknis dari proyek ini, Anda dapat melihat proposal lengkap kami di tautan berikut:

  - **[Lihat Proposal Proyek DigiUM (PDF)](https://drive.google.com/file/d/1qd_uTuGsfsIYEqq0RLoXpmcivyuc_wXe/view?usp=sharing)**

## Coba Langsung (Live Demo)

Anda dapat mencoba langsung aplikasi DigiUM yang telah kami deploy melalui tautan berikut:

  - [cite\_start]**[https://digium.vercel.app](https://www.google.com/search?q=https://digium.vercel.app)** [cite: 421, 455]
  
## Fitur Utama

  - **Pembukuan Digital Sederhana** : Antarmuka yang ramah pengguna untuk mencatat setiap transaksi pemasukan dan pengeluaran, menghasilkan laporan laba rugi secara otomatis.
  - **Analisis Kesehatan Keuangan Berbasis AI** : Memanfaatkan *Rule-Based AI* untuk mengklasifikasikan kondisi keuangan UMKM ke dalam kategori "Sehat", "Cukup", atau "Rentan" berdasarkan rasio keuangan standar.
  - **UMKM Showcase**: Sebuah etalase bagi UMKM untuk menampilkan profil bisnis mereka, menjangkau pelanggan baru, dan menarik minat investor potensial.
  - **Dashboard Interaktif**: Visualisasi data yang mudah dipahami, menampilkan ringkasan finansial, metrik kunci seperti *Net Profit Margin*, *Current Ratio*, dan lainnya, serta rekomendasi strategis dari AI.
  - **Chatbot AI Interaktif**: Asisten keuangan cerdas berbasis Gemini API yang dapat memberikan konsultasi dan evaluasi keuangan secara *real-time* kepada UMKM dan investor.

## Teknologi yang Digunakan

Proyek ini dibangun menggunakan tumpukan teknologi modern untuk memastikan performa, skalabilitas, dan pengalaman pengguna terbaik.

| Kategori | Teknologi |
| :--- | :--- |
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion |
| **Backend & Database** | Supabase, PostgreSQL |
| **Artificial Intelligence**| Python (Flask), Rule-Based AI, Google Gemini API |
| **Deployment**| Vercel, Render |

## Tim Pengembang

DigiUM dikembangkan oleh Tim Macipir yang berdedikasi:

  - **Adam Monhardi** - *Front-end Engineer* 
  - **Arsyad Faturrahman** - *Back-end Engineer* 
  - **Ariq Faishal Hanif** - *AI/ML Engineer* 

## Cara Menjalankan Proyek

1.  **Clone repositori:**

    ```bash
    git clone https://github.com/dunkelheit-afk/DigiUM_Hackathon_2025.git
    cd DigiUM_Hackathon_2025
    ```

2.  **Install dependensi:**

    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variables:**
    Buat file `.env.local` di root proyek dan isikan dengan kredensial Supabase dan API Key yang diperlukan.

4.  **Jalankan server pengembangan:**

    ```bash
    npm run dev
    ```

Buka [http://localhost:3000] di browser Anda untuk melihat hasilnya.

