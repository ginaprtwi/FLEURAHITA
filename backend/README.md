# FLEURAHITA Backend API

Backend server untuk aplikasi FLEURAHITA - Platform pemesanan buket bunga online.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL

## Project Structure

```
backend/
├── routes/
│   └── authRoutes.js      # Authentication endpoints
├── .env.example           # Environment variables template
├── .env                   # Local config (git-ignored)
├── server.js              # Main server setup
├── package.json           # Dependencies
├── db_si.sql             # Database schema
└── README.md             # Documentation
```

## Prerequisites

- Node.js (v14 atau lebih tinggi)
- MySQL Server
- npm atau yarn

masuk dulu ke folder codingan github
ketik di terminal vscode
## Installation

1. **Navigate to Backend Folder**
   ```bash
   cd backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   - Copy `.env.example` ke `.env`:
   
   ```bash
   copy .env.example .env
   ```
   - Edit `.env` dan sesuaikan dengan database credentials Anda:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=Fleurahita
   PORT=3000
   ```

4. **Setup Database**
   Pastiin udah ada databasenya di mysql

5. **Start Server**
   ```bash
   node server.js
   ```
   Server akan berjalan di `http://localhost:3000`


### Test Endpoint
```http
GET /api/test
```

**Response:**
```json
{
  "message": "Backend is running!"
}
```


## Error Handling

All endpoints return consistent error format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

### HTTP Status Codes:
- `200` - Success
- `201` - Created (Registration success)
- `400` - Bad Request (Validation error)
- `401` - Unauthorized (Wrong credentials)
- `404` - Not Found (User/data tidak ditemukan)
- `500` - Internal Server Error


### Adding New Routes
CONTOH :

1. Create new route file in `routes/` folder:
   ```javascript
   // routes/productRoutes.js
   const express = require('express');
   const router = express.Router();

   module.exports = (db) => {
       router.get('/list', (req, res) => {
           // Your logic here
       });
       
       return router;
   };
   ```

2. Import and use in `server.js`:
   ```javascript
   const productRoutes = require('./routes/productRoutes')(db);
   app.use('/api/products', productRoutes);
   ```



## Troubleshooting

**Error: "Cannot connect to database"**
- Pastikan MySQL server sudah running
- Check database credentials di file `.env`
- Pastikan database `Fleurahita` sudah dibuat dengan import `db_si.sql`

**Error: "Port 3000 already in use"**
- Ubah `PORT` di `server.js` atau stop service yang menggunakan port 3000
- Alternatif: `PORT=3001 node server.js`

**Error: "bcrypt not found" atau "Cannot find module"**
- Run `npm install` untuk install semua dependencies

**Error: "Table 'pengguna' doesn't exist"**
- Import `db_si.sql` ke MySQL
- Pastikan database name di `.env` match dengan yang di `db_si.sql` (`Fleurahita`)
