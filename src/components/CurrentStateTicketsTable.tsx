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
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { AlertCircle, Clock } from "lucide-react";

interface CurrentStateTicketsTableProps {
  tickets: EnhancedParsedTicket[];
}

export const CurrentStateTicketsTable = ({ tickets }: CurrentStateTicketsTableProps) => {
  // Filter only open tickets and sort by age (oldest first)
  const openTickets = tickets
    .filter((t) => t.isOpen)
    .sort((a, b) => b.ticketAge - a.ticketAge);

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
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-foreground">Current Open Tickets</h3>
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
                      <TableCell className="font-medium max-w-xs truncate">
                        {ticket.name}
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
