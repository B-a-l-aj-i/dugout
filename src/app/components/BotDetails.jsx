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
        <span className="font-[inter-variable] text-[15px] font-[400]">
          {userInfo?.username || "Fetching"}
          {"  "}
          {/* <span className="text-xs text-[#999999]"></span> */}
          <span className="mx-1 rounded-md bg-slate-200 pb-[1px] pl-[8px] pr-[5px] pt-1 text-xs">
            {" "}
            APP
          </span>
        </span>

        <span className="text-xs text-[#999999]">
          {formatTimestamp(Number(userInfo?.ts)).split(" ")[0]}
        </span>
      </div>
    </div>
  );
}

export default BotDetails;
