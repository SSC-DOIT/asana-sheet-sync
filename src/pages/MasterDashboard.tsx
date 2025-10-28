import { useEffect, useState } from "react";
import { loadEnhancedData, EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
          loadEnhancedData("TIE"),
          loadEnhancedData("SFDC"),
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

  const getCriticalTickets = (tickets: EnhancedParsedTicket[]) => {
    return tickets
      .filter((t) => t.isOpen && t.ticketAge > 30)
      .sort((a, b) => b.ticketAge - a.ticketAge);
  };

  const getNewestTickets = (tickets: EnhancedParsedTicket[]) => {
    return tickets
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getAgeBadge = (age: number) => {
    if (age > 30) return <Badge variant="destructive">Critical ({age}d)</Badge>;
    if (age > 14) return <Badge className="bg-orange-500">High ({age}d)</Badge>;
    if (age > 7) return <Badge className="bg-yellow-500">Medium ({age}d)</Badge>;
    return <Badge variant="secondary">New ({age}d)</Badge>;
  };

  const getStatusBadge = (ticket: EnhancedParsedTicket) => {
    if (ticket.isOpen) {
      return <Badge variant="outline">Open</Badge>;
    }
    return <Badge variant="secondary">Closed</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-96" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const tieCritical = getCriticalTickets(tieTickets);
  const sfdcCritical = getCriticalTickets(sfdcTickets);
  const allNewest = getNewestTickets([...tieTickets, ...sfdcTickets]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Department Master Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of critical tickets and recent activity across all boards
          </p>
        </div>

        {/* Critical Tickets Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TIE Critical */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                TIE Critical Tickets ({tieCritical.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tieCritical.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No critical tickets
                </p>
              ) : (
                <div className="space-y-3">
                  {tieCritical.slice(0, 5).map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium text-foreground line-clamp-2">
                          {ticket.name}
                        </span>
                        {getAgeBadge(ticket.ticketAge)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        {ticket.assignee}
                      </div>
                      {ticket.automationStage && (
                        <Badge variant="secondary" className="text-xs">
                          {ticket.automationStage}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SFDC Critical */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                SFDC Critical Tickets ({sfdcCritical.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sfdcCritical.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No critical tickets
                </p>
              ) : (
                <div className="space-y-3">
                  {sfdcCritical.slice(0, 5).map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium text-foreground line-clamp-2">
                          {ticket.name}
                        </span>
                        {getAgeBadge(ticket.ticketAge)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        {ticket.assignee}
                      </div>
                      {ticket.automationStage && (
                        <Badge variant="secondary" className="text-xs">
                          {ticket.automationStage}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 5 Newest Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              5 Newest Tickets (All Boards)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Board</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Age</TableHead>
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
                        <div className="line-clamp-2">{ticket.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{board}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(ticket)}</TableCell>
                      <TableCell>{ticket.assignee}</TableCell>
                      <TableCell>{getAgeBadge(ticket.ticketAge)}</TableCell>
                      <TableCell className="text-muted-foreground">
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
