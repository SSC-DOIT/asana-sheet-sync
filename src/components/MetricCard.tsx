import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedMetric } from "./AnimatedMetric";

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  delay?: number;
  animated?: boolean;
}

export const MetricCard = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend = "neutral",
  delay = 0,
  animated = true,
}: MetricCardProps) => {
  const getTrendIcon = () => {
    if (trend === "up") return <ArrowUp className="w-4 h-4" />;
    if (trend === "down") return <ArrowDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-accent";
    if (trend === "down") return "text-destructive";
    return "text-muted-foreground";
  };

  const CardWrapper = animated ? motion.div : "div";
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
    whileHover: { scale: 1.02 },
  } : {};

  // Parse numeric value from string if needed
  const numericValue = typeof value === 'number' ? value : parseFloat(value.replace(/[^0-9.-]/g, ''));
  const isNumeric = !isNaN(numericValue) && value.toString().match(/\d/);

  return (
    <CardWrapper {...animationProps}>
      <Card className="p-6 border-border/50 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground tracking-tight">
              {animated && isNumeric ? (
                <AnimatedMetric value={numericValue} />
              ) : (
                value
              )}
            </p>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 text-sm font-medium", getTrendColor())}>
              {getTrendIcon()}
              <span>
                {Math.abs(change)}% {changeLabel || "vs previous period"}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <motion.div 
            className="p-3 rounded-lg bg-primary/10 text-primary"
            whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--primary) / 0.2)" }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
      </div>
    </Card>
    </CardWrapper>
  );
};
