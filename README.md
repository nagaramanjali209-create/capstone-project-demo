# 📚 BookWorm E-Store — IBM Capstone Project

An E-Commerce bookstore platform built with **Spring Boot** (backend) + **React** (frontend), demonstrating AI-assisted development using **IBM BOB**.

---

## 🏗️ Architecture

```
Frontend (React + Vite)  ←→  Backend (Spring Boot)  ←→  H2 / PostgreSQL
     :5173                         :8081
```

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Axios |
| Backend | Spring Boot 3.2, Spring Security, JPA/Hibernate |
| Database | H2 (in-memory, default) / PostgreSQL (production) |
| Auth | JWT (JJWT 0.11.5) |
| API Docs | SpringDoc OpenAPI / Swagger UI |

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
mvn clean package -DskipTests
java -jar target/estore-1.0.0.jar
```

Backend runs at: **http://localhost:8081**  
Swagger UI: **http://localhost:8081/swagger-ui/index.html**  
H2 Console: **http://localhost:8081/h2-console** (JDBC URL: `jdbc:h2:mem:bookwormdb`)

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 👤 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Customer | demo@bookworm.com | demo123 |
| Admin | admin@bookworm.com | admin123 |

---

## 🗺️ Customer Journey (Use Cases)

| Step | Feature |
|---|---|
| 1 | Login / Register (JWT Auth) |
| 2 | Browse order history with Buy Again |
| 3 | Access product catalogue by category |
| 5 | Filter by category |
| 6 | Browse by brand/author |
| 7 | Select product (tagged with delivery date) + related products |
| 8 | Add to cart |
| 9 | Enter delivery address |
| 10 | Apply coupon (BOOK10), initiate payment (Credit/Debit/UPI/Wallet) |
| 11 | Payment confirmation |
| 12 | Order confirmation + cancel within 48 hrs |

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login → returns JWT

### Catalog
- `GET /api/categories` — All 18 categories
- `GET /api/products?categoryId=&keyword=&page=&size=` — Browse/search books
- `GET /api/products/{id}` — Book detail
- `GET /api/products/{id}/related` — Related books
- `GET /api/products/featured` — Recommended for you
- `GET /api/products/bestsellers` — Bestsellers
- `GET /api/products/new-launches` — New arrivals
- `POST /api/products/{id}/reviews` — Add review (auth required)

### Cart
- `GET /api/cart` — Get cart
- `POST /api/cart/items` — Add item
- `PUT /api/cart/items/{id}` — Update quantity
- `DELETE /api/cart/items/{id}` — Remove item

### Orders
- `POST /api/orders/checkout` — Place order + process payment
- `GET /api/orders/history` — Order history
- `PUT /api/orders/{id}/cancel` — Cancel order (within 48 hrs)

---

## 🐘 PostgreSQL Setup (Optional)

```bash
# Install PostgreSQL and create DB
psql -U postgres -c "CREATE DATABASE bookwormdb;"

# Run with postgres profile
java -jar target/estore-1.0.0.jar --spring.profiles.active=postgres
```

---

## 📁 Project Structure

```
capstone-project/
├── backend/                   # Spring Boot application
│   ├── src/main/java/com/bookworm/estore/
│   │   ├── entity/            # JPA entities (User, Product, Order, Cart, Payment...)
│   │   ├── repository/        # Spring Data JPA repositories
│   │   ├── service/           # Business logic
│   │   ├── controller/        # REST controllers
│   │   ├── dto/               # Request/Response DTOs
│   │   └── config/            # JWT, Security, Seeder, OpenAPI
│   └── src/main/resources/
│       └── application.properties
├── frontend/                  # React + Vite application
│   └── src/
│       ├── pages/             # LoginPage, HomePage, ProductDetailPage, 
│       │                      # CheckoutPage, PaymentPage, OrderConfirmationPage, OrderHistoryPage
│       ├── components/        # Navbar, BookCard, ProtectedRoute
│       ├── context/           # AuthContext, CartContext
│       └── api/               # axios instance
└── openapi-spec.yaml          # OpenAPI 3.0 specification
```

---


## 🏷️ Git Workflow

```bash
git init
git checkout -b feature/api-implementation
git add .
git commit -m "Implement Spring Boot API + React frontend for BookWorm e-commerce"
git push origin feature/api-implementation
# Create Pull Request with API documentation
```

---

*Built with IBM BOB (Agentic IDE) — IBM Capstone Project 2024*
# capstone-project-demo
