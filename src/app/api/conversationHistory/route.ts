import { NextResponse } from "next/server";

const CHANNELID = "C089LA005S8";

export async function GET(req) {
  try {
    const response = await fetch(`https://slack.com/api/conversations.history?channel=${CHANNELID}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Slack API Response:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Slack API Fetch Error:", error);
    return NextResponse.json(
      { error: "Error fetching Slack data", details: error.message },
      { status: 500 }
    );
  }
}
