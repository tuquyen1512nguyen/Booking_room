# StudySpace 🎓 — Study Room & Lab Booking App

[![React Native](https://img.shields.io/badge/React_Native-0.86.3-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK-57.0-000000?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, premium university study space and laboratory reservation mobile application built with **React Native**, **Expo Managed Workflow (SDK 57)**, **TypeScript**, **React Navigation 7**, **Zustand**, **TanStack Query**, and **Reanimated**.

📌 **GitHub Repository**: [https://github.com/tuquyen1512nguyen/Booking_room.git](https://github.com/tuquyen1512nguyen/Booking_room.git)

---

## 📋 Table of Contents

- [✨ Core Features](#-core-features)
- [📂 Repository & Directory Structure](#-repository--directory-structure)
- [🛠 Tech Stack](#-tech-stack)
- [⚡ Quick Start & Installation Guide](#-quick-start--installation-guide)
  - [Prerequisites](#1-prerequisites)
  - [Clone Repository](#2-clone-the-repository)
  - [Install Dependencies](#3-install-dependencies)
  - [Start Development Server](#4-start-the-expo-development-server)
- [📱 Running on Devices & Emulators](#-running-on-devices--emulators)
- [🧪 Scripts & Verification](#-scripts--verification)
- [👤 Author & License](#-author--license)

---

## ✨ Core Features

1. **Campus Space Discovery & Live Availability**:
   - Live campus banner showing open spaces, hours, and real-time statistics.
   - Real-time instant search across room titles, room codes, campus buildings, and descriptions.
   - Category filters (*All*, *🟢 Available*, *💻 Labs*, *📚 Library*, *👥 Large (>25)*, *🎯 Meeting*).
   - Advanced filter bottom sheet: filter by building, minimum capacity (4+, 10+, 20+, 30+), and specific amenities (Workstations, Projector, Wi-Fi, AC, Power Outlets, Smart TV, Soundproof).
   - Card scale animations, capacity badges, rating indicators, and instant bookmarking.

2. **Interactive Room Details**:
   - High-resolution multi-photo carousel with pagination.
   - Environment noise level tags, capacity, ratings, and max reservation duration.
   - Equipment and campus regulations breakdown.
   - Live daily schedule preview indicating reserved vs available slots.

3. **Smart Booking Engine & Conflict Prevention**:
   - 14-day date selection carousel.
   - Morning, Afternoon, and Evening time slot pickers (08:00 to 21:00).
   - **Conflict Engine**: Prevents double-booking by disabling slots already reserved by current user or default schedules.
   - Custom booking purpose input and group size tracker.
   - Instant booking confirmation dialog with haptic feedback.

4. **My Bookings & Digital QR Pass**:
   - Filter between *Upcoming* active bookings and *Past & History*.
   - Generate digital QR Campus Pass modal for quick turnstile and lab check-in.
   - One-click cancellation with immediate slot release.

5. **Profile, Saved Spaces & Notifications**:
   - Student profile card with active quota tracking.
   - Bookmarked / Saved rooms quick access screen.
   - Notification center with alert preference toggles.
   - IT Support contact and reset demo state utilities.

---

## 📂 Repository & Directory Structure

```
Booking_room/
├── assets/                  # App icons, splash images, adaptive icons
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── booking/         # DateSelector, TimeSlotPicker, BookingCard, QRCodeModal
│   │   ├── browse/          # SearchBar, FilterChips, RoomCard, QuickStatsBanner
│   │   ├── common/          # Badge, Button, EmptyState, SkeletonCard
│   │   └── modals/          # FilterModal
│   ├── constants/           # Design system (theme, colors, typography, spacing)
│   ├── data/                # Mock rooms dataset & default schedule configuration
│   ├── navigation/          # React Navigation 7 setup (TabNavigator, RootNavigator)
│   ├── screens/             # App screens (Browse, RoomDetail, Booking, MyBookings, Profile, etc.)
│   ├── services/            # TanStack React Query API handlers
│   ├── store/               # Zustand store with AsyncStorage persistence
│   └── types/               # TypeScript interfaces & types
├── App.tsx                  # Root Application Component with Providers
├── app.json                 # Expo Managed Configuration
├── babel.config.js          # Babel preset and Reanimated plugin configuration
├── index.ts                 # Expo entry point
├── package.json             # Project dependencies and npm scripts
├── tsconfig.json            # Strict TypeScript configuration
└── README.md                # Project documentation and setup guide
```

---

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (Expo Managed Workflow SDK 57)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (`strict: true`)
- **Navigation**: [React Navigation 7](https://reactnavigation.org/) (Native Stack & Bottom Tabs)
- **Global State**: [Zustand](https://github.com/pmndrs/zustand) + `@react-native-async-storage/async-storage`
- **Server Data Handling**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Animations**: [React Native Reanimated](https://docs.expo.dev/versions/latest/sdk/reanimated/)
- **Icons & UI**: [Lucide React Native](https://lucide.dev/), `@expo/vector-icons`, `expo-haptics`, `expo-linear-gradient`, `expo-blur`

---

## ⚡ Quick Start & Installation Guide

Follow these steps to run the application on your local machine:

### 1. Prerequisites

Make sure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node.js) or **bun** / **yarn** / **pnpm**
- **Expo Go App**: Download on your physical mobile phone from the [iOS App Store](https://apps.apple.com/app/expo-go/id982107779) or [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (optional, if testing on physical device).

---

### 2. Clone the Repository

Clone the project repository from GitHub:

```bash
git clone https://github.com/tuquyen1512nguyen/Booking_room.git
cd Booking_room
```

---

### 3. Install Dependencies

Install all project dependencies using npm:

```bash
npm install
```
> Or if using Expo CLI installer:
> ```bash
> npx expo install
> ```

---

### 4. Start the Expo Development Server

Run the development server command:

```bash
npm start
# or
npx expo start
```

---

## 📱 Running on Devices & Emulators

Once the development server starts, you will see a QR code in your terminal. You can run the app in the following ways:

### 🅰️ Physical Device (Recommended)
1. Open the **Expo Go** app on your iOS or Android device.
2. **Android**: Scan the QR code displayed in the terminal using the Expo Go app.
3. **iOS**: Open your device Camera app, scan the terminal QR code, and open the link in Expo Go.

### 🤖 Android Emulator
1. Launch your Android Studio Virtual Device (AVD).
2. Press `a` in the terminal running `npx expo start`.

### 🍎 iOS Simulator (macOS only)
1. Open Xcode Simulator.
2. Press `i` in the terminal running `npx expo start`.

### 🌐 Web Browser Preview
1. Press `w` in the terminal running `npx expo start`.

---

## 🧪 Scripts & Verification

| Command | Description |
| :--- | :--- |
| `npm start` / `npx expo start` | Starts the Expo Metro bundler server |
| `npx tsc --noEmit` | Runs strict TypeScript type check |
| `npx expo-doctor` | Validates dependencies, SDK versions, and config |

---

## 👤 Author & License

- **Author**: Tú Quyên
- **Repository**: [https://github.com/tuquyen1512nguyen/Booking_room.git](https://github.com/tuquyen1512nguyen/Booking_room.git)
- **License**: MIT License
