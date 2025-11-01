import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";

interface StatusDistributionChartProps {
  tickets: EnhancedParsedTicket[];
}

// Colors for different statuses
const STATUS_COLORS: Record<string, string> = {
  "Assigned": "hsl(var(--chart-1))",
  "In Progress": "hsl(var(--chart-2))",
  "Blocked": "hsl(var(--chart-3))",
  "Waiting For Customer": "hsl(var(--chart-4))",
  "Waiting on Customer": "hsl(var(--chart-4))",
  "Resolved": "hsl(var(--chart-5))",
};

export const StatusDistributionChart = ({ tickets }: StatusDistributionChartProps) => {
  // Group open tickets by status
  const statusData = tickets
    .filter((t) => t.isOpen)
    .reduce((acc, ticket) => {
      const status = ticket.customFields?.Status || "Unassigned";
      if (!acc[status]) {
        acc[status] = 0;
      }
      acc[status]++;
      return acc;
    }, {} as Record<string, number>);

  // Convert to array format for recharts
  const chartData = Object.entries(statusData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const totalTickets = tickets.filter((t) => t.isOpen).length;

  const getColor = (status: string) => {
    return STATUS_COLORS[status] || "hsl(var(--muted))";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Open Tickets by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColor(entry.name)}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    const percent = ((data.value as number / totalTickets) * 100).toFixed(1);
                    return (
                      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                        <p className="font-medium text-foreground">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.value} tickets ({percent}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry: any) => `${value} (${entry.payload.value})`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
