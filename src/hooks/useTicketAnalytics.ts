import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { loadBoardData } from "@/services/asanaService";
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { analyzeResponseTimes } from "@/utils/asanaJsonParser";
import {
  analyzeNetNewTickets,
  analyzeFirstResponseTrends,
  analyzeAutomationAnalytics,
  analyzeOpenTicketTrends,
  getLastThursday,
  getJulyFirst,
} from "@/utils/enhancedAnalytics";
import { analyzeCategoryCounts } from "@/utils/categoryAnalytics";
import {
  AnalyticsData,
  EnhancedAnalyticsData,
  UseTicketAnalyticsReturn,
} from "@/types/analytics";

const ROLLOUT_DATE = new Date("2025-10-21");
const REFETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Custom hook for loading and analyzing ticket data
 * Provides comprehensive analytics with automatic caching and refresh
 */
export function useTicketAnalytics(
  board: "TIE" | "SFDC",
  includeArchive: boolean = true,
  daysBack: number = 365
): UseTicketAnalyticsReturn {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch data with React Query
  const {
    data: tickets = [],
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["tickets", board, includeArchive],
    queryFn: () => loadBoardData(board, includeArchive),
    staleTime: REFETCH_INTERVAL, // Keep data fresh for 5 minutes
    gcTime: REFETCH_INTERVAL, // Cache in memory for 5 minutes
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData, // Keep previous data during refetch
    retry: 2,
  });

  // Memoize analytics calculations
  const analytics = useMemo<AnalyticsData | null>(() => {
    if (tickets.length === 0) return null;

    const lastThursday = getLastThursday();
    const julyFirst = getJulyFirst();

    return analyzeResponseTimes(tickets, ROLLOUT_DATE, lastThursday, julyFirst);
  }, [tickets]);

  // Memoize enhanced analytics
  const enhancedData = useMemo<EnhancedAnalyticsData | null>(() => {
    if (tickets.length === 0) return null;

    const netNewTrends = analyzeNetNewTickets(tickets, daysBack);
    const responseTrends = analyzeFirstResponseTrends(tickets, daysBack);
    const openTrends = analyzeOpenTicketTrends(tickets, daysBack);

    // Comprehensive automation analytics (per-ticket savings and forecasting)
    const automationAnalytics = analyzeAutomationAnalytics(tickets);

    // Category analysis
    const categories = analyzeCategoryCounts(tickets);

    return {
      netNewTrends,
      responseTrends,
      automationAnalytics,
      openTrends,
      categories,
    };
  }, [tickets, daysBack]);

  // Manual refresh with loading state
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  // Convert dataUpdatedAt to Date or null
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : null;

  return {
    analytics,
    enhancedData,
    tickets,
    loading: isLoading,
    error: error instanceof Error ? error : null,
    lastUpdated,
    isRefreshing,
    refresh,
  };
}
