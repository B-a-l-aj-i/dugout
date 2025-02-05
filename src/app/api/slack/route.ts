import { NextResponse } from "next/server";

const slackEvents = []; // Temporary storage for Slack events

export async function POST(req: Request) {
  try {
    const event = await req.json();

    // Handle Slack URL verification
    if (event.type === "url_verification") {
      return NextResponse.json({ challenge: event.challenge });
    }

    // Store the event (In production, use a database instead)
    slackEvents.unshift(event);

    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// GET route for fetching Slack events
export async function GET() {
  return NextResponse.json(slackEvents);
}
