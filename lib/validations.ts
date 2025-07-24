import { z } from 'zod';

export const createTransactionSchema = z.object({
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Format tanggal harus YYYY-MM-DD",
  }),

  kategori: z.enum([
    "Pendapatan Penjualan",
    "HPP",
    "Biaya Operasional",
    "Pendapatan Lain",
    "Beban Lain"
  ], {
    errorMap: () => ({ message: "Kategori tidak valid" })
  }),

  deskripsi: z.string().min(1, {
    message: "Deskripsi tidak boleh kosong",
  }),

  jumlah: z.number().positive({
    message: "Jumlah harus angka positif lebih besar dari 0",
  }),
});

export const financialAnalysisSchema = z.object({
  revenue: z.number().min(0, "Pendapatan tidak boleh negatif"),
  cogs: z.number().min(0, "HPP tidak boleh negatif"),
  operating_expenses: z.number().min(0, "Biaya operasional tidak boleh negatif"),
  total_assets: z.number().min(0, "Total aset tidak boleh negatif"),
  cash: z.number().min(0, "Kas tidak boleh negatif"),
  total_liabilities: z.number().min(0, "Total kewajiban tidak boleh negatif"),
  total_equity: z.number().min(0, "Total ekuitas tidak boleh negatif"),
});