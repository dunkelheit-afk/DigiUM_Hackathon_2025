import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv

# Muat environment variables dari file .env jika ada (untuk development lokal)
# Baris ini tidak akan berpengaruh saat di-deploy di Vercel
load_dotenv() 

# Inisialisasi aplikasi Flask
app = Flask(__name__)
CORS(app) 

# Inisialisasi Supabase Client
supabase = None
try:
    # Ambil URL dan Key dari environment variables
    # Saat lokal, ini akan diambil dari file .env. Saat di Vercel, akan diambil dari pengaturan Vercel.
    url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    
    if not url or not key:
        # Pesan error ini akan muncul di log Vercel jika variabel tidak ditemukan
        raise ValueError("SUPABASE_URL atau SUPABASE_KEY tidak ditemukan di environment variables.")
        
    supabase: Client = create_client(url, key)
except Exception as e:
    # Mencetak error yang sebenarnya ke log untuk debugging
    print(f"ERROR: Gagal menginisialisasi Supabase. {e}")
    supabase = None

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Endpoint untuk menerima data keuangan, melakukan analisis,
    menyimpan hasilnya, dan mengembalikan prediksi.
    """
    if not supabase:
        return jsonify({"error": "Konfigurasi Supabase di backend belum lengkap. Periksa log fungsi."}), 500

    # Mengambil data JSON dari request
    data = request.get_json()

    # Validasi field yang dibutuhkan
    try:
        user_id = data["user_id"]
        revenue = float(data["revenue"])
        cogs = float(data["cogs"])
        operating_expenses = float(data["operating_expenses"])
        total_assets = float(data["total_assets"])
        cash = float(data["cash"])
        total_liabilities = float(data["total_liabilities"])
        total_equity = float(data["total_equity"])
    except KeyError as e:
        return jsonify({"error": f"Field yang dibutuhkan tidak ada: {e}"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Pastikan semua input adalah angka yang valid."}), 400

    # Kalkulasi metrik keuangan
    laba_bersih = revenue - cogs - operating_expenses
    
    net_profit_margin = laba_bersih / revenue if revenue != 0 else 0
    current_ratio = cash / total_liabilities if total_liabilities != 0 else 0
    debt_to_equity = total_liabilities / total_equity if total_equity != 0 else 0
    roa = laba_bersih / total_assets if total_assets != 0 else 0
    asset_turnover = revenue / total_assets if total_assets != 0 else 0

    # Penilaian berdasarkan metrik (scoring)
    total_score = (1 if net_profit_margin >= 0.1 else 0) + \
                  (1 if current_ratio >= 1.2 else 0) + \
                  (1 if debt_to_equity < 1.0 else 0) + \
                  (1 if roa > 0.05 else 0) + \
                  (1 if asset_turnover > 0.5 else 0)
    
    # Klasifikasi dan rekomendasi berdasarkan total skor
    if total_score >= 4:
        klasifikasi = "Sehat"
        rekomendasi = "Kinerja keuangan sangat baik! Pertahankan efisiensi dan terus kembangkan usaha Anda."
    elif total_score >= 2:
        klasifikasi = "Cukup Sehat"
        rekomendasi = "Kinerja keuangan cukup baik, namun ada ruang untuk perbaikan. Fokus pada peningkatan margin laba dan efisiensi aset."
    else:
        klasifikasi = "Rentan"
        rekomendasi = "Perlu perhatian khusus. Evaluasi struktur biaya, manajemen utang, dan strategi penjualan untuk meningkatkan kesehatan finansial."

    # Menyiapkan data untuk disimpan ke Supabase
    record_to_insert = {
        'user_id': user_id,
        'revenue': revenue,
        'cogs': cogs,
        'operating_expenses': operating_expenses,
        'total_assets': total_assets,
        'cash': cash,
        'total_liabilities': total_liabilities,
        'total_equity': total_equity,
        'prediction_status': klasifikasi,
        'recommendation': rekomendasi,
        'net_profit_margin': net_profit_margin,
        'current_ratio': current_ratio,
        'debt_to_equity': debt_to_equity,
        'roa': roa,
        'asset_turnover': asset_turnover
    }

    # Menyimpan data ke tabel 'analysis_records' di Supabase
    try:
        api_response = supabase.table('analysis_records').insert(record_to_insert).execute()
        # Cek jika ada error dari Supabase API
        if api_response.error:
            raise Exception(api_response.error.message)
    except Exception as e:
        print(f"Supabase insertion error: {str(e)}") # Log error untuk debugging
        return jsonify({"error": f"Gagal menyimpan ke Supabase dari backend: {str(e)}"}), 500

    # Mengembalikan hasil prediksi dan rekomendasi ke client
    return jsonify({
        "prediction_status": klasifikasi,
        "recommendation": rekomendasi,
    })

# Baris ini dibutuhkan untuk menjalankan server Flask secara lokal
if __name__ == "__main__":
    # Port 5001 digunakan agar tidak bentrok dengan port default Next.js (3000) atau Vite (5173)
    app.run(debug=True, port=5001)
