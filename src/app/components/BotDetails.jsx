import React from "react";
import { formatTimestamp } from "./UserDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function BotDetails({ userInfo }) {
  //   console.log(userInfo);
  return (
    <div className="mb-4 flex gap-3">
      <Avatar className="-z-10">
        <AvatarImage src={userInfo?.icons?.image_48 || "/globe.svg"} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        {/* <pre>{JSON.stringify(userData, null, 2)}</pre> */}
        <p className="font-bold">{userInfo?.username || "Fetching"}</p>
        <p className="text-xs">{formatTimestamp(userInfo.ts)}</p>
      </div>
    </div>
  );
}

export default BotDetails;
