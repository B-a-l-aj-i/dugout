import React from "react";
export default function Loading() {
  return (
    <div className="flex items-center justify-center space-x-2 bg-white">
      <span className="sr-only">Loading...</span>
      <div className="h-3 w-3 animate-bounce rounded-full bg-black [animation-delay:-0.3s]"></div>
      <div className="h-3 w-3 animate-bounce rounded-full bg-black [animation-delay:-0.15s]"></div>
      <div className="h-3 w-3 animate-bounce rounded-full bg-black"></div>
    </div>
  );
}
