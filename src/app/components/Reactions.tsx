import React from "react";

function Reactions({ timestamp }: { timestamp: string }) {
  async function handleEmoji(emoji: string, timestamp: string) {
    // console.log(emoji);
    // console.log(timestamp);

    try {
      // Send the emoji data to the API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/add-reactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel: "C089LA005S8", // Replace with your channel ID
            name: emoji, // Use the selected emoji
            timestamp: timestamp, // Replace with the message timestamp
          }),
        },
      );

      // Handle API errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error || "Unknown error"}`);
      }

      // Log success
      const data = await response.json();
      console.log("Emoji reaction successful:", data);
    } catch (error) {
      console.error("Failed to handle emoji:", error);
    }
  }
  const emojis = [
    { emoji: "🔥", name: "fire" },
    { emoji: "👍", name: "+1" },
    { emoji: "👎", name: "-1" },
    { emoji: "✅", name: "white_check_mark" },
  ];
  return (
    <>
      <div className="flex gap-3">
        {emojis.map((emoji, index) => (
          <div key={index} className="rounded-lg hover:bg-slate-100">
            <span onClick={() => handleEmoji(emoji.name, timestamp)}>
              {emoji.emoji}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default Reactions;
