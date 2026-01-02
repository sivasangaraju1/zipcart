# ZipCart Delivery Partner App

React Native mobile application for delivery partners to accept and fulfill orders.

## Features

- View available delivery orders
- Accept delivery assignments
- Real-time navigation to pickup and delivery locations
- Update order status throughout delivery process
- Earnings tracking
- Delivery history

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
- React Native Maps
- Expo Location

## Environment Variables

- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## License

Proprietary
