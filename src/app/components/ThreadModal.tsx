"use client";

import { useState } from "react";
import ThreadMesssage from "./ThreadMesssage";
import { ChevronDown, ChevronRight } from "lucide-react";

function ThreadModal({
  channelId,
  timestamp,
  replyCount,
}: {
  channelId: string;
  timestamp: string;
  replyCount: number;
}) {
  const [open, setOpen] = useState(false);
  if (replyCount <= 0) return null;

  return (
    <>
      <p
        className="my-4 flex w-fit cursor-pointer items-center gap-2 rounded-lg text-sm text-blue-400 hover:text-blue-300"
        onClick={() => setOpen(!open)}
      >
        {!open && <ChevronRight className="text-black" size={18} />}
        {open && <ChevronDown className="text-black" size={18} />}
        {replyCount}
        {replyCount > 1 ? " Replies" : " Reply"}
      </p>

      {open && (
        <div>
          <ThreadMesssage
            limit={false}
            channelId={channelId}
            timestamp={timestamp}
          />
        </div>
      )}
    </>
  );
}
export default ThreadModal;
