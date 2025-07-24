import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
# HAPUS BARIS INI: from dotenv import load_dotenv

# HAPUS BARIS INI: load_dotenv()

app = Flask(__name__)
CORS(app) 

supabase = None
try:
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        # Pesan error ini akan muncul di log Vercel jika variabel tidak ditemukan
        raise ValueError("SUPABASE_URL atau SUPABASE_KEY tidak ditemukan di environment variables Vercel.")
    supabase: Client = create_client(url, key)
except Exception as e:
    # Mencetak error yang sebenarnya ke log Vercel untuk debugging
    print(f"ERROR: Gagal menginisialisasi Supabase. {e}")
    supabase = None

@app.route('/api/predict', methods=['POST'])
def predict():
    if not supabase:
        return jsonify({"error": "Konfigurasi Supabase di backend belum lengkap. Periksa log fungsi di Vercel."}), 500

    # ... sisa kode Anda tetap sama ...
    data = request.get_json()

    try:
        user_id = data["user_id"]
        revenue = data["revenue"]
        cogs = data["cogs"]
        operating_expenses = data["operating_expenses"]
        total_assets = data["total_assets"]
        cash = data["cash"]
        total_liabilities = data["total_liabilities"]
        total_equity = data["total_equity"]
    except KeyError as e:
        return jsonify({"error": f"Field yang dibutuhkan tidak ada: {e}"}), 400

    laba_bersih = revenue - cogs - operating_expenses
    
    net_profit_margin = laba_bersih / revenue if revenue != 0 else 0
    current_ratio = cash / total_liabilities if total_liabilities != 0 else 0
    debt_to_equity = total_liabilities / total_equity if total_equity != 0 else 0
    roa = laba_bersih / total_assets if total_assets != 0 else 0
    asset_turnover = revenue / total_assets if total_assets != 0 else 0

    total_score = (1 if net_profit_margin >= 0.1 else 0) + \
                  (1 if current_ratio >= 1.2 else 0) + \
                  (1 if debt_to_equity < 1.0 else 0) + \
                  (1 if roa > 0.05 else 0) + \
                  (1 if asset_turnover > 0.5 else 0)
    
    if total_score >= 4:
        klasifikasi = "Sehat"
        rekomendasi = "Kinerja keuangan sangat baik! Pertahankan efisiensi dan terus kembangkan usaha Anda."
    elif total_score >= 2:
        klasifikasi = "Cukup Sehat"
        rekomendasi = "Kinerja keuangan cukup baik, namun ada ruang untuk perbaikan. Fokus pada peningkatan margin laba dan efisiensi aset."
    else:
        klasifikasi = "Rentan"
        rekomendasi = "Perlu perhatian khusus. Evaluasi struktur biaya, manajemen utang, dan strategi penjualan untuk meningkatkan kesehatan finansial."

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

    try:
        api_response = supabase.table('analysis_records').insert(record_to_insert).execute()
        if len(api_response.data) == 0 and api_response.error:
             raise Exception(api_response.error.message)
    except Exception as e:
        return jsonify({"error": f"Gagal menyimpan ke Supabase dari backend: {str(e)}"}), 500

    return jsonify({
        "prediction_status": klasifikasi,
        "recommendation": rekomendasi,
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)