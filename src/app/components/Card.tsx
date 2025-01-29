'use client'
import ThreadModal from "../components/ThreadModal";
import UserDetails from "./UserDetails";


function Card({ userInfo, channelId,replyCount }:{userInfo:number,channelId:string,replyCount:number}) {
  // console.log(replyCount);

  // const parts = userInfo.text.split("•");

  return (
    <div className=" p-6 shadow-lg mx-auto b rounded-lg w-1/2 mb-5 max-[1000px]:w-[90%]  hover:scale-105 transition-transform duration-300">
      <div className="flex-row gap-3">
        <UserDetails userId={userInfo.user} timestamp={userInfo.ts} />
      </div>
      <div>
        {/* {parts[0]}
        <br />
        &nbsp;&nbsp;{parts[1]} */}
        {userInfo.text}
        {/* <pre>{JSON.stringify(userInfo, null, 2)}</pre> */}
      </div>
      <ThreadModal replyCount={replyCount} channelId={channelId} timestamp={userInfo.ts} />
    </div>
  );
}

export default Card;
