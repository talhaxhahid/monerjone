# MonerJone - Hostinger Node.js & MySQL Deployment Guide

This guide explains how to deploy the MonerJone Next.js web application to **Hostinger Node.js Web Hosting** with **MySQL Database** and **Prisma ORM**.

---

## 1. Create MySQL Database on Hostinger

1. Log into your **Hostinger hPanel**.
2. Go to **Databases** → **Management**.
3. Create a new MySQL database:
   - **Database Name**: `u123456_monerjone`
   - **Database Username**: `u123456_user`
   - **Password**: (Choose a strong password)
4. Note down your Database connection details.

---

## 2. Setup Node.js Application in Hostinger hPanel

1. Go to **Websites** → **Node.js** in hPanel.
2. Click **Create Application**:
   - **Node.js version**: 20.x or 22.x
   - **Application Mode**: Production
   - **Application root**: `/public_html` (or your subdomain directory)
   - **Application startup file**: `server.js`
3. Click **Create**.

---

## 3. Upload Project Files

You can upload files via **Git Deployment** or **File Manager / SSH / FTP**:

### Option A: Via SSH / Git (Recommended)
```bash
git clone <your-repo-url> .
npm install
```

### Option B: Via Zip Upload
Upload all files **except** `node_modules` and `.next`, extract into the application root, then in Hostinger SSH / Terminal run:
```bash
npm install
```

---

## 4. Configure Environment Variables (`.env`)

In your application root on Hostinger, create or edit the `.env` file:

```env
# Hostinger MySQL Database URL
DATABASE_URL="mysql://u123456_user:YourStrongPassword@127.0.0.1:3306/u123456_monerjone"

# JWT Secret Key
JWT_SECRET="generate_a_very_long_random_secret_string_here"

# Your Live Domain
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Admin Secret
ADMIN_SECRET_KEY="your_super_admin_passcode"

# Node Environment
NODE_ENV="production"
PORT=3000
```

---

## 5. Run Database Migrations & Seed Data

In the Hostinger SSH Terminal, run:

```bash
# Generate Prisma Client
npx prisma generate

# Apply MySQL Database Schema
npx prisma db push

# (Optional) Seed realistic Bangladeshi Muslim demo profiles & Admin account
npx prisma db seed
```

> **Default Seed Admin Login:**
> - **Phone**: `01700000000`
> - **Password**: `Password123!`

---

## 6. Build and Start the Application

In the Hostinger SSH Terminal:

```bash
# Build Next.js production bundle
npm run build

# Start using Hostinger Node.js manager or PM2
pm2 start ecosystem.config.js
# Or in hPanel click "Restart Application"
```

---

## 7. Performance & Image Storage Notes
- **Images**: Automatically converted and pre-compressed to high-resolution WebP (~60-90KB) upon upload and stored in MySQL `photos` table.
- **Serving**: Images are served via `/api/photos/[id]` with `Cache-Control: public, max-age=31536000, immutable`, enabling instantaneous cached loads across all devices.
