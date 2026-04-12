# Chat App

A production-minded chat experience built with the MERN stack, designed as a modern messaging platform with AI-driven assistance, profile customization, and rich media support.

## 🔥 Why this project matters
This application is more than a simple chat demo. It combines:
- a real-time Socket.IO messaging system,
- secure authentication and profile management,
- integrated image uploads,
- and conversational AI utilities that enhance real chat workflows.

This is a solid foundation for any chat product that needs both utility and polish.

## ✨ Core Features
### Chat experience
- Real-time one-to-one chat using Socket.IO
- Image attachments in chat messages with live preview and Cloudinary storage
- Persistent message history and user avatars
- Clean mobile-first chat UI with modern message bubbles and timestamps

### Productive AI flows
- AI smart replies powered by Groq Generative AI
- Conversation summarization for quick context review
- Interactive AI assistant panel for follow-up questions and chat guidance
- AI output formatted for readability with bullet lists and structured responses

### Personalization and theming
- 32 distinct UI themes available via DaisyUI presets
- Theme selection persists in `localStorage` across sessions
- Settings page preview shows live theme switching
- Profile page supports custom avatar uploads and account details

### Security and structure
- JWT + cookie-based auth with protected API routes
- Backend organized into controllers, services, routes, and middleware
- Cloudinary integration for secure image handling
- MongoDB models for users and messages

## 🧠 AI capabilities
The chat app includes multiple AI features that are deeply integrated into the messaging workflow:
- **Smart reply suggestions** generated from the latest conversation context
- **Conversation summarizer** that distills a chat thread into key points and action items
- **AI assistant chat panel** for asking the app questions and receiving rich responses

These features make the app feel like a modern smart messaging tool rather than just a chat client.

## 🧩 What’s implemented
### Frontend
- React + Vite UI with Tailwind CSS and DaisyUI
- Zustand stores for auth, chat state, theme, and AI
- Auth-protected routes for `/`, `/profile`, `/settings`
- Chat sidebar, message list, image upload, summary modal, and AI assistant panel
- Profile page with avatar upload and account details
- Settings page with 32 theme cards and live preview

### Backend
- Express API endpoints for auth, messaging, and AI
- Socket.IO server for presence and real-time updates
- Cloudinary-powered image upload for profile pictures and chat images
- Groq-based AI service for suggestions, summarization, and AI conversation
- Auth middleware protecting user data and chat routes

## 🧭 Project structure
- `/backend`
  - `src/controllers` — auth, messaging, AI controllers
  - `src/routes` — `/api/auth`, `/api/messages`, `/api/ai`
  - `src/services` — AI prompt logic and helper functions
  - `src/lib` — DB connection, Cloudinary setup, Socket.IO server
  - `src/middleware` — auth protection middleware

- `/frontend`
  - `src/pages` — `HomePage`, `LoginPage`, `SignUpPage`, `ProfilePage`, `SettingsPage`
  - `src/components` — chat modules, AI panel, message input, sidebar, summary modal
  - `src/store` — Zustand stores for auth, chat, AI, theme
  - `src/constants` — theme palette definitions

## 🚀 Setup
### Install dependencies
```bash
npm install --prefix backend
npm install --prefix frontend --include=dev
```

### Backend environment
Create `backend/.env` with:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run locally
```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

Open the app at `http://localhost:5173`.

## 🚩 Important implementation details
- Chat images are uploaded as base64 files and stored in Cloudinary before being saved to MongoDB
- Profile image updates are handled through Cloudinary and immediately reflected in the user session
- Theme changes persist per user using browser storage and apply instantly to the app chrome
- AI suggestions and summaries use context-aware prompts to keep responses relevant and concise

## 📌 Notes for reviewers
- The app is built with a modular backend and composable frontend architecture
- AI features are integrated into both chat input and sidebar workflows
- The project includes real-world concerns like auth protection, media upload, and theme persistence
- The UI is designed for modern chat use cases: user personalization, quick actions, and guided replies
