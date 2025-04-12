"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fromYear = 1900,
  toYear = 2100,
  ...props
}) {
  const [currentMonth, setCurrentMonth] = React.useState(
    props.selected ? new Date(props.selected) : new Date()
  );

  // Update current month if the selected date changes
  React.useEffect(() => {
    if (props.selected) {
      setCurrentMonth(new Date(props.selected));
    }
  }, [props.selected]);

  const handleMonthChange = (month) => {
    setCurrentMonth(month);
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value, 10);
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    if (props.selected) {
      const updatedSelection = new Date(props.selected);
      updatedSelection.setFullYear(year);
      props.onSelect?.(updatedSelection);
    }
  };

  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  );

  // Navigation functions for the arrows
  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  // Custom Caption component that combines navigation arrows with the month and year select
  const CustomCaption = ({ displayMonth }) => {
    return (
      <div className="flex items-center justify-between w-full">
        <button
          onClick={handlePreviousMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0"
          )}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {displayMonth.toLocaleString("default", { month: "long" })}
          </span>
          <select
            value={displayMonth.getFullYear()}
            onChange={handleYearChange}
            className="cursor-pointer rounded-md bg-transparent py-1 px-2 text-sm font-medium border border-input hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-ring appearance-none min-w-[80px] text-center"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleNextMonth}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0"
          )}
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      month={currentMonth}
      onMonthChange={handleMonthChange}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: CustomCaption,
      }}
      {...props}
      numberOfMonths={1}
      fixedWeeks={true}
      styles={{
        root: { width: "100%" },
        months: { width: "100%" },
        month: { width: "100%" },
        table: { width: "100%", marginBottom: 0 },
        tbody: { display: "flex", flexDirection: "column", gap: "2px" },
        head: { height: "32px", marginBottom: "4px" },
        caption: {
          position: "relative",
          alignItems: "center",
          marginBottom: "8px",
        },
      }}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
