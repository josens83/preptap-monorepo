# PrepTap Mobile App

Expo React Native mobile application for PrepTap.

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run on iOS
pnpm ios

# Run on Android
pnpm android

# Run on Web
pnpm web
```

## Build

```bash
# Build for production using EAS
eas build --platform ios
eas build --platform android
```

## Features

- Cross-platform (iOS, Android, Web)
- Shared tRPC API with web app
- Secure token storage with SecureStore
- Native navigation with expo-router

## Notes

This app shares the same backend API (tRPC) with the web application.
Authentication tokens are stored securely using expo-secure-store.
