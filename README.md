# TANI CERDAS — Prototipe Website

Website statis edukasi pertanian dengan desain responsif dan fitur interaktif dasar.

## Cara menjalankan
1. Ekstrak `tani_cerdas_website.zip`.
2. Buka folder proyek.
3. Buka `index.html` di browser. Untuk pengembangan lebih lanjut, jalankan melalui server lokal seperti Live Server di VS Code.

## Fitur yang sudah dibuat
- Beranda, About Us, komoditas, layanan, panduan, artikel, kontak, dan footer.
- Pencarian katalog komoditas.
- Kalkulator kebutuhan produk pupuk berdasarkan luas, dosis unsur hara, dan kadar pupuk yang dimasukkan pengguna.
- Kalkulator persentase perkecambahan.
- Catatan pertumbuhan yang disimpan pada localStorage browser.
- Pengaturan aksesibilitas: ukuran teks, pilihan font OpenDyslexic (jika font tersedia), tema lembut/redup/kontras, dan pengurangan animasi.
- Navigasi responsif dan dialog ringkasan komoditas.

## Catatan penting
- Ini adalah prototipe frontend. Belum ada akun/login, database online, admin, atau pengiriman laporan ke penyuluh.
- Catatan pertumbuhan dan preferensi tampilan disimpan lokal di browser. Data tidak otomatis tersinkronisasi antarperangkat.
- Beberapa foto menggunakan URL Unsplash dan membutuhkan koneksi internet. Periksa lisensi dan ganti dengan aset berlisensi sesuai kebutuhan publikasi.
- Email kontak masih placeholder (`halo@tanicerdas.example`) dan harus diganti sebelum website dipublikasikan.
- Dosis pupuk harus ditentukan dari rekomendasi agronomis yang sesuai dengan komoditas, fase tumbuh, dan kondisi lahan. Kalkulator tidak menentukan dosis rekomendasi secara otomatis.
- Font OpenDyslexic dimuat dari sumber eksternal dan mungkin tidak tersedia jika koneksi atau sumber font gagal. Pengaturan font tetap dapat dipakai, tetapi browser akan menggunakan fallback.

## File
- `index.html`: struktur halaman
- `style.css`: desain dan responsivitas
- `app.js`: kalkulator, penyimpanan catatan, pencarian, dan aksesibilitas
