import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AutomationAnalytics } from "@/types/analytics";
import { Bot, Clock, Zap, TrendingUp, Calendar, Sparkles } from "lucide-react";

interface AutomationSavingsCardProps {
  data: AutomationAnalytics;
}

export const AutomationSavingsCard = ({ data }: AutomationSavingsCardProps) => {
  return (
    <div className="space-y-6">
      {/* Per-Ticket Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Avg Time Saved Per Ticket</p>
              <p className="text-3xl font-bold text-accent">{data.averageTimeSavedPerTicket}m</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10 text-accent">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Automated Tickets</p>
              <p className="text-3xl font-bold text-foreground">{data.totalAutomatedTickets}</p>
              <p className="text-xs text-muted-foreground">vs {data.totalManualTickets} manual</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Bot className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Time Saved</p>
              <p className="text-3xl font-bold text-accent">{data.totalTimeSavedHours}h</p>
              <p className="text-xs text-muted-foreground">{data.totalTimeSavedDays} work days</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10 text-accent">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Response Time Comparison */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Response Time Impact</h3>
            <p className="text-sm text-muted-foreground">
              Comparing automated vs manual ticket response times (business hours only)
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Automated Tickets Avg Response</p>
              <p className="text-2xl font-bold text-green-600">{data.automatedTicketsAvgResponse}h</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Manual Tickets Avg Response</p>
              <p className="text-2xl font-bold text-orange-600">{data.manualTicketsAvgResponse}h</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Response Time Improvement</p>
              <p className="text-2xl font-bold text-accent">{data.responseTimeImprovement}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Forecasting */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Time Savings Projections
            </h3>
            <p className="text-sm text-muted-foreground">
              Based on {data.ticketRate.perDay.toFixed(1)} total tickets/day ({data.automatedTicketRate.perDay.toFixed(1)} automated)
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Current Month</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{data.projections.currentMonthSavings}h</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(data.projections.currentMonthSavings / 8).toFixed(1)} work days saved
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Monthly Forecast</p>
              </div>
              <p className="text-2xl font-bold text-accent">{data.projections.monthlyForecast}h</p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.projections.monthlyForecastDays} work days per month
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Yearly Forecast</p>
              </div>
              <p className="text-2xl font-bold text-accent">{data.projections.yearlyForecast}h</p>
              <p className="text-xs text-muted-foreground mt-1">
                {data.projections.yearlyForecastDays} work days per year
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Forecasts are extrapolated from the last 90 days of ticket data and current automation rates.
          </p>
        </div>
      </Card>

      {/* Detailed Breakdown */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Automation Stage Breakdown</h3>
            <p className="text-sm text-muted-foreground">
              Per-ticket time savings by automation rule
            </p>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Automation Stage</TableHead>
                  <TableHead className="text-right">Tickets</TableHead>
                  <TableHead className="text-right">Minutes/Ticket</TableHead>
                  <TableHead className="text-right">Total Minutes</TableHead>
                  <TableHead className="text-right">Total Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.byStage.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No automation data available
                    </TableCell>
                  </TableRow>
                ) : (
                  data.byStage.map((item) => (
                    <TableRow key={item.stage}>
                      <TableCell className="font-medium">{item.stage}</TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                      <TableCell className="text-right">{item.minutesPerTicket}m</TableCell>
                      <TableCell className="text-right">{item.totalMinutesSaved}m</TableCell>
                      <TableCell className="text-right">{item.totalHoursSaved}h</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>How time savings are calculated:</strong></p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Each automation rule saves a specific amount of time PER TICKET it processes</li>
              <li>R1 Triage: 5 min/ticket (manual triage, categorization, initial assessment)</li>
              <li>R2 Classification: 3 min/ticket (determining ticket type and category)</li>
              <li>R3 Description: 8 min/ticket (formatting, clarifying, writing descriptions)</li>
              <li>R4 Prioritization: 4 min/ticket (evaluating urgency and impact)</li>
              <li>R5 Validation: 6 min/ticket (checking requirements, verifying data)</li>
              <li>R6 Communication: 10 min/ticket (drafting, reviewing, sending updates)</li>
            </ul>
            <p className="mt-2"><strong>Business hours only:</strong> All response times use 8-hour workdays (8am-5pm), excluding weekends and holidays.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
