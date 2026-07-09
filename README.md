# Silah — Graduation Project Frontend

Silah is a React Native / Expo mobile application built as part of a team graduation project.  
The app is designed to support Alzheimer's patients, families, friends, and caregivers through memory assistance, reminders, AI-powered interaction, and accessible daily tools.

> Note: Backend services were developed as part of the team graduation project. This repository focuses on the frontend/mobile implementation.

---

## 📱 Overview

Silah provides a mobile experience for different user types, including patients, family members, and friends.  
The frontend focuses on clean navigation flows, mobile UI screens, API integration, and features that support daily care and memory-related assistance.

---

## ✨ Features

- Patient, family, and friend user flows
- Login, register, forgot password, verification, and reset password screens
- Patient profile
- Family profile
- Friend profile
- Memory upload flow
- Life story screens
- Reminders
- AI chat interface with audio support
- On-this-day memories
- Search by memory / face flow
- Cognitive games:
  - Memory match
  - Math challenge
  - Puzzle
  - Sequence
  - Sudoku
  - Word puzzle
- Notifications
- Camera and image picker support
- Audio support
- AsyncStorage usage
- Backend API integration
- Mobile-first user interface

---

## 🧑‍💻 My Role

My role focused on contributing to the frontend/mobile side of the project, including:

- Building and integrating mobile screens
- Creating user interface components
- Implementing navigation flows using Expo Router
- Connecting frontend screens with backend APIs
- Working on authentication-related screens
- Building profile, reminder, memory, chat, and game-related UI flows
- Collaborating with backend and AI team members to connect frontend features with backend services

---

## 🛠️ Tech Stack

- React Native
- Expo
- Expo Router
- JavaScript
- AsyncStorage
- Expo Camera
- Expo Image Picker
- Expo Notifications
- Expo AV
- API Integration

---

## 📂 Project Structure
silah-frontend/
├── app/
├── src/
├── assets/
├── components/
├── package.json
├── app.json
└── README.md

---

## 🚀 Getting Started

### 1. Clone the repository
git clone https://github.com/karimelprins/silah-frontend.git
cd silah-frontend


### 2. Install dependencies

npm install

### 3. Configure API URL

Update the API base URL inside:

​
src/config/ApiConfig.js

Example for local backend:
export const API_BASE_URL = "http://localhost:8000";


For testing on a physical device with Expo Go, replace `localhost` with your local network IP address.

Example:
export const API_BASE_URL = "http://192.168.x.x:8000";
### 4. Start the Expo development server

​
npx expo start -c

Then run the app using Expo Go or an emulator.

---

## ⚠️ Important Note

This repository contains the frontend/mobile implementation only.  
The backend and AI services were developed as part of the team graduation project and are not included in this repository.

---

## 📌 Project Type

Team Graduation Project — Frontend Contribution

---

## 👤 Author

Karim Ehab  
Frontend Developer

- Portfolio: https://karim-3d-portfolio.vercel.app/
- GitHub: https://github.com/karimelprins
- LinkedIn: https://www.linkedin.com/in/karim-ehab-4a10902a6

