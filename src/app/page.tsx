
"use client";


import Header from "@/app/components/Header";
import Card from "@/app/components/Card";
import useSWR from "swr";

const CHANNELID = "C089LA005S8";



 const fetcher = async ([url, body]) => {
  console.log("page.tsx  url   "+url);
  
  const res = await fetch(`/api/slack/fetcher?url=${encodeURIComponent(url)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });


  if (!res.ok) throw new Error("Failed to fetch Slack data");

  return res.json();
};

export default function App() {
  const { data, error, isLoading } = useSWR(
    [`https://slack.com/api/conversations.history?channel=${CHANNELID}`],
    fetcher,
  );

  if (error) return <div>Error getting messages {error}</div>;
  if (isLoading) return <div>Loading.....</div>;
  console.log(data?.messages);

  return (
    <>
       <Header />
     {data?.messages?.map((userInfo, key) =>
        !userInfo.subtype ? (
          <Card key={key} userInfo={userInfo} channelId={CHANNELID} />
        ) : (
          ""
        )
      )}
    </>
  );
}

