/** * @type {import('postcss-load-config').Config} 
 * Konfigurasi standar dan direkomendasikan untuk PostCSS pada proyek Next.js dengan Tailwind CSS.
 */
const config = {
  plugins: {
    /**
     * Plugin untuk memproses dan mengaplikasikan utility classes dari Tailwind CSS.
     */
    tailwindcss: {},
    /**
     * Plugin untuk secara otomatis menambahkan vendor prefix (misal: -webkit-, -moz-)
     * pada properti CSS untuk memastikan kompatibilitas di berbagai browser.
     */
    autoprefixer: {},
  },
};

export default config;
