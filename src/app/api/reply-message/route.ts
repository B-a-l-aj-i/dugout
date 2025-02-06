import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { channel, text, userName, icon_url, ts } = await req.json();
    console.log(ts);
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`, // Securely stored in .env.local
      },
      body: JSON.stringify({
        channel,
        text,
        username: userName,
        icon_url: icon_url,
        thread_ts: ts,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
