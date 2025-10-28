import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { useEffect } from 'react';

interface AnimatedMetricProps {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedMetric({ 
  value, 
  decimals = 0, 
  suffix = '', 
  prefix = '',
  duration = 2,
  className = ''
}: AnimatedMetricProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => 
    decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString()
  );

  useEffect(() => {
    const controls = animate(count, value, { duration, ease: [0.25, 0.46, 0.45, 0.94] });
    return controls.stop;
  }, [count, value, duration]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5,
        ease: "backOut",
        scale: { delay: 0.1 }
      }}
      whileHover={{ scale: 1.05 }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {prefix}
      </motion.span>
      <motion.span
        className="tabular-nums"
        whileHover={{ 
          textShadow: "0 0 8px hsl(var(--primary))",
          transition: { duration: 0.2 }
        }}
      >
        {rounded}
      </motion.span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {suffix}
      </motion.span>
    </motion.span>
  );
}
