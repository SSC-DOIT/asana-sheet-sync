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
} from "recharts";
import { OpenTicketTrendData } from "@/utils/enhancedAnalytics";

interface OpenTicketTrendChartProps {
  data: OpenTicketTrendData[];
}

const OpenTicketTrendChartComponent = ({ data }: OpenTicketTrendChartProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Open Tickets Over Time</h3>
          <p className="text-sm text-muted-foreground">
            Number of open tickets tracked daily over the last 90 days
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
                value: "Open Tickets",
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
            <Line
              type="monotone"
              dataKey="openCount"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
              name="Open Tickets"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const OpenTicketTrendChart = memo(OpenTicketTrendChartComponent);
