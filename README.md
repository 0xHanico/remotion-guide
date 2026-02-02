# Claude Code + Remotion Guide

Create videos programmatically with React. This repo demonstrates how to use **Claude Code** in VS Code to build animated videos with **Remotion**.

## What's Inside

A **30-second showcase** demonstrating Remotion's full power:

| Section | Time | Features |
|---------|------|----------|
| 3D Intro | 0-6s | @remotion/three, React Three Fiber, floating 3D cubes, distort material |
| Noise Particles | 6-12s | @remotion/noise, 100 procedurally animated particles |
| Spring Physics | 12-18s | spring() with different damping/stiffness configs |
| Stats Cards | 18-24s | Animated counters, card animations, pulsing rings |
| Code Finale | 24-30s | Typewriter code, syntax highlighting, particle burst |

**Libraries Used:**
- `@remotion/three` - 3D graphics with React Three Fiber
- `@remotion/noise` - Procedural noise for organic animations
- `remotion-animated` - Declarative animation components
- `@react-three/drei` - 3D helpers (Float, MeshDistortMaterial)

All built with **pure React/TypeScript** - zero external video assets.

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/claude-code-remotion-guide.git
cd claude-code-remotion-guide

# Install dependencies
npm install

# Start Remotion Studio
npm start
```

Select **RemotionShowcase** and press Play to preview.

```bash
# Render to MP4
npm run render
```

---

## Prerequisites

- **Node.js** 18+
- **VS Code** with [Claude Code extension](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code)

---

## Project Structure

```
├── src/
│   ├── Root.tsx                    # Composition registry
│   ├── Showcase/
│   │   └── RemotionShowcase.tsx    # 760 lines of animation magic
│   └── HelloWorld/                 # Starter template
├── package.json
├── remotion.config.ts
└── README.md
```

---

## Animation Techniques Used

### 3D with @remotion/three
```tsx
<ThreeCanvas width={width} height={height}>
  <Float speed={2} rotationIntensity={0.5}>
    <mesh>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial color="#8b5cf6" distort={0.3} />
    </mesh>
  </Float>
</ThreeCanvas>
```

### Procedural Noise
```tsx
import { noise2D } from '@remotion/noise';

const x = noise2D('seed', frame * 0.01, 0) * 100;
const y = noise2D('seed', 0, frame * 0.01) * 100;
```

### Spring Physics
```tsx
const scale = spring({
  frame: localFrame,
  fps,
  config: { damping: 8, stiffness: 150 }
});
```

### Declarative Animations (remotion-animated)
```tsx
<Animated animations={[
  Move({ y: 50, start: 30, duration: 30 }),
  Scale({ by: 0, initial: 0.8, start: 30, duration: 30 }),
  Fade({ to: 1, start: 30, duration: 20 }),
]}>
  <div>Animated content</div>
</Animated>
```

---

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Open Remotion Studio |
| `npm run render` | Render to MP4 |
| `npm run render:gif` | Render to GIF |
| `npm run lint` | ESLint + TypeScript check |

---

## Learn More

- [Remotion Docs](https://www.remotion.dev/docs/)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [@remotion/three](https://www.remotion.dev/docs/three)
- [@remotion/noise](https://www.remotion.dev/docs/noise)
- [remotion-animated](https://github.com/stefanwittwer/remotion-animated)

---

## License

MIT

---

*Built with Claude Code + Remotion*
