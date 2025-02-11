import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const queryParams = req.nextUrl.searchParams;
  const imageUrl = queryParams.get("image");

  if (!imageUrl) {
    return NextResponse.json(
      { error: "No image URL provided" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the image data as an array buffer
    const imageBuffer = await response.arrayBuffer();

    // Create a new response with the image data
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/png",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch image",
      },
      { status: 500 },
    );
  }
}
