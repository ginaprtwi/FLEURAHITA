const mysql = require('mysql2/promise');

// Buat connection pool (lebih stabil dan efisien)
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Default XAMPP/Laragon biasanya kosong
    database: 'db_si',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Fungsi tes koneksi
async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log('✅ Berhasil terhubung ke database db_si!');
        connection.release(); // Kembalikan koneksi ke pool
    } catch (error) {
        console.error('❌ Gagal terhubung ke database:', error.message);
    }
}

testConnection();

module.exports = db;