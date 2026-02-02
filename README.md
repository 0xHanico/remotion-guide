# Claude Code + Remotion Setup Guide

Create videos programmatically with React. This guide shows you how to set up **Claude Code** in VS Code and build animated videos with **Remotion**.

---

## Step 1: Install Required Software

### 1.1 Install Node.js

Node.js is required to run JavaScript projects.

1. Go to https://nodejs.org
2. Download the **LTS** version (green button)
3. Run the installer and click **Next** through all steps
4. Restart your computer after installation

**Verify installation:** Open a terminal and run:
```bash
node --version
```
You should see something like `v20.x.x` or higher.

### 1.2 Install VS Code

VS Code is the code editor we'll use.

1. Go to https://code.visualstudio.com
2. Download for your operating system
3. Run the installer

### 1.3 Install Claude Code Extension

Claude Code is an AI assistant that helps you write code.

1. Open VS Code
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac) to open Extensions
3. Search for **"Claude Code"**
4. Click **Install** on the extension by Anthropic
5. After installation, press `Ctrl+Shift+P` and type **"Claude: Sign In"**
6. Follow the prompts to sign in with your Anthropic account

---

## Step 2: Set Up This Project

### 2.1 Clone the Repository

Open a terminal and run:
```bash
git clone https://github.com/0xHanico/remotion-guide.git
cd remotion-guide
```

### 2.2 Install Dependencies

```bash
npm install
```

This will download all required packages (may take 1-2 minutes).

### 2.3 Start Remotion Studio

```bash
npm start
```

Your browser will open automatically at `http://localhost:3000`.

### 2.4 Preview the Video

1. In Remotion Studio, select **RemotionShowcase** from the left sidebar
2. Press the **Play** button to preview the animation

### 2.5 Render to Video File

```bash
npm run render
```

This creates `out/showcase.mp4` in your project folder.

---

## Step 3: Using Claude Code to Create Videos

Once everything is set up, you can use Claude Code to help you create and modify videos.

### Open Claude Code

1. In VS Code, press `Ctrl+L` (Windows/Linux) or `Cmd+L` (Mac)
2. The Claude Code panel opens on the right

### Example Prompts

Try asking Claude Code:

- *"Add a new scene with bouncing text that says Hello World"*
- *"Change the background color to blue"*
- *"Make the animation faster"*
- *"Add a fade transition between scenes"*
- *"Create a countdown timer animation"*

Claude Code will modify the code files and you can preview changes instantly in Remotion Studio.

---

## Project Overview

### What's in This Demo

A **30-second showcase** demonstrating Remotion's capabilities:

| Section | Time | What It Shows |
|---------|------|---------------|
| 3D Intro | 0-6s | Floating 3D shapes with distortion effects |
| Noise Particles | 6-12s | 100 particles moving with organic motion |
| Spring Physics | 12-18s | Bouncy animations with physics |
| Stats Cards | 18-24s | Animated counters and card effects |
| Code Finale | 24-30s | Typewriter code animation |

### Project Structure

```
remotion-guide/
├── src/
│   ├── Root.tsx                    # Registers all video compositions
│   ├── Showcase/
│   │   └── RemotionShowcase.tsx    # Main showcase video
│   └── HelloWorld/                 # Starter template to experiment with
├── package.json                    # Project dependencies
├── remotion.config.ts              # Remotion settings
└── README.md                       # This file
```

---

## Available Commands

| Command | What It Does |
|---------|--------------|
| `npm start` | Opens Remotion Studio in your browser |
| `npm run render` | Exports video as MP4 to `out/showcase.mp4` |
| `npm run render:gif` | Exports video as GIF |
| `npm run lint` | Checks code for errors |

---

## Troubleshooting

### "node is not recognized"
Node.js isn't installed or your terminal needs to be restarted. Close and reopen your terminal, or restart your computer.

### "npm install" fails
Try deleting the `node_modules` folder and `package-lock.json`, then run `npm install` again:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Remotion Studio won't open
Make sure port 3000 isn't being used by another app. You can also try:
```bash
npm start -- --port 3001
```

### Claude Code extension not working
1. Make sure you're signed in (Ctrl+Shift+P > "Claude: Sign In")
2. Check you have an active Anthropic account with API access

---

## Learn More

- [Remotion Documentation](https://www.remotion.dev/docs/)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Remotion 3D Guide](https://www.remotion.dev/docs/three)
- [Remotion Noise Guide](https://www.remotion.dev/docs/noise)

---

## For AI Agents

If you're an AI agent setting up this project for a user, here's the quick setup:

```bash
# 1. Clone and enter directory
git clone https://github.com/0xHanico/remotion-guide.git
cd remotion-guide

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

Prerequisites to verify:
- Node.js 18+ installed (`node --version`)
- VS Code with Claude Code extension (optional but recommended)

The main video composition is in `src/Showcase/RemotionShowcase.tsx`. The `src/HelloWorld/` folder contains a simpler template for experimentation.

---

## License

MIT

---

*Built with Claude Code + Remotion*
