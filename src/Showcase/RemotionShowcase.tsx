import React, { useMemo, useRef } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
  Easing,
} from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { noise2D } from '@remotion/noise';

// ═══════════════════════════════════════════════════════════════════════════════
// REMOTION ULTIMATE SHOWCASE - PROFESSIONAL EDITION
// Fast-paced, dynamic, smooth, clean
// Duration: 20 seconds (600 frames @ 30fps)
// ═══════════════════════════════════════════════════════════════════════════════

export const SHOWCASE_DURATION = 600; // 20 seconds

const COLORS = {
  bg: '#0a0a0f',
  primary: '#6366f1',
  secondary: '#22d3ee',
  accent: '#f472b6',
  yellow: '#fbbf24',
  green: '#34d399',
  white: '#ffffff',
  gray: '#4b5563',
};

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL BACKGROUND - Always present, creates depth
// ═══════════════════════════════════════════════════════════════════════════════

const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const offset = frame * 0.5;

  return (
    <AbsoluteFill style={{ opacity: 0.15 }}>
      <div
        style={{
          width: '200%',
          height: '200%',
          backgroundImage: `
            linear-gradient(${COLORS.primary}20 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.primary}20 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: `translate(-25%, -25%) translateY(${offset % 60}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const FloatingOrbs: React.FC = () => {
  const frame = useCurrentFrame();

  const orbs = useMemo(() => [
    { x: 10, y: 20, size: 300, color: COLORS.primary, speed: 0.02 },
    { x: 85, y: 70, size: 400, color: COLORS.secondary, speed: 0.015 },
    { x: 50, y: 80, size: 250, color: COLORS.accent, speed: 0.025 },
    { x: 20, y: 60, size: 200, color: COLORS.yellow, speed: 0.018 },
  ], []);

  return (
    <AbsoluteFill style={{ filter: 'blur(100px)', opacity: 0.4 }}>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${orb.x + Math.sin(frame * orb.speed + i) * 5}%`,
            top: `${orb.y + Math.cos(frame * orb.speed + i) * 5}%`,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3D SCENE - Runs throughout with varying intensity
// ═══════════════════════════════════════════════════════════════════════════════

const Sphere3D: React.FC<{ frame: number }> = ({ frame }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const scale = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) });

  return (
    <Float speed={4} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={scale * 1.5} rotation={[frame * 0.01, frame * 0.015, 0]}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial
          color={COLORS.primary}
          roughness={0.1}
          metalness={0.9}
          distort={0.25 + Math.sin(frame * 0.03) * 0.1}
          speed={3}
        />
      </mesh>
    </Float>
  );
};

const OrbitingShapes: React.FC<{ frame: number }> = ({ frame }) => {
  const shapes = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * Math.PI * 2,
      distance: 2.5 + (i % 2) * 0.5,
      size: 0.15 + random(`shape-${i}`) * 0.1,
      speed: 0.02 + random(`speed-${i}`) * 0.01,
      color: [COLORS.secondary, COLORS.accent, COLORS.yellow, COLORS.green][i % 4],
    })), []);

  return (
    <>
      {shapes.map((shape, i) => {
        const angle = shape.angle + frame * shape.speed;
        const x = Math.cos(angle) * shape.distance;
        const z = Math.sin(angle) * shape.distance;
        const y = Math.sin(frame * 0.05 + i) * 0.3;

        const entryProgress = spring({ frame: frame - i * 5, fps: 30, config: { damping: 15 } });

        return (
          <mesh key={i} position={[x, y, z]} scale={entryProgress * shape.size}>
            <octahedronGeometry args={[1]} />
            <meshStandardMaterial color={shape.color} roughness={0.2} metalness={0.8} />
          </mesh>
        );
      })}
    </>
  );
};

const Scene3D: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ opacity }}>
      <ThreeCanvas
        width={1920}
        height={1080}
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color={COLORS.primary} />
        <pointLight position={[-10, -5, -10]} intensity={0.8} color={COLORS.secondary} />
        <Sphere3D frame={frame} />
        <OrbitingShapes frame={frame} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1: EXPLOSIVE INTRO (0-100 frames)
// ═══════════════════════════════════════════════════════════════════════════════

const ExplosiveTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame > 120) return null;

  const letters = 'REMOTION'.split('');

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', position: 'relative' }}>
        {letters.map((letter, i) => {
          const delay = i * 3;
          const progress = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 120 } });

          const y = interpolate(progress, [0, 1], [100, 0]);
          const opacity = interpolate(progress, [0, 0.5, 1], [0, 1, 1]);
          const scale = interpolate(progress, [0, 0.8, 1], [0.5, 1.1, 1]);
          const rotate = interpolate(progress, [0, 1], [(i - 4) * 10, 0]);

          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                fontSize: 160,
                fontWeight: 900,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: COLORS.white,
                transform: `translateY(${y}px) scale(${scale}) rotate(${rotate}deg)`,
                opacity,
                textShadow: `0 0 60px ${COLORS.primary}, 0 0 120px ${COLORS.primary}50`,
                marginRight: -8,
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>

      {/* Subtitle */}
      {frame > 35 && (
        <div
          style={{
            position: 'absolute',
            bottom: '32%',
            opacity: interpolate(frame, [35, 50], [0, 1], { extrapolateRight: 'clamp' }),
            transform: `translateY(${interpolate(frame, [35, 50], [20, 0], { extrapolateRight: 'clamp' })}px)`,
          }}
        >
          <span style={{
            fontSize: 28,
            fontWeight: 400,
            color: COLORS.secondary,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
          }}>
            Videos with Code
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2: RAPID FEATURE CARDS (100-220 frames)
// ═══════════════════════════════════════════════════════════════════════════════

const FeatureCard: React.FC<{
  icon: string;
  title: string;
  delay: number;
  x: number;
  y: number;
  color: string;
}> = ({ icon, title, delay, x, y, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - delay;

  if (localFrame < 0) return null;

  const progress = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 150 } });
  const exitProgress = frame > 200 ? interpolate(frame, [200, 220], [0, 1], { extrapolateRight: 'clamp' }) : 0;

  const scale = interpolate(progress, [0, 1], [0.5, 1]) * (1 - exitProgress * 0.3);
  const cardY = interpolate(progress, [0, 1], [50, 0]) + exitProgress * -100;
  const opacity = progress * (1 - exitProgress);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) translateY(${cardY}px) scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          border: `1px solid ${color}30`,
          borderRadius: 16,
          padding: '20px 32px',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 36 }}>{icon}</span>
        <span style={{
          fontSize: 22,
          fontWeight: 600,
          color: COLORS.white,
          fontFamily: 'system-ui, sans-serif',
        }}>
          {title}
        </span>
      </div>
    </div>
  );
};

const FeatureShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < 100 || frame > 220) return null;

  const features = [
    { icon: '⚛️', title: 'React Powered', x: 25, y: 30, color: COLORS.secondary, delay: 100 },
    { icon: '🎬', title: '60 FPS Rendering', x: 75, y: 30, color: COLORS.primary, delay: 108 },
    { icon: '📐', title: 'Spring Physics', x: 25, y: 55, color: COLORS.accent, delay: 116 },
    { icon: '🔊', title: 'Audio Support', x: 75, y: 55, color: COLORS.yellow, delay: 124 },
    { icon: '🎨', title: 'CSS & SVG', x: 25, y: 80, color: COLORS.green, delay: 132 },
    { icon: '📦', title: 'NPM Ecosystem', x: 75, y: 80, color: COLORS.primary, delay: 140 },
  ];

  const titleOpacity = interpolate(frame, [100, 115], [0, 1], { extrapolateRight: 'clamp' }) *
    (frame > 200 ? interpolate(frame, [200, 220], [1, 0], { extrapolateRight: 'clamp' }) : 1);

  return (
    <AbsoluteFill>
      {/* Section title */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          width: '100%',
          textAlign: 'center',
          opacity: titleOpacity,
        }}
      >
        <span style={{
          fontSize: 18,
          fontWeight: 500,
          color: COLORS.secondary,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
        }}>
          Everything you need
        </span>
      </div>

      {features.map((f, i) => (
        <FeatureCard key={i} {...f} />
      ))}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3: SPRING PHYSICS DEMO (220-340 frames)
// ═══════════════════════════════════════════════════════════════════════════════

const BouncingBall: React.FC<{
  x: number;
  color: string;
  delay: number;
  damping: number;
  stiffness: number;
}> = ({ x, color, delay, damping, stiffness }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sectionStart = 220;
  const localFrame = frame - sectionStart - delay;

  if (localFrame < 0 || frame > 340) return null;

  const bounce = spring({ frame: localFrame, fps, config: { damping, stiffness } });
  const y = interpolate(bounce, [0, 1], [-350, 0]);

  // Squash and stretch
  const velocity = localFrame < 2 ? 0 : (bounce - spring({ frame: localFrame - 1, fps, config: { damping, stiffness } }));
  const squash = 1 - Math.abs(velocity) * 8;
  const stretch = 1 + Math.abs(velocity) * 4;

  const exitOpacity = frame > 320 ? interpolate(frame, [320, 340], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        bottom: '20%',
        transform: `translateX(-50%) translateY(${y}px) scaleX(${stretch}) scaleY(${squash})`,
        opacity: exitOpacity,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, ${color}, ${color}80)`,
          boxShadow: `0 0 40px ${color}80, 0 ${-y * 0.1}px 30px rgba(0,0,0,0.3)`,
        }}
      />
    </div>
  );
};

const SpringDemo: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < 220 || frame > 340) return null;

  const titleOpacity = interpolate(frame, [220, 235], [0, 1], { extrapolateRight: 'clamp' }) *
    (frame > 320 ? interpolate(frame, [320, 340], [1, 0], { extrapolateRight: 'clamp' }) : 1);

  const balls = [
    { x: 20, color: COLORS.primary, delay: 0, damping: 5, stiffness: 80 },
    { x: 35, color: COLORS.secondary, delay: 5, damping: 10, stiffness: 120 },
    { x: 50, color: COLORS.accent, delay: 10, damping: 15, stiffness: 180 },
    { x: 65, color: COLORS.yellow, delay: 15, damping: 20, stiffness: 250 },
    { x: 80, color: COLORS.green, delay: 20, damping: 30, stiffness: 350 },
  ];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 80,
          width: '100%',
          textAlign: 'center',
          opacity: titleOpacity,
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800, color: COLORS.white }}>
          spring()
        </div>
        <div style={{ fontSize: 20, color: COLORS.gray, marginTop: 8 }}>
          Physics-based animations
        </div>
      </div>

      {balls.map((ball, i) => (
        <BouncingBall key={i} {...ball} />
      ))}

      {/* Ground line */}
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          right: '10%',
          height: 2,
          background: `linear-gradient(90deg, transparent, ${COLORS.primary}40, transparent)`,
          opacity: titleOpacity,
        }}
      />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4: NOISE VISUALIZATION (340-460 frames)
// ═══════════════════════════════════════════════════════════════════════════════

const NoiseWave: React.FC = () => {
  const frame = useCurrentFrame();
  const sectionStart = 340;
  const localFrame = frame - sectionStart;

  // Calculate values before any early returns (hooks rule)
  const isVisible = localFrame >= 0 && frame <= 460;
  const safeLocalFrame = Math.max(0, localFrame);
  const entryProgress = interpolate(safeLocalFrame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const exitProgress = frame > 440 ? interpolate(frame, [440, 460], [0, 1], { extrapolateRight: 'clamp' }) : 0;
  const opacity = entryProgress * (1 - exitProgress);

  const points = 80;
  // Generate path data inline (no useMemo needed since localFrame changes every frame)
  const pathData = (() => {
    const pts: string[] = [];
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * 1920;
      const noiseVal = noise2D('wave', i * 0.05, safeLocalFrame * 0.02);
      const y = 540 + noiseVal * 150 * entryProgress;
      pts.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    return pts.join(' ');
  })();

  if (!isVisible) return null;

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800, color: COLORS.white }}>
          @remotion/noise
        </div>
        <div style={{ fontSize: 20, color: COLORS.gray, marginTop: 8 }}>
          Procedural animations
        </div>
      </div>

      {/* Wave visualization */}
      <svg width="1920" height="1080" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.primary} />
            <stop offset="50%" stopColor={COLORS.secondary} />
            <stop offset="100%" stopColor={COLORS.accent} />
          </linearGradient>
        </defs>
        <path
          d={pathData}
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Glow effect */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="20"
          strokeLinecap="round"
          opacity="0.2"
          filter="blur(10px)"
        />
      </svg>

      {/* Floating particles following noise */}
      {Array.from({ length: 20 }).map((_, i) => {
        const px = (i / 20) * 100;
        const noiseVal = noise2D('particle', i * 0.1, localFrame * 0.015);
        const py = 50 + noiseVal * 15;
        const size = 4 + noise2D('size', i, localFrame * 0.01) * 4;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${px}%`,
              top: `${py}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: [COLORS.primary, COLORS.secondary, COLORS.accent][i % 3],
              boxShadow: `0 0 ${size * 2}px ${[COLORS.primary, COLORS.secondary, COLORS.accent][i % 3]}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5: CODE + FINALE (460-600 frames)
// ═══════════════════════════════════════════════════════════════════════════════

const TypedCode: React.FC = () => {
  const frame = useCurrentFrame();
  const sectionStart = 460;
  const localFrame = frame - sectionStart;

  if (localFrame < 0) return null;

  const code = `const MyVideo = () => {
  const frame = useCurrentFrame();
  const opacity = spring({ frame, fps: 30 });

  return (
    <AbsoluteFill style={{ opacity }}>
      <h1>Hello Remotion!</h1>
    </AbsoluteFill>
  );
};`;

  const charsToShow = Math.min(Math.floor(localFrame * 3), code.length);
  const displayCode = code.slice(0, charsToShow);

  const highlighted = displayCode
    .replace(/(const|return)/g, '<span style="color: #c678dd">$1</span>')
    .replace(/(useCurrentFrame|spring|AbsoluteFill)/g, '<span style="color: #61afef">$1</span>')
    .replace(/('.*?'|".*?")/g, '<span style="color: #98c379">$1</span>')
    .replace(/(\d+)/g, '<span style="color: #d19a66">$1</span>')
    .replace(/(frame|fps|opacity|style)/g, '<span style="color: #e5c07b">$1</span>');

  const codeOpacity = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const exitOpacity = frame > 560 ? interpolate(frame, [560, 580], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: '8%',
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: codeOpacity * exitOpacity,
      }}
    >
      <div
        style={{
          background: '#1a1a2e',
          borderRadius: 16,
          padding: 24,
          border: `1px solid ${COLORS.primary}30`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${COLORS.primary}10`,
          width: 600,
        }}
      >
        {/* Window controls */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27ca40' }} />
          <span style={{ marginLeft: 12, color: COLORS.gray, fontSize: 13 }}>MyVideo.tsx</span>
        </div>

        {/* Code content */}
        <pre
          style={{
            fontFamily: 'JetBrains Mono, Consolas, monospace',
            fontSize: 15,
            lineHeight: 1.6,
            color: '#abb2bf',
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
        {charsToShow < code.length && (
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 18,
              background: COLORS.primary,
              marginLeft: 2,
              animation: 'blink 1s infinite',
            }}
          />
        )}
      </div>
    </div>
  );
};

const FinaleLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sectionStart = 500;
  const localFrame = frame - sectionStart;

  if (localFrame < 0) return null;

  const progress = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 80 } });
  const exitOpacity = frame > 570 ? interpolate(frame, [570, 600], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  return (
    <div
      style={{
        position: 'absolute',
        right: '12%',
        top: '50%',
        transform: `translateY(-50%) scale(${progress})`,
        textAlign: 'center',
        opacity: exitOpacity,
      }}
    >
      {/* Glowing circle */}
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.primary}40, transparent)`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 24px',
          boxShadow: `0 0 60px ${COLORS.primary}60`,
        }}
      >
        <span style={{ fontSize: 72 }}>🎬</span>
      </div>

      <div style={{ fontSize: 52, fontWeight: 900, color: COLORS.white }}>
        REMOTION
      </div>
      <div style={{ fontSize: 18, color: COLORS.secondary, marginTop: 8 }}>
        remotion.dev
      </div>

      {/* Tech badges */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
        {['React', 'TypeScript', 'FFmpeg'].map((tech, i) => (
          <div
            key={i}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              background: `${[COLORS.secondary, COLORS.primary, COLORS.green][i]}15`,
              border: `1px solid ${[COLORS.secondary, COLORS.primary, COLORS.green][i]}30`,
              color: [COLORS.secondary, COLORS.primary, COLORS.green][i],
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
};

const Finale: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < 460) return null;

  return (
    <AbsoluteFill>
      <TypedCode />
      <FinaleLogo />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSITIONS - Smooth section changes
// ═══════════════════════════════════════════════════════════════════════════════

const FlashTransition: React.FC<{ triggerFrame: number }> = ({ triggerFrame }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - triggerFrame;

  if (localFrame < -5 || localFrame > 15) return null;

  const opacity = localFrame < 0
    ? interpolate(localFrame, [-5, 0], [0, 0.8], { extrapolateRight: 'clamp' })
    : interpolate(localFrame, [0, 15], [0.8, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.white,
        opacity,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════════════════════════════════════════

export const RemotionShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  // 3D scene fades based on section
  const scene3DOpacity = frame < 100 ? 1 :
    frame < 220 ? interpolate(frame, [100, 120], [1, 0.3], { extrapolateRight: 'clamp' }) :
    frame < 340 ? 0.2 :
    frame < 460 ? interpolate(frame, [340, 360], [0.2, 0.1], { extrapolateRight: 'clamp' }) :
    interpolate(frame, [460, 480], [0.1, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Background layers */}
      <GridBackground />
      <FloatingOrbs />

      {/* 3D Scene - always present but fading */}
      <Scene3D opacity={scene3DOpacity} />

      {/* Content sections */}
      <ExplosiveTitle />
      <FeatureShowcase />
      <SpringDemo />
      <NoiseWave />
      <Finale />

      {/* Transitions */}
      <FlashTransition triggerFrame={100} />
      <FlashTransition triggerFrame={220} />
      <FlashTransition triggerFrame={340} />
      <FlashTransition triggerFrame={460} />

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle scanlines */}
      <AbsoluteFill
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
