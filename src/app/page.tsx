"use client";


import Header from "@/app/components/Header";
import Card from "@/app/components/Card";
import Loading from "./components/Loading";
import useSWR from "swr";

const CHANNELID = "C089LA005S8";



export const fetcher = async (url:string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Slack data");
  return res.json();
};

export default  function App() {
  const { data, error, isLoading } = useSWR(`/api/conversation-history`,fetcher);

  if (error) return <div>Error getting messages {error}</div>;
  if (isLoading) return (<div className="m-52"> <Loading /></div>)
  // console.log(data);
  
  // console.log(data?.messages.reply_count);
  

  return (
    <>
       <Header />
     {data?.messages?.map((userInfo, key:number) =>
        !userInfo.subtype? (
          <Card key={key} userInfo={userInfo} channelId={CHANNELID}  replyCount={userInfo.reply_count || 0}/>
        ) : (
          ""
        )
      )}
    </>
  );
}

