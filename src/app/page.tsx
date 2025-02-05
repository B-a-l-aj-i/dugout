"use client";

import Header from "@/app/components/Header";
import Card from "@/app/components/Card";
import useSWR from "swr";
import { SendMessage } from "./components/SendMessage";
// import SlackEventsPage from "./components/realtime";
import { useSession } from "next-auth/react";

const CHANNELID = "C089LA005S8";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Slack data");
  return res.json();
};

export default function App() {
  // const response = await fetch(
  //   `http://localhost:3000/api/conversation-history`,
  //   {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ channel: CHANNELID }),
  //   },
  // );

  const { data } = useSWR("/api/conversation-history", fetcher);
  const session = useSession();

  return (
    <>
      <Header user={session?.user} />
      {/* <pre>{JSON.stringify(session?.user, null, 2)}</pre> */}
      {session?.user && <SendMessage user={session?.user} />}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {/* <SlackEventsPage /> */}

      {data?.messages?.map(
        (userInfo, key: number) => (
          // userInfo.subtype == "bot_message" &&
          // !userInfo.subtype ? (
          <Card
            key={key}
            userInfo={userInfo}
            channelId={CHANNELID}
            replyCount={userInfo.reply_count || 0}
          />
        ),
        // ) : (
        //   ""
        // ),
      )}
    </>
  );
}
