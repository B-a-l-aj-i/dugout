import React from "react";
import useSWR from "swr";
import Loading from "./Loading";
import { fetcher } from "@/utils/fetchUtils";
import Message from "./Message";

interface IThreadMEssage {
  channelId: string;
  timestamp: string;
}
function ThreadMesssage({ channelId, timestamp }: IThreadMEssage) {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/threads?channelId=${channelId}&ts=${timestamp}`, // Only fetch when `isOpen` is true
    fetcher,
  );

  if (error) return <div>error</div>;
  if (isLoading) return <Loading />;

  console.log(data?.messages);

  return (
    <div>
      {data?.messages?.map(
        (
          userInfo: {
            user: string;
            ts: string;
            text: string;
            subtype: string;
            files: [];
            attachments: [];
          },
          key: number,
        ) => {
          return (
            key > 0 && (
              <div className={`m-4 mb-4 border-l-2 pl-4`} key={key}>
                <Message userInfo={userInfo} />
              </div>
            )
          );
        },
      )}
    </div>
  );
}

export default ThreadMesssage;
