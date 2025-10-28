import { Button } from "./ui/button";
import { Calendar } from "lucide-react";

export type DateRange = 30 | 90 | 180 | 365;

interface DateRangeSelectorProps {
  selected: DateRange;
  onChange: (range: DateRange) => void;
}

const RANGE_OPTIONS: { label: string; value: DateRange }[] = [
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
  { label: "6 Months", value: 180 },
  { label: "12 Months", value: 365 },
];

export const DateRangeSelector = ({ selected, onChange }: DateRangeSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground mr-2">Date Range:</span>
      <div className="flex gap-1">
        {RANGE_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={selected === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(option.value)}
            className="h-8"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
