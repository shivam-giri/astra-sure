# AstraSure Frontend
Absolutely, Shivam — here is a professional, polished, GitHub‑ready README.md tailored exactly for your project:

Login with Email
Login with Phone Number / OTP
Login with Google OAuth
AstraSure branding style
Clean structure & badges
Quickstart guide
API endpoints reference
Tech stack
Folder structure
Screenshots section (you can add later)
Frontend + Auth Server (Node/Express) setup included

🚀 Features
🔐 Multi‑Method Login

Email & Password
Phone Number Verification (OTP)
Google OAuth 2.0 Login

🛡 Secure Authentication Flow

Access tokens stored in local/session storage
Refresh tokens stored in HttpOnly secure cookies
Auto‑refresh token system
Protected routes with React Router

💼 Account Management

Create Account (Signup)
Forgot Password → Email Link
Reset Password (Token‑based secure reset)
Logout (server‑side & client‑side)

🎨 UI/UX

Fully responsive UI (Mobile, Tablet, Desktop)
Dark/Light mode support
Modern Material‑UI styling
Smooth animations (Framer Motion)


🏗 Tech Stack
Frontend

React 18 + Vite
React Router v6
Material‑UI (MUI v5)
Framer Motion (animations)
Swiper.js (optional UI components)
Phone Number Input (React‑phone‑input‑2)
Google Identity Services

Backend

Node.js + Express.js
MongoDB + Mongoose
JWT Access & Refresh Tokens
HttpOnly Cookies (Refresh token)
Nodemailer (Reset Password emails)
Zod Validation
Helmet, Rate Limiting, CORS


📁 Folder Structure (Frontend)
src/
 ├─ pages/
 │   ├─ Login.jsx
 │   ├─ Signup.jsx
 │   ├─ ForgotPassword.jsx
 │   ├─ ResetPassword.jsx
 │   └─ ...
 ├─ services/
 │   └─ auth.js        // All API calls (login, signup, reset, refresh, etc.)
 ├─ routes/
 │   └─ ProtectedRoute.jsx
 ├─ layouts/
 │   └─ MainLayout.jsx
 ├─ shared/
 │   ├─ Header.jsx
 │   ├─ Footer.jsx
 │   └─ Banner.jsx
 └─ theme/
     └─ index.jsx      // Dark/Light Mode + Theme Provider

🗄 Folder Structure (Backend)
astra-auth-server/
 ├─ server.js
 ├─ .env
 └─ src/
     ├─ routes/
     │   └─ auth.js
     ├─ models/
     │   └─ User.js
     ├─ utils/
     │   ├─ jwt.js
     │   └─ email.js
     └─ middleware/
         └─ requireAuth.js


⚙️ Environment Variables
Frontend .env
VITE_API_URL=http://localhost:4001
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID

Backend .env
PORT=4001
CLIENT_ORIGIN=http://localhost:5173

MONGO_URI=mongodb://127.0.0.1:27017/astra_auth

JWT_ACCESS_SECRET=your_random_string
JWT_REFRESH_SECRET=your_random_string
JWT_RESET_SECRET=your_random_string

ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
RESET_TOKEN_TTL=1h

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM="AstraSure <no-reply@astrasure.com>"


▶️ Running the Project
1️⃣ Start Backend (Auth Server)
cd astra-auth-server
npm install
npm run dev
Server runs on:
http://localhost:4001

2️⃣ Start Frontend
cd astra-frontend
npm install
npm run dev
Frontend runs on:
http://localhost:5173
