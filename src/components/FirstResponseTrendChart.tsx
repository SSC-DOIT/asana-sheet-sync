import { Card } from "@/components/ui/card";
import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { FirstResponseTrendData } from "@/utils/enhancedAnalytics";

interface FirstResponseTrendChartProps {
  data: FirstResponseTrendData[];
  rolloutDate?: string;
}

const FirstResponseTrendChartComponent = ({ data, rolloutDate }: FirstResponseTrendChartProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">First Response Time Trend</h3>
          <p className="text-sm text-muted-foreground">
            Weekly average first response time to tickets
          </p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              label={{
                value: "Hours",
                angle: -90,
                position: "insideLeft",
                style: { fill: "hsl(var(--muted-foreground))" },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            {rolloutDate && (
              <ReferenceLine
                x={rolloutDate}
                stroke="hsl(var(--accent))"
                strokeDasharray="5 5"
                label={{
                  value: "Automation Rollout",
                  position: "top",
                  fill: "hsl(var(--accent))",
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="avgResponseHours"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
              name="Avg Response Time"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const FirstResponseTrendChart = memo(FirstResponseTrendChartComponent);
