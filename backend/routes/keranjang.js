/**
 * keranjang.js — Route /api/keranjang
 *
 * Endpoints:
 *   GET    /api/keranjang/:userId          — semua item keranjang user
 *   POST   /api/keranjang                  — tambah item (atau update qty jika sudah ada)
 *   PUT    /api/keranjang/:idKeranjang     — update jumlah item
 *   DELETE /api/keranjang/:idKeranjang     — hapus satu item
 *   DELETE /api/keranjang/all/:userId      — kosongkan seluruh keranjang user
 */

const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

// ─── GET semua item keranjang user ────────────
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await pool.query(`
            SELECT
                k.id_Keranjang,
                k.id_User,
                k.id_Produk,
                k.Jumlah,
                k.Subtotal,
                p.Nama_Produk,
                p.Harga,
                p.Foto_Produk,
                p.Kategori,
                p.Stok
            FROM keranjang k
            JOIN produk p ON p.id_produk = k.id_Produk
            WHERE k.id_User = ?
            ORDER BY k.id_Keranjang ASC
        `, [userId]);
        res.json(rows);
    } catch (err) {
        console.error('GET /api/keranjang error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── POST tambah item ke keranjang ────────────
// Body: { id_User, id_Produk, jumlah }
router.post('/', async (req, res) => {
    try {
        const { id_User, id_Produk, jumlah = 1 } = req.body;

        if (!id_User || !id_Produk) {
            return res.status(400).json({ error: 'id_User dan id_Produk wajib diisi.' });
        }

        // Ambil harga produk
        const [produkRows] = await pool.query(
            'SELECT Harga, Stok, Nama_Produk FROM produk WHERE id_produk = ?',
            [id_Produk]
        );
        if (!produkRows.length) {
            return res.status(404).json({ error: 'Produk tidak ditemukan.' });
        }
        const { Harga, Stok } = produkRows[0];

        if (jumlah > Stok) {
            return res.status(400).json({ error: `Stok tidak cukup. Stok tersedia: ${Stok}` });
        }

        // Cek apakah produk sudah ada di keranjang user
        const [existing] = await pool.query(
            'SELECT id_Keranjang, Jumlah FROM keranjang WHERE id_User = ? AND id_Produk = ?',
            [id_User, id_Produk]
        );

        let resultId;
        if (existing.length > 0) {
            // Update jumlah
            const newJumlah  = existing[0].Jumlah + jumlah;
            const newSubtotal = Harga * newJumlah;
            await pool.query(
                'UPDATE keranjang SET Jumlah = ?, Subtotal = ? WHERE id_Keranjang = ?',
                [newJumlah, newSubtotal, existing[0].id_Keranjang]
            );
            resultId = existing[0].id_Keranjang;
        } else {
            // Insert baru
            const subtotal = Harga * jumlah;
            const [result] = await pool.query(
                'INSERT INTO keranjang (id_User, id_Produk, Jumlah, Subtotal) VALUES (?, ?, ?, ?)',
                [id_User, id_Produk, jumlah, subtotal]
            );
            resultId = result.insertId;
        }

        // Return item terbaru
        const [newRow] = await pool.query(`
            SELECT k.id_Keranjang, k.id_User, k.id_Produk, k.Jumlah, k.Subtotal,
                   p.Nama_Produk, p.Harga, p.Foto_Produk, p.Kategori, p.Stok
            FROM keranjang k JOIN produk p ON p.id_produk = k.id_Produk
            WHERE k.id_Keranjang = ?
        `, [resultId]);

        res.status(201).json(newRow[0]);
    } catch (err) {
        console.error('POST /api/keranjang error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── PUT update jumlah satu item ──────────────
// Body: { jumlah }
router.put('/:idKeranjang', async (req, res) => {
    try {
        const { idKeranjang } = req.params;
        const { jumlah } = req.body;

        if (!jumlah || jumlah < 1) {
            return res.status(400).json({ error: 'Jumlah minimal 1.' });
        }

        // Ambil harga produk untuk hitung ulang subtotal
        const [rows] = await pool.query(
            `SELECT k.id_Produk, p.Harga, p.Stok
             FROM keranjang k JOIN produk p ON p.id_produk = k.id_Produk
             WHERE k.id_Keranjang = ?`,
            [idKeranjang]
        );
        if (!rows.length) {
            return res.status(404).json({ error: 'Item keranjang tidak ditemukan.' });
        }
        const { Harga, Stok } = rows[0];

        if (jumlah > Stok) {
            return res.status(400).json({ error: `Stok tidak cukup. Stok tersedia: ${Stok}` });
        }

        const subtotal = Harga * jumlah;
        await pool.query(
            'UPDATE keranjang SET Jumlah = ?, Subtotal = ? WHERE id_Keranjang = ?',
            [jumlah, subtotal, idKeranjang]
        );

        const [updated] = await pool.query(`
            SELECT k.id_Keranjang, k.id_User, k.id_Produk, k.Jumlah, k.Subtotal,
                   p.Nama_Produk, p.Harga, p.Foto_Produk, p.Kategori, p.Stok
            FROM keranjang k JOIN produk p ON p.id_produk = k.id_Produk
            WHERE k.id_Keranjang = ?
        `, [idKeranjang]);

        res.json(updated[0]);
    } catch (err) {
        console.error('PUT /api/keranjang error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── DELETE hapus satu item ───────────────────
router.delete('/all/:userId', async (req, res) => {
    try {
        await pool.query('DELETE FROM keranjang WHERE id_User = ?', [req.params.userId]);
        res.json({ success: true, message: 'Keranjang dikosongkan.' });
    } catch (err) {
        console.error('DELETE all /api/keranjang error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:idKeranjang', async (req, res) => {
    try {
        const [check] = await pool.query(
            'SELECT id_Keranjang FROM keranjang WHERE id_Keranjang = ?',
            [req.params.idKeranjang]
        );
        if (!check.length) {
            return res.status(404).json({ error: 'Item tidak ditemukan.' });
        }
        await pool.query('DELETE FROM keranjang WHERE id_Keranjang = ?', [req.params.idKeranjang]);
        res.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/keranjang error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
