# FLEURAHITA Backend API

Backend server untuk aplikasi FLEURAHITA - Platform pemesanan buket bunga online.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL

## Prerequisites

- Node.js (v14 atau lebih tinggi)
- MySQL Server
- npm atau yarn

## Installation

masuk ke folder codingan

1. **Install Dependencies**

   Di terminal vscode ketik :

   cd backend

   dan

   npm install

2. **Setup Database**
kalau belum ada database di mysql: 

   - Import schema dari `db_si.sql`:
   - Database `Fleurahita` akan otomatis dibuat

3. **Configure Database Connection**

   - Edit `server.js` jika perlu ubah credentials database:

   ```javascript
   const db = mysql.createConnection({
       host: 'localhost',
       user: 'root',      // Sesuaikan dengan user MySQL Kalian
       password: '',      // Sesuaikan dengan password MySQL Kalian
       database: 'Fleurahita'  // Sesuai dengan db_si.sql
   });
   ```

4. **Start Server**
kalau udah semua, ketik ini di terminal (backend):

   node server.js

setelah itu coba live server register dan login, kalau salah berarti ada yang kurang (ikutin instruksi dari awal)

Common HTTP Status Codes:
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (wrong credentials)
- `404` - Not Found (user tidak ditemukan)
- `500` - Internal Server Error

## Troubleshooting

**Error: "Cannot connect to database"**
- Pastikan MySQL server sudah running
- Check database credentials di `server.js`
- Pastikan database `fleurahita` sudah dibuat

**Error: "Port 5500 already in use"**
- Ubah port di `server.js` atau stop service yang menggunakan port 5500

**Error: "bcrypt not found"**
- Run `npm install` untuk install dependencies



ENJOYY