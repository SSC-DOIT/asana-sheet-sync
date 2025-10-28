import { useEffect, useState } from "react";
import { MetricCard } from "./MetricCard";
import { ResponseTimeChart } from "./ResponseTimeChart";
import { TicketTable } from "./TicketTable";
import { TicketAgeTrendChart } from "./TicketAgeTrendChart";
import { FirstResponseTrendChart } from "./FirstResponseTrendChart";
import { AutomationSavingsCard } from "./AutomationSavingsCard";
import { loadEnhancedData, EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { analyzeResponseTimes } from "@/utils/asanaJsonParser";
import {
  analyzeTicketAgeTrends,
  analyzeFirstResponseTrends,
  analyzeAutomationSavings,
} from "@/utils/enhancedAnalytics";
import { Clock, TrendingDown, Ticket, BarChart3 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface BoardDashboardProps {
  board: "TIE" | "SFDC";
  boardName: string;
}

export const BoardDashboard = ({ board, boardName }: BoardDashboardProps) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [enhancedData, setEnhancedData] = useState<{
    ageTrends: any[];
    responseTrends: any[];
    automationSavings: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const tickets = await loadEnhancedData(board);
        const rolloutDate = new Date("2025-10-21");
        const analyzed = analyzeResponseTimes(tickets, rolloutDate);
        
        // Enhanced analytics
        const ageTrends = analyzeTicketAgeTrends(tickets);
        const responseTrends = analyzeFirstResponseTrends(tickets);
        
        // Extract automation stages
        const automationStages: { [key: string]: string } = {};
        tickets.forEach((ticket: EnhancedParsedTicket) => {
          if (ticket.automationStage) {
            automationStages[ticket.id] = ticket.automationStage;
          }
        });
        const automationSavings = analyzeAutomationSavings(automationStages);
        
        setAnalytics(analyzed);
        setEnhancedData({ ageTrends, responseTrends, automationSavings });
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [board]);

  const formatHours = (hours: number): string => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours.toFixed(1)}h`;
    return `${(hours / 24).toFixed(1)}d`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {boardName} Board Analytics
          </h1>
          <p className="text-muted-foreground">
            Analyzing response times for new ticketing process rollout
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Recent Avg Response (2d)"
            value={formatHours(analytics.recentAvg)}
            icon={<Clock className="w-5 h-5" />}
            change={analytics.improvement}
            changeLabel="improvement"
            trend={analytics.improvement > 0 ? "up" : analytics.improvement < 0 ? "down" : "neutral"}
          />
          <MetricCard
            title="Previous Avg (90d)"
            value={formatHours(analytics.previousAvg)}
            icon={<BarChart3 className="w-5 h-5" />}
          />
          <MetricCard
            title="Time Saved"
            value={formatHours(analytics.previousAvg - analytics.recentAvg)}
            icon={<TrendingDown className="w-5 h-5" />}
            trend="up"
          />
          <MetricCard
            title="Recent Tickets"
            value={analytics.recentCount.toString()}
            icon={<Ticket className="w-5 h-5" />}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Long-Term Trends</TabsTrigger>
            <TabsTrigger value="automation">Automation Savings</TabsTrigger>
            <TabsTrigger value="tickets">Recent Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ResponseTimeChart
              data={analytics.chartData}
              rolloutDate="Oct 21"
            />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {enhancedData && (
              <>
                <TicketAgeTrendChart data={enhancedData.ageTrends} />
                <FirstResponseTrendChart
                  data={enhancedData.responseTrends}
                  rolloutDate="Oct 21"
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            {enhancedData && (
              <AutomationSavingsCard data={enhancedData.automationSavings} />
            )}
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <TicketTable
              tickets={analytics.recentTickets}
              title="Recent Tickets (Last 2 Days)"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
