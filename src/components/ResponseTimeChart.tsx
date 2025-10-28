import { Card } from "@/components/ui/card";
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

interface ChartDataPoint {
  date: string;
  avgResponseTime: number;
}

interface ResponseTimeChartProps {
  data: ChartDataPoint[];
  rolloutDate: string;
}

export const ResponseTimeChart = ({ data, rolloutDate }: ResponseTimeChartProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Response Time Trend</h3>
          <p className="text-sm text-muted-foreground">
            Average response time over the last 90 days
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
            <ReferenceLine
              x={rolloutDate}
              stroke="hsl(var(--accent))"
              strokeDasharray="5 5"
              label={{
                value: "New Process Rollout",
                position: "top",
                fill: "hsl(var(--accent))",
              }}
            />
            <Line
              type="monotone"
              dataKey="avgResponseTime"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
