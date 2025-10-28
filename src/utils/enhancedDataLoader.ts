import { ParsedTicket } from "./asanaJsonParser";

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

export interface EnhancedParsedTicket extends ParsedTicket {
  automationStage: string | null;
  ticketAge: number;
  isOpen: boolean;
}

const calculateResponseTime = (createdAt: string, modifiedAt?: string): number | null => {
  if (!createdAt || !modifiedAt) return null;
  
  const created = new Date(createdAt);
  const modified = new Date(modifiedAt);
  
  if (isNaN(created.getTime()) || isNaN(modified.getTime())) return null;
  
  const diffMs = modified.getTime() - created.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return diffHours >= 0 ? diffHours : null;
};

const calculateTicketAge = (createdAt: string, completedAt?: string | null): number => {
  const created = new Date(createdAt);
  const reference = completedAt ? new Date(completedAt) : new Date();
  
  if (isNaN(created.getTime())) return 0;
  
  const diffMs = reference.getTime() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  return diffDays >= 0 ? diffDays : 0;
};

export const parseEnhancedAsanaJSON = (jsonData: AsanaResponse): EnhancedParsedTicket[] => {
  const tickets: EnhancedParsedTicket[] = [];
  
  jsonData.data.forEach((task) => {
    if (!task.created_at) return;
    
    // Find automation stage from custom fields
    let automationStage: string | null = null;
    if (task.custom_fields) {
      const virtualAssistant = task.custom_fields.find(
        (field) => field.name === "Virtual Assistant"
      );
      if (virtualAssistant && virtualAssistant.enum_value) {
        automationStage = virtualAssistant.enum_value.name;
      }
    }
    
    const responseTime = calculateResponseTime(task.created_at, task.modified_at);
    const ticketAge = calculateTicketAge(task.created_at, task.completed_at);
    const isOpen = !task.completed_at;
    
    tickets.push({
      id: task.gid,
      name: task.name || "Untitled Task",
      createdAt: task.created_at,
      modifiedAt: task.modified_at || task.created_at,
      completedAt: task.completed_at || null,
      assignee: task.assignee?.name || "Unassigned",
      responseTimeHours: responseTime,
      automationStage,
      ticketAge,
      isOpen,
    });
  });
  
  return tickets;
};

const loadTIEData = async () => {
  const [
    jan, feb, mar, apr, may, jun, jul, aug, sep, oct
  ] = await Promise.all([
    import("@/data/tie-2025-01.json"),
    import("@/data/tie-2025-02.json"),
    import("@/data/tie-2025-03.json"),
    import("@/data/tie-2025-04.json"),
    import("@/data/tie-2025-05.json"),
    import("@/data/tie-2025-06.json"),
    import("@/data/tie-2025-07.json"),
    import("@/data/tie-2025-08.json"),
    import("@/data/tie-2025-09.json"),
    import("@/data/tie-2025-10.json"),
  ]);
  
  return [jan, feb, mar, apr, may, jun, jul, aug, sep, oct];
};

const loadSFDCData = async () => {
  const [
    jan, feb, mar, apr, may, jun, jul, aug, sep, oct
  ] = await Promise.all([
    import("@/data/sfdc-2025-01.json"),
    import("@/data/sfdc-2025-02.json"),
    import("@/data/sfdc-2025-03.json"),
    import("@/data/sfdc-2025-04.json"),
    import("@/data/sfdc-2025-05.json"),
    import("@/data/sfdc-2025-06.json"),
    import("@/data/sfdc-2025-07.json"),
    import("@/data/sfdc-2025-08.json"),
    import("@/data/sfdc-2025-09.json"),
    import("@/data/sfdc-2025-10.json"),
  ]);
  
  return [jan, feb, mar, apr, may, jun, jul, aug, sep, oct];
};

export const loadEnhancedData = async (board: "TIE" | "SFDC"): Promise<EnhancedParsedTicket[]> => {
  const dataFiles = board === "TIE" ? await loadTIEData() : await loadSFDCData();
  
  const allTickets: EnhancedParsedTicket[] = [];
  
  dataFiles.forEach((file) => {
    const parsed = parseEnhancedAsanaJSON(file.default || file);
    allTickets.push(...parsed);
  });
  
  return allTickets;
};
