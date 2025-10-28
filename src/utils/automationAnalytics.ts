import { calculateBusinessHours } from './businessHours';

export interface AutomationRule {
  id: string;
  name: string;
  category: string;
  avgTimeSavedPerTicket: number; // in business hours
  applicableTicketCount: number;
  implementedDate: Date;
}

export interface AutomationAnalytics {
  totalHoursSaved: number;
  totalTicketsAutomated: number;
  avgHoursSavedPerTicket: number;
  projectedMonthlySavings: number;
  projectedQuarterlySavings: number;
  projectedAnnualSavings: number;
  automationRate: number; // percentage of tickets automated
  ruleBreakdown: Array<{
    ruleName: string;
    category: string;
    ticketsProcessed: number;
    hoursSaved: number;
    avgTimeSavedPerTicket: number;
  }>;
  costSavings: {
    hourly: number;
    total: number;
    projected30Day: number;
    projected90Day: number;
    projected365Day: number;
  };
}

const AVERAGE_HOURLY_COST = 75; // $75/hour average support cost

/**
 * Calculate automation analytics with per-ticket precision
 */
export function analyzeAutomationAnalytics(
  tickets: any[],
  automationRules: AutomationRule[]
): AutomationAnalytics {
  let totalHoursSaved = 0;
  let totalTicketsAutomated = 0;

  const ruleBreakdown = automationRules.map(rule => {
    const applicableTickets = tickets.filter(
      t => t.category === rule.category && t.wasAutomated
    );
    
    const ticketsProcessed = applicableTickets.length;
    const hoursSaved = ticketsProcessed * rule.avgTimeSavedPerTicket;

    totalHoursSaved += hoursSaved;
    totalTicketsAutomated += ticketsProcessed;

    return {
      ruleName: rule.name,
      category: rule.category,
      ticketsProcessed,
      hoursSaved,
      avgTimeSavedPerTicket: rule.avgTimeSavedPerTicket
    };
  });

  const avgHoursSavedPerTicket = totalTicketsAutomated > 0 
    ? totalHoursSaved / totalTicketsAutomated 
    : 0;

  const automationRate = tickets.length > 0
    ? (totalTicketsAutomated / tickets.length) * 100
    : 0;

  // Calculate daily average for projections
  const oldestTicket = tickets.reduce((oldest, ticket) => 
    new Date(ticket.createdAt) < new Date(oldest.createdAt) ? ticket : oldest
  , tickets[0]);

  const daysSpanned = oldestTicket 
    ? Math.max(1, Math.ceil((Date.now() - new Date(oldestTicket.createdAt).getTime()) / (1000 * 60 * 60 * 24)))
    : 30;

  const avgHoursSavedPerDay = totalHoursSaved / daysSpanned;

  // Projections
  const projectedMonthlySavings = avgHoursSavedPerDay * 30;
  const projectedQuarterlySavings = avgHoursSavedPerDay * 90;
  const projectedAnnualSavings = avgHoursSavedPerDay * 365;

  // Cost savings
  const costSavings = {
    hourly: AVERAGE_HOURLY_COST,
    total: totalHoursSaved * AVERAGE_HOURLY_COST,
    projected30Day: projectedMonthlySavings * AVERAGE_HOURLY_COST,
    projected90Day: projectedQuarterlySavings * AVERAGE_HOURLY_COST,
    projected365Day: projectedAnnualSavings * AVERAGE_HOURLY_COST
  };

  return {
    totalHoursSaved,
    totalTicketsAutomated,
    avgHoursSavedPerTicket,
    projectedMonthlySavings,
    projectedQuarterlySavings,
    projectedAnnualSavings,
    automationRate,
    ruleBreakdown,
    costSavings
  };
}

/**
 * Calculate actual response time in business hours
 */
export function calculateActualResponseTime(ticket: any): number {
  if (!ticket.firstResponseAt) return 0;
  return calculateBusinessHours(new Date(ticket.createdAt), new Date(ticket.firstResponseAt));
}

/**
 * Calculate resolution time in business hours
 */
export function calculateResolutionTime(ticket: any): number {
  if (!ticket.resolvedAt) return 0;
  return calculateBusinessHours(new Date(ticket.createdAt), new Date(ticket.resolvedAt));
}
