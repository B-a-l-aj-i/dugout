// app/api/slack/fetcher/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { url} = await req.json(); // URL  for Slack API

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    const response = await fetch(url, {
        method: "GET", // ✅ Slack API uses GET for users.info
        headers: {
          Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache:"force-cache"
      });


      const data = await response.json();
    console.log("Slack API Response:", data);
  

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching Slack data", details: error.message },
      { status: 500 }
    );
  }
}
