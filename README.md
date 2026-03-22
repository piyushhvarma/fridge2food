<div align="center">
  <img src="public/favicon.png" alt="Fridge2Food Logo" width="120" />
  <h1>🍳 Fridge2Food</h1>
  <p><strong>Turn your fridge into a feast. Instant recipes from your leftovers with AI.</strong></p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://sdk.vercel.ai/docs"><img src="https://img.shields.io/badge/AI_SDK-Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel AI SDK" /></a>
  </p>
</div>

---

## 📖 What is Fridge2Food?

**Fridge2Food** is a smart, interactive AI culinary assistant built to answer the eternal question: *"What do I make with these random ingredients in my fridge?"* 

Simply input what you have on hand, and our AI Chef will instantly generate a structured, easy-to-follow, and authentic recipe. Featuring a highly interactive **2D physics-based playground** right in the background, your ingredients literally fall into place as you cook up ideas!

## ✨ Features

- 🎮 **Interactive Physics Playground**: A custom-built 2D physics engine using `matter-js` that rains pixel-art food ingredients. Grab them, throw them, and stack them with your mouse while you chat!
- 🤖 **AI-Powered Recipes**: Powered by the Vercel AI SDK and OpenAI (`gpt-4o-mini`), ensuring you get real, authentic dish suggestions (like *Paneer Tikka* or *Shakshuka*) rather than generic AI mush.
- 🎯 **Smart Prompt Modifiers**: Craving something specific? Toggle the **Healthy 💚**, **Quick 🧡**, or **Spicy ❤️** modifiers to instruct the AI instantly.
- 🛒 **Pantry Quick Select**: Tap common ingredients (Egg, Chicken, Paneer, Cheese, etc.) to rapidly build your input prompt without typing.
- ⚡ **Structured Recipe Streaming**: Recipes stream in real-time structured formats—beautifully displaying the dish name, exact ingredients used, step-by-step chef instructions, and pro tips.
- 📱 **Mobile Optimized**: A flawless, responsive UI that looks beautiful and stays out of your way on both massive desktop monitors and compact smartphones.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & CSS Transitions
- **Physics Engine**: [Matter.js](https://brm.io/matter-js/)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/docs) (`streamText`, structured tools)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v20+) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/piyushhvarma/fridge2food.git
cd fridge2food
```

### 2. Install dependencies
Because the Vercel AI SDK requires strict peer dependencies, you may need to use the `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory and add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The physics engine and AI chat will be ready to go!

## 🚢 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

**Important:** Provide your `OPENAI_API_KEY` in the Vercel Project Environment Variables settings before deployment. 

## 🎨 Design Philosophy

Fridge2Food leans into a hybrid **Nostalgic Pixel-Art x Modern Glassmorphism** aesthetic. The background is chaotic, playful, and tactile, while the actual chat interface utilizes aggressive background blur (`backdrop-blur-md`), precise drop-shadows, and curated typography (`Pixelify Sans` for the vibe, standard system fonts for readability) to remain entirely functional and highly readable.

---

*Bon Appétit!* 👨‍🍳
