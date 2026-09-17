# MonerJone Deployment Guide (Hostinger / cPanel / VPS / PM2)

This project is pre-configured with **zero-hassle automatic database migrations and initial seeder automation**.

---

## ⚡ Automatic Database Migration & Seeding on Startup

When deployed to Hostinger (via Hostinger Node.js Web App, cPanel Node.js Selector, PM2, or VPS):
1. **Schema Sync**: Every time the app starts (`npm start` or `prestart`), it automatically runs `node scripts/init-db.js`.
2. **Auto-Migration**: Checks the MySQL database and automatically creates/updates all required tables, columns, and foreign keys matching `prisma/schema.prisma`.
3. **Smart Seeder**:
   - If the database is empty or missing the Admin user, it automatically runs the seeder (`prisma/seed.ts`).
   - If user accounts already exist, it skips seeding to preserve all live user data safely.

---

## 📋 Hostinger Deployment Setup Steps

### 1. Configure Environment Variables (`.env`)
Create or update `.env` in the root folder with your Hostinger MySQL database details:

```env
# Database Connection (MySQL on Hostinger)
DATABASE_URL="mysql://u123456789_moner:YourStrongPassword@localhost:3306/u123456789_monerjone"

# Next.js / App
NODE_ENV="production"
PORT=3000

# Authentication & JWT Secrets
JWT_SECRET="your_production_random_secret_32_characters_long"

# Stripe (Optional - If left blank or test keys, fallback bKash/Nagad works seamlessly)
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

### 2. Hostinger Node.js Application Settings
In your **Hostinger Control Panel** > **Node.js**:
- **Node.js version**: `20.x` or `18.x`
- **Application root**: `/public_html` (or your project folder)
- **Application Startup File**: `node_modules/next/dist/bin/next` or standard `npm start`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

---

### 3. Manual Database Commands (If needed via SSH/Terminal)

| Command | Purpose |
| :--- | :--- |
| `npm run init-db` | Manually run schema sync & smart seeder check |
| `npm run db:push` | Push Prisma schema directly to MySQL database |
| `npm run db:seed` | Manually seed demo users and default admin |
| `npm run build` | Build optimized production Next.js bundle |
| `npm start` | Run auto-init + start Next.js production server |

---

### 4. Default Seed Credentials (After Auto-Seed)

- **Admin Account**:
  - **Phone**: `01700000000`
  - **Password**: `Password123!`
  - **Role**: `ADMIN` (Access to `/admin` panel)

- **Demo User Account**:
  - **Phone**: `01711111111`
  - **Password**: `Password123!`
