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
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Database Configuration
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to Database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// ==================== ROUTES ====================

// Import routes
const authRoutes = require('./routes/authRoutes')(db);

// Use routes
app.use('/api/auth', authRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});