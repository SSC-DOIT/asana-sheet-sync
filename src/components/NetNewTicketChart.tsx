import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  ComposedChart,
} from "recharts";
import { NetNewTicketData } from "@/utils/enhancedAnalytics";

interface NetNewTicketChartProps {
  data: NetNewTicketData[];
}

export const NetNewTicketChart = ({ data }: NetNewTicketChartProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Net New Tickets</h3>
          <p className="text-sm text-muted-foreground">
            Daily tickets created vs closed, showing net change over time
          </p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
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
                value: "Tickets",
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
            <Bar
              dataKey="created"
              fill="hsl(var(--chart-1))"
              name="Created"
            />
            <Bar
              dataKey="closed"
              fill="hsl(var(--chart-2))"
              name="Closed"
            />
            <Line
              type="monotone"
              dataKey="netChange"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--destructive))" }}
              name="Net Change"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
