import { NextResponse } from "next/server";

const CHANNELID = process.env.NEXT_PUBLIC_DUGOUT_CHANNEL_ID;

export async function GET() {
  try {
    const response = await fetch(
      `https://slack.com/api/conversations.members?channel=${CHANNELID}&limit=1000`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    if (!data.ok) {
      throw new Error(`Failed to fetch channel members: ${data.error}`);
    }

    return NextResponse.json({ members: data.members });
  } catch (error) {
    console.error("Slack API Fetch Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 },
    );
  }
}
