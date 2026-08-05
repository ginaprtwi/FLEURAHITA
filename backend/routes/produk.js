/**
 * produk.js — Route /api/produk
 * GET    /api/produk          — semua produk (opsional ?search=)
 * GET    /api/produk/:id      — satu produk
 * POST   /api/produk          — tambah produk baru
 * PUT    /api/produk/:id      — edit produk
 * DELETE /api/produk/:id      — hapus produk
 */

const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

// GET all
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let q = `SELECT id_produk AS id, Nama_Produk, Kategori, Harga, Stok, Deskripsi, Foto_Produk, Rating FROM produk`;
        const params = [];
        if (search) {
            q += ` WHERE Nama_Produk LIKE ? OR Kategori LIKE ?`;
            params.push(`%${search}%`, `%${search}%`);
        }
        q += ` ORDER BY Nama_Produk ASC`;
        const [rows] = await pool.query(q, params);
        res.json(rows);
    } catch (err) {
        console.error('GET /api/produk error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET one
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id_produk AS id, Nama_Produk, Kategori, Harga, Stok, Deskripsi, Foto_Produk, Rating FROM produk WHERE id_produk = ?`,
            [req.params.id]
        );
        if (!rows.length) return res.status(404).json({ error: 'Produk tidak ditemukan.' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST
router.post('/', async (req, res) => {
    try {
        const { nama_produk, kategori, harga, stok, deskripsi } = req.body;
        if (!nama_produk || harga === undefined) {
            return res.status(400).json({ error: 'Nama produk dan harga wajib diisi.' });
        }
        const [result] = await pool.query(
            `INSERT INTO produk (Nama_Produk, Kategori, Harga, Stok, Deskripsi, Foto_Produk, Rating)
             VALUES (?, ?, ?, ?, ?, NULL, 0)`,
            [nama_produk, kategori || '', harga, stok || 0, deskripsi || '']
        );
        const [newRow] = await pool.query(
            `SELECT id_produk AS id, Nama_Produk, Kategori, Harga, Stok, Deskripsi, Foto_Produk FROM produk WHERE id_produk = ?`,
            [result.insertId]
        );
        res.status(201).json(newRow[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT
router.put('/:id', async (req, res) => {
    try {
        const { nama_produk, kategori, harga, stok, deskripsi } = req.body;
        await pool.query(
            `UPDATE produk SET Nama_Produk=?, Kategori=?, Harga=?, Stok=?, Deskripsi=? WHERE id_produk=?`,
            [nama_produk, kategori || '', harga, stok || 0, deskripsi || '', req.params.id]
        );
        const [rows] = await pool.query(
            `SELECT id_produk AS id, Nama_Produk, Kategori, Harga, Stok, Deskripsi, Foto_Produk FROM produk WHERE id_produk = ?`,
            [req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        await pool.query(`DELETE FROM produk WHERE id_produk = ?`, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
