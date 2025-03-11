"use client";
import React, { useState } from "react";
import Card from "./Card";
import Loading from "./Loading";
import useSWR from "swr";
import { fetcher } from "@/utils/fetchUtils";
import { UserContext } from "@/context/user";
import SmoothDatePicker from "./DatePicker";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// import { formatTimestamp } from "./UserDetails";
// import Day from "./Day";
interface Member {
  real_name: string;
  name: string;
  id: string;
  is_bot: boolean;
}

interface MessagesProps {
  members: Member[];
}

const CHANNELID = "C089LA005S8";

function Messages({ members }: MessagesProps) {
  const [oldest, setOldest] = useState<number>(
    Math.floor(new Date().setHours(0, 0, 0, 0) / 1000),
  );
  const [latest, setLatest] = useState<number>(
    Math.floor(new Date().setHours(0, 0, 0, 0) / 1000 + 86399),
  );

  const { user } = UserContext();

  const selectedDay = (date: { oldest: number; latest: number }) => {
    setOldest(date.oldest);
    setLatest(date.latest);
  };

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/conversation-history?oldest=${oldest}&latest=${latest}`,
    fetcher,
  );

  if (error) {
    return <div>error</div>;
  }

  if (isLoading) {
    return (
      <>
        <div className="z-90 sticky mx-auto max-w-[55%] text-xs max-md:max-w-[100%]">
          <SmoothDatePicker getSelectedDay={selectedDay} />
        </div>
        <Loading />
      </>
    );
  }
  // "U08B1JE9KHB";

  // function ts(t: number) {
  //   return formatTimestamp(t).split(" ").splice(1).join(" ");
  // }
  // console.log(data?.messages);
  // console.log(user);

  return (
    <>
      <div className="z-90 sticky mx-auto max-w-[55%] text-xs max-md:max-w-[100%]">
        <SmoothDatePicker getSelectedDay={selectedDay} />
      </div>

      {/* <pre> {JSON.stringify(selectedDate)}</pre> */}
      <div className="mx-auto max-w-[55%] pb-20 max-md:max-w-[100%]">
        <div>
          <Alert>
            <AlertTitle className="text-sm font-bold">Pending Users</AlertTitle>
            <div>
              {members?.map(
                (
                  user: {
                    real_name: string;
                    name: string;
                    id: string;
                    is_bot: boolean;
                  },
                  key: number,
                ) => {
                  if (
                    !data?.messages?.find(
                      (message: { user: string }) => message.user == user.id,
                    )
                  ) {
                    if (
                      user.id != process.env.ADMIN_USERS &&
                      user.name != "slackbot" &&
                      user.name != "aj" &&
                      user.is_bot == false
                    ) {
                      return (
                        <AlertDescription
                          className="inline-flex items-center gap-2 px-2 py-2"
                          key={key}
                        >
                          <span className="rounded-2xl bg-gray-100 px-2 py-1 text-orange-500">
                            {user?.real_name || user?.name}
                            {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
                          </span>
                        </AlertDescription>
                      );
                    }
                  }
                },
              )}
            </div>
            {/* <button>notify</button> */}
          </Alert>
        </div>
        {/* <Day timestamp={day} /> */}
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
        {data?.messages?.map(
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
          ) =>
            (userInfo.user == user && (
              <div key={key}>
                <Card
                  userInfo={userInfo}
                  channelId={CHANNELID}
                  replyCount={userInfo.reply_count || 0}
                />
              </div>
            )) ||
            (user == "" && (
              <div key={key}>
                {/* {(key == 0 ||
                  (key > 0 &&
                    ts(Number(userInfo.ts)) !=
                      ts(data?.messages[key - 1].ts))) && (
                  <Day timestamp={userInfo.ts} />
                )} */}
                <Card
                  userInfo={userInfo}
                  channelId={CHANNELID}
                  replyCount={userInfo.reply_count || 0}
                />
              </div>
            )),
        )}
      </div>
      {data?.messages?.length == 0 && (
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Image width={200} height={200} alt="NO MESSSAGES" src="/image.png" />
        </div>
      )}
    </>
  );
}

export default Messages;
