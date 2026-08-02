-- Database Schema untuk FLEURAHITA
-- MySQL Database

-- Create Database
CREATE DATABASE IF NOT EXISTS fleurahita;
USE fleurahita;

-- Tabel Pengguna
CREATE TABLE IF NOT EXISTS pengguna (
    id_User INT AUTO_INCREMENT PRIMARY KEY,
    Nama VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    No_HP VARCHAR(20) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Foto_Profil VARCHAR(255) DEFAULT 'foto_profil_default.jpg',
    INDEX idx_email (Email)
);

-- Tabel Alamat
CREATE TABLE IF NOT EXISTS alamat (
    id_Alamat INT AUTO_INCREMENT PRIMARY KEY,
    id_User INT NOT NULL,
    Label_Alamat VARCHAR(100),
    Nama_Penerima VARCHAR(255) NOT NULL,
    No_HP_Penerima VARCHAR(20) NOT NULL,
    Alamat_Lengkap TEXT NOT NULL,
    Kota VARCHAR(100) NOT NULL,
    Kode_Pos VARCHAR(10) NOT NULL,
    Is_Default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_User) REFERENCES pengguna(id_User) ON DELETE CASCADE
);

-- Tabel Produk
CREATE TABLE IF NOT EXISTS produk (
    id_Produk INT AUTO_INCREMENT PRIMARY KEY,
    id_Penjual INT NOT NULL,
    Nama_Produk VARCHAR(255) NOT NULL,
    Deskripsi TEXT,
    Harga DECIMAL(10, 2) NOT NULL,
    Stok INT NOT NULL DEFAULT 0,
    Kategori VARCHAR(100),
    Foto_Produk VARCHAR(255),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_Penjual) REFERENCES pengguna(id_User) ON DELETE CASCADE,
    INDEX idx_kategori (Kategori),
    INDEX idx_penjual (id_Penjual)
);

-- Tabel Pesanan
CREATE TABLE IF NOT EXISTS pesanan (
    id_Pesanan INT AUTO_INCREMENT PRIMARY KEY,
    id_User INT NOT NULL,
    id_Alamat INT NOT NULL,
    Total_Harga DECIMAL(10, 2) NOT NULL,
    Status_Pesanan ENUM('pending', 'dikemas', 'dikirim', 'selesai', 'dibatalkan') DEFAULT 'pending',
    Metode_Pembayaran VARCHAR(50),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_User) REFERENCES pengguna(id_User) ON DELETE CASCADE,
    FOREIGN KEY (id_Alamat) REFERENCES alamat(id_Alamat),
    INDEX idx_user (id_User),
    INDEX idx_status (Status_Pesanan)
);

-- Tabel Detail Pesanan
CREATE TABLE IF NOT EXISTS detail_pesanan (
    id_Detail INT AUTO_INCREMENT PRIMARY KEY,
    id_Pesanan INT NOT NULL,
    id_Produk INT NOT NULL,
    Jumlah INT NOT NULL,
    Harga_Satuan DECIMAL(10, 2) NOT NULL,
    Subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_Pesanan) REFERENCES pesanan(id_Pesanan) ON DELETE CASCADE,
    FOREIGN KEY (id_Produk) REFERENCES produk(id_Produk),
    INDEX idx_pesanan (id_Pesanan)
);

-- Tabel Ulasan/Chat
CREATE TABLE IF NOT EXISTS ulasan_chat (
    id_Chat INT AUTO_INCREMENT PRIMARY KEY,
    id_User INT NOT NULL,
    id_Produk INT,
    Pesan TEXT NOT NULL,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_User) REFERENCES pengguna(id_User) ON DELETE CASCADE,
    FOREIGN KEY (id_Produk) REFERENCES produk(id_Produk) ON DELETE CASCADE,
    INDEX idx_produk (id_Produk),
    INDEX idx_user (id_User)
);