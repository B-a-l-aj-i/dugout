"use client";

import React, { useEffect, useRef, useState } from "react";
// import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";

interface DatePickerProps {
  getSelectedDay: (date: { oldest: number; latest: number }) => void;
}

const SmoothDatePicker: React.FC<DatePickerProps> = ({ getSelectedDay }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const [date, setDate] = useState<Date>();
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Generate past 30 days including today
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const today = new Date();

  const totalDays = Math.floor(
    (today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24),
  );

  const dates = Array.from({ length: totalDays + 1 }, (_, i) => {
    const date = new Date(startOfYear);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);

    return {
      formatted: date.toLocaleDateString("en-US", {
        weekday: "narrow",
        day: "numeric",
        month: "short",
      }),
      date: date.getDate(),
      month: date.getMonth(),
      timestamp: Math.floor(date.getTime() / 1000),
      oldest: Math.floor(date.getTime() / 1000),
      latest: Math.floor(date.getTime() / 1000) + 86399,
      isToday: date.toDateString() === new Date().toDateString(),
      isMonday: date.getDay() === 1,
    };
  });

  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      // Parse the date string from URL (yyyy-MM-dd format)
      const paramDate = new Date(dateParam);
      if (!isNaN(paramDate.getTime())) {
        handleCalendarDateSelect(paramDate);
      } else {
        // If invalid date format, default to today
        handleCalendarDateSelect(new Date());
      }
    } else {
      // If no date param, default to today's date
      handleCalendarDateSelect(new Date());
    }
  }, []);

  // const scrollToNextWeek = () => {
  //   datePickerRef.current?.scrollBy({ left: 700, behavior: "smooth" });
  // };

  // const scrollToPreviousWeek = () => {
  //   datePickerRef.current?.scrollBy({ left: -700, behavior: "smooth" });
  // };

  const handleCalendarDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // setDate(selectedDate);

      const midnightTimestamp = Math.floor(selectedDate.getTime() / 1000);
      const endOfDayTimestamp = midnightTimestamp + 86399;

      const formattedDate = {
        oldest: midnightTimestamp,
        latest: endOfDayTimestamp,
      };

      getSelectedDay(formattedDate);

      // Update URL with selected date in readable format
      const params = new URLSearchParams(searchParams.toString());
      params.set("date", format(selectedDate, "yyyy-MM-dd"));
      router.push(`?${params.toString()}`);

      const selectedIndex = dates.findIndex(
        (d) =>
          d.date === selectedDate.getDate() &&
          d.month === selectedDate.getMonth() &&
          d.isToday === (d.date === new Date().getDate()),
      );

      if (selectedIndex !== -1) {
        const datePicker = datePickerRef.current;
        if (datePicker) {
          const itemWidth = 90;
          const scrollPosition =
            selectedIndex * itemWidth -
            datePicker.clientWidth / 2 +
            itemWidth / 2;

          datePicker.scrollTo({ left: scrollPosition, behavior: "instant" });
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
    <div className="h-16 max-w-[590px] flex-shrink-0 bg-white max-md:max-w-[80vw]">
      <>
        <div
          ref={datePickerRef}
          className="flex items-center justify-start gap-3 overflow-x-auto scroll-smooth rounded-lg bg-white max-md:p-0 max-sm:gap-[10px]"
        >
          {dates.map((date, index) => {
            const currentDate = new Date(date.timestamp * 1000);
            return (
              <div
                key={index}
                onClick={() => {
                  getSelectedDay(date);
                  setSelectedDate(date.date);
                  setSelectedMonth(date.month);

                  // Update URL with readable date format
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("date", format(currentDate, "yyyy-MM-dd"));
                  router.push(`?${params.toString()}`);
                }}
                className={`flex min-h-14 min-w-[72px] cursor-pointer flex-col items-center justify-center gap-[6px] rounded-lg text-[17px] transition-all max-sm:p-1`}
              >
                <span className="text-sm font-semibold uppercase text-slate-500">
                  {date.formatted.split(",")[0]}
                </span>
                <span
                  className={`flex h-9 w-9 justify-center gap-2 rounded-full px-[7px] py-2 align-middle text-[17px] font-medium tracking-wide ${
                    selectedDate === date.date && selectedMonth === date.month
                      ? "bg-[#FF3C00] text-white"
                      : ""
                  }`}
                >
                  {date.formatted.split(" ")[2].trim()}
                </span>
              </div>
            );
          })}
        </div>
      </>
    </div>
  );
};

export default SmoothDatePicker;
