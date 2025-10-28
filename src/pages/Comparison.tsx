import { useEffect, useState } from "react";
import { loadAndParseData } from "@/utils/dataLoader";
import { analyzeResponseTimes } from "@/utils/asanaJsonParser";
import { MetricCard } from "@/components/MetricCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ArrowRight, Clock, TrendingDown } from "lucide-react";

const Comparison = () => {
  const [tieAnalytics, setTieAnalytics] = useState<any>(null);
  const [sfdcAnalytics, setSfdcAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const rolloutDate = new Date("2025-10-21");
        
        const [tieTickets, sfdcTickets] = await Promise.all([
          loadAndParseData("TIE"),
          loadAndParseData("SFDC"),
        ]);

        const tieAnalyzed = analyzeResponseTimes(tieTickets, rolloutDate);
        const sfdcAnalyzed = analyzeResponseTimes(sfdcTickets, rolloutDate);

        setTieAnalytics(tieAnalyzed);
        setSfdcAnalytics(sfdcAnalyzed);
      } catch (error) {
        console.error("Error loading comparison data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatHours = (hours: number): string => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours.toFixed(1)}h`;
    return `${(hours / 24).toFixed(1)}d`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-96" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!tieAnalytics || !sfdcAnalytics) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load comparison data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Board Comparison
          </h1>
          <p className="text-muted-foreground">
            Comparing response time improvements across TIE and SFDC boards
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* TIE Board Summary */}
          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">TIE Board</h2>
            
            <div className="space-y-4">
              <MetricCard
                title="Recent Avg Response (2d)"
                value={formatHours(tieAnalytics.recentAvg)}
                icon={<Clock className="w-5 h-5" />}
                change={tieAnalytics.improvement}
                changeLabel="improvement"
                trend={tieAnalytics.improvement > 0 ? "up" : tieAnalytics.improvement < 0 ? "down" : "neutral"}
              />
              
              <MetricCard
                title="Previous Avg (90d)"
                value={formatHours(tieAnalytics.previousAvg)}
                icon={<Clock className="w-5 h-5" />}
              />
              
              <MetricCard
                title="Time Saved Per Ticket"
                value={formatHours(tieAnalytics.previousAvg - tieAnalytics.recentAvg)}
                icon={<TrendingDown className="w-5 h-5" />}
                trend="up"
              />
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recent Tickets:</span>
                <span className="font-medium">{tieAnalytics.recentCount}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Previous Tickets:</span>
                <span className="font-medium">{tieAnalytics.previousCount}</span>
              </div>
            </div>
          </Card>

          {/* SFDC Board Summary */}
          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">SFDC Board</h2>
            
            <div className="space-y-4">
              <MetricCard
                title="Recent Avg Response (2d)"
                value={formatHours(sfdcAnalytics.recentAvg)}
                icon={<Clock className="w-5 h-5" />}
                change={sfdcAnalytics.improvement}
                changeLabel="improvement"
                trend={sfdcAnalytics.improvement > 0 ? "up" : sfdcAnalytics.improvement < 0 ? "down" : "neutral"}
              />
              
              <MetricCard
                title="Previous Avg (90d)"
                value={formatHours(sfdcAnalytics.previousAvg)}
                icon={<Clock className="w-5 h-5" />}
              />
              
              <MetricCard
                title="Time Saved Per Ticket"
                value={formatHours(sfdcAnalytics.previousAvg - sfdcAnalytics.recentAvg)}
                icon={<TrendingDown className="w-5 h-5" />}
                trend="up"
              />
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recent Tickets:</span>
                <span className="font-medium">{sfdcAnalytics.recentCount}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-muted-foreground">Previous Tickets:</span>
                <span className="font-medium">{sfdcAnalytics.previousCount}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Overall Impact */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Overall Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Combined Improvement</p>
              <p className="text-3xl font-bold text-accent">
                {((tieAnalytics.improvement + sfdcAnalytics.improvement) / 2).toFixed(1)}%
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Recent Tickets</p>
              <p className="text-3xl font-bold text-foreground">
                {tieAnalytics.recentCount + sfdcAnalytics.recentCount}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg Time Saved</p>
              <p className="text-3xl font-bold text-accent">
                {formatHours(
                  ((tieAnalytics.previousAvg - tieAnalytics.recentAvg) + 
                   (sfdcAnalytics.previousAvg - sfdcAnalytics.recentAvg)) / 2
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Comparison;
