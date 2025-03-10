import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    if (!req) {
      console.log("--");
    }
    const response = await fetch(`https://slack.com/api/users.list?pretty=1`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    // console.log("Slack API Response for user DEtails:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Slack API Fetch Error:", error);
    return NextResponse.json(
      { error: "Error fetching Slack data" },
      { status: 500 },
    );
  }
}
