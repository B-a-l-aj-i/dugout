import UserDetails from "./UserDetails";
import BotDetails from "./BotDetails";
import Img from "./Img";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import Video from "./Video";
import rehypeRaw from "rehype-raw";
import { UsersContext } from "@/context/user";
import { ChevronDown, ChevronRight, Download, File } from "lucide-react";
import ThreadMesssage from "./ThreadMesssage";

// interface User {
//   id: string;
//   real_name: string;
// }

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
  // console.log(userInfo);

  const { users } = UsersContext();
  const [open, setOpen] = useState(true);

  return (
    <div>
      {/* <pre>{JSON.stringify(userInfo.subtype, null, 2)}</pre>
      <pre>{JSON.stringify(userInfo.parent_user_id, null, 2)}</pre>
      <pre>{JSON.stringify(userInfo.user, null, 2)}</pre> */}

      {userInfo.subtype === "bot_message" ||
      userInfo.user === userInfo.parent_user_id ? (
        <div className="flex-row gap-3">
          {
            userInfo?.subtype === "bot_message" ? (
              <BotDetails userInfo={userInfo} />
            ) : null
            // <UserDetails userId={userInfo?.user} timestamp={userInfo?.ts} />
          }
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
                console.log(image.file_access);

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
              {userInfo?.text?.includes("<@")
                ? userInfo?.text.replace(/<@(\w+)>/g, (_, userId) => {
                    const user = users?.find((user) => user.id === userId);
                    return user
                      ? ` <span classname="text-yellow-500">@${user?.real_name}</span> `
                      : `<@${userId}>`;
                  })
                : userInfo?.text}
            </ReactMarkdown>
          </pre>
        </div>
        {///handleing reactions

        userInfo?.reactions?.map(
          (reaction: { name: string; count: number }, key: number) => {
            return (
              <div
                key={key}
                className="mx-1 inline-flex items-center rounded-2xl border px-2"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkEmoji]}>
                  {":" + reaction?.name + ":"}
                </ReactMarkdown>
                <span className="p-1 text-xs">{reaction?.count}</span>
              </div>
            );
          },
        )}

        {/* <pre>{JSON.stringify(userInfo?.reactions, null, 2)}</pre> */}
      </div>
      {userInfo.reply_count > 0 && (
        <p
          className="my-4 flex w-fit cursor-pointer items-center gap-2 rounded-lg text-sm text-blue-400 hover:text-blue-300"
          onClick={() => setOpen(!open)}
        >
          {!open && <ChevronRight className="text-black" size={18} />}
          {open && <ChevronDown className="text-black" size={18} />}
          {userInfo.reply_count}
          {userInfo.reply_count > 1 ? " Replies" : " Reply"}
        </p>
      )}

      {userInfo?.reply_count > 0 && open && (
        <ThreadMesssage channelId="C089LA005S8" timestamp={userInfo.ts} />
      )}
    </div>
  );
}

export default Message;
