# Zipcart Database Schema

Complete database schema for the Zipcart quick-commerce platform.

## Database Status

✅ **Fully Operational** - All tables, indexes, security policies, and seed data are in place.

## Tables Overview

| Table | Records | Description |
|-------|---------|-------------|
| `user_profiles` | 6 | Extended user information with roles |
| `addresses` | 7 | User delivery addresses |
| `stores` | 5 | Physical/dark stores |
| `store_operators` | 5 | Links store operators to their stores |
| `categories` | 10 | Product categories |
| `products` | 30 | Product catalog |
| `inventory` | 150 | Store-specific product inventory |
| `carts` | 0 | User shopping carts |
| `cart_items` | 0 | Items in shopping carts |
| `orders` | 3 | Customer orders |
| `order_items` | 2 | Items in orders |
| `payments` | 0 | Payment records |
| `delivery_partners` | 0 | Delivery driver profiles |
| `deliveries` | 0 | Delivery tracking |
| `promotions` | 3 | Discount codes and promotions |
| `notifications` | 0 | User notifications |

## Custom Types

### user_role
- `customer` - Regular customers
- `delivery_partner` - Delivery drivers
- `store_operator` - Store managers
- `admin` - System administrators

### store_type
- `partner_store` - Partner retail stores
- `dark_store` - Fulfillment-only locations
- `micro_fulfillment` - Small urban fulfillment centers

### order_status
- `pending` - Order placed, awaiting confirmation
- `confirmed` - Order confirmed by store
- `preparing` - Items being picked and packed
- `out_for_delivery` - Order picked up by delivery partner
- `delivered` - Order successfully delivered
- `cancelled` - Order cancelled

### payment_status
- `pending` - Payment not yet processed
- `processing` - Payment being processed
- `succeeded` - Payment successful
- `failed` - Payment failed
- `refunded` - Payment refunded

### delivery_status
- `assigned` - Delivery assigned to partner
- `picked_up` - Order picked up from store
- `in_transit` - En route to customer
- `delivered` - Successfully delivered
- `failed` - Delivery failed

### discount_type
- `percentage` - Percentage discount (e.g., 10% off)
- `fixed_amount` - Fixed dollar discount (e.g., $5 off)
- `free_delivery` - Free delivery fee

## Key Tables

### user_profiles
Extended user information linked to Supabase Auth users.

**Columns:**
- `id` (uuid, PK) - References auth.users(id)
- `role` (user_role) - User role (default: customer)
- `phone` (text) - Contact phone number
- `avatar_url` (text) - Profile image URL
- `is_active` (boolean) - Account active status
- `created_at`, `updated_at` (timestamptz)

**Security:**
- Users can view/update their own profile
- Automatic profile creation on signup via trigger

### stores
Physical stores and dark stores for order fulfillment.

**Columns:**
- `id` (uuid, PK)
- `name` (text) - Store name
- `type` (store_type) - Store type
- `address`, `city`, `state`, `zip_code` (text) - Location
- `latitude`, `longitude` (numeric) - Coordinates for distance calculations
- `delivery_radius_miles` (numeric) - Maximum delivery distance
- `is_active` (boolean) - Store operational status
- `opens_at`, `closes_at` (time) - Operating hours
- `created_at`, `updated_at` (timestamptz)

**Security:**
- All authenticated users can view active stores
- Admins can manage all stores
- Store operators can update their assigned stores

### products
Product catalog with pricing and tax information.

**Columns:**
- `id` (uuid, PK)
- `category_id` (uuid, FK) - Product category
- `name` (text) - Product name
- `slug` (text, unique) - URL-friendly identifier
- `description` (text) - Product description
- `image_url` (text) - Primary product image
- `images` (jsonb) - Additional product images
- `base_price` (numeric) - Price in dollars
- `unit` (text) - Unit of measure (lb, each, etc.)
- `is_taxable` (boolean) - Subject to tax
- `tax_category` (text) - Tax category (food, non_food)
- `barcode` (text) - Product barcode
- `is_active` (boolean) - Product availability
- `created_at`, `updated_at` (timestamptz)

**Security:**
- All authenticated users can view active products
- Store operators and admins can create/update products

### inventory
Store-specific product inventory levels.

**Columns:**
- `id` (uuid, PK)
- `product_id` (uuid, FK) - Product reference
- `store_id` (uuid, FK) - Store reference
- `quantity` (integer) - Available quantity
- `reserved_quantity` (integer) - Quantity reserved in carts
- `reorder_level` (integer) - Reorder threshold
- `updated_at` (timestamptz)

**Unique Constraint:** (product_id, store_id)

**Security:**
- All authenticated users can view inventory
- Store operators can update inventory for their stores
- Admins can manage all inventory

### orders
Customer orders with delivery and payment information.

**Columns:**
- `id` (uuid, PK)
- `order_number` (text, unique) - Customer-facing order ID
- `user_id` (uuid, FK) - Customer reference
- `store_id` (uuid, FK) - Fulfilling store
- `address_id` (uuid, FK) - Delivery address
- `status` (order_status) - Current order status
- `subtotal` (numeric) - Items subtotal
- `tax_amount` (numeric) - Tax amount
- `delivery_fee` (numeric) - Delivery fee
- `tip_amount` (numeric) - Driver tip
- `total_amount` (numeric) - Total order amount
- `estimated_delivery_time` (timestamptz) - ETA
- `actual_delivery_time` (timestamptz) - Actual delivery time
- `special_instructions` (text) - Customer notes
- `created_at`, `updated_at` (timestamptz)

**Security:**
- Users can view/create their own orders
- Admins can view all orders

## Helper Functions

### generate_order_number()
Generates unique order numbers in format `ZC123456789`.

### update_updated_at_column()
Trigger function to automatically update `updated_at` timestamps.

### get_user_role(user_id)
Security definer function to check user roles without RLS recursion.

### handle_new_user()
Trigger function to automatically create user_profiles when a new user signs up.

## Seed Data

### Stores
- Zipcart Manhattan Downtown (NYC)
- Zipcart Brooklyn Heights (NYC)
- Zipcart SF Mission (San Francisco)
- Zipcart LA West Hollywood (Los Angeles)
- Zipcart Chicago Loop (Chicago)

### Categories (10 total)
- Fresh Produce
- Dairy & Eggs
- Meat & Seafood
- Bakery
- Snacks & Candy
- Beverages
- Frozen Foods
- Pantry Staples
- Health & Personal Care
- Household Essentials

### Products (30 total)
Products span all categories with realistic pricing and images from Pexels.

### Promotions
- `WELCOME10` - 10% off first order
- `SAVE5` - $5 off orders over $30
- `FREEDEL` - Free delivery

### Test Accounts
Store operator accounts (password: `password123`):
- operator1@zipcart.com (Manhattan Downtown)
- operator2@zipcart.com (Brooklyn Heights)
- operator3@zipcart.com (SF Mission)
- operator4@zipcart.com (LA West Hollywood)
- operator5@zipcart.com (Chicago Loop)

## Security (Row Level Security)

All tables have RLS enabled with appropriate policies:

- **Ownership-based access**: Users can only access their own data
- **Role-based access**: Admins have full access, store operators have limited access
- **Public read access**: Categories, products, and stores are viewable by all authenticated users
- **Helper functions**: Prevent RLS infinite recursion issues

## Indexes

Comprehensive indexes on:
- Foreign key columns
- Frequently queried columns (status, is_active, etc.)
- Geographic coordinates (latitude, longitude)
- Timestamps for sorting
- Unique constraints

## Triggers

All tables with `updated_at` columns have triggers to automatically update timestamps on row updates.

## Connection Details

Database connection details are stored in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
