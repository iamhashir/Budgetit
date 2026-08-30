# Budgetit

Budgetit is a React Native budgeting application focused on making expense tracking easy to understand and comfortable to use.

## Product direction

- Primary experience: simple budgeting and expense entry.
- Core navigation: Home, Add, Settings.
- Visual direction: polished, calm, attractive, and easy to scan.
- Accessibility is a first-class requirement, especially for older users.
- Frontend copy rule: do not add or change user-facing text unless it has been explicitly approved first.

## Accessibility baseline

The UI foundation is designed around:

- large, readable typography and system font scaling
- minimum comfortable touch targets
- high-contrast theme tokens
- safe-area aware layouts
- clear navigation states
- reduced visual clutter
- semantic accessibility roles and labels
- support for light/dark system appearance at the theme level

## Tech stack

- React Native
- Expo SDK 57
- TypeScript
- React Navigation
- react-native-safe-area-context
- react-native-screens

## Project structure

```text
Budgetit/
├── App.tsx
├── index.ts
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── AddScreen.tsx
│   │   └── SettingsScreen.tsx
│   └── theme/
│       └── theme.ts
├── app.json
├── package.json
└── tsconfig.json
```

## Getting started

Requirements:

- Node.js 22.13+ recommended for Expo SDK 57
- npm
- Android Studio / Android device, or Xcode on macOS for iOS

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Run Android:

```bash
npm run android
```

Run iOS:

```bash
npm run ios
```

Type-check the project:

```bash
npm run typecheck
```

## Frontend copy policy

The application intentionally contains no invented product copy. The only visible navigation text currently used is the explicitly requested screen naming: Home, Add, and Settings.

Before adding headings, onboarding text, empty states, button labels, helper text, settings descriptions, financial terminology, alerts, or any other user-facing wording, confirm the copy first.

## Current scope

The initial scaffold includes:

1. Home screen shell
2. Add screen shell
3. Settings screen shell
4. Bottom-tab navigation
5. Shared visual theme
6. Safe-area handling
7. Accessibility-oriented spacing, scaling, and touch targets

No budgeting logic, persistence, forms, financial calculations, authentication, or backend integration has been added yet.
