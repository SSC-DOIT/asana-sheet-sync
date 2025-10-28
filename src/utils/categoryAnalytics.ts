import { EnhancedParsedTicket } from "./enhancedDataLoader";

export interface CategoryData {
  category: string;
  closedCount: number;
  openCount: number;
  totalCount: number;
  description?: string;
}

// Category descriptions
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Email: "Email-related issues including Outlook configuration, sending/receiving problems, group lists, and mailbox setup. These tickets typically involve communication platform troubleshooting.",
  Password: "Password resets, login credential issues, and authentication problems. This includes account lockouts and credential management requests.",
  "Ring/Phone": "Phone system tickets including Ring Central, VoIP configuration, call quality issues, and voicemail setup. These involve telephony infrastructure and communication tools.",
  Security: "Security permissions, access controls, VPN configuration, and license management. These tickets ensure proper access levels and data protection.",
  Salesforce: "Salesforce CRM platform issues, configuration changes, and workflow customization. This includes SFDC-specific enhancements and troubleshooting.",
  Reports: "Report generation, dashboard creation, analytics configuration, and data visualization requests. These tickets involve business intelligence and reporting tools.",
  Integration: "API connections, third-party app synchronization, platform integrations, and data flow issues. These tickets ensure systems communicate properly with each other.",
  Hardware: "Physical equipment including laptops, computers, peripherals, and device configuration. This covers hardware procurement, setup, and troubleshooting.",
  Software: "Software applications, platform performance, system slowness, and application freezing issues. These tickets address software functionality and performance problems.",
  Network: "Network connectivity, internet access, WiFi issues, and infrastructure problems. This includes network configuration and connectivity troubleshooting.",
  "Data Management": "Data uploads, transfers, imports, exports, and data cleanup operations. These tickets involve moving and managing data across systems.",
  Documentation: "Documentation creation, office document templates, manuals, and guide development. This includes knowledge base and process documentation.",
  Procurement: "Purchasing requests, billing inquiries, vendor management, and licensing procurement. These tickets involve acquiring software, hardware, and services.",
  Training: "User training sessions, onboarding support, educational materials, and learning resources. This includes new hire technology orientation and skill development.",
  "User Management": "User account creation, profile updates, provisioning, deactivation, and account management. These tickets handle employee lifecycle technology needs.",
  Printer: "Printer setup, configuration, troubleshooting, scanning, and fax functionality. This covers all document printing and scanning equipment.",
  "Mobile Device": "Mobile phone setup, iPad configuration, Android device management, and mobile app support. This includes mobile device management and troubleshooting.",
  Backup: "Data backup configuration, file restoration, disaster recovery, and archival processes. These tickets ensure data protection and recovery capabilities.",
  Automation: "Workflow automation, scripting, macro creation, and process optimization. This includes automating repetitive tasks and improving efficiency.",
  Other: "Miscellaneous requests that don't fit standard categories. These tickets may involve unique situations or emerging technology needs.",
};

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
  Network: ["network", "internet", "connectivity", "wifi"],
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
  Training: [
    "training",
    "onboarding",
    "instruction",
    "learning",
    "education",
  ],
  "User Management": [
    "user",
    "account",
    "profile",
    "provisioning",
    "deactivate",
    "activate",
  ],
  Printer: [
    "printer",
    "print",
    "scanner",
    "fax",
  ],
  "Mobile Device": [
    "mobile",
    "iphone",
    "ipad",
    "android",
    "tablet",
  ],
  Backup: [
    "backup",
    "restore",
    "recovery",
    "archive",
  ],
  Automation: [
    "automation",
    "workflow",
    "script",
    "macro",
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
    if (requestDetail.includes("Training")) return "Training";
    if (requestDetail.includes("User") || requestDetail.includes("Account")) return "User Management";
    if (requestDetail.includes("Printer")) return "Printer";
    if (requestDetail.includes("Mobile") || requestDetail.includes("iPad") || requestDetail.includes("iPhone")) return "Mobile Device";
    if (requestDetail.includes("Backup") || requestDetail.includes("Restore")) return "Backup";
  }
  
  // Then check Work Type
  if (workType) {
    if (workType.includes("Data Management")) return "Data Management";
    if (workType.includes("Documentation")) return "Documentation";
    if (workType.includes("Reporting")) return "Reports";
    if (workType.includes("Communication")) return "Email";
    if (workType.includes("System")) return "Software";
    if (workType.includes("Training")) return "Training";
    if (workType.includes("Automation")) return "Automation";
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
        description: CATEGORY_DESCRIPTIONS[category] || "",
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
