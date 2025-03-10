import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  getSelectedDay: (date: { oldest: number; latest: number }) => void;
}

const SmoothDatePicker: React.FC<DatePickerProps> = ({ getSelectedDay }) => {
  const [date, setDate] = useState<Date>();
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Generate past 30 days including today
  const currentYear = new Date().getFullYear(); // Get the current year
  const startOfYear = new Date(currentYear, 0, 1); // January 1st of the current year
  const today = new Date(); // Today's date

  // Calculate the number of days between January 1st and today
  const totalDays = Math.floor(
    (today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Generate dates from January 1st to today
  const dates = Array.from({ length: totalDays + 1 }, (_, i) => {
    const date = new Date(startOfYear);
    date.setDate(date.getDate() + i); // Increment by `i` days
    date.setHours(0, 0, 0, 0); // Reset to start of day

    return {
      formatted: date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      date: date.getDate(),
      month: date.getMonth(),
      timestamp: Math.floor(date.getTime() / 1000), // Midnight UNIX timestamp (seconds)
      oldest: Math.floor(date.getTime() / 1000),
      latest: Math.floor(date.getTime() / 1000) + 86399, // 11:59 PM
      isToday: date.toDateString() === new Date().toDateString(),
      isMonday: date.getDay() === 1, // Check if the date is a Monday
    };
  });

  // Scroll to today's date on mount
  useEffect(() => {
    const datePicker = datePickerRef.current;
    if (datePicker) {
      const lastIndex = dates.length - 1; // Today's index
      const scrollPosition = lastIndex * 100;
      datePicker.scrollTo({ left: scrollPosition, behavior: "smooth" });
      setSelectedDate(dates[lastIndex].date);
      setSelectedMonth(dates[lastIndex].month);
      getSelectedDay(dates[lastIndex]); // Automatically set today's date
    }
  }, []);

  // Scroll functions
  const scrollToNextWeek = () => {
    datePickerRef.current?.scrollBy({ left: 700, behavior: "smooth" });
  };

  const scrollToPreviousWeek = () => {
    datePickerRef.current?.scrollBy({ left: -700, behavior: "smooth" });
  };

  // Handle date selection from shadcn Calendar
  const handleCalendarDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);

      const midnightTimestamp = Math.floor(selectedDate.getTime() / 1000);
      const endOfDayTimestamp = midnightTimestamp + 86399;

      const formattedDate = {
        oldest: midnightTimestamp,
        latest: endOfDayTimestamp,
      };

      getSelectedDay(formattedDate);

      // Find if selectedDate exists in dates array
      const selectedIndex = dates.findIndex(
        (d) =>
          d.date === selectedDate.getDate() &&
          d.month === selectedDate.getMonth() &&
          d.isToday === (d.date === new Date().getDate()),
      );

      if (selectedIndex !== -1) {
        // Scroll to selected date and center it
        const datePicker = datePickerRef.current;
        if (datePicker) {
          const itemWidth = 90;
          const scrollPosition =
            selectedIndex * itemWidth -
            datePicker.clientWidth / 2 +
            itemWidth / 2;

          datePicker.scrollTo({ left: scrollPosition, behavior: "smooth" });
        }
        setSelectedDate(selectedDate.getDate());
        setSelectedMonth(selectedDate.getMonth());
      } else {
        alert("Selected date is outside the current range.");
        console.warn("Selected date is outside the current range.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-white py-1 pr-2 max-md:w-[100%] max-md:flex-col max-md:py-1">
      {/* Previous Week Button */}
      <>
        <button
          onClick={scrollToPreviousWeek}
          className="transition-transform hover:scale-150 max-md:hidden"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        {/* Date Picker */}
        <div
          ref={datePickerRef}
          className="flex max-w-[100%] gap-3 overflow-x-auto scroll-smooth rounded-lg bg-white p-2 shadow-sm"
        >
          {dates.map((date, index) => (
            <div
              key={index}
              onClick={() => {
                getSelectedDay(date);
                setSelectedDate(date.date);
                setSelectedMonth(date.month);
              }}
              className={`flex min-w-fit cursor-pointer flex-col items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all max-sm:p-1 ${
                selectedDate === date.date && selectedMonth === date.month
                  ? "bg-blue-600 text-white shadow-md"
                  : date.isMonday
                    ? "bg-green-100 text-green-600 hover:bg-green-200"
                    : date.isToday
                      ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-xs font-semibold uppercase">
                {date.formatted.split(",")[0]} {/* Weekday */}
              </span>
              <span className="text-sm font-bold">
                {date.formatted.split(",")[1].trim()} {/* Date */}
              </span>
            </div>
          ))}
        </div>

        {/* Next Week Button */}
        <button
          onClick={scrollToNextWeek}
          className="transition-transform hover:scale-150 max-md:hidden"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      </>
      <div className="py-2">
        {/* Shadcn Calendar Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[150px] justify-start text-left text-xs font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleCalendarDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default SmoothDatePicker;
