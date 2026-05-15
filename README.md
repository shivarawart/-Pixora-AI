
# 🚀 Pixora AI Studio

A **modern full-stack AI Image Generation platform** powered by Bria AI API that transforms text prompts into high-quality, cinematic AI-generated images with a premium UI experience.

---

## ✨ Overview

**Pixora AI Studio** is a full-stack web application that allows users to generate stunning AI images from simple text prompts. It includes prompt enhancement, multiple image generation, structured prompt support, and real-time download & preview features.

Built with a focus on:

* ⚡ Performance
* 🎨 Premium UI/UX
* 🧠 Smart prompt engineering
* 🔥 Production-ready backend architecture

---

## 🌟 Features

### 🎨 AI Image Generation

* Generate high-quality images from text prompts
* Supports multiple styles (realistic, anime, cinematic, cyberpunk, fantasy)
* Aspect ratio control (1:1, 16:9, 9:16, etc.)

### 🧠 Smart Prompt Engine

* Auto prompt enhancement system
* Structured prompt generation using AI backend
* Optimized prompts for better image quality

### 🖼️ Multi Image Generation

* Generate 1–4 images at once
* Compare multiple outputs easily

### 📥 Download & Preview

* One-click image download
* Fullscreen image preview modal
* High-quality output saving

### ⚡ Modern UI/UX

* Glassmorphism design
* Responsive layout for all devices
* Smooth animations and transitions
* Clean, premium SaaS-like interface

### 🔐 Backend Powered

* Secure Express.js backend
* API integration with Bria AI
* Rate-limit ready architecture
* Environment variable protection

---

## 🏗️ Tech Stack

### Frontend

* HTML5
* CSS3 (Custom modern UI)
* Vanilla JavaScript (ES6+)

### Backend

* Node.js
* Express.js
* CORS, Helmet, Compression

### AI Engine

* Bria AI API

---

## 📁 Project Structure

```bash
Pixora-AI/
│
├── server.js              # Main backend server
├── package.json
├── .env                  # API keys (not pushed to GitHub)
│
├── public/               # Frontend
│   ├── index.html
│   ├── app.js
│   ├── style.css
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/pixora-ai.git
cd pixora-ai
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Environment Variables

Create `.env` file:

```env
BRIA_API_KEY=your_bria_api_key_here
PORT=3000
```

---

### 4. Run Project Locally

```bash
node server.js
```

Open:

```
http://localhost:3000
```

---

## 🚀 API Endpoints

### 🎨 Generate Image

```http
POST /api/images/generate
```

**Body:**

```json
{
  "prompt": "a futuristic cyberpunk city",
  "aspect_ratio": "1:1",
  "output_type": "png"
}
```

---

### 🧠 Enhance Prompt

```http
POST /api/prompts/enhance
```

---

### 📊 Structured Prompt

```http
POST /api/prompts/structured
```

---

### 🔁 Structured Diff

```http
POST /api/prompts/structured/diff
```

---

## 📸 How It Works

1. User enters a prompt
2. Frontend sends request to backend
3. Backend enhances prompt (optional)
4. Bria AI generates image
5. Image returned to frontend
6. User can preview or download instantly

---

## 🌍 Deployment

### Recommended Hosting

#### 🚀 Backend

* Render.com (Best for Express apps)

#### ⚡ Frontend (Optional Split)

* Vercel / Netlify

---

## ❗ Important Notes

* Keep `.env` file private (never push API keys)
* Bria API key is required for image generation
* Ensure CORS is enabled in production

---

## 🧠 Why This Project is Different

Unlike basic AI wrappers, Pixora AI Studio is designed as:

* A **real SaaS-style AI product**
* With **structured prompt engineering**
* Multi-image generation system
* Production-grade backend architecture
* Modern UX inspired by AI tools like Midjourney & Leonardo AI

---

## 🔥 Future Improvements

* User authentication system
* Image history gallery
* Cloud storage (S3 / Cloudinary)
* Payment system (Stripe)
* Prompt marketplace
* AI image upscaling

---

## 👨‍💻 Author

Built with ❤️ by **Shiva**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share it with developers!




