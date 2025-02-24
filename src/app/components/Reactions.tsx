import React from "react";

function Reactions({
  timestamp,
  reactions,
}: {
  timestamp: string;
  reactions: [];
}) {
  console.log(reactions);

  async function handleEmoji(emoji: string, timestamp: string) {
    // console.log(emoji);
    // console.log(timestamp);
    const already_reacted = reactions?.find(
      (a: { name: string }) => a?.name == emoji,
    );
    // console.log(already_reacted);

    try {
      // Send the emoji data to the API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/${already_reacted ? "remove-reactions" : "add-reactions"}`,
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
        console.log(response.statusText);
      }

      // Log success
      // const data = await response.json();
      // console.log("Emoji reaction successful:", data);
    } catch (error) {
      console.error(error);
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
            <span
              className="group"
              onClick={() => handleEmoji(emoji.name, timestamp)}
            >
              {emoji.emoji}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default Reactions;
