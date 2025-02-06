// "use client";
import React from "react";
import Card from "./Card";
import Loading from "./Loading";
import useSWR from "swr";
import { fetcher } from "@/utils/fetchUtils";
import { UserContext } from "@/context/user";

const CHANNELID = "C089LA005S8";

function Messages() {
  const { user } = UserContext();

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/conversation-history`,
    fetcher,
  );

  if (error) {
    return <div>error</div>;
  }

  if (isLoading) {
    return <Loading />;
  }
  // "U08B1JE9KHB";

  return (
    <div>
      {data?.messages?.map(
        (
          userInfo: {
            subtype: string;
            ts: string;
            user: string;
            text: string;
            reply_count: number;
          },
          key: number,
        ) =>
          (userInfo.user == user && (
            <Card
              key={key}
              userInfo={userInfo}
              channelId={CHANNELID}
              replyCount={userInfo.reply_count || 0}
            />
          )) ||
          (user == "" && (
            <Card
              key={key}
              userInfo={userInfo}
              channelId={CHANNELID}
              replyCount={userInfo.reply_count || 0}
            />
          )),
      )}
    </div>
  );
}

export default Messages;
