import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Line {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  duration: number;
}

export function AnimatedBackground() {
  const [lines, setLines] = useState<Line[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0) return;

    const generateLines = () => {
      const newLines: Line[] = [];
      for (let i = 0; i < 30; i++) {
        newLines.push({
          id: i,
          x1: Math.random() * dimensions.width,
          y1: Math.random() * dimensions.height,
          x2: Math.random() * dimensions.width,
          y2: Math.random() * dimensions.height,
          duration: 3 + Math.random() * 4,
        });
      }
      setLines(newLines);
    };

    generateLines();
  }, [dimensions]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {lines.map((line) => (
          <motion.line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: line.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </svg>

      {/* Grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }} />
    </div>
  );
}
