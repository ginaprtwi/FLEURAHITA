const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const pengirimanRoutes = require('./routes/pengiriman');
const pesananMasukRoutes = require('./routes/pesanan-masuk');
const keuanganRoutes = require('./routes/keuangan');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chat');
const ulasanRoutes   = require('./routes/ulasan');
const produkRoutes   = require('./routes/produk');
const keranjangRoutes = require('./routes/keranjang');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== STATIC FILES ====================
// Serve static assets for the entire project
app.use(express.static(path.join(__dirname, '..')));

// Shortcut routes for Penjual pages & assets
app.use('/css', express.static(path.join(__dirname, '../Penjual/css')));
app.use('/js', express.static(path.join(__dirname, '../Penjual/js')));
app.use('/assets', express.static(path.join(__dirname, '../Penjual/assets')));
app.use('/components', express.static(path.join(__dirname, '../Penjual/components')));

// Redirect root to login page
app.get('/', (req, res) => {
    res.redirect('/Auth/Login/log-in-user.html');
});

// ==================== DATABASE ====================
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (process.env.DB_PASS || ''),
    database: process.env.DB_NAME || 'Fleurahita',
    port: process.env.DB_PORT || 3306
};

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('⚠️ Warning: MySQL database connection failed:', err.message);
        console.error('Pastikan MySQL service/XAMPP sudah berjalan dan database "Fleurahita" telah dibuat.');
        return;
    }
    console.log('✅ Connected to MySQL database:', dbConfig.database);

    // Auto-create tabel chat_pesan jika belum ada
    const createChatTable = `
        CREATE TABLE IF NOT EXISTS \`chat_pesan\` (
            \`id_Chat\`   INT(11)                      NOT NULL AUTO_INCREMENT,
            \`id_User\`   INT(11)                      NOT NULL,
            \`Pengirim\`  ENUM('penjual','pembeli')     NOT NULL DEFAULT 'pembeli',
            \`Isi_Pesan\` TEXT                         NOT NULL,
            \`Waktu\`     DATETIME                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id_Chat\`),
            KEY \`fk_chat_user\` (\`id_User\`),
            CONSTRAINT \`fk_chat_user\`
                FOREIGN KEY (\`id_User\`) REFERENCES \`pengguna\` (\`id_User\`)
                ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `;
    db.query(createChatTable, (err2) => {
        if (err2) {
            console.error('⚠️ Gagal membuat tabel chat_pesan:', err2.message);
        } else {
            console.log('✅ Tabel chat_pesan siap.');
        }
    });
});

// ==================== API ROUTES ====================
app.use('/api/auth', authRoutes(db));
app.use('/api/pengiriman', pengirimanRoutes);
app.use('/api/pesanan-masuk', pesananMasukRoutes);
app.use('/api/keuangan', keuanganRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ulasan',    ulasanRoutes);
app.use('/api/produk',    produkRoutes);
app.use('/api/keranjang', keranjangRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend is running!',
        status: 'OK'
    });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log(`
=====================================================
🚀 Server FLEURAHITA jalan di http://localhost:${PORT}
=====================================================
📌 Login Page:     http://localhost:${PORT}/Auth/Login/log-in-user.html
📌 Register Page:  http://localhost:${PORT}/Auth/Register/register.html
📌 Dashboard Seller: http://localhost:${PORT}/Penjual/Pages/beranda-fix.html
📌 Dashboard Buyer:  http://localhost:${PORT}/Pembeli/Pages/beranda.html
=====================================================
`);
});