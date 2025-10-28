import { Card } from "@/components/ui/card";
import { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AutomationSavingsData, calculateTotalAutomationSavings } from "@/utils/enhancedAnalytics";
import { Bot, Clock, Zap } from "lucide-react";

interface AutomationSavingsCardProps {
  data: AutomationSavingsData[];
}

const AutomationSavingsCardComponent = ({ data }: AutomationSavingsCardProps) => {
  const totals = calculateTotalAutomationSavings(data);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Tickets Automated</p>
              <p className="text-3xl font-bold text-foreground">{totals.totalTickets}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Bot className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Time Saved (Hours)</p>
              <p className="text-3xl font-bold text-accent">{totals.totalHours}h</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10 text-accent">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Work Days Saved</p>
              <p className="text-3xl font-bold text-accent">{totals.totalDays}d</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10 text-accent">
              <Zap className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Automation Stage Breakdown</h3>
            <p className="text-sm text-muted-foreground">
              Estimated time savings by automation rule
            </p>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Automation Stage</TableHead>
                  <TableHead className="text-right">Tickets</TableHead>
                  <TableHead className="text-right">Minutes Saved</TableHead>
                  <TableHead className="text-right">Hours Saved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No automation data available
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => (
                    <TableRow key={item.stage}>
                      <TableCell className="font-medium">{item.stage}</TableCell>
                      <TableCell className="text-right">{item.ticketCount}</TableCell>
                      <TableCell className="text-right">{item.estimatedMinutesSaved}m</TableCell>
                      <TableCell className="text-right">{item.estimatedHoursSaved}h</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Note:</strong> Time estimates are based on typical manual effort:</p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>R1 Triage: ~5 min per ticket</li>
              <li>R2 Classification: ~3 min per ticket</li>
              <li>R3 Description: ~8 min per ticket</li>
              <li>R4 Prioritization: ~4 min per ticket</li>
              <li>R5 Validation: ~6 min per ticket</li>
              <li>R6 Communication: ~10 min per ticket</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const AutomationSavingsCard = memo(AutomationSavingsCardComponent);
