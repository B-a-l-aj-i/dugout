import React from "react";
import useSWR from "swr";
import Loading from "./Loading";
import { fetcher } from "@/utils/fetchUtils";
import Message from "./Message";
import Img from "./Img";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import Video from "./Video";
import rehypeRaw from "rehype-raw";
import { Download, File } from "lucide-react";
import { UsersContext } from "@/context/user";

interface IThreadMEssage {
  channelId: string;
  timestamp: string;
  limit: boolean;
}
function ThreadMesssage({ channelId, timestamp, limit }: IThreadMEssage) {
  const { users } = UsersContext();

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/threads?channelId=${channelId}&ts=${timestamp}${limit ? "&limit=true" : ""}`,
    fetcher,
  );

  if (error) return <div>error</div>;
  if (isLoading) return <Loading />;

  console.log(data?.messages);

  return (
    <div>
      {limit && data?.messages?.[1] && (
        <div>
          {/* <pre>{JSON.stringify(data?.messages, null, 2)}</pre> */}
          {/* <p className="ml-auto mr-auto w-fit rounded-xl border p-1 px-2 text-xs text-orange-400">
            Latest Thread
          </p> */}
          <div>
            <div>
              {// images and videos ans also downloadable files
              data?.messages?.[1]?.files?.map(
                (
                  image: {
                    url_private: string;
                    media_display_type: string;
                    name: string;
                    filetype: string;
                  },
                  key: number,
                ) => {
                  if (image?.media_display_type === "video") {
                    return <Video key={key} url_private={image.url_private} />;
                  } else {
                    if (image?.filetype != "png" && image?.filetype != "jpg") {
                      return (
                        <div
                          className="m-2 flex w-[50%] items-center justify-between rounded-md border border-blue-400 p-2 hover:border-blue-300 max-sm:w-[80%]"
                          key={key}
                        >
                          <div className="flex items-center">
                            <File className="inline-flex" />
                            {image.name}
                          </div>
                          <a
                            target="_blank"
                            href={image?.url_private}
                            download="proposed_file_name"
                          >
                            <Download
                              height={20}
                              width={20}
                              className="inline-flex"
                            />
                          </a>
                        </div>
                      );
                    } else {
                      return <Img key={key} url_private={image?.url_private} />;
                    }
                  }
                },
              )}
            </div>
            <div>
              {//gifs are rendered here
              data?.messages?.[1]?.attachments?.map(
                (attachment: { blocks: [] }) =>
                  attachment?.blocks?.map(
                    (gif: { block_id: string; image_url: string }) => (
                      <Img key={gif.block_id} url_private={gif.image_url} />
                    ),
                  ),
              )
              /////
              }
            </div>

            <div className="m-2">
              <pre className="overflow-auto whitespace-pre-wrap font-sans">
                <ReactMarkdown
                  components={{
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    a: ({ node, ...props }) => (
                      <a
                        target="_blank"
                        {...props}
                        className="text-blue-500 hover:underline"
                      />
                    ),
                  }}
                  remarkPlugins={[remarkGfm, remarkEmoji]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {data?.messages?.[1]?.text?.includes("<@")
                    ? data?.messages?.[1]?.text.replace(
                        /<@(\w+)>/g,
                        (_: string, userId: string) => {
                          const user = users?.find(
                            (user) => user.id === userId,
                          );
                          return user
                            ? ` <span classname="text-yellow-500">@${user?.real_name}</span> `
                            : `<@${userId}>`;
                        },
                      )
                    : data?.messages?.[1]?.text}
                </ReactMarkdown>
              </pre>
            </div>
          </div>
        </div>
      )}

      {!limit &&
        data?.messages?.map(
          (
            userInfo: {
              user: string;
              ts: string;
              text: string;
              subtype: string;
              files: [];
              reactions: [];
              reply_count: number;
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
