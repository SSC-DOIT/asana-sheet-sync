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
import { filterByDepartment, getDepartmentStats } from "@/utils/departmentAnalytics";

interface DepartmentTicketsTableProps {
  tickets: EnhancedParsedTicket[];
  department: string;
}

export const DepartmentTicketsTable = ({ tickets, department }: DepartmentTicketsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const getAsanaUrl = (taskId: string) => {
    return `https://app.asana.com/0/${ASANA_PROJECTS.TIE}/${taskId}`;
  };

  const departmentTickets = useMemo(() => {
    return filterByDepartment(tickets, department)
      .filter((t) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          t.name.toLowerCase().includes(query) ||
          t.assignee.toLowerCase().includes(query) ||
          t.customFields?.Department?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => b.ticketAge - a.ticketAge);
  }, [tickets, department, searchQuery]);

  const stats = getDepartmentStats(tickets, department);

  const handleExport = () => {
    const filename = department === "All Departments" 
      ? "all-departments-tickets.csv"
      : `${department.toLowerCase().replace(/\s+/g, "-")}-tickets.csv`;
    exportTicketsToCSV(departmentTickets, filename);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {department} Open Tickets
            </h3>
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
                disabled={departmentTickets.length === 0}
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
                  Total Open: <span className="font-semibold text-foreground">{stats.totalOpen}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-muted-foreground">
                  Aged (14+ days): <span className="font-semibold text-foreground">{stats.aged}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-muted-foreground">
                  Critical (30+ days): <span className="font-semibold text-foreground">{stats.critical}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Avg Age: <span className="font-semibold text-foreground">{stats.averageAge.toFixed(1)}d</span>
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing all currently open tickets for {department} sorted by age (oldest first)
          </p>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Department</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departmentTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No open tickets found for {department}
                  </TableCell>
                </TableRow>
              ) : (
                departmentTickets.slice(0, 100).map((ticket) => {
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
                        {ticket.customFields?.Status ? (
                          <Badge variant="outline">{ticket.customFields.Status}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">No Status</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {ticket.assignee}
                      </TableCell>
                      <TableCell>
                        {ticket.customFields?.Department ? (
                          <Badge variant="outline">{ticket.customFields.Department}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Unassigned</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        {departmentTickets.length > 100 && (
          <p className="text-sm text-muted-foreground text-center">
            Showing 100 of {departmentTickets.length} open tickets
          </p>
        )}
      </div>
    </Card>
  );
};
