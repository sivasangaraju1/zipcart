# ZipCart Store Management App

React Native mobile application for store managers to manage inventory and fulfill orders.

## Features

- Manage incoming orders
- Update order status
- Inventory management
- Product catalog updates
- Real-time order notifications
- Sales analytics

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio (for emulator)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from example:
```bash
cp .env.example .env
```

3. Add your Supabase credentials to `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm start
```

5. Run on your device:
- Scan the QR code with Expo Go app (iOS/Android)
- Press `i` for iOS simulator
- Press `a` for Android emulator

## Project Structure

```
src/
├── contexts/       # React contexts (Auth)
├── lib/           # Supabase client and types
├── navigation/    # Navigation setup
└── screens/       # App screens
```

## Tech Stack

- React Native
- Expo
- TypeScript
- React Navigation
- Supabase

## Environment Variables

- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## License

Proprietary
