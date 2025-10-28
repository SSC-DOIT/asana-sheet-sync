import { EnhancedParsedTicket } from "./enhancedDataLoader";

export interface CategoryData {
  category: string;
  closedCount: number;
  openCount: number;
  totalCount: number;
}

// Define ticket categories based on ticket names and custom fields
const CATEGORY_KEYWORDS = {
  Email: [
    "email",
    "outlook",
    "inbox",
    "mail",
    "send",
    "receive",
    "group list",
  ],
  Password: ["password", "reset", "login", "credential", "authentication"],
  "Ring/Phone": ["ring", "phone", "call", "voip", "dialer", "telephony"],
  Security: [
    "security",
    "permission",
    "access",
    "license",
    "licensing",
    "role",
  ],
  Salesforce: ["sfdc", "salesforce", "crm"],
  Reports: ["report", "dashboard", "analytics", "data"],
  Integration: ["integration", "api", "sync", "connection"],
  Hardware: ["hardware", "laptop", "computer", "device", "equipment"],
  Software: ["software", "platform", "application", "tool"],
  Network: ["network", "internet", "connectivity", "vpn"],
};

export const categorizeTicket = (ticket: EnhancedParsedTicket): string => {
  const searchText = `${ticket.name} ${ticket.customFields?.Category || ""}`.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => searchText.includes(keyword))) {
      return category;
    }
  }

  return "Other";
};

export const analyzeCategoryCounts = (
  tickets: EnhancedParsedTicket[]
): CategoryData[] => {
  const categoryCounts: { [key: string]: CategoryData } = {};

  tickets.forEach((ticket) => {
    const category = categorizeTicket(ticket);

    if (!categoryCounts[category]) {
      categoryCounts[category] = {
        category,
        closedCount: 0,
        openCount: 0,
        totalCount: 0,
      };
    }

    categoryCounts[category].totalCount++;
    if (ticket.isOpen) {
      categoryCounts[category].openCount++;
    } else {
      categoryCounts[category].closedCount++;
    }
  });

  // Sort by total count and return top 10
  return Object.values(categoryCounts)
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 10);
};
