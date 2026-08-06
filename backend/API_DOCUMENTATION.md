# API Documentation - FLEURAHITA

## Base URL
```
http://localhost:3001/api
```

---

## Products API

### 1. Get All Products
**Endpoint:** `GET /api/products`

**Query Parameters:**
- `kategori` (optional) - Filter by category
- `search` (optional) - Search by product name
- `sortBy` (optional) - Sort field: `Nama_Produk`, `Harga`, `Rating`, `Stok` (default: `Nama_Produk`)
- `order` (optional) - Sort order: `ASC`, `DESC` (default: `ASC`)
- `limit` (optional) - Limit number of results
- `featured` (optional) - Get featured products (rating >= 4.0 & stok > 0): `true`

**Examples:**
```javascript
// Get all products
fetch('http://localhost:3001/api/products')

// Get featured products (untuk beranda)
fetch('http://localhost:3001/api/products?featured=true&limit=8')

// Filter by category
fetch('http://localhost:3001/api/products?kategori=Bucket Bunga Wisuda')

// Search products
fetch('http://localhost:3001/api/products?search=Rose')

// Sort by price
fetch('http://localhost:3001/api/products?sortBy=Harga&order=ASC')
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id_produk": 1,
      "Nama_Produk": "Wisuda Gemilang Bloom",
      "Kategori": "Bucket Bunga + Boneka",
      "Harga": "116000.00",
      "Ukuran": "Medium",
      "Stok": 34,
      "Deskripsi": "...",
      "Foto_Produk": "bucket_1.jpg",
      "Rating": "3.78"
    }
  ],
  "count": 1
}
```

---

### 2. Get Product by ID
**Endpoint:** `GET /api/products/:id`

**Example:**
```javascript
fetch('http://localhost:3001/api/products/1')
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id_produk": 1,
    "Nama_Produk": "Wisuda Gemilang Bloom",
    "Kategori": "Bucket Bunga + Boneka",
    "Harga": "116000.00",
    "Ukuran": "Medium",
    "Stok": 34,
    "Deskripsi": "...",
    "Foto_Produk": "bucket_1.jpg",
    "Rating": "3.78",
    "reviews": [
      {
        "id_Ulasan": 1,
        "id_Produk": 1,
        "id_User": 10,
        "Rating": 5,
        "Komentar": "Bagus banget!",
        "Tanggal_Ulasan": "2026-01-15T10:30:00.000Z",
        "nama_user": "John Doe"
      }
    ]
  }
}
```

---

### 3. Get Categories
**Endpoint:** `GET /api/products/categories/list`

**Example:**
```javascript
fetch('http://localhost:3001/api/products/categories/list')
```

**Response:**
```json
{
  "success": true,
  "data": [
    "Bucket Bunga + Boneka",
    "Bucket Bunga Satin",
    "Bucket Bunga Wisuda",
    "Bucket Custom",
    "Bucket Mawar Satin",
    "Bucket Snack",
    "Bucket Uang",
    "Buket Tangan Pengantin"
  ]
}
```

---

## Cart API

### 1. Get Cart Items
**Endpoint:** `GET /api/cart/:userId`

**Example:**
```javascript
const userId = 1;
fetch(`http://localhost:3001/api/cart/${userId}`)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id_Keranjang": 1,
        "id_User": 1,
        "id_Produk": 5,
        "Jumlah": 2,
        "Subtotal": "360000.00",
        "Nama_Produk": "Purple Dream Bouquet",
        "Harga": "180000.00",
        "Kategori": "Bucket Bunga Satin",
        "Foto_Produk": "bucket_5.jpg",
        "Stok": 3,
        "Ukuran": "Small"
      }
    ],
    "total": 360000,
    "count": 1
  }
}
```

---

### 2. Add Item to Cart
**Endpoint:** `POST /api/cart/add`

**Body:**
```json
{
  "id_User": 1,
  "id_Produk": 5,
  "Jumlah": 2
}
```

**Example:**
```javascript
fetch('http://localhost:3001/api/cart/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id_User: 1,
    id_Produk: 5,
    Jumlah: 2
  })
})
```

**Response:**
```json
{
  "success": true,
  "message": "Produk berhasil ditambahkan ke keranjang",
  "data": {
    "id_Keranjang": 101,
    "id_User": 1,
    "id_Produk": 5,
    "Jumlah": 2,
    "Subtotal": 360000
  }
}
```

---

### 3. Update Cart Item Quantity
**Endpoint:** `PUT /api/cart/:cartId`

**Body:**
```json
{
  "Jumlah": 3
}
```

**Example:**
```javascript
const cartId = 1;
fetch(`http://localhost:3001/api/cart/${cartId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    Jumlah: 3
  })
})
```

**Response:**
```json
{
  "success": true,
  "message": "Jumlah produk berhasil diperbarui",
  "data": {
    "id_Keranjang": 1,
    "Jumlah": 3,
    "Subtotal": 540000
  }
}
```

---

### 4. Delete Cart Item
**Endpoint:** `DELETE /api/cart/:cartId`

**Example:**
```javascript
const cartId = 1;
fetch(`http://localhost:3001/api/cart/${cartId}`, {
  method: 'DELETE'
})
```

**Response:**
```json
{
  "success": true,
  "message": "Produk berhasil dihapus dari keranjang"
}
```

---

### 5. Clear All Cart Items
**Endpoint:** `DELETE /api/cart/clear/:userId`

**Example:**
```javascript
const userId = 1;
fetch(`http://localhost:3001/api/cart/clear/${userId}`, {
  method: 'DELETE'
})
```

**Response:**
```json
{
  "success": true,
  "message": "Keranjang berhasil dikosongkan"
}
```

---

## Usage Examples for Frontend

### Halaman Beranda (Featured Products)
```javascript
async function loadFeaturedProducts() {
  try {
    const response = await fetch('http://localhost:3001/api/products?featured=true&limit=8');
    const result = await response.json();
    
    if (result.success) {
      displayProducts(result.data);
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
}
```

### Halaman Produk (All Products with Filter)
```javascript
async function loadProducts(category = '', searchTerm = '') {
  try {
    let url = 'http://localhost:3001/api/products?';
    
    if (category) url += `kategori=${category}&`;
    if (searchTerm) url += `search=${searchTerm}&`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      displayProducts(result.data);
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
}
```

### Halaman Keranjang
```javascript
// Load cart
async function loadCart(userId) {
  try {
    const response = await fetch(`http://localhost:3001/api/cart/${userId}`);
    const result = await response.json();
    
    if (result.success) {
      displayCart(result.data.items);
      updateTotal(result.data.total);
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

// Add to cart
async function addToCart(userId, productId, quantity = 1) {
  try {
    const response = await fetch('http://localhost:3001/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_User: userId,
        id_Produk: productId,
        Jumlah: quantity
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Produk berhasil ditambahkan ke keranjang');
      loadCart(userId); // Refresh cart
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}

// Update quantity
async function updateCartQuantity(cartId, newQuantity) {
  try {
    const response = await fetch(`http://localhost:3001/api/cart/${cartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Jumlah: newQuantity
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      loadCart(userId); // Refresh cart
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error updating cart:', error);
  }
}

// Delete item
async function removeFromCart(cartId, userId) {
  try {
    const response = await fetch(`http://localhost:3001/api/cart/${cartId}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.success) {
      loadCart(userId); // Refresh cart
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (in development)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error