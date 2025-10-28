import { useEffect, useState } from "react";
import { MetricCard } from "./MetricCard";
import { ResponseTimeChart } from "./ResponseTimeChart";
import { TicketTable } from "./TicketTable";
import { TicketAgeTrendChart } from "./TicketAgeTrendChart";
import { FirstResponseTrendChart } from "./FirstResponseTrendChart";
import { AutomationSavingsCard } from "./AutomationSavingsCard";
import { OpenTicketTrendChart } from "./OpenTicketTrendChart";
import { CurrentStateTicketsTable } from "./CurrentStateTicketsTable";
import { loadLiveData } from "@/utils/liveDataLoader";
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { analyzeResponseTimes } from "@/utils/asanaJsonParser";
import {
  analyzeTicketAgeTrends,
  analyzeFirstResponseTrends,
  analyzeAutomationSavings,
  analyzeOpenTicketTrends,
  getLastThursday,
  getJulyFirst,
} from "@/utils/enhancedAnalytics";
import { Clock, TrendingDown, Ticket, BarChart3 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CategoryBreakdownCard } from "./CategoryBreakdownCard";
import { analyzeCategoryCounts } from "@/utils/categoryAnalytics";

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
    openTrends: any[];
    categories: any[];
  } | null>(null);
  const [tickets, setTickets] = useState<EnhancedParsedTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const loadData = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const loadedTickets = await loadLiveData(board);
        const rolloutDate = new Date("2025-10-21");
        const lastThursday = getLastThursday();
        const julyFirst = getJulyFirst();
        
        const analyzed = analyzeResponseTimes(loadedTickets, rolloutDate, lastThursday, julyFirst);
        
        // Enhanced analytics
        const ageTrends = analyzeTicketAgeTrends(loadedTickets);
        const responseTrends = analyzeFirstResponseTrends(loadedTickets);
        const openTrends = analyzeOpenTicketTrends(loadedTickets);
        
        // Extract automation stages
        const automationStages: { [key: string]: string } = {};
        loadedTickets.forEach((ticket: EnhancedParsedTicket) => {
          if (ticket.automationStage) {
            automationStages[ticket.id] = ticket.automationStage;
          }
        });
        const automationSavings = analyzeAutomationSavings(automationStages);
        
        // Category analysis
        const categories = analyzeCategoryCounts(loadedTickets);
        
        setTickets(loadedTickets);
        setAnalytics(analyzed);
        setEnhancedData({ ageTrends, responseTrends, automationSavings, openTrends, categories });
        setLastUpdated(new Date());

        if (isRefresh) {
          toast({
            title: "Data refreshed",
            description: "Dashboard updated with latest Asana data",
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error loading data",
          description: error instanceof Error ? error.message : "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };

  useEffect(() => {
    loadData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadData(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {boardName} Board Analytics
            </h1>
            <p className="text-muted-foreground">
              Recent period: Since last Thursday | Historical: July 1 - Last Thursday
            </p>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Recent Avg Response"
            value={formatHours(analytics.recentAvg)}
            icon={<Clock className="w-5 h-5" />}
            change={analytics.improvement}
            changeLabel="improvement"
            trend={analytics.improvement > 0 ? "up" : analytics.improvement < 0 ? "down" : "neutral"}
          />
          <MetricCard
            title="Historical Avg"
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Long-Term Trends</TabsTrigger>
            <TabsTrigger value="automation">Automation Savings</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="current">Current State</TabsTrigger>
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
                <OpenTicketTrendChart data={enhancedData.openTrends} />
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

          <TabsContent value="categories" className="space-y-6">
            {enhancedData && (
              <CategoryBreakdownCard data={enhancedData.categories} />
            )}
          </TabsContent>

          <TabsContent value="current" className="space-y-6">
            <CurrentStateTicketsTable tickets={tickets} />
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <TicketTable
              tickets={analytics.recentTickets}
              title="Recent Tickets (Since Last Thursday)"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
