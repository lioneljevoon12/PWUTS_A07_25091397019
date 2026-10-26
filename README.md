# UTS Pemrograman Web: Portal Admin MeowNesa

## Identitas

- Nama: Lionel Jevon Chrismana Putra
- NIM: 25091397019
- Kelompok: A07

## Tentang Proyek

MeowNesa merupakan sistem informasi berbasis web untuk membantu Jaga Satwa UNESA mengelola data kucing kampus dan proses adopsi. Sistem ini mencakup pengelolaan populasi kucing, pemberian makan, riwayat kesehatan dan perawatan, pengajuan adopsi, pemantauan pasca-adopsi, serta informasi publik.

Pada UTS Pemrograman Web, saya mengerjakan **modul admin MeowNesa**. Modul ini digunakan untuk mengelola data kucing dan aktivitas yang berkaitan dengan pemeliharaan serta proses adopsi. Halaman yang dikerjakan meliputi dashboard, data populasi kucing, feeding log, rekam medis, screening adopsi, monitoring pasca-adopsi, dan CMS artikel.

## Halaman dan Fitur

### 1. Dashboard (`index.html`)

Menampilkan ringkasan data operasional, meliputi:
- Total kucing yang terdata.
- Jumlah kucing yang siap diadopsi.
- Jumlah pengajuan adopsi yang sedang diproses.
- Status pemberian makan hari ini.
- Status sterilisasi.
- Pengingat yang perlu ditindaklanjuti.

### 2. Data Populasi Kucing (`cats.html`)

Digunakan untuk melihat dan mengelola data kucing yang terdaftar dalam pendataan Jaga Satwa UNESA di Kampus Ketintang dan Lidah Wetan.

Fitur:
- Menampilkan data kucing dalam tabel.
- Mencari kucing berdasarkan nama atau kode kalung.
- Memfilter data berdasarkan kampus, status adopsi, dan jenis kelamin.
- Melihat detail profil kucing melalui modal.
- Mengedit data kucing.

### 3. Feeding Log (`feeding.html`)

Digunakan untuk melihat catatan pemberian makan kucing berdasarkan zona fakultas dan tanggal.

Fitur:
- Menampilkan jadwal atau catatan pemberian makan.
- Melihat status pelaksanaan pemberian makan.
- Membedakan catatan yang sudah selesai dan yang belum.

### 4. Rekam Medis (`health.html`)

Digunakan untuk melihat riwayat kesehatan dan perawatan kucing serta mencatat tindakan medis.

Fitur:
- Menampilkan riwayat sterilisasi, vaksinasi, dan perawatan.
- Menambahkan catatan tindakan medis melalui form.
- Memvalidasi kolom wajib, panjang minimal, dan format isian menggunakan jQuery sebelum data diproses.

### 5. Screening Adopsi (`adoptions.html`)

Digunakan untuk memantau pengajuan adopsi dan tahapan pemeriksaannya.

Fitur:
- Menampilkan daftar pengajuan adopsi.
- Melihat status pengajuan.
- Mengelompokkan tahapan proses menjadi Review Berkas, Wawancara, Disetujui, dan Siap Antar.

### 6. Monitoring Pasca-Adopsi (`monitoring.html`)

Digunakan untuk memantau laporan kondisi kucing setelah diadopsi.

Fitur:
- Menampilkan laporan kondisi mingguan dari adopter.
- Melihat status laporan.
- Menandai laporan yang terlambat.

### 7. CMS Artikel (`cms.html`)

Digunakan untuk mengelola artikel edukasi yang berkaitan dengan kucing dan kegiatan Jaga Satwa UNESA.

Fitur:
- Menambahkan artikel.
- Melihat artikel.
- Mengedit artikel.
- Menghapus artikel.

## Implementasi UTS

### Homepage dan Layout Utama

`index.html` digunakan sebagai layout utama yang memuat sidebar, topbar, dan area konten. Navigasi pada sidebar digunakan untuk membuka halaman modul admin melalui Ajax dengan jQuery, sehingga konten dapat dimuat tanpa memuat ulang seluruh halaman.

Layout dibuat responsif menggunakan CSS Flexbox, Grid, dan media query untuk menyesuaikan tampilan pada layar desktop maupun perangkat seluler.

### Halaman Konten Interaktif

Halaman `cats.html` menyediakan tabel data populasi kucing dengan fitur pencarian langsung, filter berdasarkan beberapa kategori, dan modal untuk melihat detail profil kucing.

### Halaman Form dan Validasi

Halaman `health.html` menyediakan form pencatatan tindakan medis. Validasi menggunakan JavaScript/jQuery dilakukan untuk memeriksa kolom wajib, panjang minimal, dan format isian sebelum data diproses. Pesan kesalahan ditampilkan pada kolom yang bermasalah.

Ketiga bagian tersebut merupakan bagian dari pengerjaan modul admin untuk UTS Pemrograman Web.

## Teknologi

- HTML5
- CSS3
- JavaScript
- jQuery 3.7.1
- Google Fonts: Baloo 2 dan Plus Jakarta Sans

## Live Website
https://lioneljevoon12.github.io/PWUTS_A07_25091397019/index.html