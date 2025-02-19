import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  getSelectedDay: (date: { oldest: number; latest: number }) => void;
}

const SmoothDatePicker: React.FC<DatePickerProps> = ({ getSelectedDay }) => {
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Generate past 30 days including today
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i)); // 29 days ago up to today
    date.setHours(0, 0, 0, 0); // Reset to start of day

    return {
      formatted: date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      date: date.getDate(),
      timestamp: Math.floor(date.getTime() / 1000), // Midnight UNIX timestamp (seconds)
      oldest: Math.floor(date.getTime() / 1000),
      latest: Math.floor(date.getTime() / 1000) + 86399, // 11:59 PM
      isToday: date.toDateString() === new Date().toDateString(),
    };
  });

  // Scroll to today's date on mount
  useEffect(() => {
    const datePicker = datePickerRef.current;
    if (datePicker) {
      const lastIndex = dates.length - 1; // Today's index
      const scrollPosition = lastIndex * 100;
      datePicker.scrollTo({ left: scrollPosition, behavior: "smooth" });
      setSelectedDate(dates[lastIndex].timestamp);
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

  return (
    <div className="flex w-full items-center justify-center gap-3 py-1 max-sm:p-0 max-sm:text-xs">
      {/* Previous Week Button */}
      <button onClick={scrollToPreviousWeek}>
        <ChevronLeft size={20} />
      </button>

      {/* Date Picker */}
      <div
        ref={datePickerRef}
        className="bg-muted flex w-full gap-3 overflow-x-auto scroll-smooth rounded-lg p-2 shadow-md max-sm:p-1"
      >
        {dates.map((date, index) => (
          <div
            key={index}
            onClick={() => {
              getSelectedDay(date);
              setSelectedDate(date.date);
            }}
            className={`flex min-w-fit cursor-pointer flex-col items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition-all max-sm:p-1 ${
              selectedDate === date.date
                ? "scale-105 bg-black text-white shadow-lg" // Selected date styling
                : date.isToday
                  ? "bg-blue-500 text-white hover:bg-blue-600" // Today's date styling
                  : "bg-white text-gray-700 hover:bg-gray-100" // Default styling
            }`}
          >
            {date.formatted}
          </div>
        ))}
      </div>

      {/* Next Week Button */}
      <button onClick={scrollToNextWeek}>
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default SmoothDatePicker;
