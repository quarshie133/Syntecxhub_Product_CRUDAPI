# 🛍️ Product CRUD REST API

A REST API built with **Node.js**, **Express**, and **Mongoose** that handles full CRUD operations on a Product resource — with **filtering by category and price range**, and **pagination** for listing products.

---

## 🚀 Features

- Full CRUD + PATCH support for a Product resource
- Filter products by **category**
- Filter products by **price range** (minPrice / maxPrice)
- **Pagination** support with page and limit controls
- Input validation via Mongoose schema with `enum` for categories
- Graceful error handling including invalid ID format (`CastError`)
- Meaningful HTTP status codes and error messages

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| Mongoose | MongoDB object modeling |
| MongoDB | Database |
| dotenv | Environment variable management |
| Nodemon | Auto-restart during development |

---

## 📁 Project Structure

```
user-api/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── userController.js      # User route logic
│   └── productController.js   # Product route logic
├── models/
│   ├── User.js                # User Mongoose schema
│   └── Product.js             # Product Mongoose schema
├── routes/
│   ├── userRoutes.js          # User API endpoints
│   └── productRoutes.js       # Product API endpoints
├── .env                       # Environment variables (not committed)
├── .env.example               # Environment variable template
├── .gitignore
├── package.json
└── server.js                  # App entry point
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running locally **or** a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/your-username/user-api.git
cd user-api
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the root directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/userapi
```

**4. Start the development server**
```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

---

## 📡 API Endpoints

Base URL: `http://localhost:5000/api/products`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/products` | Create a new product |
| `GET` | `/api/products` | Get all products (supports filtering & pagination) |
| `GET` | `/api/products/:id` | Get a single product by ID |
| `PUT` | `/api/products/:id` | Replace a product (full update) |
| `PATCH` | `/api/products/:id` | Update specific fields only |
| `DELETE` | `/api/products/:id` | Delete a product |

---

## 🔍 Filtering & Pagination

The `GET /api/products` endpoint supports the following query parameters:

| Query Param | Type | Description | Example |
|---|---|---|---|
| `category` | String | Filter by product category | `?category=electronics` |
| `minPrice` | Number | Filter products priced at or above this value | `?minPrice=50` |
| `maxPrice` | Number | Filter products priced at or below this value | `?maxPrice=200` |
| `page` | Number | Page number to retrieve (default: 1) | `?page=2` |
| `limit` | Number | Number of results per page (default: 5) | `?limit=3` |

### Example Queries

**Filter by category:**
```
GET /api/products?category=electronics
```

**Filter by price range:**
```
GET /api/products?minPrice=10&maxPrice=100
```

**Combine category and price:**
```
GET /api/products?category=electronics&minPrice=50&maxPrice=200
```

**Pagination:**
```
GET /api/products?page=1&limit=2
GET /api/products?page=2&limit=2
```

**Combine everything:**
```
GET /api/products?category=food&minPrice=5&maxPrice=50&page=1&limit=3
```

---

## 📦 Request & Response Examples

### Create a Product — `POST /api/products`

**Request Body:**
```json
{
  "name": "Wireless Headphones",
  "price": 120,
  "description": "Noise cancelling over-ear headphones",
  "category": "electronics"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "_id": "664abc123...",
    "name": "Wireless Headphones",
    "price": 120,
    "description": "Noise cancelling over-ear headphones",
    "category": "electronics",
    "inStock": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get All Products with Pagination — `GET /api/products?page=1&limit=2`

**Response `200`:**
```json
{
  "success": true,
  "total": 6,
  "page": 1,
  "totalPages": 3,
  "count": 2,
  "data": [...]
}
```

---

### Partial Update — `PATCH /api/products/:id`

**Request Body:**
```json
{
  "price": 99
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "664abc123...",
    "name": "Wireless Headphones",
    "price": 99,
    "category": "electronics"
  }
}
```

---

### Delete a Product — `DELETE /api/products/:id`

**Response `200`:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## ✅ Product Schema & Validation

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | String | ✅ Yes | Cannot be empty |
| `price` | Number | ✅ Yes | Cannot be negative |
| `description` | String | ❌ No | Defaults to "No description provided" |
| `category` | String | ✅ Yes | Must be one of: `electronics`, `clothing`, `food`, `furniture`, `other` |
| `inStock` | Boolean | ❌ No | Defaults to `true` |

---

## 📊 HTTP Status Codes Used

| Code | Meaning |
|---|---|
| `200` | Success — GET, PUT, PATCH, DELETE |
| `201` | Created — POST |
| `400` | Bad Request — validation error or invalid ID format |
| `404` | Not Found — product ID doesn't exist |
| `500` | Internal Server Error |

---

## 🔴 Error Handling Examples

**Invalid category:**
```json
{
  "success": false,
  "message": "vehicles is not a valid category"
}
```

**Missing required field:**
```json
{
  "success": false,
  "message": "Product validation failed: name: Product name is required"
}
```

**Invalid MongoDB ID format:**
```json
{
  "success": false,
  "message": "Invalid product ID format"
}
```

**Product not found:**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## 🧪 Testing

Endpoints were tested using [Postman](https://www.postman.com/).

### Quick Validation Tests
- Send a `POST` without a `name` → `400` Name is required
- Send a `POST` with `"category": "vehicles"` → `400` invalid category
- Send a `GET` with a bad ID → `400` Invalid product ID format
- Send a `GET` with a valid but non-existent ID → `404` Product not found

---

## 📌 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the server runs on (default: 5000) |
| `MONGO_URI` | MongoDB connection string |

See `.env.example` for a template.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙋‍♂️ Author

Built as a backend learning assignment covering REST API design, Express routing, Mongoose ODM, query filtering, pagination, error handling, and API testing with Postman.
