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
  automationSavings: AutomationSavingsData[];
  openTrends: OpenTicketTrendPoint[];
  categories: CategoryData[];
}

// Ticket age trend data point
export interface TicketAgeTrendPoint {
  date: string;
  avgAge: number;
  count: number;
}

// Response time trend data point
export interface ResponseTrendPoint {
  date: string;
  avgResponseTime: number;
  count: number;
}

// Automation savings by stage
export interface AutomationSavingsData {
  stage: string;
  count: number;
  hoursPerTicket: number;
  totalHours: number;
  workDays: number;
}

// Open ticket trend data point
export interface OpenTicketTrendPoint {
  date: string;
  openCount: number;
  closedCount: number;
}

// Category analytics data
export interface CategoryData {
  category: string;
  count: number;
  openCount: number;
  closedCount: number;
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
