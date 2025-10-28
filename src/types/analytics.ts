import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";

// Analytics data returned from response time analysis
export interface AnalyticsData {
  recentAvg: number;
  previousAvg: number;
  improvement: number;
  chartData: ChartDataPoint[];
  recentTickets: RecentTicket[];
  recentCount: number;
  previousCount: number;
}

// Individual data point in trend charts
export interface ChartDataPoint {
  date: string;
  avgResponseTime: number;
}

// Simplified ticket data for recent tickets display
export interface RecentTicket {
  id: string;
  name: string;
  createdAt: string;
  responseTime: number | null;
  assignee: string;
}

// Enhanced analytics including trends and automation data
export interface EnhancedAnalyticsData {
  ageTrends: TicketAgeTrendPoint[];
  responseTrends: ResponseTrendPoint[];
  automationAnalytics: AutomationAnalytics;
  openTrends: OpenTicketTrendPoint[];
  categories: CategoryData[];
}

// Ticket age trend data point
export interface TicketAgeTrendPoint {
  date: string;
  openAvg: number;
  closedAvg: number;
}

// Response time trend data point
export interface ResponseTrendPoint {
  date: string;
  avgResponseHours: number;
  count: number;
}

// Automation savings by stage (per-ticket basis)
export interface AutomationSavingsData {
  stage: string;
  count: number;
  minutesPerTicket: number;
  totalMinutesSaved: number;
  totalHoursSaved: number;
}

// Comprehensive automation analytics
export interface AutomationAnalytics {
  // Per-ticket metrics
  averageTimeSavedPerTicket: number; // minutes
  averageAutomationRulesPerTicket: number;

  // Response time comparison
  automatedTicketsAvgResponse: number; // hours (business hours)
  manualTicketsAvgResponse: number; // hours (business hours)
  responseTimeImprovement: number; // percentage

  // Ticket rate and forecasting
  ticketRate: {
    perDay: number;
    perWeek: number;
    perMonth: number;
  };

  // Time savings projections
  projections: {
    currentMonthSavings: number; // hours
    monthlyForecast: number; // hours per month
    yearlyForecast: number; // hours per year
    monthlyForecastDays: number; // work days per month
    yearlyForecastDays: number; // work days per year
  };

  // Breakdown by automation stage
  byStage: AutomationSavingsData[];

  // Summary totals
  totalAutomatedTickets: number;
  totalManualTickets: number;
  totalTimeSavedHours: number;
  totalTimeSavedDays: number;
}

// Open ticket trend data point
export interface OpenTicketTrendPoint {
  date: string;
  openCount: number;
}

// Category analytics data
export interface CategoryData {
  category: string;
  openCount: number;
  closedCount: number;
  totalCount: number;
}

// Board dashboard state
export interface BoardDashboardState {
  analytics: AnalyticsData | null;
  enhancedData: EnhancedAnalyticsData | null;
  tickets: EnhancedParsedTicket[];
  loading: boolean;
  lastUpdated: Date | null;
  isRefreshing: boolean;
}

// Hook return type for useTicketAnalytics
export interface UseTicketAnalyticsReturn {
  analytics: AnalyticsData | null;
  enhancedData: EnhancedAnalyticsData | null;
  tickets: EnhancedParsedTicket[];
  loading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  isRefreshing: boolean;
  refresh: () => Promise<void>;
}
