import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTicketAnalytics } from "@/hooks/useTicketAnalytics";
import { DepartmentSelector } from "@/components/DepartmentSelector";
import { DepartmentTicketsTable } from "@/components/DepartmentTicketsTable";
import { MetricCard } from "@/components/MetricCard";
import { RefreshCw, Building2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { getDepartmentStats } from "@/utils/departmentAnalytics";

const DepartmentView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDepartment, setSelectedDepartment] = useState(
    searchParams.get("dept") || "Sales"
  );

  const { tickets, loading, error } = useTicketAnalytics("TIE", true);

  useEffect(() => {
    setSearchParams({ dept: selectedDepartment }, { replace: true });
  }, [selectedDepartment, setSearchParams]);

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-foreground">Loading Department View</p>
              <p className="text-sm text-muted-foreground">Fetching tickets from TIE board...</p>
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

  const stats = getDepartmentStats(tickets, selectedDepartment);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Department View</h1>
              <p className="text-muted-foreground mt-1">
                View and manage open tickets by department
              </p>
            </div>
          </div>
          
          <DepartmentSelector
            tickets={tickets}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={handleDepartmentChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Open Tickets"
            value={stats.totalOpen.toString()}
            icon={<Building2 className="w-5 h-5" />}
          />
          <MetricCard
            title="Aged Tickets (14+ days)"
            value={stats.aged.toString()}
            icon={<Clock className="w-5 h-5" />}
          />
          <MetricCard
            title="Critical (30+ days)"
            value={stats.critical.toString()}
            icon={<AlertCircle className="w-5 h-5" />}
          />
          <MetricCard
            title="Average Ticket Age"
            value={`${stats.averageAge.toFixed(1)}d`}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        <DepartmentTicketsTable
          tickets={tickets}
          department={selectedDepartment}
        />
      </div>
    </div>
  );
};

export default DepartmentView;
