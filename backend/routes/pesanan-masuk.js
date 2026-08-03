const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        await pool.query("SET SESSION group_concat_max_len = 10000;");

        const { search, status } = req.query;
        let whereConditions = [];
        let queryParams = [];

        if (search) {
            whereConditions.push("(u.Nama LIKE ? OR pr.Nama_Produk LIKE ? OR p.Kode_Orderan LIKE ?)");
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        if (status && status !== 'Semua Status') {
            whereConditions.push("p.Status_Pesanan = ?");
            queryParams.push(status);
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        const query = `
            SELECT 
                p.id_Pesanan AS id,
                p.Kode_Orderan AS kode_orderan,
                u.Nama AS customer_name,
                p.Total_Bayar AS total,
                p.Status_Pesanan AS status,
                p.Metode_Pembayaran AS payment_status,
                IFNULL(GROUP_CONCAT(pr.Nama_Produk SEPARATOR ', '), '-') AS product_name,
                IFNULL(MIN(pr.Foto_Produk), 'column-img2.png') AS product_image
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
        console.error("Database error (pesanan-masuk):", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE pesanan
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM pesanan WHERE id_Pesanan = ?", [id]);
        res.json({ message: "Pesanan berhasil dihapus" });
    } catch (err) {
        console.error("Database delete error:", err);
        res.status(500).json({ error: err.message });
    }
});

// UPDATE status pesanan / payment status
router.patch('/update-status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, payment_status } = req.body;
        
        let fields = [];
        let params = [];

        if (status) {
            fields.push("Status_Pesanan = ?");
            params.push(status);
        }
        if (payment_status) {
            fields.push("Metode_Pembayaran = ?");
            params.push(payment_status);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: "Tidak ada data status yang diupdate" });
        }

        params.push(id);
        const query = `UPDATE pesanan SET ${fields.join(', ')} WHERE id_Pesanan = ?`;
        await pool.query(query, params);
        res.json({ message: "Status pesanan berhasil diupdate" });
    } catch (err) {
        console.error("Database update status error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
