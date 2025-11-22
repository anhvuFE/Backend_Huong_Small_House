# Small House Backend

TypeScript/Express backend for the Small House ecommerce platform.  
Implements the 3-tier architecture described in the specification with MongoDB/Mongoose data layer, service/controller separation, and integrations for Sepay payments, Cloudinary media, and SMTP notifications.

## Tech Stack

- **Runtime:** Node.js 20, Express 4, TypeScript
- **Database:** MongoDB with Mongoose ODM and auto-increment helper (counters collection)
- **Security:** JWT access/refresh tokens, bcrypt password hashing, Helmet, rate limiting, role-based middleware
- **Integrations:** Sepay API, Cloudinary, Nodemailer (SMTP)
- **Utilities:** Winston logger, Joi validation, seed script with sample data

Project structure:

```
src/
 ├── config/         # Environment, DB, Cloudinary, SMTP, Sepay clients
 ├── controllers/    # Request/response handling for each domain
 ├── services/       # Business rules (auth, product, order, payment, etc.)
 ├── models/         # Mongoose schemas (users, orders, products, promotions, ...)
 ├── middlewares/    # Auth, validation, global error handler
 ├── routes/         # REST endpoints grouped by domain
 ├── utils/          # Logger, errors, auto-increment helper, slugify
 ├── scripts/        # Database seed script with sample data
 └── index.ts        # App bootstrap
```

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Copy environment variables

```bash
cp .env.example .env
```

Fill in database URI, JWT secrets, SMTP credentials, Sepay keys, Cloudinary URL, and `FRONTEND_URL` (default http://localhost:5173).

3. Run the development server

```bash
npm run dev
```

4. Swagger docs

```bash
# chạy server rồi mở http://localhost:4000/docs
```

5. Compile for production

```bash
npm run build
npm start
```

## Database Seed

Use the provided script to bootstrap MongoDB with counters, categories, products, promotions, and default accounts (passwords are hashed automatically).

```bash
npm run seed
```

> Lưu ý: Script seed mặc định **không** chạy nếu đã có dữ liệu để tránh xoá ảnh đã upload. Nếu muốn seed lại từ đầu (sẽ xoá sạch và ghi đè), chạy với `SEED_FORCE=true npm run seed`.

Seeded accounts:

- Customer: `xanh@gmail.com` / `12345678`
- Customers: `lan@gmail.com`, `minh@gmail.com`, `hoa@gmail.com`, `tuan@gmail.com` (password `12345678`)
- Admin: `admin@gmail.com` / `12345678`

## API Overview

| Module      | Key Endpoints (prefixed with `/api`)                                        |
|-------------|-----------------------------------------------------------------------------|
| Auth        | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `PUT /auth/change-password` |
| Products    | `GET /products`, `GET /products/{id}`, `POST /products`, `PUT /products/{id}`, `DELETE /products/{id}` |
| Categories  | `GET /products/categories/all`, `POST /products/categories`                 |
| Orders      | `POST /orders`, `GET /orders/me`, `GET /orders/{id}`, `GET /orders` (admin), `PATCH /orders/{id}/status` |
| Payments    | `POST /orders/:orderId/payment/sepay`, `POST /orders/payment/sepay/callback`|
| Promotions  | `GET /promotions`, `POST /promotions`, `GET /promotions/:code`              |
| Reviews     | `GET /reviews/:productId`, `POST /reviews`                                  |
| Reports     | `GET /reports/daily/:date`, `GET /reports/monthly/:year/:month`, `GET /reports/yearly/:year`, `GET /reports/top-products` (admin) |
| Feedback    | `POST /feedback`, `GET /feedback/me`, `GET /feedback` (admin), `PATCH /feedback/:id/status`, `POST /feedback/:id/respond` |
| Consultations | `POST /consultations`, `GET /consultations/me`, `GET /consultations` (admin), `POST /consultations/:id/messages`, `POST /consultations/:id/admin/messages`, `POST /consultations/:id/close` |
| Profile     | `GET /profile`, `PUT /profile`, `PUT /profile/password`                          |

Every module uses dedicated service classes to keep controllers thin and maintainable. Guests can create orders without JWTs, while authenticated users and admins receive role-based access control.

## Scripts

- `npm run dev` – Start Nodemon + ts-node watcher
- `npm run build` – Type-check and transpile to `dist/`
- `npm start` – Run compiled server
- `npm run seed` – Seed MongoDB with counters, categories, products, promotions, admin/user accounts

## Notes

- Sepay checkout links are returned from the order creation/service when `paymentMethod === 'Sepay'`.
- SMTP service sends HTML confirmation emails for every order.
- Cloudinary integration is configured automatically when `CLOUDINARY_URL` is available.
- Product images (`POST/PUT /products`) and profile avatar upload (`PUT /profile`) accept `multipart/form-data` and are pushed to Cloudinary. Provide `CLOUDINARY_FOLDER` to group uploads (defaults to `small-house`).
- Auto-refresh access token: send `x-refresh-token: <refreshToken>` header alongside an expired access token; middleware will issue a new access token in response header `x-access-token`.
- Use the `health` endpoint (`GET /health`) for uptime checks.
