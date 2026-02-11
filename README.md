# E-Commerce Microservices System

**Version:** 1.0.0  
**Status:** Production-Grade Reference Implementation  
**License:** MIT  
**Author:** Purushottam Kumar

---

## 1. Executive Summary

This project is a **comprehensive, production-grade E-Commerce platform** engineered using a **Microservices Architecture**. Unlike typical monolithic tutorials, this system demonstrates how to build scalable, distributed applications where each business domain operates independently.

It is designed for **high scalability, fault tolerance, and clear separation of concerns**. The system handles the complete e-commerce lifecycle: user registration with role-based access, product management, shopping cart operations, order processing, payment simulation, and asynchronous notifications.

**Target Audience:**
*   **System Architects**: To reference patterns for service isolation and distributed data management.
*   **Senior Engineers**: To evaluate a clean implementation of Node.js microservices without frameworks like NestJS (using pure Express for transparency).
*   **Technical Interviewers**: As a standard for "Take-Home" architectural assignments.

**Key Differentiators:**
*   **True Database-per-Service**: No shared monolithic database.
*   **Distributed Authorization**: Centralized Auth Service with decentralized permission enforcement.
*   **Production Frontend**: A fully functional Next.js Admin Dashboard, not just API docs.

> **Note:** This project represents a production-grade architectural reference. Some infrastructure elements (e.g., API Gateway, async messaging) are intentionally left out to keep the focus on core service design.

---

## 2. System Design Philosophy

### Why Microservices?
In a rapidly evolving e-commerce environment, a monolith can become a bottleneck. By splitting domains (Auth, Product, Order) into separate services:
1.  **Independent Scaling**: The `product-service` (high read traffic) can be scaled differently from the `order-service` (high write reliability).
2.  **Fault Isolation**: A failure in the `notification-service` does not prevent a user from placing an order.
3.  **Tech Stack Agility**: While this project uses Node.js uniformly, future services could be written in Go or Python without rewriting the whole system.

### Principles Followed
*   **Database Isolation**: Services cannot access each other's tables. All communication is via REST APIs.
*   **Statelessness**: Services do not hold user sessions. JWTs carry all necessary state.
*   **Clean Architecture**: Separation of concerns within services (Routes -> Controllers -> Services -> Repositories).

---

## 3. High-Level Architecture

The system functions as a distributed network of services.

### Request Flow
1.  **Client** (Next.js Admin / Postman) sends a request.
2.  **Auth Middleware** intercepts the request at the service level.
3.  **JWT Verification** ensures the caller is authenticated.
4.  **RBAC Check** ensures the caller has the specific permission (e.g., `product:create`).
5.  **Service Logic** executes, interacting *only* with its own database.
6.  **Response** is returned as standardized JSON.

### Architecture Diagram (Conceptual)
```
[Client App] 
     │
     ▼
[Auth Service] <───> [MySQL: Auth DB]
     │
     ├── (Issues JWT)
     │
     ▼
[Other Services] (Verify JWT)
     │
     ├── [Product Service] <───> [MySQL: Product DB]
     ├── [Order Service]   <───> [MySQL: Store DB (Logically Isolated)]
     ├── [Cart Service]    <───> [MySQL: Store DB (Logically Isolated)]
     └── ...
```

---

## 4. Complete Folder Structure

The repository is organized as a monorepo for development simplicity, though services are logically independent.

### Root Directory
*   `apps/`: Contains frontend applications.
    *   `admin-frontend/`: The Next.js dashboard for administrators.
*   `services/`: Contains all backend microservices.
*   `database/`: Shared SQL schemas (for initialization only).

### Service Structure (`services/*`)
Every microservice follows an identical "Clean Architecture" pattern to minimize context switching for developers.

| Folder | Responsibility |
|:---|:---|
| `config/` | Database connections, environment variables, and external service configs. |
| `controllers/` | **Entry Point**: Handles HTTP requests, validates input, calls Services, sends responses. |
| `services/` | **Business Logic**: Contains the core domain rules. Does NOT know about HTTP or SQL. |
| `repositories/` | **Data Access**: Executes raw SQL queries. The ONLY place that touches the DB. |
| `routes/` | **API Definitions**: Maps URLs to Controllers and applies Middleware. |
| `middlewares/` | **Interceptors**: Auth checks, error handling, logging. |
| `utils/` | **Helpers**: Custom Error classes, formatting utilities. |
| `app.js` | **App Setup**: Configures Express, middleware, and routes. |
| `server.js` | **Entry Point**: Starts the HTTP server. |

---

## 5. Microservices Deep Dive

### 1. Auth Service (Port 3001)
*   **Purpose**: The gatekeeper of the system. Manages identities and access rights.
*   **Responsibilities**: Registration, Login, Token Issuance, Role/Permission Management, User Blocking.
*   **Database**: Owns `users`, `roles`, `permissions`, `role_permissions`.
*   **Key APIs**:
    *   `POST /auth/login`: Returns JWT + User Data.
    *   `GET /users`: List users (Admin only).
    *   `PATCH /users/:id/block`: Ban a user.

### 2. User Service (Port 3002)
*   **Purpose**: Manages user profiles and extended data.
*   **Responsibilities**: Profile updates (Name, Phone), Address Book management.
*   **Database**: Owns `user_profiles`, `addresses`.
*   **Interaction**: Receives `userId` from the JWT token to fetch the correct profile.

### 3. Product Service (Port 3003)
*   **Purpose**: Catalog management.
*   **Responsibilities**: CRUD for Products, Category hierarchy, Inventory tracking.
*   **Database**: Owns `products`, `categories`.
*   **Key APIs**:
    *   `GET /products`: Public catalog.
    *   `POST /products`: Admin create (requires `product:create` permission).

### 4. Cart Service (Port 3004)
*   **Purpose**: Temporary storage for shopping sessions.
*   **Responsibilities**: Add/Remove items, update quantities.
*   **Database**: Owns `carts`, `cart_items`.
*   **Note**: Does not validate stock in real-time (performance optimization); stock is checked at checkout.

### 5. Order Service (Port 3005)
*   **Purpose**: The core transaction engine.
*   **Responsibilities**: Creating orders, calculating totals, tracking status (Pending -> Paid -> Shipped).
*   **Database**: Owns `orders`, `order_items`.
*   **Consistency**: Stores a *snapshot* of product data (price/name) at the time of purchase to prevent historical data corruption if product prices change later.

### 6. Payment Service (Port 3006)
*   **Purpose**: Financial processing.
*   **Responsibilities**: Mock payment gateway integration, transaction logging.
*   **Database**: Owns `payments`.
*   **Flow**: Triggered by Order Service or Client after order creation.

### 7. Notification Service (Port 3007)
*   **Purpose**: Asynchronous communication.
*   **Responsibilities**: Sending emails (mocked) or system alerts.
*   **Database**: Owns `notifications`.
*   **Trigger**: Called by Order Service when status changes (e.g., "Order Paid").

---

## 6. Authentication & Authorization (Deep Dive)

### JWT Strategy
*   **Algorithm**: HS256 (HMAC SHA-256).
*   **Payload**:
    ```json
    {
      "id": 1,
      "email": "admin@example.com",
      "roleId": 1,
      "permissions": ["product:create", "user:read", ...]
    }
    ```
*   **Lifecycle**: Tokens expire in 1 day. No refresh token mechanism is currently implemented (security trade-off for simplicity).

### RBAC Implementation
We use a **Permission-Based** model, not just Role-Based.
*   **Roles** (e.g., "Admin") are collections of **Permissions** (e.g., "product:delete").
*   **Code checks Permissions, not Roles**.
    *   *Bad*: `if (user.role === 'Admin')`
    *   *Good*: `if (user.permissions.includes('product:delete'))`
*   **Why?**: This allows creating custom roles (e.g., "Junior Editor") without changing a single line of code in the backend services.

---

## 7. Database Design

### Strategy: Database-per-Service
To ensure loose coupling, services do not share tables.
*   **Strict Isolation**: `product-service` cannot `JOIN` with `users` table.
*   **Data Duplication**: Minimal duplication is accepted (e.g., `userId` is stored in `orders` table without a Foreign Key constraint to the `users` table).
*   **Consistency**: Eventually consistent. If a user is deleted in Auth, their historical orders remain in Order Service (which is desirable for audit logs).

### Schema Ownership
*   **ecommerce_auth**: `users`, `roles`, `permissions`
*   **ecommerce_product**: `products`, `categories`
*   **ecommerce_store**:
    *   `carts`, `cart_items`
    *   `orders`, `order_items`
    *   `payments`
    *   `user_profiles`, `addresses`

---

## 8. Admin Dashboard Architecture

The frontend is a **Next.js 14+ application using the App Router**.

*   **AuthContext**: A React Context provider that hydrates user state from cookies and manages the `user` object globally.
*   **Route Protection**:
    *   `layout.tsx` checks `isAuthenticated`. If false, redirects to `/login`.
    *   This prevents unauthenticated rendering of protected pages (flicker-free).
*   **RBAC UI**:
    *   Components use `hasPermission('permission_slug')` to conditionally render elements.
    *   *Example*: The "Delete Product" button is not even added to the DOM if the user lacks `product:delete`.
*   **API Layer**:
    *   Centralized `axios` instances (`authApi`, `productApi`, etc.).
    *   **Interceptors**: Automatically inject the `Authorization: Bearer <token>` header into every request.

---

## 9. End-to-End Business Flows

### A. User Login
1.  Frontend POSTs email/password to `auth-service`.
2.  `auth-service` hashes password, compares with DB.
3.  On success, fetches Role and Permissions.
4.  Generates JWT containing Permissions.
5.  Frontend stores JWT in Cookie and User Object in Context.

### B. Product Creation (Admin)
1.  Admin fills form, POSTs to `product-service`.
2.  `product-service` Middleware verifies JWT.
3.  Middleware checks for `product:create` permission.
4.  Controller validates input (price > 0, name exists).
5.  Service logic creates Slug (`My Product` -> `my-product`).
6.  Repository inserts into `products` table.

---

## 10. Error Handling Strategy

We use a **Centralized Error Handling** mechanism to avoid `try/catch` spaghetti code.

*   **AppError Class**: Extends the native Error class, adding `statusCode` and `status` ('fail' vs 'error').
*   **Global Middleware**: All services use `app.use(errorHandler)` as the last middleware.
    *   Catches operational errors (validation, auth).
    *   Catches programming errors (bugs) and sends a generic 500 message to client (security).
*   **Response Format**:
    ```json
    {
      "status": "error",
      "message": "Product not found"
    }
    ```

---

## 11. Security Considerations

1.  **Password Security**: Bcrypt hashing with salt. Plain text passwords never stored.
2.  **SQL Injection**: Mitigated by using `mysql2` parameterized queries (Prepared Statements).
3.  **XSS**: Next.js automatically escapes output.
4.  **Rate Limiting**: (Not implemented but recommended for Prod)
5.  **Environment Isolation**: Secrets (`JWT_SECRET`, DB creds) are loaded from `.env` files, never hardcoded.

---

## 12. Environment & Configuration

Each service requires its own `.env` file in its root directory.

**Standard Variables:**
```bash
PORT=300X               # Unique port per service
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
DB_NAME=ecommerce_xxx   # Specific DB name
JWT_SECRET=complex_key  # Must be same across all services
```

**Service Ports:**
*   Auth: 3001
*   User: 3002
*   Product: 3003
*   Cart: 3004
*   Order: 3005
*   Payment: 3006
*   Notification: 3007

---

## 13. Running the Project

### Prerequisites
*   **Node.js**: v18 or higher.
*   **MySQL**: v8.0 or higher.

### Step 1: Database Setup
1.  Open your MySQL client.
2.  Create databases: `ecommerce_auth`, `ecommerce_product`, `ecommerce_store`.
3.  Run the script `database/schema.sql` to initialize tables and relationships.

### Step 2: Install Dependencies
Navigate to each service folder and install:
```bash
cd services/auth-service && npm install
cd ../product-service && npm install
# ... repeat for all services
```

### Step 3: Start Services
Start each service in a separate terminal:
```bash
# Terminal 1
cd services/auth-service && npm start

# Terminal 2
cd services/product-service && npm start

# ... and so on.
```

### Step 4: Start Frontend
```bash
cd apps/admin-frontend
npm install
npm run dev
# Open http://localhost:3000
```

---

## 14. Scalability & Future Improvements

*   **API Gateway**: Currently, the frontend calls services directly. Adding an API Gateway (like Nginx or Kong) would simplify the frontend logic and handle rate limiting.
*   **Message Queue**: Use RabbitMQ or Kafka for asynchronous communication (e.g., Order Service -> Notification Service) to decouple services further.
*   **Dockerization**: Containerizing each service with Docker Compose would streamline local development and deployment.

---

## 15. Project Status

This project is complete and serves as a **high-level reference implementation**. It is not a "work in progress" but a finished artifact demonstrating architectural competence.

**Ideal For:**
*   **Portfolio Showcase**: Demonstrates ability to architect complex systems.
*   **Learning Resource**: For developers moving from Monolith to Microservices.
*   **Codebase Template**: A solid starting point for new Node.js microservice projects.

---
*Built with ❤️ by Purushottam Kumar.*
