import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url"); // Get URL from query params

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    console.log("Fetching Slack API:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "force-cache",
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
