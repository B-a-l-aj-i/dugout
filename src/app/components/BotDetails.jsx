import React from "react";
import Image from "next/image";
import { formatTimestamp } from "./UserDetails";

function BotDetails({ userInfo }) {
  //   console.log(userInfo);
  return (
    <div className="mb-4 flex gap-3">
      <Image
        width={50}
        height={30}
        alt="Profile Pic"
        className="rounded-full"
        src={userInfo?.icons?.image_48 || "/globe.svg"} //  Provide a fallback
        unoptimized // Avoid Next.js image optimization for external images
      />
      <div>
        {/* <pre>{JSON.stringify(userData, null, 2)}</pre> */}
        <p className="font-bold">{userInfo?.username || "Fetching"}</p>
        <p>{formatTimestamp(userInfo.ts)}</p>
      </div>
    </div>
  );
}

export default BotDetails;
