const express = require('express');
const cors = require('cors');
const path = require('path'); // Wajib ditambahkan untuk mengelola path folder
require('dotenv').config();

const pengirimanRoutes = require('./routes/pengiriman');
const pesananMasukRoutes = require('./routes/pesanan-masuk');
const keuanganRoutes = require('./routes/keuangan');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// -------------------------------------------------------------
// SERVE STATIC FILES (CSS, JS, Assets, dan HTML)
// -------------------------------------------------------------
// Me-serve folder Pages
app.use(express.static(path.join(__dirname, '../Penjual/Pages')));

// Me-serve folder pendukung di luar Pages agar CSS, JS, dan Gambar bisa ter-load
app.use('/css', express.static(path.join(__dirname, '../Penjual/css')));
app.use('/js', express.static(path.join(__dirname, '../Penjual/js')));
app.use('/assets', express.static(path.join(__dirname, '../Penjual/assets')));
app.use('/components', express.static(path.join(__dirname, '../Penjual/components')));

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------
app.use('/api/pengiriman', pengirimanRoutes);
app.use('/api/pesanan-masuk', pesananMasukRoutes);
app.use('/api/keuangan', keuanganRoutes);

// Jalankan Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n=================================`);
  console.log(`✅ Server jalan di http://localhost:${PORT}`);
  console.log(`📄 Akses halaman: http://localhost:${PORT}/pengiriman.html`);
  console.log(`=================================\n`);
});