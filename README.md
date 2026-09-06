# JokerX Optimizer

JokerX Optimizer adalah aplikasi desktop utilitas untuk mengoptimalkan dan merawat sistem komputer. Dibangun dengan fokus pada performa tinggi, aplikasi ini menggabungkan antarmuka modern yang ringan dengan keamanan maksimal di balik layar berkat dukungan Rust dan Tauri.

<p align="center">
  <img src="src/assets/preview-jokerx-optimizer.png" alt="JokerX Optimizer Preview" width="100%" />
</p>

## Fitur Utama

- **Antarmuka Profesional (Enterprise UI):** Tampilan *dark mode* yang futuristik dan bersih, lengkap dengan konsol log aktivitas yang berjalan secara *real-time*.
- **Pembersihan Cache Mendalam:** Membersihkan file *temporary* sampah sistem untuk mengembalikan kapasitas penyimpanan.
- **Reset & Perbaikan Jaringan:** Melakukan *flush DNS* instan guna mengatasi masalah koneksi internet yang ngadat.
- **Arsitektur Ringan:** Mengandalkan *native code*, sehingga jauh lebih hemat RAM dibanding aplikasi desktop berbasis Electron biasa.

## Teknologi yang Digunakan

- **Frontend:** ![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=flat&logo=javascript&logoColor=black)
- **Backend:** ![Rust](https://img.shields.io/badge/Rust-%23000000.svg?style=flat&logo=rust&logoColor=white)
- **Desktop Framework:** ![Tauri](https://img.shields.io/badge/Tauri-%2324C8DB.svg?style=flat&logo=tauri&logoColor=white)

## Cara Menjalankan

Pastikan di komputer Anda sudah terinstal **Node.js**, **Rust**, dan dependensi Tauri yang diperlukan.

1. Clone repositorinya:
   ```bash
   git clone [https://github.com/iqbaalfd/jokerx-optimizer.git](https://github.com/iqbaalfd/jokerx-optimizer.git)
   cd jokerx-optimizer
2. Instal dependensi:
    ```bash
    npm install
3. Jalankan Mode Development
   ```bash
  npm run tauri dev