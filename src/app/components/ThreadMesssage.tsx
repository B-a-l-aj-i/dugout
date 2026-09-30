"use client";
import React from "react";
import useSWR from "swr";
import Loading from "./Loading";
import { fetcher } from "@/utils/fetchUtils";
import Message from "./Message";
// import Img from "./Img";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import remarkEmoji from "remark-emoji";
// import Video from "./Video";
// import rehypeRaw from "rehype-raw";
// import { Download, File } from "lucide-react";
// import { UsersContext } from "@/context/user";
import Reactions from "./Reactions";
import { useSession } from "next-auth/react";

interface IThreadMEssage {
  channelId: string;
  timestamp: string;
}
function ThreadMesssage({ channelId, timestamp }: IThreadMEssage) {
  const { data: session } = useSession();

  // const { users } = UsersContext();

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/threads?channelId=${channelId}&ts=${timestamp}`,
    fetcher,
    { refreshInterval: 60_000 },
  );

  if (error) return <div>error</div>;
  if (isLoading) return <Loading />;

  // console.log(data?.messages);

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
            reactions: [];
            reply_count: number;
            parent_user_id: string;
            attachments: [];
          },
          key: number,
        ) => {
          return (
            key > 0 && (
              <div className={`mb-4`} key={key}>
                {
                  /* ****reactions are handled */
                  session?.user?.email == "sandeep@timeless.co" && (
                    <div className="ml-auto flex w-fit cursor-pointer gap-3 rounded-lg border px-1 opacity-0 group-hover:opacity-100">
                      <Reactions
                        reactions={userInfo?.reactions}
                        timestamp={userInfo?.ts}
                      />
                    </div>
                  )
                  // *****
                }
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
