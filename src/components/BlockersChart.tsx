import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";

interface BlockersChartProps {
  tickets: (EnhancedParsedTicket & { board: "TIE" | "SFDC" })[];
  selectedAssignee: string | null;
  onAssigneeClick: (assignee: string) => void;
}

// Generate colors for the chart
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(262, 83%, 58%)", // Purple shades for additional assignees
  "hsl(252, 83%, 68%)",
  "hsl(242, 83%, 78%)",
  "hsl(232, 83%, 68%)",
  "hsl(222, 83%, 58%)",
];

export const BlockersChart = ({
  tickets,
  selectedAssignee,
  onAssigneeClick,
}: BlockersChartProps) => {
  // Group tickets by assignee
  const assigneeData = tickets.reduce((acc, ticket) => {
    const assignee = ticket.assignee || "Unassigned";
    if (!acc[assignee]) {
      acc[assignee] = 0;
    }
    acc[assignee]++;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array format for recharts
  const chartData = Object.entries(assigneeData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const totalTickets = tickets.length;

  const CustomLabel = ({ cx, cy }: { cx: number; cy: number }) => {
    return (
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-foreground"
      >
        <tspan x={cx} dy="-0.5em" fontSize="48" fontWeight="bold">
          {totalTickets}
        </tspan>
        <tspan x={cx} dy="1.5em" fontSize="14" className="fill-muted-foreground">
          Total Blockers
        </tspan>
      </text>
    );
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockers by Assignee</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[500px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={120}
                  outerRadius={180}
                  paddingAngle={2}
                  dataKey="value"
                  label={CustomLabel}
                  labelLine={false}
                  cursor="pointer"
                  onClick={(data) => onAssigneeClick(data.name)}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      opacity={
                        selectedAssignee === null || selectedAssignee === entry.name ? 1 : 0.3
                      }
                      className="transition-opacity duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
                          <p className="font-medium text-foreground">{payload[0].name}</p>
                          <p className="text-sm text-muted-foreground">
                            {payload[0].value} {payload[0].value === 1 ? "ticket" : "tickets"}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-1">
            <div className="flex flex-col gap-2">
              {chartData.map((entry, index) => (
                <button
                  key={`legend-${index}`}
                  onClick={() => onAssigneeClick(entry.name)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    selectedAssignee === entry.name
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium flex-1 text-left">{entry.name}</span>
                  <span className="text-sm font-semibold">{entry.value}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
