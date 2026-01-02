# Supabase Database

This directory contains the database schema and migrations for Zipcart.

## Current Status

✅ **Database is fully operational and populated with seed data**

All tables, security policies, indexes, triggers, and seed data have been successfully applied.

## Database Overview

- **16 tables** with full Row Level Security (RLS)
- **10 product categories**
- **30 products** across all categories
- **5 stores** in major US cities
- **150 inventory records** (products × stores)
- **3 active promotions**
- **5 store operator test accounts**

## Test Accounts

Store operator accounts for testing (password: `password123`):
- operator1@zipcart.com (Manhattan Downtown)
- operator2@zipcart.com (Brooklyn Heights)
- operator3@zipcart.com (SF Mission)
- operator4@zipcart.com (LA West Hollywood)
- operator5@zipcart.com (Chicago Loop)

## Documentation

See `DATABASE_SCHEMA.md` in the project root for complete schema documentation including:
- Table structures
- Custom types
- Security policies
- Helper functions
- Seed data details

## Connection

Database connection details are automatically configured via environment variables in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Migrations

The migrations folder is intentionally empty. The database schema has been consolidated and is already applied. All future schema changes should be created using the Supabase migration tools.
