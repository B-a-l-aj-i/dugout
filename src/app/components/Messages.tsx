"use client";

import React, { useState, useEffect } from "react";
import Card from "./Card";
import useSWR from "swr";
import { fetcher } from "@/utils/fetchUtils";
import { UserContext } from "@/context/user";
import SmoothDatePicker from "./DatePicker";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import SidebarFilter from "./Sidebar";
interface Member {
  real_name: string;
  name: string;
  id: string;
  is_bot: boolean;
  deleted: boolean;
}

interface MessagesProps {
  members: Member[];
}

const CHANNELID = process.env.NEXT_PUBLIC_DUGOUT_CHANNEL_ID!;

function Messages({ members }: MessagesProps) {
  const searchParams = useSearchParams();
  const [oldest, setOldest] = useState<number>(
    Math.floor(new Date().setHours(0, 0, 0, 0) / 1000),
  );
  const [latest, setLatest] = useState<number>(
    Math.floor(new Date().setHours(0, 0, 0, 0) / 1000 + 86399),
  );

  const { user } = UserContext();

  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const paramDate = new Date(dateParam);
      if (!isNaN(paramDate.getTime())) {
        const midnightTimestamp = Math.floor(paramDate.getTime() / 1000);
        setOldest(midnightTimestamp);
        setLatest(midnightTimestamp + 86399);
      }
    }
  }, [searchParams]);

  const selectedDay = (date: { oldest: number; latest: number }) => {
    setOldest(date.oldest);
    setLatest(date.latest);
  };

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/conversation-history?oldest=${oldest}&latest=${latest}`,
    fetcher,
    { refreshInterval: 60_000 },
  );

  const { data: channelMembersData } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/channel-members`,
    fetcher,
  );

  if (error) {
    return <div>error</div>;
  }

  if (isLoading) {
    return (
      <>
        <div className="z-90 sticky mx-auto hidden max-w-[55%] text-xs max-md:max-w-[100%]">
          <SmoothDatePicker getSelectedDay={selectedDay} />
        </div>
      </>
    );
  }

  const channelMemberIds = new Set<string>(channelMembersData?.members || []);

  const pendingUsers = members?.filter((user: Member) => {
    // Only include users who are members of the dugout channel
    if (channelMemberIds.size > 0 && !channelMemberIds.has(user.id)) {
      return false;
    }

    const hasNotSentMessages = !data?.messages?.find(
      (message: { user: string }) => message.user === user.id,
    );

    // Check if the user is not an admin, not "slackbot", not "aj", and not a bot
    const isNotAdmin = !process.env.NEXT_PUBLIC_ADMIN_USERS?.split(
      ",",
    ).includes(user.id);
    const isNotSlackbot = user.name !== "slackbot";
    const isNotAj = user.name !== "aj";
    const isDeleted = user.deleted === true;
    const isNotBot = user.is_bot === false;

    return (
      hasNotSentMessages &&
      isNotAdmin &&
      isNotSlackbot &&
      isNotAj &&
      isNotBot &&
      !isDeleted
    );
  });
  const userMessages =
    user === ""
      ? data?.messages
      : data?.messages?.filter((msg: { user: string }) => msg.user === user);

  return (
    <div className="flex">
      <div className="fixed z-50">
        <SidebarFilter
          members={members}
          pendingUsers={pendingUsers}
          isToday={(() => {
            const selected = new Date(oldest * 1000);
            const today = new Date();
            return (
              selected.getFullYear() === today.getFullYear() &&
              selected.getMonth() === today.getMonth() &&
              selected.getDate() === today.getDate()
            );
          })()}
        />
      </div>
      <div className="mx-auto max-w-[600px] pb-20 max-sm:mx-1 max-sm:max-w-[90vw]">
        {userMessages?.length > 0 ? (
          userMessages.map(
            (
              userInfo: {
                subtype: string;
                ts: string;
                user: string;
                text: string;
                reply_count: number;
                username: string;
                reactions: [];
                files: [];
                parent_user_id: string;
                attachments: [];
              },
              key: number,
            ) => (
              <div className="max-w-[600px]" key={key}>
                <Card
                  userInfo={userInfo}
                  channelId={CHANNELID}
                  replyCount={userInfo.reply_count || 0}
                />
              </div>
            ),
          )
        ) : (
          <div className="flex h-[50vh] w-full items-center justify-center">
            <Image
              width={200}
              height={200}
              alt="No Messages"
              src="/image.png"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
