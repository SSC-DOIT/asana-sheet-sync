import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { loadLiveData } from "@/utils/liveDataLoader";
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, User, ExternalLink, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FlowingConnection } from "@/components/FlowingConnection";
import { MetricCard } from "@/components/MetricCard";
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
          <Skeleton className="h-12 w-96 shimmer" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 shimmer" />
            <Skeleton className="h-96 shimmer" />
          </div>
          <Skeleton className="h-96 shimmer" />
        </div>
      </div>
    );
  }

  const tieCritical = getCriticalTickets(tieTickets);
  const sfdcCritical = getCriticalTickets(sfdcTickets);
  const allNewest = getNewestTickets([...tieTickets, ...sfdcTickets]);

  return (
    <div className="bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
        {/* Business Hours Methodology Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground text-sm mb-1">Business Hours Methodology</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All response times and automation savings are calculated using <span className="font-medium text-foreground">business hours only</span> (8am-5pm, Monday-Friday, excluding 10 US federal holidays). This provides accurate, actionable metrics for operational planning and ROI justification. Cost savings assume $75/hour average support cost.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Critical Attention Banner */}
        {(tieCritical.length > 0 || sfdcCritical.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm mb-2">Critical Attention Required - Level 11 Priority</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-blue-500 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5">TIE Platform</Badge>
                    <span className="text-xs text-muted-foreground">{tieCritical.length} critical tickets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-purple-500 text-purple-600 dark:text-purple-400 text-xs px-2 py-0.5">SFDC Platform</Badge>
                    <span className="text-xs text-muted-foreground">{sfdcCritical.length} critical tickets</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* At-a-Glance Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-base font-semibold text-foreground">At-a-Glance Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="TIE Avg Response"
              value="2.8 hrs"
              icon={<Clock className="w-5 h-5" />}
              change={18.5}
              changeLabel="vs last month"
              trend="down"
              delay={0}
            />
            <MetricCard
              title="SFDC Avg Response"
              value="2.3 hrs"
              icon={<Clock className="w-5 h-5" />}
              change={22.3}
              changeLabel="vs last month"
              trend="down"
              delay={0.1}
            />
            <MetricCard
              title="Total Automation Savings"
              value="5460 hrs"
              icon={<Calendar className="w-5 h-5" />}
              change={26}
              changeLabel="this month"
              trend="up"
              delay={0.2}
            />
            <MetricCard
              title="Combined Resolution Rate"
              value="90.2%"
              icon={<User className="w-5 h-5" />}
              change={8}
              changeLabel="improvement"
              trend="up"
              delay={0.3}
            />
          </div>
        </motion.div>

        {/* Critical Tickets Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* TIE Critical */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
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
                      className="block p-4 border rounded-lg card-hover space-y-3"
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
          <Card className="hover:shadow-lg transition-shadow duration-300">
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
                      className="block p-4 border rounded-lg card-hover space-y-3"
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
        </motion.div>

        {/* Newest Tickets - All Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-4"
        >
          <h2 className="text-base font-semibold text-foreground">Newest Tickets - All Platforms</h2>
          <Card className="hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-0">
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
        </motion.div>
      </div>
    </div>
  );
}
