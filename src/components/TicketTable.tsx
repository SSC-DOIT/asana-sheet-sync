import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportTableToCSV } from "@/utils/csvExport";
import { Download, Search } from "lucide-react";

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

export const TicketTable = ({ tickets, title = "Recent Tickets" }: TicketTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTickets = useMemo(() => {
    if (!searchQuery) return tickets;
    const query = searchQuery.toLowerCase();
    return tickets.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.assignee.toLowerCase().includes(query)
    );
  }, [tickets, searchQuery]);

  const handleExport = () => {
    const exportData = filteredTickets.map((t) => ({
      ID: t.id,
      Name: t.name,
      "Created At": new Date(t.createdAt).toLocaleString(),
      Assignee: t.assignee,
      "Response Time (hours)": t.responseTime.toFixed(2),
    }));
    exportTableToCSV(
      exportData,
      ["ID", "Name", "Created At", "Assignee", "Response Time (hours)"],
      "recent-tickets.csv"
    );
  };
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              disabled={filteredTickets.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
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
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
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
