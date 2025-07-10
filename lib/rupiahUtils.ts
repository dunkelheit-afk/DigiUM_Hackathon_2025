// --- FUNGSI HELPER UNTUK FORMAT ANGKA ---
const formatRupiah = (value: number | ''): string => {
  if (value === '' || value === null || isNaN(Number(value))) return '';
  return new Intl.NumberFormat('id-ID').format(Number(value));
};

const parseRupiah = (value: string): number | '' => {
  if (value === '') return '';
  const numericString = value.replace(/[^0-9]/g, '');
  return numericString ? Number(numericString) : '';
};