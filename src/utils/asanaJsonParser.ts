interface AsanaTask {
  gid: string;
  created_at: string;
  modified_at?: string;
  completed_at?: string | null;
  name?: string;
  assignee?: {
    name: string;
    gid: string;
  } | null;
  custom_fields?: any[];
}

interface AsanaResponse {
  data: AsanaTask[];
}

export interface ParsedTicket {
  id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
  completedAt: string | null;
  assignee: string;
  responseTimeHours: number | null;
}

export const parseAsanaJSON = (jsonData: AsanaResponse): ParsedTicket[] => {
  const tickets: ParsedTicket[] = [];
  
  jsonData.data.forEach((task) => {
    if (!task.created_at) return;
    
    const responseTime = calculateResponseTime(task.created_at, task.modified_at);
    
    tickets.push({
      id: task.gid,
      name: task.name || "Untitled Task",
      createdAt: task.created_at,
      modifiedAt: task.modified_at || task.created_at,
      completedAt: task.completed_at || null,
      assignee: task.assignee?.name || "Unassigned",
      responseTimeHours: responseTime,
    });
  });
  
  return tickets;
};

export const calculateResponseTime = (createdAt: string, modifiedAt?: string): number | null => {
  if (!createdAt || !modifiedAt) return null;
  
  const created = new Date(createdAt);
  const modified = new Date(modifiedAt);
  
  if (isNaN(created.getTime()) || isNaN(modified.getTime())) return null;
  
  const diffMs = modified.getTime() - created.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return diffHours >= 0 ? diffHours : null;
};

export const analyzeResponseTimes = (tickets: ParsedTicket[], rolloutDate: Date) => {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  
  const recentTickets: ParsedTicket[] = [];
  const previousTickets: ParsedTicket[] = [];
  
  tickets.forEach((ticket) => {
    const created = new Date(ticket.createdAt);
    if (isNaN(created.getTime())) return;
    
    if (created >= twoDaysAgo) {
      recentTickets.push(ticket);
    } else if (created >= ninetyDaysAgo && created < twoDaysAgo) {
      previousTickets.push(ticket);
    }
  });
  
  const calculateAverage = (ticketList: ParsedTicket[]): number => {
    const responseTimes = ticketList
      .map((t) => t.responseTimeHours)
      .filter((time): time is number => time !== null && time >= 0);
    
    if (responseTimes.length === 0) return 0;
    
    const sum = responseTimes.reduce((acc, time) => acc + time, 0);
    return sum / responseTimes.length;
  };
  
  const recentAvg = calculateAverage(recentTickets);
  const previousAvg = calculateAverage(previousTickets);
  
  const improvement = previousAvg > 0 
    ? ((previousAvg - recentAvg) / previousAvg) * 100 
    : 0;
  
  // Calculate daily averages for chart
  const dailyData: { [key: string]: { total: number; count: number } } = {};
  
  tickets.forEach((ticket) => {
    const created = new Date(ticket.createdAt);
    if (isNaN(created.getTime())) return;
    
    if (created >= ninetyDaysAgo) {
      const dateKey = created.toISOString().split("T")[0];
      const responseTime = ticket.responseTimeHours;
      
      if (responseTime !== null && responseTime >= 0) {
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = { total: 0, count: 0 };
        }
        dailyData[dateKey].total += responseTime;
        dailyData[dateKey].count += 1;
      }
    }
  });
  
  const chartData = Object.keys(dailyData)
    .sort()
    .map((date) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      avgResponseTime: Number((dailyData[date].total / dailyData[date].count).toFixed(2)),
    }));
  
  const recentTicketsWithResponseTime = recentTickets
    .filter((t) => t.responseTimeHours !== null && t.responseTimeHours > 0)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
    .map((ticket) => ({
      id: ticket.id,
      name: ticket.name,
      createdAt: ticket.createdAt,
      responseTime: ticket.responseTimeHours || 0,
      assignee: ticket.assignee,
    }));
  
  return {
    recentAvg,
    previousAvg,
    improvement,
    chartData,
    recentTickets: recentTicketsWithResponseTime,
    recentCount: recentTickets.length,
    previousCount: previousTickets.length,
  };
};
