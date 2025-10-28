import { useState } from "react";
import { CSVUploader } from "@/components/CSVUploader";
import { MetricCard } from "@/components/MetricCard";
import { ResponseTimeChart } from "@/components/ResponseTimeChart";
import { TicketTable } from "@/components/TicketTable";
import { parseAsanaCSV, analyzeResponseTimes } from "@/utils/ticketAnalytics";
import { Clock, TrendingDown, Calendar, Target } from "lucide-react";

const Index = () => {
  const [analytics, setAnalytics] = useState<ReturnType<typeof analyzeResponseTimes> | null>(null);

  const handleDataLoad = (csvText: string) => {
    try {
      const tickets = parseAsanaCSV(csvText);
      const analysis = analyzeResponseTimes(tickets);
      setAnalytics(analysis);
    } catch (error) {
      console.error("Error analyzing data:", error);
    }
  };

  const formatHours = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    if (hours < 24) return `${hours.toFixed(1)} hours`;
    return `${(hours / 24).toFixed(1)} days`;
  };

  const rolloutDate = new Date();
  rolloutDate.setDate(rolloutDate.getDate() - 2);
  const rolloutDateStr = rolloutDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Ticket Response Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Analyzing the impact of automated triage on response times
          </p>
        </div>

        {/* Upload Section */}
        {!analytics && (
          <div className="max-w-2xl mx-auto">
            <CSVUploader onDataLoad={handleDataLoad} />
          </div>
        )}

        {/* Analytics Dashboard */}
        {analytics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Recent Average (Last 2 Days)"
                value={formatHours(analytics.recentAvg)}
                icon={<Clock className="w-5 h-5" />}
                change={analytics.improvement}
                changeLabel="improvement"
                trend={analytics.improvement > 0 ? "up" : analytics.improvement < 0 ? "down" : "neutral"}
              />
              <MetricCard
                title="Previous Average (88 Days)"
                value={formatHours(analytics.previousAvg)}
                icon={<Calendar className="w-5 h-5" />}
              />
              <MetricCard
                title="Time Saved per Ticket"
                value={formatHours(analytics.previousAvg - analytics.recentAvg)}
                icon={<TrendingDown className="w-5 h-5" />}
                trend="up"
              />
              <MetricCard
                title="Recent Tickets Analyzed"
                value={analytics.recentCount.toString()}
                icon={<Target className="w-5 h-5" />}
              />
            </div>

            {/* Chart */}
            <ResponseTimeChart data={analytics.chartData} rolloutDate={rolloutDateStr} />

            {/* Recent Tickets Table */}
            <TicketTable tickets={analytics.recentTickets} title="Recent Tickets (Last 2 Days)" />

            {/* Upload New Data */}
            <div className="flex justify-center pt-4">
              <CSVUploader onDataLoad={handleDataLoad} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
