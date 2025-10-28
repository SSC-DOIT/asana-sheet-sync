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
    "won't send",
    "won't receive",
    "setup",
  ],
  Password: ["password", "reset", "login", "credential", "authentication"],
  "Ring/Phone": [
    "ring",
    "phone",
    "call",
    "voip",
    "dialer",
    "telephony",
    "voicemail",
  ],
  Security: [
    "security",
    "permission",
    "access",
    "license",
    "licensing",
    "role",
    "vpn",
  ],
  Salesforce: ["sfdc", "salesforce", "crm"],
  Reports: [
    "report",
    "dashboard",
    "analytics",
    "data",
    "reporting",
  ],
  Integration: [
    "integration",
    "api",
    "sync",
    "connection",
    "apps not syncing",
    "platform integration",
  ],
  Hardware: [
    "hardware",
    "laptop",
    "computer",
    "device",
    "equipment",
    "configuration",
  ],
  Software: [
    "software",
    "platform",
    "application",
    "tool",
    "system slow",
    "freezing",
  ],
  Network: ["network", "internet", "connectivity"],
  "Data Management": [
    "data upload",
    "data transfer",
    "data management",
    "data cleanup",
    "import",
    "export",
  ],
  Documentation: [
    "documentation",
    "office docs",
    "templates",
    "manual",
    "guide",
  ],
  Procurement: [
    "procurement",
    "purchase",
    "billing",
    "licensing",
    "vendor",
  ],
};

export const categorizeTicket = (ticket: EnhancedParsedTicket): string => {
  // First check custom fields for more accurate categorization
  const requestDetail = ticket.customFields?.["TIE Request Detail"] || "";
  const workType = ticket.customFields?.["Work Type"] || "";
  const category = ticket.customFields?.Category || "";
  
  // Map TIE Request Detail to categories
  if (requestDetail) {
    if (requestDetail.includes("Email")) return "Email";
    if (requestDetail.includes("Phone") || requestDetail.includes("Voicemail")) return "Ring/Phone";
    if (requestDetail.includes("Office Docs") || requestDetail.includes("Templates")) return "Documentation";
    if (requestDetail.includes("Reports") || requestDetail.includes("Dashboards")) return "Reports";
    if (requestDetail.includes("Data Upload") || requestDetail.includes("Data Transfer")) return "Data Management";
    if (requestDetail.includes("Apps Not Syncing")) return "Integration";
    if (requestDetail.includes("System Slow") || requestDetail.includes("Freezing")) return "Software";
    if (requestDetail.includes("Login") || requestDetail.includes("VPN")) return "Security";
    if (requestDetail.includes("Purchase") || requestDetail.includes("Billing")) return "Procurement";
    if (requestDetail.includes("Hardware") || requestDetail.includes("Configuration")) return "Hardware";
    if (requestDetail.includes("Platform Integration")) return "Integration";
  }
  
  // Then check Work Type
  if (workType) {
    if (workType.includes("Data Management")) return "Data Management";
    if (workType.includes("Documentation")) return "Documentation";
    if (workType.includes("Reporting")) return "Reports";
    if (workType.includes("Communication")) return "Email";
    if (workType.includes("System")) return "Software";
  }
  
  // Fall back to keyword matching in ticket name and category
  const searchText = `${ticket.name} ${category}`.toLowerCase();

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => searchText.includes(keyword))) {
      return cat;
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
