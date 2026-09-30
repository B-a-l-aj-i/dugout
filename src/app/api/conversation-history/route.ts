import { NextResponse } from "next/server";

const CHANNELID = process.env.NEXT_PUBLIC_DUGOUT_CHANNEL_ID;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const oldest = searchParams.get("oldest");
  const latest = searchParams.get("latest");
  // console.log("--------" + oldest);
  if (!req) {
    console.log(req);
  }
  try {
    const response = await fetch(
      `https://slack.com/api/conversations.history?channel=${CHANNELID}&oldest=${oldest}&latest=${latest}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Slack API Fetch Error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
