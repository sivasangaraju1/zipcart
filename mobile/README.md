# ZipCart Mobile Apps

This directory contains three separate React Native (Expo) mobile applications for the ZipCart platform.

## Apps Overview

### 1. Customer App (`customer-app/`)
The customer-facing application for browsing stores, ordering products, and tracking deliveries.

**Port:** 8081

**Features:**
- Browse stores and products
- Shopping cart management
- Place orders
- Real-time order tracking
- User profile management

### 2. Delivery Partner App (`delivery-app/`)
The delivery partner application for accepting and managing delivery orders.

**Port:** 8082

**Features:**
- View available delivery orders
- Accept delivery assignments
- Track assigned deliveries
- Mark orders as delivered
- Availability status management

### 3. Store Manager App (`store-app/`)
The store owner/manager application for managing products and orders.

**Port:** 8083

**Features:**
- Manage incoming orders
- Update order status
- Full product management (CRUD)
- Store status control
- View order details

## Running the Apps

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

Navigate to each app directory and install dependencies:

```bash
# Customer App
cd mobile/customer-app
npm install

# Delivery App
cd mobile/delivery-app
npm install

# Store App
cd mobile/store-app
npm install
```

### Environment Variables

Each app needs a `.env` file in its root directory with the following variables:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Copy `.env.example` to `.env` and fill in your Supabase credentials.

### Running Apps on Different Ports

Each app is configured to run on a different port for testing:

**Customer App - Port 8081:**
```bash
cd mobile/customer-app
npm start
# For web: npm run web
```
Access at: http://localhost:8081

**Delivery App - Port 8082:**
```bash
cd mobile/delivery-app
npm start
# For web: npm run web
```
Access at: http://localhost:8082

**Store App - Port 8083:**
```bash
cd mobile/store-app
npm start
# For web: npm run web
```
Access at: http://localhost:8083

### Running All Apps Simultaneously

You can run all three apps at the same time in separate terminal windows:

**Terminal 1 - Customer App:**
```bash
cd mobile/customer-app && npm start
```

**Terminal 2 - Delivery App:**
```bash
cd mobile/delivery-app && npm start
```

**Terminal 3 - Store App:**
```bash
cd mobile/store-app && npm start
```

## Testing on Mobile Devices

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Web Browser
```bash
npm run web
```

## Project Structure

Each app follows the same structure:

```
app/
├── App.tsx                 # Main app entry with navigation
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── babel.config.js        # Babel configuration
└── src/
    ├── lib/
    │   └── supabase.ts   # Supabase client setup
    └── screens/           # All app screens
```

## Notes

- All apps use React Navigation for routing
- Supabase is used for backend and authentication
- AsyncStorage is used for local data persistence
- Real-time updates use Supabase subscriptions

## Troubleshooting

**Port already in use:**
If you see a port conflict, make sure no other process is using the ports 8081-8083, or modify the port numbers in each app's `package.json`.

**Dependencies not found:**
Run `npm install` in each app directory.

**Expo errors:**
Clear the cache with:
```bash
expo start -c
```
