# 🎬 ScriptVision: AI-Powered Cinematic Pre-Production

ScriptVision is a professional-grade tool designed for Directors of Photography, Directors, Editors, and Script Supervisors. It transforms raw screenplays into highly detailed, shoot-ready cinematic breakdowns, complete with storyboard frames, shot divisions, and sound design philosophies.

By leveraging state-of-the-art AI models, ScriptVision analyzes the emotional DNA and psychological subtext of a script, translating text into actionable camera blocking, lens choices, and editorial pacing.

---

## 🌟 Core Features

- **Expert LLM Breakdown (Groq LPU)**: Utilizes `llama-3.3-70b-versatile` running at lightning speeds to parse scripts. The AI acts as a 30-year veteran of global cinema, avoiding cliché descriptions in favor of precise, motivated cinematic language.
- **Shot-by-Shot Division**: Decomposes scenes into specific shots, complete with camera movement, angle, lens distortion, duration, and psychological purpose.
- **Sound Design & Editing**: Generates detailed soundscapes (genre, tempo, instrumentation, reference tracks) and editorial rhythm (cut types, pacing notes, transitions) tailored to the scene's emotional weight.
- **AI Storyboarding**: Integrates seamlessly with Hugging Face's `FLUX.1-schnell` model to generate high-fidelity, cinematic storyboard frames based on the script's visual style.
- **Premium UI/UX**: A dark-mode, glassmorphism-inspired interface built with React, Vite, and Framer Motion, featuring dynamic loading overlays and cleanly tabbed data visualization.

---

## 🏗️ Architecture

ScriptVision uses a robust modern web stack:

*   **Frontend**: React (Vite), React Router, Framer Motion, Lucide React icons.
*   **Backend**: Node.js, Express.js, MongoDB (Mongoose) for persistence.
*   **AI Inference**: 
    *   **Groq API**: Handles deep script analysis (fast, high-token context).
    *   **Hugging Face API**: Handles image generation.
*   **Data Parsing**: `pdf-parse` for robust script document ingestion.

*(Note: Earlier iterations used a local Ollama integration, but the architecture has been migrated fully to cloud inference to support larger context windows and higher reasoning capabilities).*

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (running locally on `mongodb://localhost:27017/script-to-visual` or via Atlas)
- API Keys for Groq and Hugging Face.

### 2. Environment Variables
Create a `.env` file in the `/backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/script-to-visual
GROQ_API_KEY=your_groq_api_key_here
HF_API_KEY=your_huggingface_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### 3. Installation
**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 4. Usage
1. Open `http://localhost:5174` (or whatever port Vite provides).
2. Go to the **Analyze** page.
3. Paste a block of script text or upload a PDF.
4. Watch as the engine parses the scene and breaks down the cinematography, sound, and editing choices!

---

## 📖 The Magic of Cinema
Built for the storytellers. Whether drawing inspiration from the chaotic raw energy of *Fight Club*, the fierce intensity of *Aravinda Sametha*, the warmth of *Hi Nanna*, or the relentless grit of *12th Fail*, this tool is designed to elevate the universal language of film.

---
*Crafted with ❤️ for filmmakers.*
