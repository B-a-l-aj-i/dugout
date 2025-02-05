"use client";
import ThreadModal from "../components/ThreadModal";
import UserDetails from "./UserDetails";
import Renderer from "./Renderer";
import BotDetails from "./BotDetails";
function Card({
  userInfo,
  channelId,
  replyCount,
}: {
  userInfo: number;
  channelId: string;
  replyCount: number;
}) {
  // console.log(userInfo);

  return (
    <div className="b mx-auto mb-5 w-1/2 rounded-lg p-6 shadow-lg transition-transform duration-300 hover:scale-105 max-[1000px]:w-[90%]">
      <div className="flex-row gap-3">
        {(userInfo.subtype == "bot_message" && (
          <BotDetails userInfo={userInfo} />
        )) || <UserDetails userId={userInfo?.user} timestamp={userInfo?.ts} />}
      </div>
      <div>
        <pre className="overflow-auto whitespace-pre-wrap font-sans">
          <Renderer text={userInfo?.text} />
        </pre>
      </div>
      <ThreadModal
        replyCount={replyCount}
        channelId={channelId}
        timestamp={userInfo?.ts}
      />
    </div>
  );
}

export default Card;
