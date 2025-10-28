interface AsanaTicket {
  taskId: string;
  createdAt: string;
  completedAt: string;
  lastModified: string;
  name: string;
  assignee: string;
  assigneeEmail: string;
  notes: string;
}

export const parseAsanaCSV = (csvText: string): AsanaTicket[] => {
  const lines = csvText.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  
  const tickets: AsanaTicket[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Handle quoted CSV values
    const values: string[] = [];
    let currentValue = "";
    let insideQuotes = false;
    
    for (let char of lines[i]) {
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = "";
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    
    tickets.push({
      taskId: row["Task ID"] || "",
      createdAt: row["Created At"] || "",
      completedAt: row["Completed At"] || "",
      lastModified: row["Last Modified"] || "",
      name: row["Name"] || "",
      assignee: row["Assignee"] || "",
      assigneeEmail: row["Assignee Email"] || "",
      notes: row["Notes"] || "",
    });
  }
  
  return tickets;
};

export const calculateResponseTime = (ticket: AsanaTicket): number | null => {
  if (!ticket.createdAt || !ticket.lastModified) return null;
  
  const created = new Date(ticket.createdAt);
  const modified = new Date(ticket.lastModified);
  
  if (isNaN(created.getTime()) || isNaN(modified.getTime())) return null;
  
  const diffMs = modified.getTime() - created.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return diffHours;
};

export const analyzeResponseTimes = (tickets: AsanaTicket[]) => {
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  
  const recentTickets: AsanaTicket[] = [];
  const previousTickets: AsanaTicket[] = [];
  
  tickets.forEach((ticket) => {
    const created = new Date(ticket.createdAt);
    if (isNaN(created.getTime())) return;
    
    if (created >= twoDaysAgo) {
      recentTickets.push(ticket);
    } else if (created >= ninetyDaysAgo && created < twoDaysAgo) {
      previousTickets.push(ticket);
    }
  });
  
  const calculateAverage = (ticketList: AsanaTicket[]): number => {
    const responseTimes = ticketList
      .map(calculateResponseTime)
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
      const responseTime = calculateResponseTime(ticket);
      
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
    .map((ticket) => ({
      id: ticket.taskId,
      name: ticket.name,
      createdAt: ticket.createdAt,
      responseTime: calculateResponseTime(ticket) || 0,
      assignee: ticket.assignee,
    }))
    .filter((t) => t.responseTime > 0)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);
  
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
