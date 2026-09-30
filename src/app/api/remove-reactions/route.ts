import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Extract data from the request body
    const { channel, name, timestamp } = await req.json();
    // console.log("Received data:", { channel, name, timestamp });

    // Call the Slack API
    const response = await fetch("https://slack.com/api/reactions.remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        channel, // Use dynamic channel ID from the request
        name, // Use dynamic emoji name from the request
        timestamp, // Use dynamic timestamp from the request
      }),
    });

    const data = await response.json();

    // Handle Slack API errors
    if (!data.ok) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    // Return success response
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
