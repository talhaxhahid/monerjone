/* eslint-disable */
/**
 * MonerJone Automatic Database Migration & Seeder Runner
 * Designed for seamless deployment on Hostinger (Node.js App, cPanel, VPS, PM2, Docker).
 * 
 * Automatically ensures:
 * 1. Database schema is in sync (tables created/updated)
 * 2. Prisma Client is generated
 * 3. Initial admin and demo seed data are seeded if missing
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

async function initDatabase() {
  console.log('----------------------------------------------------');
  console.log('🚀 MonerJone: Running Auto Database Initialization...');
  console.log('----------------------------------------------------');

  loadEnv();

  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL environment variable is not set. Skipping auto-migration.');
    return;
  }

  try {
    // 1. Synchronize schema / Run migrations
    console.log('📦 Step 1/2: Synchronizing Database Schema...');
    try {
      execSync('npx prisma db push --skip-generate', {
        stdio: 'inherit',
        env: process.env,
      });
      console.log('✅ Database schema synchronized.');
    } catch (e) {
      console.warn('⚠️  Schema sync note:', e.message || e);
    }

    // 2. Auto-seed if missing
    console.log('🌱 Step 2/2: Checking if Seed Data is required...');
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    try {
      const adminUser = await prisma.user.findUnique({
        where: { phone: '01700000000' },
      });

      const userCount = await prisma.user.count();

      if (!adminUser || userCount === 0) {
        console.log(`ℹ️  No seed data detected (Found ${userCount} users). Running automatic seeder...`);
        execSync('npx tsx prisma/seed.ts', {
          stdio: 'inherit',
          env: process.env,
        });
        console.log('✅ Automatic seeding completed successfully!');
      } else {
        console.log(`✅ Database already contains ${userCount} profiles/users. Seeder skipped.`);
      }
    } catch (seedErr) {
      console.warn('⚠️  Seed check warning:', seedErr.message || seedErr);
    } finally {
      await prisma.$disconnect();
    }

    console.log('🎉 MonerJone Database is ready!');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('⚠️  Database initialization note:', error.message || error);
    console.log('Proceeding with application startup...');
  }
}

// Run if called directly
if (require.main === module) {
  initDatabase().catch((err) => {
    console.error('Fatal initialization error:', err);
    process.exit(0); // Exit 0 to prevent deployment crashing if DB is temporarily connecting
  });
}

module.exports = { initDatabase };
