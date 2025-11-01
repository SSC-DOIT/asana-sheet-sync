import { useState } from "react";
import { useTicketAnalytics } from "@/hooks/useTicketAnalytics";
import { BlockersChart } from "@/components/BlockersChart";
import { BlockerTicketsTable } from "@/components/BlockerTicketsTable";
import { RefreshCw, AlertCircle } from "lucide-react";
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { Card, CardContent } from "@/components/ui/card";

const BlockersView = () => {
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);

  const { tickets: tieTickets, loading: tieLoading, error: tieError } = useTicketAnalytics("TIE", true);
  const { tickets: sfdcTickets, loading: sfdcLoading, error: sfdcError } = useTicketAnalytics("SFDC", true);

  const loading = tieLoading || sfdcLoading;
  const error = tieError || sfdcError;
  
  // Add board identifier to tickets
  const tieTicketsWithBoard = tieTickets.map(t => ({ ...t, board: "TIE" as const }));
  const sfdcTicketsWithBoard = sfdcTickets.map(t => ({ ...t, board: "SFDC" as const }));
  const allTickets = [...tieTicketsWithBoard, ...sfdcTicketsWithBoard];

  // Filter for tickets with "Waiting For Customer" or "Waiting on Customer" status
  const blockerTickets = allTickets.filter((ticket) => {
    const status = ticket.customFields?.Status;
    return (
      ticket.isOpen &&
      (status === "Waiting For Customer" || status === "Waiting on Customer")
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-foreground">Loading Information Needed</p>
              <p className="text-sm text-muted-foreground">Fetching tickets from TIE and SFDC boards...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-destructive">
            Error loading tickets: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Information Needed</h1>
            <p className="text-muted-foreground mt-1">
              Tickets waiting for customer response
            </p>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Tasks are generally assigned to the supervisor of the reporter due to licensing constraints.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {blockerTickets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No tickets currently waiting for customer response.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <BlockersChart
              tickets={blockerTickets}
              selectedAssignee={selectedAssignee}
              onAssigneeClick={setSelectedAssignee}
            />

            {selectedAssignee && (
              <BlockerTicketsTable
                tickets={blockerTickets}
                assignee={selectedAssignee}
                onClearSelection={() => setSelectedAssignee(null)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlockersView;
