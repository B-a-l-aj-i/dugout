// import { NextResponse } from "next/server";

// const CHANNELID = "C089LA005S8";
// const SLACK_API_URL = "https://slack.com/api/conversations.history";
// const SLACK_TOKEN = process.env.SLACK_DUGOUT_BOT_TOKEN;

// export async function GET(req: Request) {
//   if (!req) {
//     console.log(req);
//   }

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   let allMessages: any[] = [];
//   let cursor: string | null = null;
//   let hasMore = true;
//   try {
//     while (hasMore) {
//       const url: string = cursor
//         ? `${SLACK_API_URL}?channel=${CHANNELID}&limit=100&cursor=${cursor}`
//         : `${SLACK_API_URL}?channel=${CHANNELID}&limit=100`;

//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${SLACK_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();

//       if (!data.ok) {
//         return NextResponse.json(
//           { error: "Slack API Error", details: data },
//           { status: 500 },
//         );
//       }

//       // Add messages from the response
//       allMessages = [...allMessages, ...data.messages];

//       // Handle pagination
//       cursor = data.response_metadata?.next_cursor || null;
//       hasMore = !!cursor; // Continue if cursor exists
//     }

//     return NextResponse.json({ messages: allMessages });
//   } catch (error: unknown) {
//     console.error("Slack API Fetch Error:", error);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 },
//     );
//   }
// }

import { NextResponse } from "next/server";

const CHANNELID = "C089LA005S8";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const oldest = searchParams.get("oldest");
  const latest = searchParams.get("latest");
  // console.log("--------" + oldest);
  if (!req) {
    console.log(req);
  }
  try {
    const response = await fetch(
      `https://slack.com/api/conversations.history?channel=${CHANNELID}&oldest=${oldest}&latest=${latest}`,
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
