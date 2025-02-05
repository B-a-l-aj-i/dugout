import { NextResponse } from "next/server";

const CHANNELID = "C089LA005S8";

export async function GET(req: Request) {
  console.log("asd");
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
    // console.log("Slack API Response:", data);
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Slack API Fetch Error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// import { NextResponse } from "next/server";
// import { WebClient, LogLevel } from "@slack/web-api";

// // Initialize Slack Web API client
// const client = new WebClient(process.env.SLACK_DUGOUT_BOT_TOKEN, {
//   logLevel: LogLevel.ERROR,
// });

// export async function POST(req: Request) {
//   try {
//     const { channel } = await req.json();

//     const result = await client.conversations.history({ channel });

//     if (!result.ok) {
//       return NextResponse.json({ error: result.error }, { status: 400 });
//     }

//     return NextResponse.json({ messages: result.messages });
//   } catch (error) {
//     console.error("Slack API Error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }
