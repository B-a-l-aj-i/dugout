"use client";
import Reply from "./Reply";
import ThreadModal from "../components/ThreadModal";
import React, { useState } from "react";
import Message from "./Message";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";

interface ICardProps {
  userInfo: {
    subtype: string;
    ts: string;
    user: string;
    text: string;
    files: [];
    attachments: [];
  };
  channelId: string;
  replyCount: number;
}

function Card({ userInfo, channelId, replyCount }: ICardProps) {
  // console.log(userInfo?.files || "");
  const [click, setClick] = useState(false);

  function handleClick() {
    setClick((p) => !p);
  }
  const { data: session } = useSession();

  return (
    <div className="group relative my-3 rounded-lg p-4 max-sm:p-0">
      {session?.user && (
        <div className="absolute right-0 top-0 flex w-fit gap-3 rounded-md border px-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div>🔥</div>
          <div>👍</div>
          <div>👎</div>
          <div>✅</div>

          <TooltipProvider delayDuration={0.2}>
            <Tooltip>
              <TooltipTrigger>
                {/* ( */}
                <svg
                  onClick={handleClick}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-reply cursor-pointer"
                >
                  <polyline points="9 17 4 12 9 7" />
                  <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                </svg>
                {/* ) */}
              </TooltipTrigger>

              <TooltipContent>
                <p>Click to Reply</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      <div>
        <Message userInfo={userInfo} />
        <ThreadModal
          replyCount={replyCount}
          channelId={channelId}
          timestamp={userInfo?.ts}
        />
        <Reply click={click} timestamp={userInfo?.ts} />
      </div>
    </div>
  );
}

export default Card;
