# Silah — Alzheimer Support Mobile Application

Silah is a **React Native / Expo mobile application** created as a team graduation project to support Alzheimer's patients, family members, friends, and caregivers through memory assistance, reminders, communication tools, and accessible daily interactions.

This repository contains the **frontend/mobile implementation** and documents my contribution to the project.

## Product Overview

Silah was designed around multiple user roles and daily care workflows.

The mobile experience includes:

- Patient, family member, and friend flows
- Authentication and account recovery screens
- Profile screens
- Memories and life-story flows
- Reminder management
- AI chat interface with audio support
- On-this-day memories
- Memory / face search flow
- Notifications
- Camera and media selection
- Cognitive games

## My Contribution

My role focused on the **frontend/mobile side** of the project.

I contributed to:

- Building mobile screens and reusable UI
- Implementing navigation flows with Expo Router
- Connecting frontend screens to backend APIs
- Authentication-related screens and state
- Profile flows
- Reminder interfaces
- Memory-related screens
- AI chat UI
- Media selection and camera flows
- Cognitive game interfaces
- Collaborating with backend and AI team members during integration

> Silah was a team graduation project. Backend and AI services were developed collaboratively by other team members; this repository focuses on the frontend implementation and my contribution.

## Key Features

### Authentication

- Login
- Registration
- Forgot password
- Verification
- Reset password
- Role-based user flows

### Patient / Family Experience

- Patient profile
- Family profile
- Friend profile
- Memory upload
- Life story
- Reminder flows
- Notifications

### AI & Memory Features

- AI chat interface
- Audio support
- On-this-day memories
- Search by memory / face workflow

### Cognitive Games

- Memory Match
- Math Challenge
- Sliding Puzzle
- Sequence Game
- Sudoku
- Word Puzzle

### Device Features

- Expo Camera
- Image Picker
- Notifications
- Audio
- AsyncStorage
- Haptics

## Tech Stack

- React Native
- Expo
- Expo Router
- JavaScript / TypeScript tooling
- AsyncStorage
- Expo Camera
- Expo Image Picker
- Expo Notifications
- Expo AV
- REST API integration
- NativeWind / Tailwind utilities

## Frontend Architecture

```text
silah-frontend/
├── app/
│   ├── (auth)/        # Authentication flows
│   ├── (main)/        # Main application routes
│   └── components/
├── src/
│   └── config/        # API configuration
├── components/        # Shared UI
├── services/          # API helpers
├── hooks/
├── styles/
├── assets/
└── authContext.js
```

## API Integration

The frontend communicates with the project backend through shared API configuration.

Example local configuration:

```js
export const API_BASE_URL = "http://localhost:8000";
```

When testing on a physical device, the backend host must be reachable from the phone over the local network.

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the backend URL

Update:

```text
src/config/ApiConfig.js
```

### 3. Start Expo

```bash
npx expo start -c
```

Then launch the app through Expo Go or an emulator.

## What This Project Demonstrates

- Building a multi-screen React Native application
- Role-based navigation
- Frontend authentication flows
- REST API integration
- Mobile state and local storage
- Camera and media workflows
- Notifications and audio
- Collaboration across frontend, backend, and AI workstreams
- Building accessible user flows for a real-world problem domain

## Project Type

**Team Graduation Project — Frontend / Mobile Contribution**

## Developer

**Karim Ehab**

- Portfolio: https://karim-3d-portfolio.vercel.app/
- GitHub: https://github.com/karimelprins
- LinkedIn: https://www.linkedin.com/in/karim-ehab-4a10902a6
