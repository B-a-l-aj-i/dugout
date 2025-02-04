import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");
    const timestamp = searchParams.get("ts");

    if (!channelId || !timestamp) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 },
      );
    }
    // console.log(userId)
    const response = await fetch(
      `https://slack.com/api/conversations.replies?channel=${channelId}&ts=${timestamp}&pretty=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    console.log("Slack API Response for user DEtails:", data);
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Slack API Fetch Error:", error);

    let errorMessage = "Error fetching Slack data";
    let errorDetails = "";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || "";
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      errorMessage = "An unknown error occurred";
    }

    return NextResponse.json(
      { error: errorMessage, details: errorDetails },
      { status: 500 },
    );
  }
}
