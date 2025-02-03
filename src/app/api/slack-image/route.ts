import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("fileUrl");

  if (!fileUrl) {
    return NextResponse.json({ error: "Missing fileUrl parameter" }, { status: 400 });
  }

  try {
    // Fetch the image from Slack (using the provided file URL)
    const response = await fetch(fileUrl, {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`, // Ensure you're using a valid token
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }

    // Return the image as a response with proper content-type
    const contentType = response.headers.get("Content-Type") || "image/png";
    const imageBuffer = await response.buffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json({ error: "Error fetching image" }, { status: 500 });
  }
}
