const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET cart items by user ID
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const [cartItems] = await db.query(`
            SELECT 
                k.*,
                p.Nama_Produk,
                p.Harga,
                p.Kategori,
                p.Foto_Produk,
                p.Stok,
                p.Ukuran
            FROM keranjang k
            JOIN produk p ON k.id_Produk = p.id_produk
            WHERE k.id_User = ?
            ORDER BY k.id_Keranjang DESC
        `, [userId]);

        // Calculate total
        const total = cartItems.reduce((sum, item) => sum + parseFloat(item.Subtotal), 0);

        res.json({
            success: true,
            data: {
                items: cartItems,
                total: total,
                count: cartItems.length
            }
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data keranjang',
            error: error.message
        });
    }
});

// POST add item to cart
router.post('/add', async (req, res) => {
    try {
        const { id_User, id_Produk, Jumlah = 1 } = req.body;

        // Validate input
        if (!id_User || !id_Produk) {
            return res.status(400).json({
                success: false,
                message: 'User ID dan Product ID harus diisi'
            });
        }

        // Check if product exists and has stock
        const [product] = await db.query(
            'SELECT * FROM produk WHERE id_produk = ?',
            [id_Produk]
        );

        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan'
            });
        }

        if (product[0].Stok < Jumlah) {
            return res.status(400).json({
                success: false,
                message: 'Stok produk tidak mencukupi'
            });
        }

        // Check if item already in cart
        const [existingItem] = await db.query(
            'SELECT * FROM keranjang WHERE id_User = ? AND id_Produk = ?',
            [id_User, id_Produk]
        );

        if (existingItem.length > 0) {
            // Update quantity
            const newJumlah = existingItem[0].Jumlah + Jumlah;
            const newSubtotal = newJumlah * product[0].Harga;

            await db.query(
                'UPDATE keranjang SET Jumlah = ?, Subtotal = ? WHERE id_Keranjang = ?',
                [newJumlah, newSubtotal, existingItem[0].id_Keranjang]
            );

            res.json({
                success: true,
                message: 'Jumlah produk di keranjang diperbarui',
                data: {
                    id_Keranjang: existingItem[0].id_Keranjang,
                    Jumlah: newJumlah,
                    Subtotal: newSubtotal
                }
            });
        } else {
            // Insert new item
            const Subtotal = Jumlah * product[0].Harga;

            const [result] = await db.query(
                'INSERT INTO keranjang (id_User, id_Produk, Jumlah, Subtotal) VALUES (?, ?, ?, ?)',
                [id_User, id_Produk, Jumlah, Subtotal]
            );

            res.json({
                success: true,
                message: 'Produk berhasil ditambahkan ke keranjang',
                data: {
                    id_Keranjang: result.insertId,
                    id_User,
                    id_Produk,
                    Jumlah,
                    Subtotal
                }
            });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan produk ke keranjang',
            error: error.message
        });
    }
});

// PUT update cart item quantity
router.put('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;
        const { Jumlah } = req.body;

        if (!Jumlah || Jumlah < 1) {
            return res.status(400).json({
                success: false,
                message: 'Jumlah harus lebih dari 0'
            });
        }

        // Get cart item with product info
        const [cartItem] = await db.query(`
            SELECT k.*, p.Harga, p.Stok 
            FROM keranjang k
            JOIN produk p ON k.id_Produk = p.id_produk
            WHERE k.id_Keranjang = ?
        `, [cartId]);

        if (cartItem.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item keranjang tidak ditemukan'
            });
        }

        // Check stock availability
        if (cartItem[0].Stok < Jumlah) {
            return res.status(400).json({
                success: false,
                message: 'Stok produk tidak mencukupi',
                availableStock: cartItem[0].Stok
            });
        }

        // Update quantity and subtotal
        const newSubtotal = Jumlah * cartItem[0].Harga;

        await db.query(
            'UPDATE keranjang SET Jumlah = ?, Subtotal = ? WHERE id_Keranjang = ?',
            [Jumlah, newSubtotal, cartId]
        );

        res.json({
            success: true,
            message: 'Jumlah produk berhasil diperbarui',
            data: {
                id_Keranjang: cartId,
                Jumlah,
                Subtotal: newSubtotal
            }
        });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui keranjang',
            error: error.message
        });
    }
});

// DELETE remove item from cart
router.delete('/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;

        const [result] = await db.query(
            'DELETE FROM keranjang WHERE id_Keranjang = ?',
            [cartId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Item keranjang tidak ditemukan'
            });
        }

        res.json({
            success: true,
            message: 'Produk berhasil dihapus dari keranjang'
        });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus produk dari keranjang',
            error: error.message
        });
    }
});

// DELETE clear all cart items for a user
router.delete('/clear/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        await db.query(
            'DELETE FROM keranjang WHERE id_User = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'Keranjang berhasil dikosongkan'
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengosongkan keranjang',
            error: error.message
        });
    }
});

module.exports = router;