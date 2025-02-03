import React from 'react'
import UserDetails from './UserDetails'
import useSWR from 'swr';
import Loading from './Loading';
import Renderer from './Renderer';

export const fetcher1 = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Slack data");
  return res.json();
};


function ThreadMesssage({channelId,timestamp}) {


  const { data, error, isLoading } = useSWR(
    `/api/threads?channelId=${channelId}&ts=${timestamp}`, // Only fetch when `isOpen` is true
     fetcher1
 );
    //  console.log(data);

     if(error)return <div>error</div>
     if(isLoading)return <Loading />
  
  
  return (
    <div>
     {data?.messages?.map((userInfo,key)=>{
       return(
         <div className={`p-4 border-2 rounded-md mb-4 ${key==0?'m-0':'m-4'}`} key={key}>
        <UserDetails userId={userInfo?.user} timestamp={userInfo?.ts}/>
        <Renderer text={userInfo?.text}/>
        </div>
       )
      })}    
    </div>
  )
}

export default ThreadMesssage;