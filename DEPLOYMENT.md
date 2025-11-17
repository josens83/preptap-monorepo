# PrepTap Deployment Guide

This guide provides comprehensive instructions for deploying PrepTap in various environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
  - [Database Setup](#database-setup)
  - [Vercel Deployment](#vercel-deployment)
  - [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher
- Git installed and configured
- Database (SQLite for development, PostgreSQL for production)
- Vercel account (for production deployment)
- Stripe account (for payment processing)

## 🏠 Local Development

### 1. Initial Setup

```bash
# Clone the repository
git clone https://github.com/josens83/preptap-monorepo.git
cd preptap-monorepo

# Install dependencies and setup database
pnpm setup
```

### 2. Environment Configuration

Create `.env` file in the root directory:

```bash
cp .env.example .env
```

Update with your local settings:

```env
# Database (SQLite for development)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-local-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Prisma
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Start Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your application.

### 4. Test Accounts

After running `pnpm db:seed`, you can use these test accounts:

- **Free User**: `free@example.com` / `password123`
- **Premium User**: `premium@example.com` / `password123`

## 🚀 Production Deployment

### Database Setup

#### Option 1: Vercel Postgres (Recommended)

```bash
# Install Vercel Postgres
pnpm add @vercel/postgres

# In your Vercel dashboard:
# 1. Go to Storage tab
# 2. Create New Database → Postgres
# 3. Copy connection string
```

#### Option 2: Supabase

```bash
# 1. Create account at https://supabase.com
# 2. Create new project
# 3. Go to Settings → Database
# 4. Copy connection string (Transaction mode)
```

#### Option 3: Railway

```bash
# 1. Create account at https://railway.app
# 2. New Project → Provision PostgreSQL
# 3. Copy DATABASE_URL from Variables tab
```

### Database Migration

```bash
# Generate Prisma Client
pnpm db:generate

# Run migrations
cd packages/db
pnpm prisma migrate deploy

# Seed production data (optional)
pnpm db:seed
```

### Vercel Deployment

#### 1. Install Vercel CLI

```bash
pnpm add -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Link Project

```bash
vercel link
```

#### 4. Configure Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="use-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.vercel.app"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"

# Email (optional - for production notifications)
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="noreply@preptap.com"

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID="G-XXXXXXXXXX"
```

#### 5. Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

#### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | NextAuth secret key | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Application URL | `https://preptap.com` |
| `NEXT_PUBLIC_APP_URL` | Public app URL | `https://preptap.com` |

#### Optional Variables

| Variable | Description | Required For |
|----------|-------------|--------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Google login |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Google login |
| `STRIPE_SECRET_KEY` | Stripe secret key | Payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Payment webhooks |
| `EMAIL_SERVER` | SMTP server URL | Email notifications |
| `EMAIL_FROM` | Sender email address | Email notifications |

### Stripe Integration

#### 1. Create Stripe Account

Visit https://dashboard.stripe.com/register

#### 2. Get API Keys

```bash
# Dashboard → Developers → API keys
# Copy "Secret key" and "Publishable key"
```

#### 3. Setup Webhooks

```bash
# Dashboard → Developers → Webhooks
# Add endpoint: https://your-domain.vercel.app/api/webhooks/stripe

# Select events:
# - checkout.session.completed
# - customer.subscription.created
# - customer.subscription.updated
# - customer.subscription.deleted
# - invoice.payment_succeeded
# - invoice.payment_failed
```

#### 4. Test Webhook Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 📊 Post-Deployment

### 1. Verify Deployment

```bash
# Check app is accessible
curl -I https://your-domain.vercel.app

# Check database connection
pnpm prisma db pull
```

### 2. Monitor Logs

```bash
# View deployment logs
vercel logs

# View production logs
vercel logs --prod
```

### 3. Setup Custom Domain (Optional)

```bash
# In Vercel Dashboard:
# 1. Go to Settings → Domains
# 2. Add domain
# 3. Configure DNS records as instructed

# Or via CLI:
vercel domains add your-domain.com
```

### 4. Setup Analytics

#### Google Analytics

```bash
# 1. Create GA4 property at https://analytics.google.com
# 2. Copy Measurement ID (G-XXXXXXXXXX)
# 3. Add to Vercel environment variables:
NEXT_PUBLIC_GA_TRACKING_ID="G-XXXXXXXXXX"
```

#### Vercel Analytics

```bash
# Install Vercel Analytics
pnpm add @vercel/analytics

# Already integrated in apps/web/src/app/layout.tsx
```

### 5. Performance Optimization

```bash
# Enable compression
# Already configured in next.config.js

# Optimize images
# Using Next.js Image component (optimized by default)

# Enable caching
# Configure in vercel.json:
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

## 🔒 Security Checklist

- [ ] Environment variables are set in Vercel (not in code)
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] Database credentials are secure
- [ ] Stripe keys are production keys (not test keys)
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection (React handles this)
- [ ] HTTPS is enforced
- [ ] Webhook signatures are verified

## 🐛 Troubleshooting

### Build Errors

**Error: "Module not found"**

```bash
# Clear cache and reinstall
pnpm clean
pnpm install
pnpm build
```

**Error: "Prisma Client not generated"**

```bash
# Generate Prisma Client
pnpm db:generate
```

### Database Issues

**Error: "Can't reach database server"**

```bash
# Check connection string format
# PostgreSQL: postgresql://user:password@host:port/database
# Ensure IP is whitelisted in database provider

# Test connection
psql $DATABASE_URL
```

**Error: "Migration failed"**

```bash
# Reset and re-run migrations
cd packages/db
pnpm prisma migrate reset
pnpm prisma migrate deploy
```

### Runtime Errors

**Error: "NEXTAUTH_URL is not configured"**

```bash
# Ensure NEXTAUTH_URL is set in Vercel environment variables
# Format: https://your-domain.vercel.app (no trailing slash)
```

**Error: "Stripe webhook signature verification failed"**

```bash
# Ensure STRIPE_WEBHOOK_SECRET is correctly set
# Get it from: Stripe Dashboard → Webhooks → Signing secret
```

### Performance Issues

**Slow API responses**

```bash
# Check database indexes
pnpm prisma studio

# Add indexes to frequently queried fields
# Example: @@index([userId, createdAt])
```

**High memory usage**

```bash
# Optimize Prisma queries
# Use select to fetch only needed fields
# Use pagination for large datasets
```

## 📈 Monitoring

### Vercel Monitoring

- **Deployment logs**: `vercel logs`
- **Analytics**: Vercel Dashboard → Analytics
- **Speed Insights**: Vercel Dashboard → Speed Insights

### Database Monitoring

```bash
# View database stats
pnpm db:studio

# Check connection pool
# In Prisma schema, configure:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

### Error Tracking (Optional)

```bash
# Setup Sentry
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs

# Or use Vercel Error Tracking (built-in)
```

## 🔄 Continuous Deployment

Vercel automatically deploys:

- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and pushes to other branches

### Disable Auto-Deploy (if needed)

```bash
# In vercel.json:
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "preview": false
    }
  }
}
```

## 📞 Support

- **Documentation**: https://github.com/josens83/preptap-monorepo
- **Issues**: https://github.com/josens83/preptap-monorepo/issues
- **Email**: dev@preptap.com

## 🎉 Success!

Your PrepTap application is now deployed! 🚀

Next steps:
1. Test all features in production
2. Monitor logs and analytics
3. Setup error tracking
4. Configure backup strategy
5. Plan for scaling

---

**Happy deploying!** 🙏
