/* eslint-disable @typescript-eslint/no-unused-vars */
import UserDetails from "./UserDetails";
import BotDetails from "./BotDetails";
import Img from "./Img";
import React, { ReactNode, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import Video from "./Video";
import rehypeRaw from "rehype-raw";
import { UsersContext } from "@/context/user";
import { Download, File } from "lucide-react";

import ThreadMesssage from "./ThreadMesssage";

interface IUserProps {
  userInfo: {
    subtype: string;
    ts: string;
    user: string;
    text: string;
    files: [];
    reply_count: number;
    parent_user_id: string;
    reactions: [];
    attachments: [];
  };
}

function Message({ userInfo }: IUserProps) {
  const { users } = UsersContext();

  const processedText = userInfo?.text
    // Replace mentions (<@userId>)
    ?.replace(/<@(\w+)>/g, (_, userId) => {
      const user = users?.find((user) => user.id === userId);
      return user
        ? `<span class="text-yellow-500">@${user.real_name}</span>`
        : `<@${userId}>`;
    })
    // Convert Slack link format <url|text> to Markdown link format [text](url)
    .replace(/<([^|>]+)\|([^>]+)>/g, "[$2]($1)")
    // Preserve multi-line code blocks (```code```)
    .replace(/```([\s\S]*?)```/g, "```$1```")
    // Convert inline code `code` into <code> tags
    .replace(/`([^`]+)`/g, "<code>$1</code>");

  const [reactedUsers, setReactedUsers] = useState<number | null>(null);

  function handleReactions(key: number) {
    setReactedUsers((prevKey) => (prevKey === key ? null : key));
  }

  return (
    <div className="font-[inter-variable]">
      {userInfo.subtype === "bot_message" ||
      userInfo.user === userInfo.parent_user_id ? (
        <div className="flex-row gap-3">
          {userInfo?.subtype === "bot_message" ? (
            <BotDetails userInfo={userInfo} />
          ) : null}
        </div>
      ) : (
        <UserDetails userId={userInfo?.user} timestamp={userInfo?.ts} />
      )}

      <div className="ml-[5%]">
        <div>
          {// images and videos ans also downloadable files
          userInfo?.files?.map(
            (
              image: {
                url_private: string;
                media_display_type: string;
                name: string;
                filetype: string;
                file_access: string;
              },
              key: number,
            ) => {
              if (
                image.file_access == "visible" &&
                image?.media_display_type === "video"
              ) {
                return <Video key={key} url_private={image.url_private} />;
              } else {
                if (
                  image.file_access == "visible" &&
                  image?.filetype != "png" &&
                  image?.filetype != "jpg"
                ) {
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
                  return (
                    image.file_access == "visible" && (
                      <Img key={key} url_private={image?.url_private} />
                    )
                  );
                }
              }
            },
          )}
        </div>
        <div>
          {//gifs are rendered here
          userInfo?.attachments?.map((attachment: { blocks: [] }) =>
            attachment?.blocks?.map(
              (gif: { block_id: string; image_url: string }) => (
                <Img key={gif.block_id} url_private={gif.image_url} />
              ),
            ),
          )
          /////
          }
        </div>

        <div className="ml-[27px]">
          <pre className="overflow-auto whitespace-pre-wrap font-[inter-variable] text-[15px]">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                    className="text-blue-500 hover:underline"
                  />
                ),
                code: ({
                  node,
                  inline,
                  children,
                  ...props
                }: {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  node?: any;
                  inline?: boolean;
                  children?: ReactNode;
                }) =>
                  inline ? (
                    <span className="rounded border bg-gray-200 px-1">
                      {children}
                    </span>
                  ) : (
                    <span
                      {...props}
                      className="w-fit rounded border bg-transparent px-[2px] pt-[2px] text-orange-400"
                    >
                      <span>{children}</span>
                    </span>
                  ),
              }}
              remarkPlugins={[remarkGfm, remarkEmoji]}
              rehypePlugins={[rehypeRaw]}
            >
              {processedText}
            </ReactMarkdown>
          </pre>
        </div>
        {///handleing reactions
        userInfo?.reactions?.map(
          (
            reaction: { name: string; count: number; users: [] },
            key: number,
          ) => {
            // console.log(userInfo.reactions);

            return (
              <div
                key={key}
                className="relative left-7 mx-1 inline-flex cursor-pointer items-center rounded-2xl border px-1 text-[10px] hover:border-blue-300"
              >
                <div
                  onClick={() => handleReactions(key)}
                  className="flex pb-[2px] pt-[3px]"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkEmoji]}>
                    {":" + reaction?.name + ":"}
                  </ReactMarkdown>
                  <span className="px-1">{reaction?.count}</span>
                  {reactedUsers == key && (
                    <div>
                      <div className="absolute left-0 top-6 z-50 h-fit w-[120px] rounded-md bg-slate-800 px-2 py-2 text-white">
                        {reaction.users.map((usr, index) => {
                          const u = users?.find((user) => user.id == usr);
                          return (
                            <li key={index} className="w-fit">
                              {(u && u?.real_name) || usr}{" "}
                            </li>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          },
        )}

        {/* <pre>{JSON.stringify(userInfo?.reactions, null, 2)}</pre> */}
      </div>

      <div>
        <ThreadMesssage
          channelId={process.env.NEXT_PUBLIC_DUGOUT_CHANNEL_ID!}
          timestamp={userInfo.ts}
        />
      </div>
      {/* )} */}
    </div>
  );
}

export default Message;
