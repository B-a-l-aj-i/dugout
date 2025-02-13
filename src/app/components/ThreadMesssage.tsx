import React from "react";
import UserDetails from "./UserDetails";
import useSWR from "swr";
import Loading from "./Loading";
import Renderer from "./Renderer";
import { fetcher } from "@/utils/fetchUtils";
import BotDetails from "./BotDetails";
import Img from "./Img";

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
          },
          key: number,
        ) => {
          return (
            key > 0 && (
              <div
                className={`mb-4 border-l-2 pl-4 ${key == 0 ? "m-0" : "m-4"}`}
                key={key}
              >
                {(userInfo?.subtype == "bot_message" && (
                  <BotDetails userInfo={userInfo} />
                )) || (
                  <UserDetails
                    userId={userInfo?.user}
                    timestamp={userInfo?.ts}
                  />
                )}
                <pre className="overflow-auto whitespace-pre-wrap font-sans">
                  <Renderer text={userInfo?.text} />
                </pre>
                {userInfo?.files?.map(
                  (
                    image: { url_private: string; filetype: string },
                    key: number,
                  ) => {
                    if (image?.filetype === "mp4") {
                      return (
                        <video key={key} controls>
                          <source
                            src={`https://files.slack.com/files-tmb/T089L9ZUDQC-F08D62SAMKN-a9b2a0d1a1/export-1739373733296.mp4`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      );
                    } else {
                      return <Img key={key} url_private={image?.url_private} />;
                    }
                  },
                )}
              </div>
            )
          );
        },
      )}
    </div>
  );
}

export default ThreadMesssage;
