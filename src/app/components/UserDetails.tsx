"use client";

import useSWR from "swr";
import Image from "next/image";
import { useLocalStorageValue } from "@react-hookz/web";

// Updated Slack Fetcher to Use Next.js API Route
export const slackPersistentFetcher = async (
  url: string,
  localStorage: {
    value: {
      data: string;
      timestamp: number;
    } | null;
    set: (value: { data: string; timestamp: number }) => void;
    remove?: () => void;
    fetch?: () => void;
  },
) => {
  const { value, set } = localStorage;

  if (value) {
    const { data, timestamp } = value;

    // Cache valid for 24 hours
    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
      return data;
    }
  }

  // Use Next.js API route instead of calling Slack directly
  console.log(url);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch Slack data");

  const data = await res.json();
  set({ data, timestamp: Date.now() });

  // console.log(data);

  return data;
};

function UserDetails({
  userId,
  timestamp,
}: {
  userId: string;
  timestamp: string;
}) {
  const localStorage = useLocalStorageValue<{
    data: string;
    timestamp: number;
  }>(userId);

  const {
    data: userData,
    error: userError,
    isLoading: userIsLoading,
  } = useSWR(
    `api/user-details/?userId=${userId}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (url) => slackPersistentFetcher(url, localStorage as any),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  if (userError) return <div>Error getting messages</div>;
  if (userIsLoading) return <div>Loading....</div>;

  // console.log(userData);

  return (
    <div className="mb-4 flex gap-3">
      <Image
        width={50}
        height={30}
        alt="Profile Pic"
        className="rounded-full"
        src={userData?.user?.profile?.image_48 || "/globe.svg"} //  Provide a fallback
        unoptimized // Avoid Next.js image optimization for external images
      />
      <div>
        {/* <pre>{JSON.stringify(userData, null, 2)}</pre> */}
        <p className="font-bold">
          {userData?.user?.profile?.real_name || "Fetching"}
        </p>
        <p>{formatTimestamp(Number(timestamp))}</p>
      </div>
    </div>
  );
}

// Timestamp Formatter
export function formatTimestamp(slackTimestamp: number) {
  const date = new Date(slackTimestamp * 1000);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][date.getMonth()];
  const dateOfMonth = date.getDate();

  return `${hours}:${minutes} ${day} ${month} ${dateOfMonth}`;
}

export default UserDetails;
