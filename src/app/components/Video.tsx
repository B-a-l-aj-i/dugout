"use client";
import React, { useState } from "react";
import { Play } from "lucide-react";

function Video({ url_private }: { url_private: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="inline-flex cursor-pointer">
      <div
        className="relative inline-flex cursor-pointer rounded-lg object-cover shadow-md transition-transform"
        onClick={() => setIsOpen(true)}
      >
        <div className="absolute left-[40%] top-[35%] h-fit w-fit rounded-3xl bg-slate-100 bg-opacity-80 p-2">
          <Play width={20} height={20} />
        </div>
        <video width={200} height={200} className="rounded-lg">
          <source
            src={`/api/slack-image?media=${encodeURIComponent(url_private)}`}
            type="video/mp4"
          />
        </video>
      </div>

      {/* Fullscreen Video Modal */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
        >
          <div
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 cursor-pointer text-4xl font-bold text-white"
          >
            X
          </div>
          <video controls autoPlay className="max-h-[90vh] max-w-[90vw]">
            <source
              src={`/api/slack-image?media=${encodeURIComponent(url_private)}`}
              type="video/mp4"
            />
          </video>
        </div>
      )}
    </div>
  );
}

export default Video;
