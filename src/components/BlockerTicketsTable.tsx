import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { ArrowUpDown, ExternalLink, Search, X } from "lucide-react";
import { exportTicketsToCSV } from "@/utils/csvExport";
import { ASANA_PROJECTS } from "@/config/asanaProjects";

interface BlockerTicketsTableProps {
  tickets: (EnhancedParsedTicket & { board: "TIE" | "SFDC" })[];
  assignee: string;
  onClearSelection: () => void;
}

type SortField = "name" | "ticketAge" | "createdAt" | "department";
type SortDirection = "asc" | "desc";

export const BlockerTicketsTable = ({
  tickets,
  assignee,
  onClearSelection,
}: BlockerTicketsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("ticketAge");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredTickets = useMemo(() => {
    return tickets.filter(
      (ticket) =>
        ticket.assignee === assignee &&
        (searchTerm === "" ||
          ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [tickets, assignee, searchTerm]);

  const sortedTickets = useMemo(() => {
    return [...filteredTickets].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === "department") {
        aVal = a.customFields?.Department || "";
        bVal = b.customFields?.Department || "";
      }

      if (typeof aVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [filteredTickets, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getAsanaUrl = (taskId: string, board: "TIE" | "SFDC") => {
    const projectGid = board === "TIE" ? ASANA_PROJECTS.TIE : ASANA_PROJECTS.SFDC;
    return `https://app.asana.com/0/${projectGid}/${taskId}`;
  };

  const handleExport = () => {
    exportTicketsToCSV(
      sortedTickets,
      `blocker-tickets-${assignee.replace(/\s+/g, "-").toLowerCase()}.csv`
    );
  };

  const getAgeBadge = (age: number) => {
    if (age > 30) {
      return <Badge variant="destructive">Critical ({age}d)</Badge>;
    } else if (age > 14) {
      return <Badge variant="default">Aged ({age}d)</Badge>;
    } else {
      return <Badge variant="secondary">{age}d</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CardTitle>Tickets for {assignee}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearSelection}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full sm:w-[250px]"
              />
            </div>
            <Button onClick={handleExport} variant="outline">
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Ticket Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("department")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Department
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("ticketAge")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Age
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("createdAt")}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    Created Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                sortedTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium max-w-md">
                      <div className="truncate">{ticket.name}</div>
                    </TableCell>
                    <TableCell>
                      {ticket.customFields?.Department || "N/A"}
                    </TableCell>
                    <TableCell>{getAgeBadge(ticket.ticketAge)}</TableCell>
                    <TableCell>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-8 w-8 p-0"
                      >
                        <a
                          href={getAsanaUrl(ticket.id, ticket.board)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {sortedTickets.length} {sortedTickets.length === 1 ? "ticket" : "tickets"}
        </div>
      </CardContent>
    </Card>
  );
};
