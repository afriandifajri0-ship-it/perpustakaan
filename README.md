# 📚 Perpustakaan Digital - Website Peminjaman Buku Mandiri

Website peminjaman buku perpustakaan modern, hangat, dan interaktif. Pengunjung dapat mengeksplorasi koleksi buku, mengecek ketersediaan eksemplar di rak secara langsung, menambahkan ke "Rak Pinjam", memilih durasi pinjam, dan mengajukan peminjaman langsung di dalam website hingga menerima **Slip Bukti Peminjaman Digital** lengkap dengan kode unik.

---

## 🚀 Cara Menjalankan Project

Project ini dibuat dengan arsitektur **Clean Vanilla HTML5, CSS3, dan JavaScript modern** tanpa dependensi build tool yang rumit, sehingga dapat langsung dijalankan:

### Opsi 1: Klik Langsung (Paling Mudah)
Cukup buka folder `c:\vscode\Perpustakaan` dan klik dua kali file **`index.html`** untuk langsung membukanya di browser apa saja (Chrome, Edge, Firefox, Safari).

### Opsi 2: Menggunakan Ekstensi VS Code Live Server
1. Buka folder `Perpustakaan` di VS Code.
2. Klik kanan pada file `index.html` lalu pilih **"Open with Live Server"**.
3. Website akan terbuka otomatis di alamat `http://127.0.0.1:5500`.

### Opsi 3: Menggunakan Simple Python Server (Jika Tersedia)
Buka terminal di folder project lalu jalankan:
```bash
python -m http.server 3000
```
Lalu buka `http://localhost:3000` di peramban Anda.

---

## 📁 Struktur File

```
Perpustakaan/
│
├── index.html          # Halaman utama (Hero berlatar foto, katalog, drawer Rak Pinjam, modal slip)
│
├── css/
│   └── style.css       # Desain antarmuka (Tema hangat editorial, typography Playfair & Sans, responsive)
│
├── js/
│   ├── data.js         # PUSAT DATA: Konfigurasi perpustakaan, background banner, & katalog buku dummy
│   └── app.js          # LOGIKA APLIKASI: Filter, Rak Pinjam, kalkulasi durasi, modal, & LocalStorage
│
└── README.md           # Dokumentasi dan panduan kustomisasi
```

---

## ✏️ Bagian yang Wajib Anda Ganti Manual (`// TODO:`)

Semua data telah dikumpulkan di **`js/data.js`** agar Anda tidak perlu mengedit file HTML atau logic aplikasi. Buka file **`js/data.js`** dan cari penanda `// TODO:`:

1. **Nama Perpustakaan & Slogan**: Ubah `name`, `tagline`, dan `subTagline`.
2. **Foto Latar Belakang (Background Hero & Banner)**: Ganti link di dalam object `backgrounds` dengan foto ruang perpustakaan Anda.
3. **Nomor WhatsApp Petugas**: Sesuaikan `whatsappNumber` dengan nomor petugas (format `628xxxxxxxx`).
4. **Alamat & Jam Operasional**: Ubah `address` dan `openingHours`.
5. **Koleksi Buku & Eksemplar**: Sesuaikan daftar buku di `INITIAL_BOOKS` (judul, penulis, sampul buku, sinopsis, nomor rak fisik, dan stok eksemplar).
