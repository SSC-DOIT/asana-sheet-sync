import { useEffect, useState } from "react";
import { loadLiveData } from "@/utils/liveDataLoader";
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusDistributionChart } from "@/components/StatusDistributionChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MasterDashboard() {
  const [tieTickets, setTieTickets] = useState<EnhancedParsedTicket[]>([]);
  const [sfdcTickets, setSfdcTickets] = useState<EnhancedParsedTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [tie, sfdc] = await Promise.all([
          loadLiveData("TIE"),
          loadLiveData("SFDC"),
        ]);
        setTieTickets(tie);
        setSfdcTickets(sfdc);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getNewestTickets = (tickets: EnhancedParsedTicket[]) => {
    // Deduplicate by ticket ID
    const uniqueTickets = Array.from(
      new Map(tickets.map(t => [t.id, t])).values()
    );
    
    return uniqueTickets
      .filter((t) => t.isOpen)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  };

  const getAsanaUrl = (taskId: string, board: string) => {
    // You'll need to get the project GID from your config
    const projectGid = board === "TIE" ? "1210587239106056" : "1210698810765473";
    return `https://app.asana.com/0/${projectGid}/${taskId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <Clock className="w-8 h-8 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-foreground">Loading Master Dashboard</p>
              <p className="text-sm text-muted-foreground">Fetching tickets from TIE and SFDC boards...</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const allNewest = getNewestTickets([...tieTickets, ...sfdcTickets]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Technology Solutions Open Tickets
          </h1>
          <p className="text-muted-foreground">
            Open tickets by status and recent activity across all boards
          </p>
        </div>

        {/* Open Tickets by Status - Doughnut Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusDistributionChart tickets={tieTickets} board="TIE" />
          <StatusDistributionChart tickets={sfdcTickets} board="SFDC" />
        </div>

        {/* 10 Newest Open Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              10 Newest Open Tickets (All Boards)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Board</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allNewest.map((ticket) => {
                  const board = tieTickets.some((t) => t.id === ticket.id)
                    ? "TIE"
                    : "SFDC";
                  return (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium max-w-md">
                        <a
                          href={getAsanaUrl(ticket.id, board)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:underline"
                        >
                          <div className="line-clamp-2">{ticket.name}</div>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{board}</Badge>
                      </TableCell>
                      <TableCell>
                        {ticket.customFields?.Department ? (
                          <Badge variant="secondary">{ticket.customFields.Department}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{ticket.assignee}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
