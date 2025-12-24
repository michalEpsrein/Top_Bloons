import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { cn } from "@/lib/utils";

type DateRangeFilterProps = {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onClear: () => void;
};

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: DateRangeFilterProps) {
  const hasFilter = startDate || endDate;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-right font-normal",
              startDate && "text-gray-900"
            )}
          >
            <CalendarIcon className="ml-2 h-4 w-4" />
            {startDate
              ? format(startDate, "dd/MM/yyyy", { locale: he })
              : "מתאריך"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate ?? undefined}
            onSelect={onStartDateChange}
            initialFocus
            locale={he}
          />
        </PopoverContent>
      </Popover>

      <span className="text-gray-400">-</span>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-right font-normal",
              endDate && "text-gray-900"
            )}
          >
            <CalendarIcon className="ml-2 h-4 w-4" />
            {endDate
              ? format(endDate, "dd/MM/yyyy", { locale: he })
              : "עד תאריך"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate ?? undefined}
            onSelect={onEndDateChange}
            initialFocus
            locale={he}
          />
        </PopoverContent>
      </Popover>

      {hasFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4 ml-1" />
          נקה
        </Button>
      )}
    </div>
  );
}
