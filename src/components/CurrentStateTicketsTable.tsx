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
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { exportTicketsToCSV } from "@/utils/csvExport";
import { AlertCircle, Clock, Download, Search, ExternalLink } from "lucide-react";
import { ASANA_PROJECTS } from "@/config/asanaProjects";

interface CurrentStateTicketsTableProps {
  tickets: EnhancedParsedTicket[];
  board: "TIE" | "SFDC";
}

export const CurrentStateTicketsTable = ({ tickets, board }: CurrentStateTicketsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const getAsanaUrl = (taskId: string) => {
    const projectGid = board === "TIE" ? ASANA_PROJECTS.TIE : ASANA_PROJECTS.SFDC;
    return `https://app.asana.com/0/${projectGid}/${taskId}`;
  };

  // Filter and sort tickets
  const openTickets = useMemo(() => {
    return tickets
      .filter((t) => t.isOpen)
      .filter((t) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(query) ||
          t.assignee.toLowerCase().includes(query) ||
          t.automationStage?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => b.ticketAge - a.ticketAge);
  }, [tickets, searchQuery]);

  const handleExport = () => {
    exportTicketsToCSV(openTickets, "open-tickets.csv");
  };

  const getAgeBadge = (age: number) => {
    if (age > 30) return { variant: "destructive" as const, label: `${Math.round(age)}d - Critical` };
    if (age > 14) return { variant: "default" as const, label: `${Math.round(age)}d - High` };
    if (age > 7) return { variant: "secondary" as const, label: `${Math.round(age)}d - Medium` };
    return { variant: "outline" as const, label: `${Math.round(age)}d - New` };
  };

  const totalOldTickets = openTickets.filter((t) => t.ticketAge > 14).length;
  const criticalTickets = openTickets.filter((t) => t.ticketAge > 30).length;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Current Open Tickets</h3>
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
                disabled={openTickets.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Total Open: <span className="font-semibold text-foreground">{openTickets.length}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-muted-foreground">
                  Aged (14+ days): <span className="font-semibold text-foreground">{totalOldTickets}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-muted-foreground">
                  Critical (30+ days): <span className="font-semibold text-foreground">{criticalTickets}</span>
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing all currently open tickets sorted by age (oldest first)
          </p>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Automation Stage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No open tickets
                  </TableCell>
                </TableRow>
              ) : (
                openTickets.slice(0, 100).map((ticket) => {
                  const ageBadge = getAgeBadge(ticket.ticketAge);
                  return (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium max-w-xs">
                        <a
                          href={getAsanaUrl(ticket.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:underline text-foreground"
                        >
                          <span className="truncate">{ticket.name}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ageBadge.variant}>{ageBadge.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ticket.assignee}
                      </TableCell>
                      <TableCell>
                        {ticket.automationStage ? (
                          <Badge variant="outline">{ticket.automationStage}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Manual</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        {openTickets.length > 100 && (
          <p className="text-sm text-muted-foreground text-center">
            Showing 100 of {openTickets.length} open tickets
          </p>
        )}
      </div>
    </Card>
  );
};
