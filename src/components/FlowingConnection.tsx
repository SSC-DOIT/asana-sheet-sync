import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  progress: number;
  delay: number;
}

export function FlowingConnection() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: i,
        progress: 0,
        delay: i * 0.3,
      });
    }
    setParticles(newParticles);
  }, []);

  // SVG path for the flowing connection
  const path = "M 50 200 Q 250 50, 450 200 T 850 200";

  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      <svg
        viewBox="0 0 900 400"
        className="w-full h-full"
        style={{ maxWidth: '900px' }}
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main path */}
        <motion.path
          d={path}
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Glowing path */}
        <motion.path
          d={path}
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="1"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Animated particles */}
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            r="4"
            fill="hsl(var(--primary))"
            filter="url(#glow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              offsetPath: `path('${path}')`,
            }}
          />
        ))}

        {/* Start icon (Asana-like) */}
        <g transform="translate(30, 180)">
          <motion.circle
            cx="20"
            cy="20"
            r="25"
            fill="hsl(var(--primary))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          />
          <motion.circle
            cx="20"
            cy="20"
            r="30"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16">A</text>
        </g>

        {/* End icon (Sheets-like) */}
        <g transform="translate(830, 180)">
          <motion.rect
            x="0"
            y="0"
            width="40"
            height="40"
            rx="4"
            fill="hsl(var(--accent))"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          />
          <motion.rect
            x="-5"
            y="-5"
            width="50"
            height="50"
            rx="6"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.3, opacity: [0, 1, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5,
            }}
          />
          <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16">S</text>
        </g>
      </svg>
    </div>
  );
}
