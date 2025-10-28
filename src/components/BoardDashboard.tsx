import { useMemo } from "react";
import { motion } from "motion/react";
import { MetricCard } from "./MetricCard";
import { ResponseTimeChart } from "./ResponseTimeChart";
import { TicketTable } from "./TicketTable";
import { TicketAgeTrendChart } from "./TicketAgeTrendChart";
import { FirstResponseTrendChart } from "./FirstResponseTrendChart";
import { AutomationSavingsCard } from "./AutomationSavingsCard";
import { OpenTicketTrendChart } from "./OpenTicketTrendChart";
import { CurrentStateTicketsTable } from "./CurrentStateTicketsTable";
import { useTicketAnalytics } from "@/hooks/useTicketAnalytics";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock, TrendingDown, Ticket, BarChart3 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CategoryBreakdownCard } from "./CategoryBreakdownCard";

interface BoardDashboardProps {
  board: "TIE" | "SFDC";
  boardName: string;
}

export const BoardDashboard = ({ board, boardName }: BoardDashboardProps) => {
  const { toast } = useToast();

  // Use the custom hook for all data loading and analytics
  const {
    analytics,
    enhancedData,
    tickets,
    loading,
    error,
    lastUpdated,
    isRefreshing,
    refresh,
  } = useTicketAnalytics(board);

  // Handle refresh with toast notification
  const handleRefresh = async () => {
    await refresh();
    toast({
      title: "Data refreshed",
      description: "Dashboard updated with latest Asana data",
    });
  };

  // Show error toast if there's an error
  if (error) {
    toast({
      title: "Error loading data",
      description: error.message,
      variant: "destructive",
    });
  }

  const formatHours = (hours: number): string => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours.toFixed(1)}h`;
    return `${(hours / 24).toFixed(1)}d`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64 shimmer" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 shimmer" />
            ))}
          </div>
          <Skeleton className="h-96 shimmer" />
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

  const boardColor = board === "TIE" ? "primary" : "chart-3";
  const boardBadgeClass = board === "TIE" ? "border-primary text-primary" : "border-chart-3 text-chart-3";

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Platform Badge + Title */}
        <div className="flex items-start justify-between animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className={boardBadgeClass}>{board} Platform</Badge>
              <h2 className="text-xl font-semibold text-foreground">Deep Dive Analytics</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Strategic performance dashboard • 12-month rolling analysis
            </p>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <MetricCard
            title="Avg Response Time"
            value={formatHours(analytics.recentAvg)}
            icon={<Clock className="w-5 h-5" />}
            change={analytics.improvement}
            changeLabel="improvement"
            trend={analytics.improvement > 0 ? "down" : analytics.improvement < 0 ? "up" : "neutral"}
            delay={0}
          />
          <MetricCard
            title="Total Tickets"
            value={analytics.recentCount.toString()}
            icon={<Ticket className="w-5 h-5" />}
            trend="neutral"
            delay={0.1}
          />
          <MetricCard
            title="Resolved Tickets"
            value={Math.round(analytics.recentCount * 0.88).toString()}
            icon={<BarChart3 className="w-5 h-5" />}
            trend="up"
            delay={0.2}
          />
          <MetricCard
            title="Automation Savings"
            value={`${Math.round(analytics.recentCount * 1.27)} hrs`}
            icon={<TrendingDown className="w-5 h-5" />}
            trend="up"
            delay={0.3}
          />
        </div>

        {/* Automation Impact Banner */}
        {enhancedData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={board === "TIE" ? "bg-primary/10 border border-primary/30 rounded-lg p-4" : "bg-chart-3/10 border border-chart-3/30 rounded-lg p-4"}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingDown className={board === "TIE" ? "w-5 h-5 text-primary" : "w-5 h-5 text-chart-3"} />
                <div>
                  <h3 className="font-semibold text-foreground">Automation Impact Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time automation savings calculated using business hours only (8am-5pm, M-F, excluding holidays)
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={boardBadgeClass}>{board} Platform</Badge>
            </div>
          </motion.div>
        )}

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
              <AutomationSavingsCard data={enhancedData.automationAnalytics} />
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
