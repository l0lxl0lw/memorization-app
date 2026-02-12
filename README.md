# Memorization App

A word-blacking-out memorization tool. Add any text, then progressively black out words as you memorize them until you can recall the entire passage from memory.

**Try it:** [https://l0lxl0lw.github.io/memorization-app](https://l0lxl0lw.github.io/memorization-app)

## How It Works

1. Open a document (the app comes with starter texts, or add your own)
2. Read through the text a few times
3. Tap words you can recall to black them out
4. Keep reading and blacking out words until the entire passage is hidden
5. Once everything is blacked out, you've memorized it

## Features

- **Click-to-black-out** individual words as you memorize them
- **Progress tracking** shows percentage memorized per document
- **Works without an account** using browser local storage
- **Sign up** to sync your documents and progress across devices
- **Add your own text** to memorize anything — scripts, speeches, verses, frameworks
- **Section headers** (markdown `####`) are styled separately so you can organize long texts

## Getting Started

Visit [the app](https://l0lxl0lw.github.io/memorization-app) to start memorizing right away — no account needed.

To sync across devices, click **Sign Up** and create an account with your email.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

Next.js, React, TypeScript, Tailwind CSS, Supabase (auth & storage). Deployed to GitHub Pages via static export.
