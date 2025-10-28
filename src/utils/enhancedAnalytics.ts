import { ParsedTicket } from "./asanaJsonParser";

export interface TicketAgeData {
  date: string;
  openAvg: number;
  closedAvg: number;
}

export interface FirstResponseTrendData {
  date: string;
  avgResponseHours: number;
  count: number;
}

export interface OpenTicketTrendData {
  date: string;
  openCount: number;
}

export interface AutomationSavingsData {
  stage: string;
  ticketCount: number;
  estimatedMinutesSaved: number;
  estimatedHoursSaved: number;
}

// Automation time estimates (in minutes) based on typical manual effort
const AUTOMATION_TIME_ESTIMATES = {
  "R1 - Triage +": 5, // Manual triage and categorization
  "R2 - Classification +": 3, // Manual classification
  "R3 - Description +": 8, // Writing detailed descriptions
  "R4 - Prioritization +": 4, // Manual priority assessment
  "R5 - Validation +": 6, // Manual validation checks
  "R6 - Communication +": 10, // Drafting and sending communication
};

export const calculateTicketAge = (createdAt: string, referenceDate?: string): number => {
  const created = new Date(createdAt);
  const reference = referenceDate ? new Date(referenceDate) : new Date();
  
  if (isNaN(created.getTime()) || isNaN(reference.getTime())) return 0;
  
  const diffMs = reference.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  return diffDays >= 0 ? diffDays : 0;
};

export const analyzeTicketAgeTrends = (tickets: ParsedTicket[], daysBack: number = 90): TicketAgeData[] => {
  const now = new Date();
  const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  
  // Group tickets by day
  const dailyData: { [key: string]: { openAges: number[]; closedAges: number[] } } = {};
  
  tickets.forEach((ticket) => {
    const created = new Date(ticket.createdAt);
    if (isNaN(created.getTime()) || created < startDate) return;
    
    const dateKey = created.toISOString().split("T")[0];
    
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = { openAges: [], closedAges: [] };
    }
    
    const isOpen = !ticket.completedAt;
    const age = calculateTicketAge(
      ticket.createdAt,
      isOpen ? undefined : ticket.completedAt || undefined
    );
    
    if (isOpen) {
      dailyData[dateKey].openAges.push(age);
    } else {
      dailyData[dateKey].closedAges.push(age);
    }
  });
  
  // Calculate averages
  return Object.keys(dailyData)
    .sort()
    .map((date) => {
      const data = dailyData[date];
      const openAvg = data.openAges.length > 0
        ? data.openAges.reduce((sum, age) => sum + age, 0) / data.openAges.length
        : 0;
      const closedAvg = data.closedAges.length > 0
        ? data.closedAges.reduce((sum, age) => sum + age, 0) / data.closedAges.length
        : 0;
      
      return {
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        openAvg: Number(openAvg.toFixed(2)),
        closedAvg: Number(closedAvg.toFixed(2)),
      };
    });
};

export const analyzeFirstResponseTrends = (tickets: ParsedTicket[], daysBack: number = 90): FirstResponseTrendData[] => {
  const now = new Date();
  const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  
  const weeklyData: { [key: string]: { total: number; count: number } } = {};
  
  tickets.forEach((ticket) => {
    const created = new Date(ticket.createdAt);
    if (isNaN(created.getTime()) || created < startDate) return;
    if (!ticket.responseTimeHours || ticket.responseTimeHours <= 0) return;
    
    // Group by week for smoother trends
    const weekStart = new Date(created);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().split("T")[0];
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { total: 0, count: 0 };
    }
    
    weeklyData[weekKey].total += ticket.responseTimeHours;
    weeklyData[weekKey].count += 1;
  });
  
  return Object.keys(weeklyData)
    .sort()
    .map((date) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      avgResponseHours: Number((weeklyData[date].total / weeklyData[date].count).toFixed(2)),
      count: weeklyData[date].count,
    }));
};

export const analyzeOpenTicketTrends = (tickets: ParsedTicket[], daysBack: number = 90): OpenTicketTrendData[] => {
  const now = new Date();
  const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  
  const dailyOpenCounts: { [key: string]: number } = {};
  
  // For each day, count how many tickets were open on that day
  for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
    const dateKey = new Date(d).toISOString().split("T")[0];
    dailyOpenCounts[dateKey] = 0;
    
    tickets.forEach((ticket) => {
      const created = new Date(ticket.createdAt);
      const completed = ticket.completedAt ? new Date(ticket.completedAt) : null;
      
      // Ticket is open on this day if created before/on this day and not completed, or completed after this day
      if (created <= d && (!completed || completed > d)) {
        dailyOpenCounts[dateKey]++;
      }
    });
  }
  
  return Object.keys(dailyOpenCounts)
    .sort()
    .map((date) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      openCount: dailyOpenCounts[date],
    }));
};

export const getLastThursday = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 4 = Thursday
  const daysToSubtract = dayOfWeek >= 4 ? dayOfWeek - 4 : dayOfWeek + 3;
  const lastThursday = new Date(today);
  lastThursday.setDate(today.getDate() - daysToSubtract);
  lastThursday.setHours(0, 0, 0, 0);
  return lastThursday;
};

export const getJulyFirst = (): Date => {
  return new Date("2025-07-01T00:00:00");
};

export const analyzeAutomationSavings = (
  automationStages: { [ticketId: string]: string }
): AutomationSavingsData[] => {
  const stageCounts: { [stage: string]: number } = {};
  
  Object.values(automationStages).forEach((stage) => {
    if (stage && stage.startsWith("R")) {
      stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    }
  });
  
  const results: AutomationSavingsData[] = [];
  
  Object.entries(stageCounts).forEach(([stage, count]) => {
    const minutesPerTicket = AUTOMATION_TIME_ESTIMATES[stage as keyof typeof AUTOMATION_TIME_ESTIMATES] || 0;
    const totalMinutes = count * minutesPerTicket;
    
    results.push({
      stage,
      ticketCount: count,
      estimatedMinutesSaved: totalMinutes,
      estimatedHoursSaved: Number((totalMinutes / 60).toFixed(2)),
    });
  });
  
  return results.sort((a, b) => b.estimatedMinutesSaved - a.estimatedMinutesSaved);
};

export const calculateTotalAutomationSavings = (savings: AutomationSavingsData[]) => {
  const totalTickets = savings.reduce((sum, s) => sum + s.ticketCount, 0);
  const totalMinutes = savings.reduce((sum, s) => sum + s.estimatedMinutesSaved, 0);
  const totalHours = totalMinutes / 60;
  const totalDays = totalHours / 8; // 8-hour workday
  
  return {
    totalTickets,
    totalMinutes,
    totalHours: Number(totalHours.toFixed(2)),
    totalDays: Number(totalDays.toFixed(2)),
  };
};
