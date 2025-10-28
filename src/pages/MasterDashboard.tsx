import { useEffect, useState } from "react";
import { loadLiveData } from "@/utils/liveDataLoader";
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, User, ExternalLink, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  const getCriticalTickets = (tickets: EnhancedParsedTicket[]) => {
    return tickets
      .filter((t) => t.isOpen && (t.customFields?.Priority === "Highest" || t.customFields?.Priority === "Level 11"))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getNewestTickets = (tickets: EnhancedParsedTicket[]) => {
    return tickets
      .filter((t) => t.isOpen)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return <Badge variant="secondary">No Priority</Badge>;
    if (priority === "Level 11") return <Badge variant="destructive">Level 11</Badge>;
    if (priority === "Highest") return <Badge variant="destructive">Highest</Badge>;
    if (priority === "High") return <Badge className="bg-orange-500">High</Badge>;
    if (priority === "Medium") return <Badge className="bg-yellow-500">Medium</Badge>;
    if (priority === "Low") return <Badge variant="secondary">Low</Badge>;
    if (priority === "Lowest") return <Badge variant="outline">Lowest</Badge>;
    if (priority === "Current Sprint") return <Badge className="bg-blue-500">Current Sprint</Badge>;
    return <Badge variant="secondary">{priority}</Badge>;
  };

  const getAsanaUrl = (taskId: string, board: string) => {
    // You'll need to get the project GID from your config
    const projectGid = board === "TIE" ? "1210587239106056" : "1210698810765473";
    return `https://app.asana.com/0/${projectGid}/${taskId}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
            Technology Solutions Open Tickets
          </h1>
          <p className="text-muted-foreground">
            High priority tickets and recent activity across all boards
          </p>
        </div>

        {/* Critical Tickets Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TIE Critical */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                TIE High Priority Tickets ({tieCritical.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tieCritical.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No high priority tickets
                </p>
              ) : (
                <div className="space-y-4">
                  {tieCritical.slice(0, 5).map((ticket) => (
                    <a
                      key={ticket.id}
                      href={getAsanaUrl(ticket.id, "TIE")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 border rounded-lg hover:bg-accent/50 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-semibold text-foreground flex-1">
                          {ticket.name}
                        </h4>
                        <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-medium">Assignee:</span>
                          <div className="flex items-center gap-1">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="text-xs">
                                {getInitials(ticket.assignee)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{ticket.assignee}</span>
                          </div>
                        </div>
                        
                        {ticket.customFields?.Department && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium">Department:</span>
                            <Badge variant="outline" className="text-xs">
                              {ticket.customFields.Department}
                            </Badge>
                          </div>
                        )}
                        
                        {ticket.summary && (
                          <div className="pt-2 border-t">
                            <span className="text-muted-foreground font-medium">Summary:</span>
                            <p className="text-muted-foreground mt-1 line-clamp-3">
                              {ticket.summary}
                            </p>
                          </div>
                        )}
                      </div>
                    </a>
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
                SFDC High Priority Tickets ({sfdcCritical.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sfdcCritical.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No high priority tickets
                </p>
              ) : (
                <div className="space-y-4">
                  {sfdcCritical.slice(0, 5).map((ticket) => (
                    <a
                      key={ticket.id}
                      href={getAsanaUrl(ticket.id, "SFDC")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 border rounded-lg hover:bg-accent/50 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-semibold text-foreground flex-1">
                          {ticket.name}
                        </h4>
                        <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-medium">Assignee:</span>
                          <div className="flex items-center gap-1">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="text-xs">
                                {getInitials(ticket.assignee)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{ticket.assignee}</span>
                          </div>
                        </div>
                        
                        {ticket.customFields?.Department && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-medium">Department:</span>
                            <Badge variant="outline" className="text-xs">
                              {ticket.customFields.Department}
                            </Badge>
                          </div>
                        )}
                        
                        {ticket.summary && (
                          <div className="pt-2 border-t">
                            <span className="text-muted-foreground font-medium">Summary:</span>
                            <p className="text-muted-foreground mt-1 line-clamp-3">
                              {ticket.summary}
                            </p>
                          </div>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
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
