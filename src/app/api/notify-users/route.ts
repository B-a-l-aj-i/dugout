// GET only — invoked by Vercel cron (vercel.json) at 10:30 IST daily.
// Cron only supports GET, so this endpoint takes no input and computes
// today's pending users itself, then posts an @mention reminder in #dugout.

import { NextResponse } from "next/server";

const DUGOUT_CHANNEL_ID = process.env.NEXT_PUBLIC_DUGOUT_CHANNEL_ID;

function getISTDate() {
  const date = new Date();
  const istTime = date.getTime() + 5.5 * 60 * 60 * 1000;
  return new Date(istTime);
}

const todayMessages = [
  "☀️ Good Morning\n\n👋 Hi ${todayUserMentions}, I haven't seen your updates today.",
  "☀️ Good Morning\n\n👋 Hello ${todayUserMentions}, just a reminder that I haven't received your updates today.",
  "☀️ Good Morning\n\n👋 Hey ${todayUserMentions}, I noticed you haven't updated your progress today.",
  "☀️ Good Morning\n\n👋 Hi there ${todayUserMentions}, I haven't seen your updates for today.",
  "☀️ Good Morning\n\n👋 Attention ${todayUserMentions}, we're missing your updates for today.",
];

const yesterdayMessages = [
  "\n\n⚠️ ${yesterdayUserMentions}, please share your progress from yesterday with screenshots.",
  "\n\n⚠️ ${yesterdayUserMentions}, kindly share your progress and screenshots from yesterday.",
  "\n\n⚠️ ${yesterdayUserMentions}, could you please share your progress with screenshots from yesterday?",
  "\n\n⚠️ ${yesterdayUserMentions}, please share your yesterday's progress and screenshots.",
  "\n\n⚠️ ${yesterdayUserMentions}, would you mind sharing yesterday's progress with screenshots?"
];

const congratsMessages = [
  "☀️ Good Morning\n\n🎉 Thanks everyone for sharing today's updates!",
  "☀️ Good Morning\n\n✨ Great job team on staying updated today!",
  "☀️ Good Morning\n\n🌟 Hey everyone, excellent work on sharing your progress today!",
  "☀️ Good Morning\n\n🎯 Perfect! Everyone has posted their updates today!",
  "☀️ Good Morning\n\n🚀 Amazing team participation on today's updates!"
];

const closingMessages = [
  "\n\nThanks!",
  "\n\nThank you!",
  "\n\nMuch appreciated!",
  "\n\nThanks a bunch!",
  "\n\nAppreciate it!"
];

const allGoodMessages = [
  "☀️ Good Morning\n\n🌟 Fantastic work team!\n\n✨ Everyone has shared their updates and progress. Keep up the great work!\n\nHave a wonderful day! 🙌",
  "☀️ Good Morning\n\n🎉 Outstanding team participation!\n\n💫 All updates and progress are in. You're all doing great!\n\nKeep shining! ⭐",
  "☀️ Good Morning\n\n🚀 Perfect attendance!\n\n🌈 Everyone's updates and progress are complete. Excellent job!\n\nYou're amazing! 🏆",
  "☀️ Good Morning\n\n💪 Incredible team effort!\n\n🎯 All progress updates are submitted. Brilliant work everyone!\n\nProud of the team! 👏",
  "☀️ Good Morning\n\n⭐ Awesome performance team!\n\n🌟 Complete participation on updates and progress. Well done!\n\nThank you all! 🙏"
];

interface SlackUser {
  id: string;
  deleted: boolean;
  is_bot: boolean;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
  is_app_user: boolean;
  real_name: string;
  profile: {
    real_name: string;
    image_48: string;
  }
}

interface SlackMessage {
  user: string;
  username?: string;
  bot_profile?: {
    name: string;
  };
  reply_users?: string[];
}

interface ProcessedUser {
  id: string;
  name: string;
  avatar: string;
}

export async function GET() {
  try {
    // Check if it's weekend in IST (Saturday = 6, Sunday = 0)
    const todayIST = getISTDate();
    const dayOfWeek = todayIST.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json({
        success: true,
        message: "Skipping notifications on weekend",
        inactiveUsersCount: 0,
        inactiveUsers: [],
        messageResult: null,
      });
    }

    // Get all users in the workspace
    const usersResponse = await fetch("https://slack.com/api/users.list", {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const usersData = await usersResponse.json();
    if (!usersData.ok) {
      throw new Error(`Failed to fetch users: ${usersData.error}`);
    }

    // Get today's conversation history in IST
    const todayDate = getISTDate();
    todayDate.setHours(0, 0, 0, 0);
    const oldest = (todayDate.getTime() / 1000).toString();
    const latest = (getISTDate().getTime() / 1000).toString();

    const historyResponse = await fetch(
      `https://slack.com/api/conversations.history?channel=${DUGOUT_CHANNEL_ID}&oldest=${oldest}&latest=${latest}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    const historyData = await historyResponse.json();
    if (!historyData.ok) {
      throw new Error(
        `Failed to fetch conversation history: ${historyData.error}`,
      );
    }

    // Check if bot already sent a notification today
    const botMessageExists = historyData.messages.some(
      (msg: { username?: string; bot_profile?: { name: string } }) =>
        msg.username === "Dugout Bot" || msg.bot_profile?.name === "Dugout Bot",
    );

    if (botMessageExists) {
      return NextResponse.json({
        success: true,
        message: "Notification already sent today",
      });
    }

    // Get users who sent messages today
    const activeUserIds = new Set(
      historyData.messages.map((msg: SlackMessage) => msg.user),
    );

    // Get ignored users from env
    const ignoredUsers = (process.env.NEXT_PUBLIC_ADMIN_USERS || "")
      .split(",")
      .map((id) => id.trim());
    const ignoredUsersSet = new Set(ignoredUsers);

    // Filter inactive users (who haven't sent messages today)
    const inactiveUsers = usersData.members
      .filter((user: SlackUser) => {
        return (
          !user.deleted &&
          !user.is_bot &&
          !user.is_restricted &&
          !user.is_ultra_restricted &&
          !user.is_app_user &&
          user.id !== "USLACKBOT" &&
          !ignoredUsersSet.has(user.id) &&
          !ignoredUsers.includes(user.id) &&
          !activeUserIds.has(user.id)
        );
      })
      .map((user: SlackUser): ProcessedUser => ({
        id: user.id,
        name: user.profile.real_name || user.real_name,
        avatar: user.profile.image_48,
      }));

    // Create a set of inactive user IDs for faster lookup
    const inactiveUserIds = new Set(inactiveUsers.map((user: ProcessedUser) => user.id));

    // Modify filteredYesterdayInactiveUsers to exclude users who are already inactive today
    const filteredYesterdayInactiveUsers = usersData.members
      .filter((user: SlackUser) => {
        return (
          !user.deleted &&
          !user.is_bot &&
          !user.is_restricted &&
          !user.is_ultra_restricted &&
          !user.is_app_user &&
          user.id !== "USLACKBOT" &&
          !ignoredUsersSet.has(user.id) &&
          !ignoredUsers.includes(user.id) &&
          !inactiveUserIds.has(user.id) &&
          !historyData.messages.some(
            (msg: SlackMessage) =>
              msg.reply_users?.includes(user.id) ?? false
          )
        );
      })
      .map((user: SlackUser): ProcessedUser => ({
        id: user.id,
        name: user.profile.real_name || user.real_name,
        avatar: user.profile.image_48,
      }));

    // Update the notification sending code
    if (inactiveUsers.length > 0 || filteredYesterdayInactiveUsers.length > 0) {
      const todayUserMentions = inactiveUsers
        .map((user: ProcessedUser) => `<@${user.id}>`)
        .join(" ");
      const yesterdayUserMentions = filteredYesterdayInactiveUsers
        .map((user: ProcessedUser) => `<@${user.id}>`)
        .join(" ");

      // Randomly select message components
      const baseMessage = inactiveUsers.length > 0 
        ? todayMessages[Math.floor(Math.random() * todayMessages.length)]
        : congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
        
      const yesterdayPart = filteredYesterdayInactiveUsers.length > 0
        ? yesterdayMessages[Math.floor(Math.random() * yesterdayMessages.length)]
        : "";

      const closingPart = closingMessages[Math.floor(Math.random() * closingMessages.length)];

      // Combine the message parts
      const finalMessage = (baseMessage + yesterdayPart + closingPart)
        .replace("${todayUserMentions}", todayUserMentions || "")
        .replace("${yesterdayUserMentions}", yesterdayUserMentions || "")
        .trim();

      const messageResponse = await fetch(
        "https://slack.com/api/chat.postMessage",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel: DUGOUT_CHANNEL_ID,
            username: "Dugout Bot",
            icon_url: "https://slack.com/img/icons/app-57.png",
            text: finalMessage,
          }),
        }
      );

      return NextResponse.json({
        success: messageResponse.ok,
        inactiveUsersCount: inactiveUsers.length,
        yesterdayInactiveUsersCount: filteredYesterdayInactiveUsers.length,
        inactiveUsers,
        yesterdayInactiveUsers: filteredYesterdayInactiveUsers,
      });
    } else {
      // Send congratulatory message when everything is complete
      const thankYouMessage = allGoodMessages[Math.floor(Math.random() * allGoodMessages.length)];
      
      const messageResponse = await fetch(
        "https://slack.com/api/chat.postMessage",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            channel: DUGOUT_CHANNEL_ID,
            username: "Dugout Bot",
            icon_url: "https://slack.com/img/icons/app-57.png",
            text: thankYouMessage,
          }),
        }
      );

      return NextResponse.json({
        success: true,
        message: "All updates complete",
        inactiveUsersCount: 0,
        yesterdayInactiveUsersCount: 0,
        inactiveUsers: [],
        yesterdayInactiveUsers: [],
        messageResult: messageResponse.json(),
      });
    }
  } catch (error) {
    console.error("Error in notify-user:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
