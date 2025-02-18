import UserDetails from "./UserDetails";
import BotDetails from "./BotDetails";
import Img from "./Img";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";
import Video from "./Video";
import rehypeRaw from "rehype-raw";
import { UsersContext } from "@/context/user";
import { Download, File } from "lucide-react";

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
    attachments: [];
  };
}

function Message({ userInfo }: IUserProps) {
  const { users } = UsersContext();
  return (
    <div>
      <div className="flex-row gap-3">
        {(userInfo?.subtype == "bot_message" && (
          <BotDetails userInfo={userInfo} />
        )) || <UserDetails userId={userInfo?.user} timestamp={userInfo?.ts} />}
      </div>
      <div className="ml-[10%]">
        <div>
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

        <div>
          {// images and videos ans also downloadable files
          userInfo?.files?.map(
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
                      className="m-2 flex items-center justify-between rounded-md border border-blue-400 p-2 hover:border-blue-300"
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
      </div>
    </div>
  );
}

export default Message;
