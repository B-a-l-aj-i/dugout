import { NextResponse } from "next/server";

const DUGOUT_CHANNEL_ID = process.env.DUGOUT_CHANNEL_ID;

function getISTDate() {
  const date = new Date();
  const istTime = date.getTime() + (5.5 * 60 * 60 * 1000);
  return new Date(istTime);
}

// List of messages to randomize
const messages = [
  "Hi ${userMentions}, I haven't seen your updates today. Please share your progress and include yesterday's screenshots. Thanks!",
  "Hello ${userMentions}, just a reminder that I haven't received your updates today. Please share your progress and any screenshots from yesterday. Thank you!",
  "Hey ${userMentions}, I noticed you haven't updated today. Could you please share your progress and include screenshots from yesterday? Appreciate it!",
  "Hi there ${userMentions}, I haven't seen your updates for today. Please let me know your progress and share yesterday's screenshots. Thanks!",
  "Greetings ${userMentions}, it seems I haven't received your updates today. Please provide your progress and include screenshots from yesterday. Thank you!"
];

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
        messageResult: null
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
      throw new Error(`Failed to fetch conversation history: ${historyData.error}`);
    }

    // Check if bot already sent a notification today
    const botMessageExists = historyData.messages.some((msg: { 
      username?: string; 
      bot_profile?: { name: string }; 
    }) => msg.username === "Dugout Bot" || msg.bot_profile?.name === "Dugout Bot");

    if (botMessageExists) {
      return NextResponse.json({
        success: true,
        message: "Notification already sent today",
        inactiveUsersCount: 0,
        inactiveUsers: [],
        messageResult: null
      });
    }

    // Get users who sent messages today
    const activeUserIds = new Set(historyData.messages.map((msg: { user: string }) => msg.user));

    // Get ignored users from env
    const ignoredUsers = (process.env.ADMIN_USERS || "").split(",").map(id => id.trim());
    const ignoredUsersSet = new Set(ignoredUsers);

    // Filter inactive users (who haven't sent messages today)
    const inactiveUsers = usersData.members.filter((user: { 
      id: string; 
      deleted: boolean; 
      is_bot: boolean;
      is_restricted: boolean;
      is_ultra_restricted: boolean;
      is_app_user: boolean;
      real_name: string; 
      profile: { real_name: string; image_48: string; }; 
    }) => {
      return (
        !user.deleted &&
        !user.is_bot &&
        !user.is_restricted &&
        !user.is_ultra_restricted &&
        !user.is_app_user &&
        user.id !== "USLACKBOT" &&
        !ignoredUsersSet.has(user.id) &&
        !activeUserIds.has(user.id)
      );
    }).map((user: { id: string; real_name: string; profile: { real_name: string; image_48: string; }; }) => ({
      id: user.id,
      name: user.profile.real_name || user.real_name,
      avatar: user.profile.image_48
    }));

    // Post a message in the channel mentioning non-messaged users (inactive users)
    if (inactiveUsers.length > 0) {
      const userMentions = inactiveUsers.map((user: { id: string; name: string; avatar: string }) => `<@${user.id}>`).join(' ');
      const randomMessage = messages[Math.floor(Math.random() * messages.length)].replace("${userMentions}", userMentions);
      const messageResponse = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SLACK_DUGOUT_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: DUGOUT_CHANNEL_ID,
          username: "Dugout Bot",
          icon_url: "https://slack.com/img/icons/app-57.png",
          text: randomMessage,
        }),
      });

      const messageData = await messageResponse.json();
      
      return NextResponse.json({
        success: messageData.ok,
        inactiveUsersCount: inactiveUsers.length,
        inactiveUsers,
        messageResult: messageData
      });
    }

    return NextResponse.json({
      success: true,
      inactiveUsersCount: 0,
      inactiveUsers: [],
      messageResult: null
    });

  } catch (error) {
    console.error("Error in notify-user:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
} 