# main.py

import os
import joblib
import pandas as pd
import google.generativeai as genai
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Muat environment variables dari file .env
load_dotenv()

# Konfigurasi Google Gemini API dengan kunci Anda
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY tidak ditemukan di file .env")
genai.configure(api_key=GOOGLE_API_KEY)

# Inisialisasi aplikasi FastAPI
app = FastAPI()

# Konfigurasi CORS
# Dapatkan URL Vercel dari environment variable
VERCEL_URL = os.getenv('VERCEL_URL')

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

# Jika ada VERCEL_URL, tambahkan ke daftar origin
if VERCEL_URL:
    origins.append(f"https://{VERCEL_URL}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Definisikan struktur data input mentah
class RawFinancialData(BaseModel):
    revenue: float
    cogs: float
    operating_expenses: float
    total_assets: float
    total_liabilities: float
    total_equity: float

# Muat model prediksi status
model = joblib.load('model_kesehatan_umkm.joblib')

@app.post("/predict")
def predict_status(data: RawFinancialData):
    # --- Bagian 1: Perhitungan & Prediksi Lokal ---
    try:
        laba_bersih = data.revenue - data.cogs - data.operating_expenses
        net_profit_margin = laba_bersih / data.revenue if data.revenue > 0 else 0
        current_ratio = data.total_assets / data.total_liabilities if data.total_liabilities > 0 else 0
        debt_to_equity = data.total_liabilities / data.total_equity if data.total_equity > 0 else 0
        roa = laba_bersih / data.total_assets if data.total_assets > 0 else 0
        asset_turnover = data.revenue / data.total_assets if data.total_assets > 0 else 0
    except Exception as e:
        return {"error": f"Error during feature calculation: {str(e)}"}

    calculated_features = {
        'net_profit_margin': net_profit_margin,
        'current_ratio': current_ratio,
        'debt_to_equity': debt_to_equity,
        'roa': roa,
        'asset_turnover': asset_turnover
    }
    input_df = pd.DataFrame([calculated_features])
    predicted_status_label = model.predict(input_df)[0]

    # --- Bagian 2: Membuat Rekomendasi dengan Gemini AI ---
    try:
        # =================================================================
        # === PROMPT DIPERBARUI AGAR LEBIH SINGKAT & ON POINT ===
        # =================================================================
        prompt = f"""
        Anda adalah konsultan keuangan UMKM.
        Data keuangan:
        - Status Prediksi: {predicted_status_label}
        - Margin Laba Bersih: {net_profit_margin:.2%}
        - Rasio Lancar: {current_ratio:.2f}
        - Utang thd. Ekuitas: {debt_to_equity:.2f}

        Berdasarkan data di atas, berikan 3 rekomendasi **singkat** dan **langsung ke intinya** dalam format poin-poin markdown.
        Setiap poin harus berupa satu kalimat aksi yang jelas.
        Hindari paragraf pembuka atau penutup.
        Contoh:
        - Tekan biaya operasional dengan mencari supplier alternatif.
        - Tinjau ulang struktur harga untuk meningkatkan margin laba.
        - Fokus pada penjualan produk paling laris untuk menaikkan pendapatan.
        """
        # =================================================================
        
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        response = gemini_model.generate_content(prompt)
        recommendation_text = response.text

    except Exception as e:
        recommendation_text = f"Tidak dapat menghasilkan rekomendasi AI saat ini. Error: {str(e)}"

    # --- Bagian 3: Mengembalikan Semua Hasil ---
    final_result = {
        "prediction_status": predicted_status_label,
        "net_profit_margin": net_profit_margin,
        "current_ratio": current_ratio,
        "debt_to_equity": debt_to_equity,
        "roa": roa,
        "asset_turnover": asset_turnover,
        "recommendation": recommendation_text
    }

    return final_result

@app.get("/")
def root():
    return {"message": "API Prediksi & Rekomendasi Aktif"}
