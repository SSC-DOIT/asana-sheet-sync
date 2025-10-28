import { Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EnhancedParsedTicket } from "@/utils/enhancedDataLoader";
import { extractDepartments } from "@/utils/departmentAnalytics";

interface DepartmentSelectorProps {
  tickets: EnhancedParsedTicket[];
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
}

export const DepartmentSelector = ({
  tickets,
  selectedDepartment,
  onDepartmentChange,
}: DepartmentSelectorProps) => {
  const departments = extractDepartments(tickets);
  
  const getDepartmentTicketCount = (dept: string) => {
    return tickets.filter((t) => t.isOpen && t.customFields?.Department === dept).length;
  };

  return (
    <div className="flex items-center gap-3">
      <Building2 className="w-5 h-5 text-muted-foreground" />
      <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select a department" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectItem value="All Departments">
            All Departments ({tickets.filter((t) => t.isOpen).length} tickets)
          </SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept} ({getDepartmentTicketCount(dept)} tickets)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
