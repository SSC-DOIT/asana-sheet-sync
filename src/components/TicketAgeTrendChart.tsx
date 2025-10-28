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
  Legend,
} from "recharts";
import { TicketAgeData } from "@/utils/enhancedAnalytics";

interface TicketAgeTrendChartProps {
  data: TicketAgeData[];
}

const TicketAgeTrendChartComponent = ({ data }: TicketAgeTrendChartProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Ticket Age Trends</h3>
          <p className="text-sm text-muted-foreground">
            Average age of tickets over time (open vs closed)
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
                value: "Days",
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
            <Legend />
            <Line
              type="monotone"
              dataKey="openAvg"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--destructive))" }}
              name="Open Tickets"
            />
            <Line
              type="monotone"
              dataKey="closedAvg"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--accent))" }}
              name="Closed Tickets"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export const TicketAgeTrendChart = memo(TicketAgeTrendChartComponent);
