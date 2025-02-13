import React from "react";
import { formatTimestamp } from "./UserDetails";

function day(timestamp) {
  const formattedDate = formatTimestamp(timestamp)
    .split(" ")
    .splice(1)
    .join(" ");

  const today = new Date();
  const todayFormatted = formatTimestamp(today.getTime() / 1000)
    .split(" ")
    .splice(1)
    .join(" ");

  return formattedDate === todayFormatted ? "Today" : formattedDate;
}

function Day({ timestamp }) {
  return (
    <div className="mx-auto my-2 max-w-fit rounded-xl border px-3 py-1 text-center text-[12px]">
      {day(timestamp)}
    </div>
  );
}
export default Day;
