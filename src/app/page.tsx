"use client";

import Header from "@/app/components/Header";
import Card from "@/app/components/Card";
import useSWR from "swr";
import { SendMessage } from "./components/SendMessage";
// import SlackEventsPage from "./components/realtime";
import { useSession } from "next-auth/react";
import Loading from "./components/Loading";

const CHANNELID = "C089LA005S8";

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch Slack data");
    return res.json();
  } catch (e) {
    console.log(e);
  }
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

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/conversation-history`,
    fetcher,
  );
  const { data: session } = useSession();

  if (error) {
    return <div>error</div>;
  }

  if (isLoading) {
    return <Loading />;
  }
  // console.log(data.messages);

  return (
    <>
      <Header user={session?.user} />

      <pre>{JSON.stringify(session?.user, null, 2)}</pre>
      {session?.user && <SendMessage user={session?.user} />}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {/* <SlackEventsPage /> */}

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
        ) => (
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
