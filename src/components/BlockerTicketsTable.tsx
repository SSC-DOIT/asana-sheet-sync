import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { ExternalLink, Search, X } from "lucide-react";
import { exportTicketsToCSV } from "@/utils/csvExport";
import { ASANA_PROJECTS } from "@/config/asanaProjects";

interface BlockerTicketsTableProps {
  tickets: (EnhancedParsedTicket & { board: "TIE" | "SFDC" })[];
  assignee: string;
  onClearSelection: () => void;
}

export const BlockerTicketsTable = ({
  tickets,
  assignee,
  onClearSelection,
}: BlockerTicketsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const getAsanaUrl = (taskId: string, board: "TIE" | "SFDC") => {
    const projectGid = board === "TIE" ? ASANA_PROJECTS.TIE : ASANA_PROJECTS.SFDC;
    return `https://app.asana.com/0/${projectGid}/${taskId}`;
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(
      (ticket) =>
        ticket.assignee === assignee &&
        (searchTerm === "" ||
          ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [tickets, assignee, searchTerm]);

  const handleExport = () => {
    exportTicketsToCSV(
      filteredTickets,
      `blocker-tickets-${assignee.replace(/\s+/g, "-").toLowerCase()}.csv`
    );
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return { variant: "outline" as const, label: "No Priority" };
    
    switch (priority) {
      case "Highest":
      case "Level 11":
        return { variant: "destructive" as const, label: priority };
      case "High":
        return { variant: "default" as const, label: priority };
      case "Medium":
        return { variant: "secondary" as const, label: priority };
      case "Low":
      case "Lowest":
        return { variant: "outline" as const, label: priority };
      case "Current Sprint":
        return { variant: "default" as const, label: priority };
      default:
        return { variant: "outline" as const, label: priority };
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
        {filteredTickets.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No tickets found
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTickets.map((ticket) => {
                const priorityBadge = getPriorityBadge(ticket.customFields?.Priority);
                return (
                  <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-2">
                        <a
                          href={getAsanaUrl(ticket.id, ticket.board)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-sm hover:underline flex items-start gap-2 text-foreground"
                        >
                          <span className="flex-1 line-clamp-2">{ticket.name}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5 text-muted-foreground" />
                        </a>
                      </div>
                      
                      <div className="space-y-1.5 text-xs">
                        {ticket.customFields?.Department && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Department:</span>
                            <Badge variant="outline" className="text-xs">
                              {ticket.customFields.Department}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Priority:</span>
                          <Badge variant={priorityBadge.variant} className="text-xs">
                            {priorityBadge.label}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Age:</span>
                          <span className="font-medium text-foreground">
                            {Math.round(ticket.ticketAge)} days
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Created:</span>
                          <span className="text-muted-foreground">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredTickets.length} {filteredTickets.length === 1 ? "ticket" : "tickets"}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
