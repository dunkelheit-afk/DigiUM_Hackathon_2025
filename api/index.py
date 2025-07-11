import os
import joblib
import requests
import google.generativeai as genai
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Muat environment variables dari file .env (untuk pengembangan lokal)
load_dotenv()

# --- Konfigurasi Aplikasi FastAPI ---
app = FastAPI()

# --- Konfigurasi CORS ---
VERCEL_URL = os.getenv('VERCEL_URL')
origins = [
    "http://localhost:3000",
]
if VERCEL_URL:
    origins.append(f"https://{VERCEL_URL}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Konfigurasi Google Gemini AI ---
try:
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    if not GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY tidak ditemukan di environment variables")
    genai.configure(api_key=GOOGLE_API_KEY)
except Exception as e:
    print(f"Peringatan: Gagal mengkonfigurasi Gemini AI. Rekomendasi tidak akan tersedia. Error: {e}")


# --- Logika Pengunduhan Model Eksternal ---
MODEL_URL = 'https://github.com/dunkelheit-afk/DigiUM_Hackathon_2025/releases/download/V.1.1.1-model/model_kesehatan_umkm.joblib'
model_path = '/tmp/model_kesehatan_umkm.joblib'
model = None

def download_model():
    global model
    if not os.path.exists(model_path):
        print(f"Model tidak ditemukan, mengunduh dari {MODEL_URL}...")
        try:
            response = requests.get(MODEL_URL)
            response.raise_for_status()
            with open(model_path, 'wb') as f:
                f.write(response.content)
            print("Model berhasil diunduh.")
        except Exception as e:
            print(f"Gagal mengunduh model: {e}")
            return
    
    try:
        if model is None:
            model = joblib.load(model_path)
            print("Model berhasil dimuat.")
    except Exception as e:
        print(f"Gagal memuat model dari file: {e}")
        model = None

download_model()


# --- Definisi Model Data & Endpoint ---
class RawFinancialData(BaseModel):
    revenue: float
    cogs: float
    operating_expenses: float
    total_assets: float
    cash: float
    total_liabilities: float
    total_equity: float

@app.post("/api/predict")
def predict_status(data: RawFinancialData):
    if model is None:
        return {"error": "Model prediksi tidak tersedia."}, 500
    
    try:
        # Bagian 1: Prediksi Status Lokal
        laba_bersih = data.revenue - data.cogs - data.operating_expenses
        net_profit_margin = laba_bersih / data.revenue if data.revenue > 0 else 0
        current_ratio = data.cash / data.total_liabilities if data.total_liabilities > 0 else 0
        debt_to_equity = data.total_liabilities / data.total_equity if data.total_equity > 0 else 0
        roa = laba_bersih / data.total_assets if data.total_assets > 0 else 0
        asset_turnover = data.revenue / data.total_assets if data.total_assets > 0 else 0
        
        # PERBAIKAN: Membuat input untuk model tanpa menggunakan pandas
        # Pastikan urutan ini SAMA PERSIS dengan urutan kolom saat training model
        input_list = [
            net_profit_margin,
            current_ratio,
            debt_to_equity,
            roa,
            asset_turnover
        ]
        
        # Model scikit-learn mengharapkan input 2D (list of lists)
        input_for_prediction = [input_list]
        
        predicted_status_label = model.predict(input_for_prediction)[0]

    except Exception as e:
        return {"error": f"Error saat prediksi lokal: {str(e)}"}, 400

    # Bagian 2: Membuat Rekomendasi dengan Gemini AI
    recommendation_text = "Rekomendasi AI tidak tersedia saat ini."
    try:
        prompt = f"""
        Anda adalah konsultan keuangan UMKM.
        Data keuangan:
        - Status Prediksi: {predicted_status_label}
        - Margin Laba Bersih: {net_profit_margin:.2%}
        - Rasio Lancar: {current_ratio:.2f}
        - Utang thd. Ekuitas: {debt_to_equity:.2f}

        Berdasarkan data di atas, berikan 3 rekomendasi singkat dan langsung ke intinya dalam format poin-poin markdown.
        Setiap poin harus berupa satu kalimat aksi yang jelas. Hindari paragraf pembuka atau penutup.
        """
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        response = gemini_model.generate_content(prompt)
        recommendation_text = response.text
    except Exception as e:
        print(f"Gagal menghasilkan rekomendasi AI: {e}")

    # Bagian 3: Mengembalikan Semua Hasil
    return {
        "prediction_status": predicted_status_label,
        "net_profit_margin": net_profit_margin,
        "current_ratio": current_ratio,
        "debt_to_equity": debt_to_equity,
        "roa": roa,
        "asset_turnover": asset_turnover,
        "recommendation": recommendation_text
    }

@app.get("/")
def root():
    return {"message": "API Prediksi & Rekomendasi Aktif"}
