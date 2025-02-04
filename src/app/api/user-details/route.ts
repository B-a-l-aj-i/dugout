import { NextResponse } from "next/server";


export async function GET(req: Request) {


  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }
    // console.log(userId)
    const response = await fetch(`https://slack.com/api/users.info?user=${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Slack API Response for user DEtails:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Slack API Fetch Error:", error);
    return NextResponse.json(
      { error: "Error fetching Slack data", details: error.message },
      { status: 500 }
    );
  }
}
