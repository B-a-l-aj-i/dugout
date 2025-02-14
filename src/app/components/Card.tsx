"use client";
import ThreadModal from "../components/ThreadModal";
import UserDetails from "./UserDetails";
import BotDetails from "./BotDetails";
import Reply from "./Reply";
import Img from "./Img";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown
import remarkEmoji from "remark-emoji";

interface ICardProps {
  userInfo: {
    subtype: string;
    ts: string;
    user: string;
    text: string;
    files: [];
  };
  channelId: string;
  replyCount: number;
}

function Card({ userInfo, channelId, replyCount }: ICardProps) {
  // console.log(userInfo?.files || "");

  return (
    <div className="mx-auto w-[90%] max-w-xl rounded-lg p-4">
      <div className="flex-row gap-3">
        {(userInfo?.subtype == "bot_message" && (
          <BotDetails userInfo={userInfo} />
        )) || <UserDetails userId={userInfo?.user} timestamp={userInfo?.ts} />}
      </div>
      <div>
        <pre className="overflow-auto whitespace-pre-wrap font-sans">
          <ReactMarkdown
            components={{
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              a: ({ node, ...props }) => (
                <a {...props} className="text-blue-500 hover:underline" />
              ),
            }}
            remarkPlugins={[remarkGfm, remarkEmoji]}
          >
            {userInfo?.text}
          </ReactMarkdown>
        </pre>
      </div>

      <div>
        {userInfo?.files?.map((image: { url_private: string }, key) => {
          return <Img key={key} url_private={image?.url_private} />;
        })}
      </div>

      <ThreadModal
        replyCount={replyCount}
        channelId={channelId}
        timestamp={userInfo?.ts}
      />
      <Reply timestamp={userInfo?.ts} />
    </div>
  );
}

export default Card;
