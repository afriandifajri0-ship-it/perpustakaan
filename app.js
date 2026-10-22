/**
 * ==============================================================================
 * LOGIKA APLIKASI PEMINJAMAN BUKU PERPUSTAKAAN DIGITAL (VANILLA JS)
 * ==============================================================================
 * Fitur:
 * 1. Manajemen State Buku & Eksemplar dengan LocalStorage Persistence
 * 2. Sistem Pencarian & Filter Kategori Real-Time
 * 3. Rak Pinjam (Cart) dengan Batas Kuota Maksimal & Estimasi Jatuh Tempo
 * 4. Modal Detail Buku & Info Lokasi Fisik Rak
 * 5. Form Peminjaman Langsung di Web & Penerbitan Slip Bukti Pinjam Digital
 * 6. Integrasi Opsional WhatsApp dengan Pesan Terformat Otomatis
 * 7. Riwayat Peminjaman Tersimpan (Tidak hilang setelah refresh)
 * ==============================================================================
 */

// Inisialisasi State Aplikasi
const AppState = {
  books: [],
  cart: [],
  loansHistory: [],
  selectedCategory: "all",
  searchQuery: "",
  onlyAvailable: false,
  borrowDays: 7 // default rekomendasi 7 hari
};

// Storage Keys
const STORAGE_KEYS = {
  BOOKS: "perpus_books_data_v1",
  CART: "perpus_active_cart_v1",
  LOANS: "perpus_loans_history_v1"
};

// ==============================================================================
// 1. INISIALISASI & PERSISTENSI DATA
// ==============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initLibraryData();
  applyLibraryConfig();
  renderCategoryFilter();
  renderBookGrid();
  renderCart();
  setupEventListeners();
});

function initLibraryData() {
  // Ambil buku dari localStorage jika ada, atau gunakan INITIAL_BOOKS dari data.js
  const storedBooks = localStorage.getItem(STORAGE_KEYS.BOOKS);
  if (storedBooks) {
    try {
      AppState.books = JSON.parse(storedBooks);
    } catch (e) {
      AppState.books = [...INITIAL_BOOKS];
    }
  } else {
    AppState.books = [...INITIAL_BOOKS];
    saveBooksToStorage();
  }

  // Ambil cart dari storage
  const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
  if (storedCart) {
    try {
      AppState.cart = JSON.parse(storedCart);
    } catch (e) {
      AppState.cart = [];
    }
  }

  // Ambil riwayat peminjaman
  const storedLoans = localStorage.getItem(STORAGE_KEYS.LOANS);
  if (storedLoans) {
    try {
      AppState.loansHistory = JSON.parse(storedLoans);
    } catch (e) {
      AppState.loansHistory = [];
    }
  }
}

function saveBooksToStorage() {
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(AppState.books));
}

function saveCartToStorage() {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(AppState.cart));
}

function saveLoansToStorage() {
  localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(AppState.loansHistory));
}

// Terapkan data konfigurasi dari LIBRARY_CONFIG ke elemen visual
function applyLibraryConfig() {
  // Nama perpustakaan & Brand
  document.querySelectorAll(".lib-name").forEach(el => el.textContent = LIBRARY_CONFIG.name);
  
  const heroTitleEl = document.getElementById("heroTitle");
  if (heroTitleEl) heroTitleEl.textContent = LIBRARY_CONFIG.tagline;

  const heroSubEl = document.getElementById("heroSubtitle");
  if (heroSubEl) heroSubEl.textContent = LIBRARY_CONFIG.subTagline;

  // Background images dengan fallback yang andal
  const heroSec = document.getElementById("heroSection");
  if (heroSec) {
    heroSec.style.backgroundImage = `url('${LIBRARY_CONFIG.backgrounds.hero}')`;
  }

  const quoteSec = document.getElementById("quoteBannerSection");
  if (quoteSec) {
    quoteSec.style.backgroundImage = `url('${LIBRARY_CONFIG.backgrounds.quoteBanner}')`;
  }

  const footerSec = document.getElementById("footerBannerSection");
  if (footerSec) {
    footerSec.style.backgroundImage = `url('${LIBRARY_CONFIG.backgrounds.facilityBanner}')`;
  }

  // Info Kontak & Alamat
  const libAddr = document.getElementById("libAddress");
  if (libAddr) libAddr.textContent = LIBRARY_CONFIG.address;

  const libHours = document.getElementById("libHours");
  if (libHours) libHours.textContent = LIBRARY_CONFIG.openingHours;

  const maxLimitTexts = document.querySelectorAll(".lib-max-limit");
  maxLimitTexts.forEach(el => el.textContent = LIBRARY_CONFIG.maxBorrowLimit);
}

// ==============================================================================
// 2. FILTER & PENCARIAN BUKU
// ==============================================================================
function renderCategoryFilter() {
  const container = document.getElementById("categoryChipsRow");
  if (!container) return;

  container.innerHTML = BOOK_CATEGORIES.map(cat => `
    <button type="button" 
            class="chip-btn ${AppState.selectedCategory === cat.id ? 'active' : ''}" 
            data-cat-id="${cat.id}">
      ${cat.label}
    </button>
  `).join("");

  container.querySelectorAll(".chip-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      AppState.selectedCategory = btn.getAttribute("data-cat-id");
      renderCategoryFilter();
      renderBookGrid();
    });
  });
}

function getFilteredBooks() {
  return AppState.books.filter(book => {
    // Filter Kategori
    const matchCategory = AppState.selectedCategory === "all" || book.category === AppState.selectedCategory;
    
    // Filter Pencarian (Judul, Penulis, ISBN)
    const query = AppState.searchQuery.toLowerCase().trim();
    const matchQuery = !query || 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query) ||
      book.isbn.toLowerCase().includes(query);

    // Filter Hanya yang Tersedia
    const matchAvailability = !AppState.onlyAvailable || book.availableCopies > 0;

    return matchCategory && matchQuery && matchAvailability;
  });
}

// ==============================================================================
// 3. RENDER KATALOG BUKU
// ==============================================================================
function renderBookGrid() {
  const grid = document.getElementById("bookGrid");
  const countEl = document.getElementById("resultCount");
  if (!grid) return;

  const filtered = getFilteredBooks();
  if (countEl) {
    countEl.textContent = `Menampilkan ${filtered.length} buku`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📖</div>
        <h3>Buku Tidak Ditemukan</h3>
        <p style="color: var(--text-muted); margin-top: 8px;">
          Tidak ada buku yang cocok dengan pencarian atau filter yang Anda pilih. Silakan coba kata kunci lain.
        </p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(book => {
    const isAvailable = book.availableCopies > 0;
    const isInCart = AppState.cart.some(item => item.id === book.id);
    
    // Temukan nama kategori
    const catObj = BOOK_CATEGORIES.find(c => c.id === book.category);
    const categoryName = catObj ? catObj.label : book.category;

    return `
      <article class="book-card" data-book-id="${book.id}">
        <div class="book-cover-wrap" onclick="openBookDetailModal('${book.id}')">
          <img src="${book.cover}" alt="Sampul ${book.title}" class="book-cover-img" loading="lazy" onerror="this.src='https://placehold.co/400x600?text=Buku+Perpustakaan'" />
          
          <div class="status-pill ${isAvailable ? 'available' : 'unavailable'}">
            <span>${isAvailable ? '●' : '✕'}</span>
            <span>${isAvailable ? `Tersedia (${book.availableCopies}/${book.totalCopies})` : 'Sedang Dipinjam'}</span>
          </div>

          <div class="category-tag">${categoryName}</div>
        </div>

        <div class="book-card-body">
          <h3 class="book-card-title" onclick="openBookDetailModal('${book.id}')" title="${book.title}">
            ${book.title}
          </h3>
          <p class="book-card-author">Karya: ${book.author} (${book.year})</p>
          
          <div class="book-location-badge">
            <span>📍</span>
            <span>${book.location}</span>
          </div>

          <p class="book-card-synopsis">${book.synopsis}</p>

          <div class="book-card-actions">
            <button type="button" class="btn-detail" onclick="openBookDetailModal('${book.id}')">
              Info Lengkap
            </button>
            <button type="button" 
                    class="btn-borrow ${isInCart ? 'in-cart' : ''}" 
                    onclick="toggleAddToCart('${book.id}')"
                    ${!isAvailable && !isInCart ? 'disabled' : ''}>
              ${isInCart ? '✓ Di Rak' : (isAvailable ? '+ Pinjam' : 'Stok Habis')}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// ==============================================================================
// 4. LOGIKA RAK PINJAM (CART & KUOTA)
// ==============================================================================
function toggleAddToCart(bookId) {
  const book = AppState.books.find(b => b.id === bookId);
  if (!book) return;

  const existingIndex = AppState.cart.findIndex(item => item.id === bookId);

  if (existingIndex > -1) {
    // Hapus dari rak
    AppState.cart.splice(existingIndex, 1);
    saveCartToStorage();
    renderCart();
    renderBookGrid();
    showToast(`"${book.title}" dikeluarkan dari Rak Pinjam.`);
  } else {
    // Cek ketersediaan stok
    if (book.availableCopies <= 0) {
      showToast("Maaf, seluruh eksemplar buku ini sedang dipinjam.", "error");
      return;
    }

    // Cek batas kuota maksimal per peminjaman
    if (AppState.cart.length >= LIBRARY_CONFIG.maxBorrowLimit) {
      showToast(`Maksimal peminjaman adalah ${LIBRARY_CONFIG.maxBorrowLimit} buku sekaligus. Selesaikan peminjaman ini terlebih dahulu.`, "warning");
      openCartDrawer();
      return;
    }

    // Tambahkan ke rak
    AppState.cart.push({
      id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      location: book.location,
      addedAt: new Date().toISOString()
    });

    saveCartToStorage();
    renderCart();
    renderBookGrid();
    showToast(`"${book.title}" ditambahkan ke Rak Pinjam!`);
  }
}

function removeFromCart(bookId) {
  AppState.cart = AppState.cart.filter(b => b.id !== bookId);
  saveCartToStorage();
  renderCart();
  renderBookGrid();
  showToast("Buku dihapus dari Rak Pinjam.");
}

function renderCart() {
  // Update badge counter di navbar
  const badgeEl = document.getElementById("cartCountBadge");
  if (badgeEl) {
    badgeEl.textContent = AppState.cart.length;
    badgeEl.style.display = AppState.cart.length > 0 ? "inline-flex" : "none";
  }

  // Update Meter Kuota
  const max = LIBRARY_CONFIG.maxBorrowLimit;
  const current = AppState.cart.length;
  const remaining = Math.max(0, max - current);

  const quotaLabelEl = document.getElementById("quotaLabel");
  if (quotaLabelEl) {
    quotaLabelEl.textContent = `${current} dari ${max} buku terpilih`;
  }

  const quotaRemainingEl = document.getElementById("quotaRemaining");
  if (quotaRemainingEl) {
    quotaRemainingEl.textContent = `Sisa kuota: ${remaining} buku`;
  }

  const quotaFillEl = document.getElementById("quotaBarFill");
  if (quotaFillEl) {
    const percent = Math.min(100, (current / max) * 100);
    quotaFillEl.style.width = `${percent}%`;
  }

  // Render Daftar Buku di Drawer
  const itemsContainer = document.getElementById("drawerItemsList");
  const checkoutBtn = document.getElementById("btnProceedCheckout");

  if (!itemsContainer) return;

  if (AppState.cart.length === 0) {
    itemsContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">📚</div>
        <p style="font-weight: 600; color: #374151;">Rak Pinjam Anda masih kosong</p>
        <p style="font-size: 0.82rem; margin-top: 6px;">
          Pilih buku dari katalog dan tekan tombol <strong>+ Pinjam</strong> untuk memasukkannya ke sini.
        </p>
      </div>
    `;
    if (checkoutBtn) checkoutBtn.disabled = true;
  } else {
    itemsContainer.innerHTML = AppState.cart.map(item => `
      <div class="cart-item-card">
        <img src="${item.cover}" alt="${item.title}" class="cart-item-img" onerror="this.src='https://placehold.co/100x140?text=Buku'" />
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.title}</h4>
          <p class="cart-item-author">${item.author}</p>
          <p class="cart-item-loc">📍 ${item.location}</p>
        </div>
        <button type="button" class="btn-remove-item" onclick="removeFromCart('${item.id}')" title="Hapus dari Rak">
          ✕
        </button>
      </div>
    `).join("");

    if (checkoutBtn) checkoutBtn.disabled = false;
  }

  // Update Tampilan Estimasi Jatuh Tempo
  updateReturnDatePreview();
}

function updateReturnDatePreview() {
  const returnDateEl = document.getElementById("returnDateEstimate");
  if (!returnDateEl) return;

  const dueDate = calculateDueDate(AppState.borrowDays);
  returnDateEl.textContent = `Estimasi Jatuh Tempo: ${formatDateIndo(dueDate)}`;
}

function calculateDueDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + parseInt(days, 10));
  return date;
}

// ==============================================================================
// 5. MODAL DETAIL BUKU
// ==============================================================================
function openBookDetailModal(bookId) {
  const book = AppState.books.find(b => b.id === bookId);
  if (!book) return;

  const isAvailable = book.availableCopies > 0;
  const isInCart = AppState.cart.some(item => item.id === book.id);
  const catObj = BOOK_CATEGORIES.find(c => c.id === book.category);

  const container = document.getElementById("modalDetailContent");
  if (!container) return;

  container.innerHTML = `
    <div class="detail-content-grid">
      <div>
        <img src="${book.cover}" alt="${book.title}" class="detail-cover" onerror="this.src='https://placehold.co/400x600?text=Buku'" />
        
        <div style="margin-top: 16px;">
          <button type="button" 
                  class="btn-borrow ${isInCart ? 'in-cart' : ''}" 
                  style="width: 100%; padding: 12px; font-size: 0.95rem;" 
                  onclick="toggleAddToCart('${book.id}'); openBookDetailModal('${book.id}')"
                  ${!isAvailable && !isInCart ? 'disabled' : ''}>
            ${isInCart ? '✓ Sudah Ada di Rak Pinjam' : (isAvailable ? '+ Masukkan ke Rak Pinjam' : 'Stok Sedang Habis')}
          </button>
        </div>
      </div>

      <div>
        <div class="meta-tags-row">
          <span class="meta-tag">🏷️ ${catObj ? catObj.label : book.category}</span>
          <span class="meta-tag" style="background: ${isAvailable ? '#ECFDF5' : '#FEF2F2'}; color: ${isAvailable ? '#059669' : '#DC2626'}; font-weight: 700;">
            ${isAvailable ? `● ${book.availableCopies} Eksemplar Siap Dipinjam` : '✕ Sedang Dipinjam'}
          </span>
        </div>

        <h2 class="detail-title">${book.title}</h2>
        <p class="detail-author">Penulis: <strong>${book.author}</strong> | Tahun Rilis: <strong>${book.year}</strong></p>

        <table class="detail-specs-table">
          <tr>
            <td class="label">Nomor ISBN</td>
            <td><strong>${book.isbn}</strong></td>
          </tr>
          <tr>
            <td class="label">Tebal Halaman</td>
            <td>${book.pages} Halaman</td>
          </tr>
          <tr>
            <td class="label">Bahasa</td>
            <td>${book.language}</td>
          </tr>
          <tr>
            <td class="label">Lokasi Rak Fisik</td>
            <td style="color: #92400E; font-weight: 700;">📍 ${book.location}</td>
          </tr>
        </table>

        <div class="detail-synopsis-box">
          <strong style="display: block; margin-bottom: 6px; color: #111827;">Sinopsis Ringkas:</strong>
          ${book.synopsis}
        </div>
      </div>
    </div>
  `;

  openModal("modalDetail");
}

// ==============================================================================
// 6. FORM PENGAJUAN PEMINJAMAN LANGSUNG (CHECKOUT)
// ==============================================================================
function openCheckoutModal() {
  if (AppState.cart.length === 0) {
    showToast("Pilih minimal 1 buku sebelum mengajukan peminjaman.", "warning");
    return;
  }

  closeDrawer();

  // Render ringkasan buku yang dipinjam di form modal
  const summaryList = document.getElementById("checkoutSummaryList");
  const summaryDue = document.getElementById("checkoutDueDate");

  if (summaryList) {
    summaryList.innerHTML = AppState.cart.map(item => `
      <div class="summary-book-mini">
        <div>
          <strong>${item.title}</strong>
          <div style="font-size: 0.74rem; color: var(--text-muted);">${item.location}</div>
        </div>
        <span style="color: var(--success); font-weight: 700;">Gratis</span>
      </div>
    `).join("");
  }

  if (summaryDue) {
    const due = calculateDueDate(AppState.borrowDays);
    summaryDue.textContent = formatDateIndo(due);
  }

  openModal("modalCheckout");
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("borrowerName").value.trim();
  const idNumber = document.getElementById("borrowerId").value.trim();
  const phone = document.getElementById("borrowerPhone").value.trim();
  const notes = document.getElementById("borrowerNotes") ? document.getElementById("borrowerNotes").value.trim() : "";

  if (!name || !idNumber || !phone) {
    showToast("Harap lengkapi semua kolom wajib.", "error");
    return;
  }

  // Buat Kode Unik Peminjaman (Contoh: LIB-2026-X7K2)
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  const borrowCode = `LIB-${new Date().getFullYear()}-${randomChars}`;

  const borrowDate = new Date();
  const dueDate = calculateDueDate(AppState.borrowDays);

  const newLoan = {
    code: borrowCode,
    borrower: {
      name,
      idNumber,
      phone,
      notes
    },
    books: [...AppState.cart],
    durationDays: AppState.borrowDays,
    borrowDateISO: borrowDate.toISOString(),
    dueDateISO: dueDate.toISOString(),
    borrowDateFormatted: formatDateIndo(borrowDate),
    dueDateFormatted: formatDateIndo(dueDate),
    status: "Siap Diambil di Meja Sirkulasi"
  };

  // Kurangi stok eksemplar buku di katalog perpustakaan
  AppState.cart.forEach(cartItem => {
    const bookIndex = AppState.books.findIndex(b => b.id === cartItem.id);
    if (bookIndex > -1 && AppState.books[bookIndex].availableCopies > 0) {
      AppState.books[bookIndex].availableCopies -= 1;
    }
  });

  // Simpan data peminjaman ke riwayat (Persistensi)
  AppState.loansHistory.unshift(newLoan);
  saveLoansToStorage();
  saveBooksToStorage();

  // Kosongkan Rak Pinjam
  AppState.cart = [];
  saveCartToStorage();

  // Refresh UI
  renderCart();
  renderBookGrid();

  // Tutup Modal Checkout
  closeModal("modalCheckout");

  // Reset form
  document.getElementById("formCheckout").reset();

  // Buka Modal Bukti Peminjaman Berhasil (Receipt Slip)
  showReceiptModal(newLoan);
}

// ==============================================================================
// 7. BUKTI PEMINJAMAN BERHASIL (DIGITAL RECEIPT & WA ASSURANCE)
// ==============================================================================
function showReceiptModal(loan) {
  const container = document.getElementById("modalReceiptContent");
  if (!container) return;

  const bookListHtml = loan.books.map((b, idx) => `
    <li style="margin-bottom: 6px; font-size: 0.88rem;">
      <strong>${idx + 1}. ${b.title}</strong>
      <div style="font-size: 0.76rem; color: #78350F;">Lokasi Pengambilan: ${b.location}</div>
    </li>
  `).join("");

  // Pesan Terformat untuk WhatsApp Petugas
  const waText = encodeURIComponent(
    `Halo Petugas ${LIBRARY_CONFIG.name},\n` +
    `Saya telah mengajukan peminjaman buku melalui website dengan detail sbb:\n\n` +
    `📌 *Kode Peminjaman:* ${loan.code}\n` +
    `👤 *Nama Peminjam:* ${loan.borrower.name} (${loan.borrower.idNumber})\n` +
    `📅 *Batas Kembali:* ${loan.dueDateFormatted}\n` +
    `📚 *Buku yang Dipinjam:*\n` +
    loan.books.map((b, i) => `${i + 1}. ${b.title}`).join("\n") +
    `\n\nMohon siapkan bukunya. Terima kasih banyak!`
  );

  const waUrl = `https://wa.me/${LIBRARY_CONFIG.whatsappNumber}?text=${waText}`;

  container.innerHTML = `
    <div class="receipt-card">
      <div class="receipt-stamp">TERKONFIRMASI</div>
      
      <div style="text-align: center; margin-bottom: 16px;">
        <h3 style="font-size: 1.3rem; color: #111827; margin-bottom: 4px;">${LIBRARY_CONFIG.name}</h3>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Slip Bukti Peminjaman Resmi Perpustakaan</p>
      </div>

      <div class="receipt-code-highlight">
        <div class="receipt-code-title">Tunjukkan Kode Ini ke Meja Petugas:</div>
        <div class="receipt-code-number">${loan.code}</div>
      </div>

      <table class="detail-specs-table" style="margin-bottom: 16px;">
        <tr>
          <td class="label">Nama Peminjam</td>
          <td><strong>${loan.borrower.name}</strong></td>
        </tr>
        <tr>
          <td class="label">NIM / No. Anggota</td>
          <td>${loan.borrower.idNumber}</td>
        </tr>
        <tr>
          <td class="label">Tanggal Pinjam</td>
          <td>${loan.borrowDateFormatted}</td>
        </tr>
        <tr>
          <td class="label">Batas Pengembalian</td>
          <td style="color: var(--danger); font-weight: 700;">${loan.dueDateFormatted} (${loan.durationDays} Hari)</td>
        </tr>
        <tr>
          <td class="label">Lokasi Meja Ambil</td>
          <td>Meja Sirkulasi Utama (Lantai 1)</td>
        </tr>
      </table>

      <div style="margin-top: 12px; border-top: 1px dashed var(--border); padding-top: 12px;">
        <h5 style="font-size: 0.85rem; margin-bottom: 8px;">Daftar Buku:</h5>
        <ul style="padding-left: 18px; margin: 0;">
          ${bookListHtml}
        </ul>
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px; border-radius: 6px; margin-top: 16px; font-size: 0.78rem; color: #475569;">
        💡 <strong>Catatan Petugas:</strong> Buku telah direservasi untuk Anda. Silakan tunjukkan kode di atas kepada petugas di meja sirkulasi untuk serah terima fisik.
      </div>
    </div>

    <div class="no-print" style="display: flex; flex-direction: column; gap: 10px;">
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" 
         class="btn-borrow" 
         style="background: #25D366; text-decoration: none; text-align: center; padding: 12px; font-size: 0.9rem; font-weight: 700;">
        💬 Kirim Konfirmasi ke WhatsApp Petugas (Opsional)
      </a>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <button type="button" class="btn-detail" onclick="window.print()" style="padding: 11px;">
          🖨️ Cetak / Simpan Slip
        </button>
        <button type="button" class="btn-checkout-proceed" onclick="closeModal('modalReceipt')" style="padding: 11px;">
          Selesai & Kembali
        </button>
      </div>
    </div>
  `;

  openModal("modalReceipt");
}

// ==============================================================================
// 8. MODAL RIWAYAT PEMINJAMAN (VIEW LOANS)
// ==============================================================================
function openLoansHistoryModal() {
  const container = document.getElementById("loansHistoryList");
  if (!container) return;

  if (AppState.loansHistory.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
        <div style="font-size: 2.5rem; margin-bottom: 10px;">📋</div>
        <h4>Belum Ada Riwayat Peminjaman</h4>
        <p style="font-size: 0.85rem; margin-top: 6px;">
          Buku yang Anda pinjam langsung di website ini akan dicatat di sini secara otomatis.
        </p>
      </div>
    `;
  } else {
    container.innerHTML = AppState.loansHistory.map(loan => `
      <div class="loan-history-card">
        <div class="loan-history-header">
          <span style="font-family: monospace; font-weight: 800; font-size: 1rem; color: var(--primary);">
            ${loan.code}
          </span>
          <span class="status-pill available" style="position: static; font-size: 0.72rem; padding: 2px 8px;">
            ${loan.status}
          </span>
        </div>
        
        <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 6px;">
          Peminjam: <strong>${loan.borrower.name}</strong> | Batas Kembali: <strong style="color: var(--danger);">${loan.dueDateFormatted}</strong>
        </p>

        <div style="font-size: 0.82rem; margin-top: 8px;">
          <strong>Buku:</strong> ${loan.books.map(b => b.title).join(", ")}
        </div>

        <div style="margin-top: 10px; text-align: right;">
          <button type="button" class="btn-detail" style="font-size: 0.75rem; padding: 4px 10px;" onclick="closeModal('modalHistory'); showReceiptModal(${JSON.stringify(loan).replace(/"/g, '&quot;')})">
            Lihat Bukti Slip
          </button>
        </div>
      </div>
    `).join("");
  }

  openModal("modalHistory");
}

// ==============================================================================
// 9. EVENT LISTENERS & MODAL CONTROLLERS
// ==============================================================================
function setupEventListeners() {
  // Input Pencarian
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      AppState.searchQuery = e.target.value;
      renderBookGrid();
    });
  }

  // Checkbox Hanya yang Tersedia
  const availableOnlyCheck = document.getElementById("availableOnlyCheck");
  if (availableOnlyCheck) {
    availableOnlyCheck.addEventListener("change", (e) => {
      AppState.onlyAvailable = e.target.checked;
      renderBookGrid();
    });
  }

  // Tombol Durasi Pinjam (3, 7, 14 Hari)
  document.querySelectorAll(".duration-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".duration-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      AppState.borrowDays = parseInt(btn.getAttribute("data-days"), 10);
      updateReturnDatePreview();
    });
  });

  // Drawer Toggles
  const btnToggleCart = document.getElementById("btnToggleCart");
  if (btnToggleCart) btnToggleCart.addEventListener("click", openCartDrawer);

  const btnCloseDrawer = document.getElementById("btnCloseDrawer");
  if (btnCloseDrawer) btnCloseDrawer.addEventListener("click", closeDrawer);

  const btnProceedCheckout = document.getElementById("btnProceedCheckout");
  if (btnProceedCheckout) btnProceedCheckout.addEventListener("click", openCheckoutModal);

  // Form Checkout Submit
  const formCheckout = document.getElementById("formCheckout");
  if (formCheckout) formCheckout.addEventListener("submit", handleCheckoutSubmit);

  // Riwayat Peminjaman Button
  const btnHistory = document.getElementById("btnHistory");
  if (btnHistory) btnHistory.addEventListener("click", openLoansHistoryModal);

  // Modal Backdrop Click
  const backdrop = document.getElementById("modalBackdrop");
  if (backdrop) {
    backdrop.addEventListener("click", () => {
      closeAllModals();
      closeDrawer();
    });
  }
}

// Helper Modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById("modalBackdrop");
  if (modal && backdrop) {
    modal.classList.add("active");
    backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById("modalBackdrop");
  if (modal) modal.classList.remove("active");
  if (backdrop) backdrop.classList.remove("active");
  document.body.style.overflow = "";
}

function closeAllModals() {
  document.querySelectorAll(".app-modal").forEach(m => m.classList.remove("active"));
  const backdrop = document.getElementById("modalBackdrop");
  if (backdrop) backdrop.classList.remove("active");
  document.body.style.overflow = "";
}

function openCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("modalBackdrop");
  if (drawer && backdrop) {
    drawer.classList.add("active");
    backdrop.classList.add("active");
  }
}

function closeDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("modalBackdrop");
  if (drawer) drawer.classList.remove("active");
  if (backdrop && !document.querySelector(".app-modal.active")) {
    backdrop.classList.remove("active");
  }
}

// Toast Notifikasi
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-message";
  
  let icon = "ℹ️";
  if (type === "warning") icon = "⚠️";
  if (type === "error") icon = "❌";

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Format Tanggal Indonesia
function formatDateIndo(dateObj) {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
}
