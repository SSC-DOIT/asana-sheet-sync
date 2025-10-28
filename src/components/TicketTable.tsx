import { Card } from "@/components/ui/card";
import { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Ticket {
  id: string;
  name: string;
  createdAt: string;
  responseTime: number;
  assignee: string;
}

interface TicketTableProps {
  tickets: Ticket[];
  title?: string;
}

const TicketTableComponent = ({ tickets, title = "Recent Tickets" }: TicketTableProps) => {
  const getResponseTimeBadge = (hours: number) => {
    if (hours < 2) return <Badge className="bg-accent">Fast</Badge>;
    if (hours < 8) return <Badge variant="secondary">Moderate</Badge>;
    return <Badge variant="destructive">Slow</Badge>;
  };

  const formatResponseTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${hours.toFixed(1)}h`;
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.name}</TableCell>
                    <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{ticket.assignee || "Unassigned"}</TableCell>
                    <TableCell>{formatResponseTime(ticket.responseTime)}</TableCell>
                    <TableCell>{getResponseTimeBadge(ticket.responseTime)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export const TicketTable = memo(TicketTableComponent);
