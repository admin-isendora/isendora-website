import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  tempRange?: DateRange | undefined;
  onTempRangeChange?: (range: DateRange | undefined) => void;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  tempRange,
  onTempRangeChange,
  onSelect,
  ...props
}: CalendarProps) {
  // Track the first selected date for two-click range selection
  const [firstSelectedDate, setFirstSelectedDate] = React.useState<Date | undefined>();

  // Handle day click
  const handleDayClick = (day: Date | undefined) => {
    if (!day) return;

    if (!firstSelectedDate) {
      // First click - set the potential start date
      setFirstSelectedDate(day);
      if (onTempRangeChange) {
        onTempRangeChange({ from: day, to: undefined });
      }
    } else {
      // Second click - complete the range selection
      const range: DateRange = {
        from: firstSelectedDate < day ? firstSelectedDate : day,
        to: firstSelectedDate < day ? day : firstSelectedDate,
      };
      
      if (onSelect) {
        onSelect(range);
      }
      
      // Reset the first selected date
      setFirstSelectedDate(undefined);
      if (onTempRangeChange) {
        onTempRangeChange(undefined);
      }
    }
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors",
          "opacity-50 hover:opacity-100 disabled:opacity-30"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: cn(
          "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400"
        ),
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md [&:has([aria-selected])]:bg-gray-100 dark:[&:has([aria-selected])]:bg-gray-800 [&:has([aria-selected].day-outside)]:bg-gray-100/50 dark:[&:has([aria-selected].day-outside)]:bg-gray-800/50",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
        ),
        day: cn(
          "h-9 w-9 p-0 font-normal",
          "hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors",
          "aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: cn(
          "bg-gray-900 dark:bg-gray-50 text-gray-50 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-50 hover:text-gray-50 dark:hover:text-gray-900 focus:bg-gray-900 dark:focus:bg-gray-50 focus:text-gray-50 dark:focus:text-gray-900 rounded-md transition-colors"
        ),
        day_today: cn(
          "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-md transition-colors"
        ),
        day_outside: cn(
          "day-outside text-gray-500 opacity-50 dark:text-gray-400",
          "aria-selected:bg-gray-100/50 aria-selected:text-gray-500 aria-selected:opacity-30 dark:aria-selected:bg-gray-800/50 dark:aria-selected:text-gray-400"
        ),
        day_disabled: "text-gray-500 opacity-50 dark:text-gray-400",
        day_range_middle: cn(
          "aria-selected:bg-gray-100 aria-selected:text-gray-900 dark:aria-selected:bg-gray-800 dark:aria-selected:text-gray-50 rounded-md transition-colors"
        ),
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      selected={tempRange || selected}
      onDayClick={handleDayClick}
      mode="range"
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };