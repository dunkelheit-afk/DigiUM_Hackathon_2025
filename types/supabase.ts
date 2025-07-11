// types/supabase.ts

// File ini mendefinisikan tipe untuk database Supabase Anda.
// Menambahkan 'export' di sini akan membuat file ini menjadi sebuah modul.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      // Definisi untuk tabel 'profiles'
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          full_name: string | null
          avatar_url: string | null
          umkm_name: string | null
          phone: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          umkm_name?: string | null
          phone?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          umkm_name?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      // PERBAIKAN: Menambahkan definisi untuk tabel 'transactions'
      transactions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          tanggal: string
          deskripsi: string
          kategori: string
          jumlah: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          tanggal: string
          deskripsi: string
          kategori: string
          jumlah: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          tanggal?: string
          deskripsi?: string
          kategori?: string
          jumlah?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      // PERBAIKAN: Menambahkan definisi untuk tabel 'analysis_records'
      analysis_records: {
        Row: {
            id: number
            created_at: string
            user_id: string
            revenue: number
            cogs: number
            operating_expenses: number
            total_assets: number
            cash: number
            total_liabilities: number
            total_equity: number
            prediction_status: string
            net_profit_margin: number
            current_ratio: number
            debt_to_equity: number
            roa: number
            asset_turnover: number
            recommendation: string
        }
        Insert: {
            id?: number
            created_at?: string
            user_id: string
            revenue: number
            cogs: number
            operating_expenses: number
            total_assets: number
            cash: number
            total_liabilities: number
            total_equity: number
            prediction_status: string
            net_profit_margin: number
            current_ratio: number
            debt_to_equity: number
            roa: number
            asset_turnover: number
            recommendation: string
        }
        Update: {
            id?: number
            created_at?: string
            user_id?: string
            revenue?: number
            cogs?: number
            operating_expenses?: number
            total_assets?: number
            cash?: number
            total_liabilities?: number
            total_equity?: number
            prediction_status?: string
            net_profit_margin?: number
            current_ratio?: number
            debt_to_equity?: number
            roa?: number
            asset_turnover?: number
            recommendation?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_records_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
