const express = require('express');
const router = express.Router();

// Router ini butuh koneksi db, sama polanya kayak authRoutes.js
module.exports = (db) => {

    // GET /api/keranjang/:id_User
    // Ambil semua isi keranjang milik satu user, lengkap dengan data produknya
    router.get('/:id_User', (req, res) => {
        const { id_User } = req.params;

        const query = `
            SELECT 
                k.id_Keranjang,
                k.id_Produk,
                k.Jumlah,
                k.Subtotal,
                p.Nama_Produk,
                p.Harga,
                p.Foto_Produk
            FROM keranjang k
            JOIN produk p ON k.id_Produk = p.id_produk
            WHERE k.id_User = ?
        `;

        db.query(query, [id_User], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Gagal mengambil data keranjang'
                });
            }

            res.status(200).json({
                success: true,
                data: results
            });
        });
    });

    // PATCH /api/keranjang/:id_Keranjang  -> update jumlah (dipanggil pas klik tombol +/-)
    router.patch('/:id_Keranjang', (req, res) => {
        const { id_Keranjang } = req.params;
        const { Jumlah } = req.body;

        if (!Jumlah || Jumlah < 1) {
            return res.status(400).json({
                success: false,
                message: 'Jumlah tidak valid'
            });
        }

        // Ambil harga produk dulu buat hitung ulang Subtotal
        const getHargaQuery = `
            SELECT p.Harga 
            FROM keranjang k 
            JOIN produk p ON k.id_Produk = p.id_produk 
            WHERE k.id_Keranjang = ?
        `;

        db.query(getHargaQuery, [id_Keranjang], (err, rows) => {
            if (err || rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Item keranjang tidak ditemukan'
                });
            }

            const subtotalBaru = rows[0].Harga * Jumlah;

            const updateQuery = 'UPDATE keranjang SET Jumlah = ?, Subtotal = ? WHERE id_Keranjang = ?';
            db.query(updateQuery, [Jumlah, subtotalBaru, id_Keranjang], (err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Gagal update jumlah'
                    });
                }
                res.status(200).json({
                    success: true,
                    data: { Jumlah, Subtotal: subtotalBaru }
                });
            });
        });
    });

    // DELETE /api/keranjang/:id_Keranjang -> dipanggil pas klik "Hapus"
    router.delete('/:id_Keranjang', (req, res) => {
        const { id_Keranjang } = req.params;

        db.query('DELETE FROM keranjang WHERE id_Keranjang = ?', [id_Keranjang], (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Gagal menghapus item'
                });
            }
            res.status(200).json({ success: true, message: 'Item dihapus' });
        });
    });

    return router;
};