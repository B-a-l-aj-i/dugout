import UserDetails from "./UserDetails";
import BotDetails from "./BotDetails";
import Img from "./Img";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub Flavored Markdown
import remarkEmoji from "remark-emoji";
import Video from "./Video";
import rehypeRaw from "rehype-raw"; // 👈 Allows raw HTML in Markdown
import { UsersContext } from "@/context/user";

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
                    const user = users.find((user) => user.id === userId);
                    return user ? user.real_name : `<@${userId}>`;
                  })
                : userInfo?.text}
            </ReactMarkdown>
            {/* {userInfo?.text?.replace(/<@(\w+)>/g, (_, userId) => {
              const user = users.find((user) => user.id === userId);
              return user ? user.real_name : `<@${userId}>`; // Replace if found, else keep original
            })} */}
          </pre>
        </div>

        <div>
          {// images and videos
          userInfo?.files?.map(
            (
              image: { url_private: string; media_display_type: string },
              key: number,
            ) => {
              if (image?.media_display_type === "video") {
                return <Video key={key} url_private={image.url_private} />;
              } else {
                return <Img key={key} url_private={image?.url_private} />;
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
