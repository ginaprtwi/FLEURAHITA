const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET summary keuangan (Total Saldo, Jumlah Transaksi, Pendapatan Bulan ini)
router.get('/summary', async (req, res) => {
    try {
        const query = `
            SELECT 
                IFNULL(SUM(CASE WHEN Status_Pesanan != 'Dibatalkan' THEN Total_Bayar ELSE 0 END), 0) AS total_saldo,
                COUNT(CASE WHEN Status_Pesanan != 'Dibatalkan' THEN id_Pesanan END) AS jumlah_transaksi,
                IFNULL(SUM(CASE WHEN Status_Pesanan != 'Dibatalkan' AND DATE_FORMAT(Tanggal_Pesan, '%Y-%m') = (SELECT DATE_FORMAT(MAX(Tanggal_Pesan), '%Y-%m') FROM pesanan) THEN Total_Bayar ELSE 0 END), 0) AS pendapatan_bulan
            FROM pesanan
        `;

        const [rows] = await pool.query(query);
        res.json(rows[0] || { total_saldo: 0, jumlah_transaksi: 0, pendapatan_bulan: 0 });
    } catch (err) {
        console.error("Database error (keuangan summary):", err);
        res.status(500).json({ error: err.message });
    }
});

// GET daftar transaksi keuangan
router.get('/transaksi', async (req, res) => {
    try {
        await pool.query("SET SESSION group_concat_max_len = 10000;");

        const { search } = req.query;
        let whereConditions = [];
        let queryParams = [];

        if (search) {
            whereConditions.push("(u.Nama LIKE ? OR pr.Nama_Produk LIKE ? OR p.Kode_Orderan LIKE ?)");
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        const query = `
            SELECT 
                p.id_Pesanan AS id,
                p.Kode_Orderan AS order_number,
                u.Nama AS customer_name,
                IFNULL(GROUP_CONCAT(pr.Nama_Produk SEPARATOR ', '), '-') AS product_name,
                p.Total_Bayar AS total,
                DATE_FORMAT(p.Tanggal_Pesan, '%d-%m-%Y') AS date
            FROM pesanan p
            JOIN pengguna u ON p.id_User = u.id_User
            LEFT JOIN detail_pesanan dp ON p.id_Pesanan = dp.id_Pesanan
            LEFT JOIN produk pr ON dp.id_Produk = pr.id_produk
            ${whereClause}
            GROUP BY p.id_Pesanan
            ORDER BY p.Tanggal_Pesan DESC
        `;

        const [rows] = await pool.query(query, queryParams);
        res.json(rows);
    } catch (err) {
        console.error("Database error (keuangan transaksi):", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
