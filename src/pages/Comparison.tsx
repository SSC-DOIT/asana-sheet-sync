import { useEffect, useState } from "react";
import { loadLiveData } from "@/utils/liveDataLoader";
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { analyzeResponseTimes } from "@/utils/asanaJsonParser";
import { analyzeAutomationAnalytics, getLastThursday, getJulyFirst } from "@/utils/enhancedAnalytics";
import { MetricCard } from "@/components/MetricCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ArrowRight, Clock, TrendingDown, Bot, Zap } from "lucide-react";

const Comparison = () => {
  const [tieAnalytics, setTieAnalytics] = useState<any>(null);
  const [sfdcAnalytics, setSfdcAnalytics] = useState<any>(null);
  const [tieAutomation, setTieAutomation] = useState<any>(null);
  const [sfdcAutomation, setSfdcAutomation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const rolloutDate = new Date("2025-10-21");
        const lastThursday = getLastThursday();
        const julyFirst = getJulyFirst();
        
        const [tieTickets, sfdcTickets] = await Promise.all([
          loadLiveData("TIE"),
          loadLiveData("SFDC"),
        ]);

        const tieAnalyzed = analyzeResponseTimes(tieTickets, rolloutDate, lastThursday, julyFirst);
        const sfdcAnalyzed = analyzeResponseTimes(sfdcTickets, rolloutDate, lastThursday, julyFirst);

        // Automation analytics (per-ticket savings and forecasting)
        const tieAutomationAnalytics = analyzeAutomationAnalytics(tieTickets);
        const sfdcAutomationAnalytics = analyzeAutomationAnalytics(sfdcTickets);

        setTieAnalytics(tieAnalyzed);
        setSfdcAnalytics(sfdcAnalyzed);
        setTieAutomation(tieAutomationAnalytics);
        setSfdcAutomation(sfdcAutomationAnalytics);
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
            Recent period: Since last Thursday | Historical: July 1 - Last Thursday
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* TIE Board Summary */}
          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">TIE Board</h2>
            
            <div className="space-y-4">
              <MetricCard
                title="Recent Avg Response"
                value={formatHours(tieAnalytics.recentAvg)}
                icon={<Clock className="w-5 h-5" />}
                change={tieAnalytics.improvement}
                changeLabel="improvement"
                trend={tieAnalytics.improvement > 0 ? "up" : tieAnalytics.improvement < 0 ? "down" : "neutral"}
              />
              
              <MetricCard
                title="Historical Avg"
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
                title="Recent Avg Response"
                value={formatHours(sfdcAnalytics.recentAvg)}
                icon={<Clock className="w-5 h-5" />}
                change={sfdcAnalytics.improvement}
                changeLabel="improvement"
                trend={sfdcAnalytics.improvement > 0 ? "up" : sfdcAnalytics.improvement < 0 ? "down" : "neutral"}
              />
              
              <MetricCard
                title="Historical Avg"
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
          <h2 className="text-2xl font-semibold text-foreground mb-6">Combined Impact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Response Time Impact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-muted-foreground">Response Time Improvements</h3>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Avg Time Saved Per Ticket</p>
                <p className="text-3xl font-bold text-accent">
                  {formatHours(
                    ((tieAnalytics.previousAvg - tieAnalytics.recentAvg) + 
                     (sfdcAnalytics.previousAvg - sfdcAnalytics.recentAvg)) / 2
                  )}
                </p>
              </div>
            </div>

            {/* Automation Impact */}
            {tieAutomation && sfdcAutomation && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-muted-foreground">Automation Savings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-primary" />
                      <p className="text-sm text-muted-foreground">Total Automated</p>
                    </div>
                    <p className="text-3xl font-bold text-foreground">
                      {tieAutomation.totalAutomatedTickets + sfdcAutomation.totalAutomatedTickets}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      <p className="text-sm text-muted-foreground">Hours Saved</p>
                    </div>
                    <p className="text-3xl font-bold text-accent">
                      {(tieAutomation.totalTimeSavedHours + sfdcAutomation.totalTimeSavedHours).toFixed(1)}h
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <p className="text-sm text-muted-foreground">Work Days Saved</p>
                  </div>
                  <p className="text-3xl font-bold text-accent">
                    {(tieAutomation.totalTimeSavedDays + sfdcAutomation.totalTimeSavedDays).toFixed(1)}d
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Summary:</strong> The automated ticketing process has significantly improved response times 
              and saved substantial staff time across both boards. The R1-R6 automation rules handle initial triage, 
              classification, and communication, allowing staff to focus on complex problem-solving.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Comparison;
