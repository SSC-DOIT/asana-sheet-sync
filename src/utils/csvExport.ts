import { EnhancedParsedTicket } from "./enhancedDataLoader";

/**
 * Escapes CSV field values that contain special characters
 */
function escapeCsvField(value: any): string {
  if (value === null || value === undefined) return "";

  const stringValue = String(value);

  // If the field contains comma, quote, or newline, wrap it in quotes
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    // Escape existing quotes by doubling them
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Converts an array of objects to CSV format
 */
function convertToCSV(data: any[], headers: string[]): string {
  const headerRow = headers.map(escapeCsvField).join(",");

  const dataRows = data.map((row) => {
    return headers.map((header) => escapeCsvField(row[header])).join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Triggers a download of the CSV file
 */
function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Exports ticket data to CSV format
 */
export function exportTicketsToCSV(
  tickets: EnhancedParsedTicket[],
  filename: string = "tickets.csv"
): void {
  if (tickets.length === 0) {
    console.warn("No tickets to export");
    return;
  }

  // Prepare data for export
  const exportData = tickets.map((ticket) => ({
    ID: ticket.id,
    Name: ticket.name,
    "Created At": new Date(ticket.createdAt).toLocaleString(),
    "Modified At": new Date(ticket.modifiedAt).toLocaleString(),
    "Completed At": ticket.completedAt
      ? new Date(ticket.completedAt).toLocaleString()
      : "",
    Assignee: ticket.assignee,
    "Response Time (hours)": ticket.responseTimeHours?.toFixed(2) || "",
    "Ticket Age (days)": ticket.ticketAge.toFixed(1),
    Status: ticket.isOpen ? "Open" : "Closed",
    "Automation Stage": ticket.automationStage || "",
    Priority: ticket.customFields?.Priority || "",
    Category: ticket.customFields?.Category || "",
    "Work Type": ticket.customFields?.["Work Type"] || "",
    Department: ticket.customFields?.Department || "",
    Effort: ticket.customFields?.Effort || "",
    "TIE Request Detail": ticket.customFields?.["TIE Request Detail"] || "",
    Summary: ticket.summary || "",
  }));

  const headers = [
    "ID",
    "Name",
    "Created At",
    "Modified At",
    "Completed At",
    "Assignee",
    "Response Time (hours)",
    "Ticket Age (days)",
    "Status",
    "Automation Stage",
    "Priority",
    "Category",
    "Work Type",
    "Department",
    "Effort",
    "TIE Request Detail",
    "Summary",
  ];

  const csv = convertToCSV(exportData, headers);
  downloadCSV(csv, filename);
}

/**
 * Exports generic table data to CSV
 */
export function exportTableToCSV(
  data: any[],
  headers: string[],
  filename: string = "export.csv"
): void {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const csv = convertToCSV(data, headers);
  downloadCSV(csv, filename);
}
