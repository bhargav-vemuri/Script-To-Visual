<div align="center">
  
# 🎬 ScriptVision
**AI-Powered Cinematic Pre-Production & Storyboarding**

[![React](https://img.shields.io/badge/React-19.0+-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0+-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Optimized-47A248.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Groq](https://img.shields.io/badge/Groq-LPU_Inference-f5a623.svg?style=for-the-badge)](https://groq.com/)

**🚀 Live Demo:** [script-to-visual.vercel.app](https://script-to-visual.vercel.app)

*ScriptVision is an enterprise-grade AI tool designed for Directors, DoPs, Editors, and Script Supervisors. It translates raw screenplays into deeply structured cinematic breakdowns, shot divisions, and storyboards in seconds.*

</div>

---

## 🚀 Overview

ScriptVision bridges the gap between text and screen. By leveraging state-of-the-art Large Language Models (LLMs) and Image Generation APIs, it analyzes the emotional subtext of a script and translates it into actionable cinematic language. 

Unlike generic AI wrappers, ScriptVision acts as a 30-year veteran of global cinema, recommending highly specific lens choices, lighting ratios, camera blocking, and editorial rhythms.

## ✨ Key Capabilities

- **Deep Cinematic Breakdown**: Uses `llama-3.3-70b-versatile` via Groq LPU to extract emotional DNA and translate it into precise DoP-style shot notes.
- **Shot-by-Shot Division**: Automatically breaks scenes into logically motivated shots, complete with camera movement, lens distortion, and psychological purpose.
- **Sound & Editorial Rhythm**: Generates detailed soundscapes (tempo, instrumentation) and editorial pacing tailored to the scene's tension.
- **Non-Blocking AI Storyboarding**: Integrates with Hugging Face's `FLUX.1-schnell` model to generate high-fidelity, cinematic storyboard frames.
- **Premium UI/UX (Amber Noir)**: A glassmorphism-inspired dark mode interface built with Framer Motion, featuring our custom *Amber Noir* cinematic color palette.

---

## 🏗️ System Architecture

ScriptVision is built for high performance and scalability, utilizing a decoupled MERN-stack architecture capable of handling heavy concurrent AI workloads without timeouts.

### Technology Stack
- **Frontend**: React, Vite, Framer Motion, TailwindCSS, React Router.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **AI Inference**: Groq (Text Analysis), Hugging Face (Image Generation).

### Scalability & Performance Highlights
- **OOM-Protected Uploads**: PDF ingestion bypasses RAM entirely, utilizing OS-level temp disk storage (`multer.diskStorage`) to allow massive concurrent file uploads without memory crashing.
- **Global Concurrency Queue**: Heavy outbound API requests (like Hugging Face image generation) are routed through a non-blocking, asynchronous global queue to prevent API rate-limit bans and socket exhaustion.
- **Optimized DB Indexing**: MongoDB is heavily indexed on relational fields to ensure instant data retrieval at scale.
- **DDoS Mitigation**: Built-in Express rate-limiting protects the backend from malicious scraping and brute-force attacks.
- **React Memoization**: The UI utilizes deep React memoization (`React.memo`, `useCallback`) to guarantee 60fps rendering even when displaying massive script breakdowns.

---

## 💻 Getting Started (Local Development)

### 1. Prerequisites
Ensure you have the following installed on your local machine:
- **Node.js** (v18.x or higher)
- **MongoDB** (running locally or via MongoDB Atlas)
- API Keys for **Groq** and **Hugging Face**

### 2. Environment Configuration
Create a `.env` file in the `/backend` directory and add your credentials:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stv
GROQ_API_KEY=your_groq_api_key_here
HF_API_KEY=your_huggingface_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### 3. Installation & Bootstrapping

Open two terminal windows to run the frontend and backend simultaneously.

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

The application will now be running at `http://localhost:5174` (or the port specified by Vite).

---

## ☁️ Deployment (Production)

ScriptVision is pre-configured for seamless cloud deployment.

### Deploying the Backend (Render / Heroku)
1. Push your code to GitHub.
2. Connect your repository to a service like **Render**.
3. Set your Build Command to `npm install` and Start Command to `node index.js`.
4. Ensure all environment variables (from your local `.env`) are injected into the Render dashboard.
*Note: Because image generation is handled via background queues, the backend is highly resilient against standard PaaS request timeouts (like Render's 60-second limit).*

### Deploying the Frontend (Vercel)
1. Import your repository into **Vercel**.
2. Vercel will automatically detect the Vite framework.
3. Add the following Environment Variable in the Vercel dashboard to point to your live backend:
   `VITE_API_URL=https://your-backend-url.onrender.com`
4. Deploy!

---

## 📖 The Magic of Cinema

Built for the storytellers. Whether drawing inspiration from the chaotic raw energy of *Fight Club*, the fierce intensity of *Aravinda Sametha*, the warmth of *Hi Nanna*, or the patriotic spirit of *Major*, this tool is designed to elevate the universal language of film.

<div align="center">
  <i>Crafted with ❤️ for filmmakers.</i>
</div>
