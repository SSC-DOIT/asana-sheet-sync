import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink, X } from "lucide-react";
import { ASANA_PROJECTS } from "@/config/asanaProjects";

interface StatusDistributionChartProps {
  tickets: EnhancedParsedTicket[];
  board: "TIE" | "SFDC";
}

// Theme-aware colors using CSS variables
const STATUS_COLORS: Record<string, string> = {
  "Assigned": "hsl(210, 100%, 50%)",           // Blue
  "In Progress": "hsl(142, 76%, 36%)",         // Green  
  "Blocked": "hsl(0, 84%, 60%)",               // Red
  "Waiting For Customer": "hsl(45, 93%, 47%)", // Orange/Yellow
  "Waiting on Customer": "hsl(45, 93%, 47%)",  // Orange/Yellow
  "Resolved": "hsl(271, 81%, 56%)",            // Purple
  "Internal Review": "hsl(280, 67%, 61%)",     // Light Purple
  "Closed": "hsl(160, 60%, 45%)",              // Teal
  "Unassigned": "hsl(var(--muted-foreground) / 0.3)",
};

export const StatusDistributionChart = ({ tickets, board }: StatusDistributionChartProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const getAsanaUrl = (taskId: string) => {
    const projectGid = board === "TIE" ? ASANA_PROJECTS.TIE : ASANA_PROJECTS.SFDC;
    return `https://app.asana.com/0/${projectGid}/${taskId}`;
  };

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
    return STATUS_COLORS[status] || "hsl(var(--muted-foreground) / 0.5)";
  };

  const handleStatusClick = (status: string) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  const filteredTickets = selectedStatus
    ? tickets.filter((t) => t.isOpen && (t.customFields?.Status || "Unassigned") === selectedStatus)
    : [];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{board} Board - Open Tickets by Status</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {totalTickets} open {totalTickets === 1 ? 'ticket' : 'tickets'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
            {/* Chart */}
            <div className="h-[380px] flex items-center justify-center px-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    onClick={(data) => handleStatusClick(data.name)}
                    cursor="pointer"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getColor(entry.name)}
                        opacity={selectedStatus === null || selectedStatus === entry.name ? 1 : 0.3}
                        className="transition-opacity duration-200"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        const percent = ((data.value as number / totalTickets) * 100).toFixed(1);
                        return (
                          <div className="bg-popover border border-border rounded-lg shadow-lg p-3 max-w-[200px]">
                            <p className="font-medium text-foreground text-sm">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {data.value} tickets ({percent}%)
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Click to view</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="space-y-2 min-w-0">
              {chartData.map((entry) => {
                const percent = ((entry.value / totalTickets) * 100).toFixed(0);
                const isSelected = selectedStatus === entry.name;
                const isOtherSelected = selectedStatus !== null && !isSelected;
                
                return (
                  <button
                    key={entry.name}
                    onClick={() => handleStatusClick(entry.name)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-accent/50 ${
                      isSelected ? 'bg-accent' : ''
                    } ${isOtherSelected ? 'opacity-40' : ''}`}
                  >
                    <div
                      className="w-4 h-4 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: getColor(entry.name) }}
                    />
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {entry.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-semibold text-foreground min-w-[2ch] text-right">
                        {entry.value}
                      </span>
                      <span className="text-xs text-muted-foreground min-w-[3.5rem] text-right">
                        ({percent}%)
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedStatus && filteredTickets.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedStatus} Tickets ({filteredTickets.length})
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedStatus(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <a
                        href={getAsanaUrl(ticket.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-sm hover:underline flex items-start gap-2 text-foreground group"
                      >
                        <span className="flex-1 line-clamp-2 min-w-0">{ticket.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </a>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground flex-shrink-0">Assignee:</span>
                        <span className="font-medium text-foreground truncate text-right">{ticket.assignee}</span>
                      </div>
                      
                      {ticket.customFields?.Department && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground flex-shrink-0">Department:</span>
                          <Badge variant="outline" className="text-xs truncate max-w-[60%]" title={ticket.customFields.Department}>
                            {ticket.customFields.Department}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground flex-shrink-0">Age:</span>
                        <span className="font-medium text-foreground">
                          {Math.round(ticket.ticketAge)} days
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground flex-shrink-0">Created:</span>
                        <span className="text-muted-foreground">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
