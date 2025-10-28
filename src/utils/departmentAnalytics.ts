import { EnhancedParsedTicket } from "./enhancedDataLoader";

export interface DepartmentStats {
  totalOpen: number;
  aged: number;
  critical: number;
  averageAge: number;
}

export const extractDepartments = (tickets: EnhancedParsedTicket[]): string[] => {
  const departments = new Set<string>();
  
  tickets.forEach((ticket) => {
    const dept = ticket.customFields?.Department;
    if (dept && dept.trim()) {
      departments.add(dept);
    }
  });
  
  return Array.from(departments).sort();
};

export const filterByDepartment = (
  tickets: EnhancedParsedTicket[],
  department: string
): EnhancedParsedTicket[] => {
  if (department === "All Departments") {
    return tickets.filter((t) => t.isOpen);
  }
  
  return tickets.filter((ticket) => {
    const ticketDept = ticket.customFields?.Department;
    return ticket.isOpen && ticketDept === department;
  });
};

export const getDepartmentStats = (
  tickets: EnhancedParsedTicket[],
  department: string
): DepartmentStats => {
  const filteredTickets = filterByDepartment(tickets, department);
  
  const aged = filteredTickets.filter((t) => t.ticketAge > 14).length;
  const critical = filteredTickets.filter((t) => t.ticketAge > 30).length;
  
  const averageAge =
    filteredTickets.length > 0
      ? filteredTickets.reduce((sum, t) => sum + t.ticketAge, 0) / filteredTickets.length
      : 0;
  
  return {
    totalOpen: filteredTickets.length,
    aged,
    critical,
    averageAge: Math.round(averageAge * 100) / 100,
  };
};
