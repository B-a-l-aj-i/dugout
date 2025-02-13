"use client";
import ThreadModal from "../components/ThreadModal";
import UserDetails from "./UserDetails";
import Renderer from "./Renderer";
import BotDetails from "./BotDetails";
import Reply from "./Reply";
import Img from "./Img";

interface ICardProps {
  userInfo: {
    subtype: string;
    ts: string;
    user: string;
    text: string;
    files: [];
  };
  channelId: string;
  replyCount: number;
}

function Card({ userInfo, channelId, replyCount }: ICardProps) {
  // console.log(userInfo?.files || "");

  return (
    <div className="b mx-auto mb-11 w-1/2 rounded-lg p-4 shadow-md max-lg:w-[90%]">
      <div className="flex-row gap-3">
        {(userInfo?.subtype == "bot_message" && (
          <BotDetails userInfo={userInfo} />
        )) || <UserDetails userId={userInfo?.user} timestamp={userInfo?.ts} />}
      </div>
      <div>
        <pre className="overflow-auto whitespace-pre-wrap pb-7 font-sans">
          <Renderer text={userInfo?.text.replace("<", "").replace(">", "")} />
        </pre>
      </div>

      <div>
        {userInfo?.files?.map((image: { url_private: string }, key) => {
          return <Img key={key} url_private={image?.url_private} />;
        })}
      </div>

      <ThreadModal
        replyCount={replyCount}
        channelId={channelId}
        timestamp={userInfo?.ts}
      />
      <Reply timestamp={userInfo?.ts} />
    </div>
  );
}

export default Card;
