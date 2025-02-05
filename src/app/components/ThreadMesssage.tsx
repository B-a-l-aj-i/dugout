import React from "react";
import UserDetails from "./UserDetails";
import useSWR from "swr";
import Loading from "./Loading";
import Renderer from "./Renderer";

export const fetcher1 = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Slack data");
  return res.json();
};

interface IThreadMEssage {
  channelId: string;
  timestamp: string;
}
function ThreadMesssage({ channelId, timestamp }: IThreadMEssage) {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/threads?channelId=${channelId}&ts=${timestamp}`, // Only fetch when `isOpen` is true
    fetcher1,
  );
  //  console.log(data);

  if (error) return <div>error</div>;
  if (isLoading) return <Loading />;

  return (
    <div>
      {data?.messages?.map(
        (userInfo: { user: string; ts: string; text: string }, key: number) => {
          return (
            <div
              className={`mb-4 rounded-md border-2 p-4 ${key == 0 ? "m-0" : "m-4"}`}
              key={key}
            >
              <UserDetails userId={userInfo?.user} timestamp={userInfo?.ts} />
              <Renderer text={userInfo?.text} />
            </div>
          );
        },
      )}
    </div>
  );
}

export default ThreadMesssage;
