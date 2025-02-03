'use client'
import ThreadModal from "../components/ThreadModal";
import UserDetails from "./UserDetails";
import Renderer from "./Renderer";
import ReactMarkdown from 'react-markdown';

// import { SlackMarkdown } from "react-slack-renderer";


function Card({ userInfo, channelId,replyCount}:{userInfo:number,channelId:string,replyCount:number}) {

  console.log(userInfo);
  

  return (
    <div className=" p-6 shadow-lg mx-auto b rounded-lg w-1/2 mb-5 max-[1000px]:w-[90%] hover:scale-105 transition-transform duration-300">
      <div className="flex-row gap-3">
        <UserDetails userId={userInfo?.user} timestamp={userInfo?.ts} />
      </div>
      <div>
      {/* <SlackMarkdown>{userInfo?.text}</SlackMarkdown>; */}
        {/* {userInfo?.text} */}

        {/* <ReactMarkdown>{userInfo?.text}</ReactMarkdown> */}
        <pre className="font-sans overflow-auto whitespace-pre-wrap">
          <Renderer text={userInfo?.text} />
        </pre>
      </div>
      <ThreadModal replyCount={replyCount} channelId={channelId} timestamp={userInfo?.ts} />
    </div>
  );
}

export default Card;
