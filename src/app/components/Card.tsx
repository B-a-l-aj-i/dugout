"use client";
import Reply from "./Reply";
import ThreadModal from "../components/ThreadModal";
import React from "react";
import Message from "./Message";

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

  return (
    <div className="mx-auto w-[90%] max-w-xl rounded-lg p-4">
      <Message userInfo={userInfo} />
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
