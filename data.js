/**
 * ==============================================================================
 * DATA KONFIGURASI DAN KOLEKSI BUKU PERPUSTAKAAN
 * ==============================================================================
 * File ini merupakan satu-satunya tempat untuk mengatur data perpustakaan dan koleksi buku.
 * Anda TIDAK PERLU mengubah kode logic aplikasi untuk mengganti nama perpustakaan,
 * nomor kontak, background banner, maupun menambah/mengurangi daftar buku.
 * 
 * Silakan cari tanda "// TODO:" untuk bagian yang perlu disesuaikan dengan data riil.
 * ==============================================================================
 */

const LIBRARY_CONFIG = {
  // TODO: Ganti dengan nama perpustakaan Anda
  name: "Perpustakaan Literasi Kita",
  
  // TODO: Ganti dengan slogan atau motto perpustakaan yang hangat & menyapa pengunjung
  tagline: "Tempat Tenang untuk Pikiran yang Ingin Bertualang",
  subTagline: "Temukan inspirasi, pinjam buku idamanmu secara instan, dan nikmati hangatnya membaca tanpa antre.",

  // TODO: Aturan batas peminjaman
  maxBorrowLimit: 3, // Batas maksimal buku per satu kali peminjaman
  borrowDurationOptions: [
    { days: 3, label: "3 Hari (Membaca Cepat)" },
    { days: 7, label: "7 Hari (Rekomendasi Standar)" },
    { days: 14, label: "14 Hari (Studi Mendalam)" }
  ],

  // TODO: Ganti dengan nomor WhatsApp petugas (format internasional tanpa tanda +, contoh: 6281234567890)
  whatsappNumber: "6281234567890",

  // TODO: Ganti dengan jam operasional & alamat perpustakaan Anda
  address: "Jl. Cendekia No. 42, Kota Literasi, Indonesia",
  openingHours: "Senin - Sabtu: 08.30 - 17.30 WIB | Minggu Libur",
  contactEmail: "salam@literasikita.id",

  // TODO: Ganti gambar background di bawah ini dengan foto perpustakaan asli Anda jika sudah ada.
  // Saat ini menggunakan placeholder image berkualitas tinggi yang langsung jalan.
  backgrounds: {
    hero: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80", 
    // Fallback jika offline: "https://placehold.co/1600x900/1e293b/f8fafc?text=Suasana+Perpustakaan+Hangat"
    
    quoteBanner: "https://images.unsplash.com/photo-1507842229450-782105327980?auto=format&fit=crop&w=1600&q=80",
    // Fallback jika offline: "https://placehold.co/1600x600/0f172a/f8fafc?text=Ruang+Baca+Perpustakaan"
    
    facilityBanner: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
  }
};

// TODO: Tambahkan atau ubah kategori buku sesuai ketersediaan di perpustakaan Anda
const BOOK_CATEGORIES = [
  { id: "all", label: "Semua Koleksi" },
  { id: "psikologi", label: "Psikologi & Self-Growth" },
  { id: "sains-teknologi", label: "Sains & Teknologi" },
  { id: "fiksi-sastra", label: "Fiksi & Sastra" },
  { id: "filsafat-humaniora", label: "Filsafat & Humaniora" },
  { id: "bisnis-ekonomi", label: "Bisnis & Produktivitas" }
];

// TODO: Ganti data buku dummy di bawah ini dengan data koleksi nyata perpustakaan Anda.
// Jumlah eksemplar akan disinkronkan otomatis dengan LocalStorage peramban pengunjung.
const INITIAL_BOOKS = [
  {
    id: "BOK-001",
    title: "Atomic Habits: Perubahan Kecil yang Memberikan Hasil Luar Biasa",
    author: "James Clear",
    year: 2019,
    category: "psikologi",
    isbn: "978-602-06-3317-6",
    pages: 352,
    language: "Bahasa Indonesia",
    location: "Rak C-02 (Lantai 1 - Ruang Pengembangan Diri)",
    totalCopies: 5,
    availableCopies: 3,
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    // TODO: Ganti dengan foto cover asli atau placeholder: https://placehold.co/400x600?text=Atomic+Habits
    synopsis: "Sebuah panduan praktis dan teruji tentang bagaimana membentuk kebiasaan baik, membuang kebiasaan buruk, dan menguasai perilaku kecil harian yang mengarah pada lompatan prestasi hidup yang luar biasa.",
    tags: ["Best Seller", "Kebiasaan", "Produktivitas"]
  },
  {
    id: "BOK-002",
    title: "Filosofi Teras: Menemukan Kedamaian Hati di Tengah Keruwetan Dunia",
    author: "Henry Manampiring",
    year: 2018,
    category: "filsafat-humaniora",
    isbn: "978-602-412-518-9",
    pages: 346,
    language: "Bahasa Indonesia",
    location: "Rak B-04 (Lantai 1 - Sayap Filsafat Praktis)",
    totalCopies: 4,
    availableCopies: 2,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    // TODO: Ganti dengan foto cover asli atau placeholder: https://placehold.co/400x600?text=Filosofi+Teras
    synopsis: "Penjelasan tentang ajaran Stoikisme Yunani Kuno yang disajikan sangat membumi dengan gaya bertutur santai khas kehidupan modern Indonesia, membimbing kita mengelola emosi negatif dan fokus pada apa yang dapat kita kendalikan.",
    tags: ["Stoikisme", "Ketenangan", "Lokal Favorit"]
  },
  {
    id: "BOK-003",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin (Uncle Bob)",
    year: 2008,
    category: "sains-teknologi",
    isbn: "978-013-235088-4",
    pages: 464,
    language: "Bahasa Inggris",
    location: "Rak T-01 (Lantai 2 - Laboratorium Komputer)",
    totalCopies: 3,
    availableCopies: 1,
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    // TODO: Ganti dengan foto cover asli atau placeholder: https://placehold.co/400x600?text=Clean+Code
    synopsis: "Kitab fundamental bagi setiap engineer perangkat lunak yang ingin menulis kode yang rapi, mudah dirawat, elegan, dan profesional. Dilengkapi contoh kasus refactoring nyata langkah demi langkah.",
    tags: ["Software Engineering", "Best Practice", "Rujukan Wajib"]
  },
  {
    id: "BOK-004",
    title: "Laut Bercerita",
    author: "Leila S. Chudori",
    year: 2017,
    category: "fiksi-sastra",
    isbn: "978-602-424-694-5",
    pages: 379,
    language: "Bahasa Indonesia",
    location: "Rak S-03 (Lantai 2 - Sudut Sastra Nusantara)",
    totalCopies: 6,
    availableCopies: 4,
    cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
    // TODO: Ganti dengan foto cover asli atau placeholder: https://placehold.co/400x600?text=Laut+Bercerita
    synopsis: "Kisah pilu nan puitis tentang aktivis mahasiswa tahun 1998 yang diculik dan dihilangkan paksa, serta suara getir keluarga yang terus menanti kepastian di daratan.",
    tags: ["Novel Sejarah", "Menyentuh Jiwa", "Penghargaan Sastra"]
  },
  {
    id: "BOK-005",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    year: 2011,
    category: "psikologi",
    isbn: "978-037-453-355-7",
    pages: 499,
    language: "Bahasa Inggris",
    location: "Rak C-05 (Lantai 1 - Ruang Kognisi)",
    totalCopies: 3,
    availableCopies: 0, // Sedang dipinjam semua untuk demonstrasi status 'Habis/Dipinjam'
    cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    // TODO: Ganti dengan foto cover asli atau placeholder: https://placehold.co/400x600?text=Thinking+Fast+and+Slow
    synopsis: "Karya pemenang Nobel yang mengungkap dua sistem yang mendorong cara kita berpikir: Sistem 1 yang cepat, intuitif, dan emosional; serta Sistem 2 yang lebih lambat, deliberatif, dan logis.",
    tags: ["Psikologi Kognitif", "Nobel Prize", "Behavioral Science"]
  },
  {
    id: "BOK-006",
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    year: 1980,
    category: "fiksi-sastra",
    isbn: "978-979-973-123-4",
    pages: 535,
    language: "Bahasa Indonesia",
    location: "Rak S-01 (Lantai 2 - Koleksi Khusus Maestro)",
    totalCopies: 4,
    availableCopies: 2,
    cover: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
    // TODO: Ganti dengan foto cover asli atau placeholder: https://placehold.co/400x600?text=Bumi+Manusia
    synopsis: "Roman tetralogi Buru pembuka yang mengisahkan pergulatan pemuda priyayi Minke di tengah pusaran kolonialisme Hindia Belanda, cinta sejati pada Annelies Mellema, dan kesadaran humanisme universal.",
    tags: ["Klasik Indonesia", "Karya Agung", "Tetralogi Buru"]
  },
  {
    id: "BOK-007",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    year: 2017,
    category: "sains-teknologi",
    isbn: "978-144-937-332-0",
    pages: 616,
    language: "Bahasa Inggris",
    location: "Rak T-02 (Lantai 2 - Arsitektur Sistem)",
    totalCopies: 2,
    availableCopies: 2,
    cover: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    // TODO: Ganti dengan foto cover asli atau placeholder: https://placehold.co/400x600?text=Designing+Data-Intensive
    synopsis: "Eksplorasi mendalam mengenai prinsip arsitektur data modern: replikasi, partisi, transaksi, konsistensi data, hingga pemrosesan aliran data (stream processing) untuk sistem berskala masif.",
    tags: ["Big Data", "Distributed Systems", "Arsitektur"]
  },
  {
    id: "BOK-008",
    title: "Psychology of Money: Pelajaran Abadi Mengenai Kekayaan & Keserakahan",
    author: "Morgan Housel",
    year: 2020,
    category: "bisnis-ekonomi",
    isbn: "978-602-06-4788-3",
    pages: 268,
    language: "Bahasa Indonesia",
    location: "Rak E-01 (Lantai 1 - Finansial & Investasi)",
    totalCopies: 5,
    availableCopies: 3,
    cover: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80",
    // TODO: Ganti dengan foto cover asli atau placeholder: https://placehold.co/400x600?text=Psychology+of+Money
    synopsis: "Sukses mengelola uang bukan semata tentang seberapa pintar Anda berhitung matematika, melainkan tentang bagaimana perilaku emosi Anda saat berhadapan dengan risiko, keberuntungan, dan kepuasan ego.",
    tags: ["Literasi Keuangan", "Mindset", "Best Seller"]
  }
];
