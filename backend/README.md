# FLEURAHITA Backend Server

Backend API untuk sistem autentikasi FLEURAHITA menggunakan Node.js, Express, dan MySQL.

## Prerequisites

Pastikan Anda sudah menginstall:
- Node.js (v14 atau lebih baru)
- MySQL Server (v5.7 atau lebih baru)
- npm atau yarn

## Setup Database

1. **Buka MySQL**
   ```bash
   mysql -u root -p
   ```

2. **Import database schema**
   ```bash
   mysql -u root -p < database.sql
   ```
   
   Atau copy-paste isi file `database.sql` ke MySQL command line/workbench

3. **Verifikasi database sudah dibuat**
   ```sql
   USE fleurahita;
   SHOW TABLES;
   ```

## Setup Backend Server

1. **Masuk ke folder backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi database**
   
   Edit file `server.js` pada bagian MySQL Configuration:
   ```javascript
   const db = mysql.createConnection({
       host: 'localhost',
       user: 'root',           // Ganti dengan user MySQL Anda
       password: '',           // Ganti dengan password MySQL Anda
       database: 'fleurahita'
   });
   ```

4. **Jalankan server**
   
   Development mode (auto-restart):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

5. **Test server**
   
   Buka browser dan akses:
   ```
   http://localhost:3000/api/test
   ```
   
   Seharusnya muncul response:
   ```json
   {"message": "Backend is running!"}
   ```

## API Endpoints

### Register User
- **URL**: `POST /api/auth/register`
- **Body**:
  ```json
  {
    "namaLengkap": "John Doe",
    "email": "john@example.com",
    "noHp": "081234567890",
    "password": "Password123",
    "role": "pembeli"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "success": true,
    "message": "Registrasi berhasil",
    "data": {
      "userId": 1,
      "email": "john@example.com"
    }
  }
  ```
- **Error Response (400)**:
  ```json
  {
    "success": false,
    "message": "Email sudah terdaftar"
  }
  ```

### Login User
- **URL**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "message": "Login berhasil",
    "data": {
      "userId": 1,
      "namaLengkap": "John Doe",
      "email": "john@example.com",
      "role": "pembeli"
    }
  }
  ```
- **Error Response (401)**:
  ```json
  {
    "success": false,
    "message": "Email atau password salah"
  }
  ```

## Database Schema

### Table: users
| Column        | Type          | Description                      |
|---------------|---------------|----------------------------------|
| id            | INT (PK)      | User ID (auto increment)         |
| nama_lengkap  | VARCHAR(255)  | Nama lengkap user                |
| email         | VARCHAR(255)  | Email (unique)                   |
| no_hp         | VARCHAR(20)   | Nomor HP                         |
| password      | VARCHAR(255)  | Hashed password                  |
| role          | ENUM          | pembeli / penjual / admin        |
| created_at    | TIMESTAMP     | Waktu registrasi                 |
| updated_at    | TIMESTAMP     | Waktu update terakhir            |

### Table: sessions (optional)
| Column         | Type          | Description                     |
|----------------|---------------|---------------------------------|
| id             | INT (PK)      | Session ID                      |
| user_id        | INT (FK)      | Foreign key ke users.id         |
| session_token  | VARCHAR(255)  | Unique session token            |
| expires_at     | TIMESTAMP     | Waktu expired                   |
| created_at     | TIMESTAMP     | Waktu dibuat                    |

## Troubleshooting

### Error: Cannot connect to MySQL
- Pastikan MySQL server sudah running
- Check username dan password di `server.js`
- Pastikan database `fleurahita` sudah dibuat

### Error: Port 3000 already in use
- Ganti PORT di `server.js`:
  ```javascript
  const PORT = 3001; // atau port lain yang available
  ```
- Update juga di frontend `register.js`:
  ```javascript
  const API_BASE_URL = 'http://localhost:3001/api';
  ```

### Error: bcryptjs not found
- Jalankan ulang `npm install`
- Pastikan `package.json` ada di folder backend

## Security Notes

⚠️ **Untuk Production**:
- Jangan hardcode password database di source code
- Gunakan environment variables (.env file)
- Tambahkan rate limiting untuk prevent brute force
- Implementasi JWT untuk session management
- Setup HTTPS
- Validasi input lebih ketat di backend

## Development

Untuk development dengan auto-reload:
```bash
npm run dev
```

Server akan restart otomatis setiap ada perubahan file.

## License

ISC