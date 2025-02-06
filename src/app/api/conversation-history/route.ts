import { NextResponse } from "next/server";

const CHANNELID = "C089LA005S8";

export async function GET(req: Request) {
  if (!req) {
    console.log(req);
  }
  try {
    const response = await fetch(
      `https://slack.com/api/conversations.history?channel=${CHANNELID}`,
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
