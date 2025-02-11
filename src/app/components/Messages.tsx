"use client";
import React from "react";
import Card from "./Card";
import Loading from "./Loading";
import useSWR from "swr";
import { fetcher } from "@/utils/fetchUtils";
import { UserContext } from "@/context/user";
import { formatTimestamp } from "./UserDetails";
import Day from "./Day";

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

  function ts(t: number) {
    return formatTimestamp(t).split(" ").splice(1).join(" ");
  }
  console.log(data?.messages);

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
            files: [];
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
            <div key={key}>
              {(key == 0 ||
                (key > 0 &&
                  ts(Number(userInfo.ts)) !=
                    ts(data?.messages[key - 1].ts))) && (
                <Day timestamp={userInfo.ts} />
              )}
              <Card
                userInfo={userInfo}
                channelId={CHANNELID}
                replyCount={userInfo.reply_count || 0}
              />
            </div>
          )),
      )}
    </div>
  );
}

export default Messages;
