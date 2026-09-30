// GET only — invoked by both:
//   1. Vercel cron (vercel.json) at 11:30 IST daily — cron only supports GET
//   2. The "Notify N people" button in the sidebar
// Computes today's pending users from Slack and DMs each from the bot.

import { NextResponse } from "next/server";

const DUGOUT_CHANNEL_ID = process.env.NEXT_PUBLIC_DUGOUT_CHANNEL_ID;

const todayMessages = [
  "We still haven't gotten your post on dugout for today, please post now.",
  "Heads up — your dugout update for today is still missing. Please post now.",
  "Quick reminder: we haven't seen your dugout post for today yet. Please post now.",
  "Your dugout update for today hasn't come through yet. Please post now.",
  "Still waiting on your dugout post for today. Please post now.",
  "Just checking in — your dugout update for today is pending. Please post now.",
];

function getISTDate() {
  const date = new Date();
  const istTime = date.getTime() + 5.5 * 60 * 60 * 1000;
  return new Date(istTime);
}

interface SlackUser {
  id: string;
  name: string;
  deleted: boolean;
  is_bot: boolean;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
  is_app_user: boolean;
}

interface SlackMessage {
  user?: string;
  reply_users?: string[];
}


async function sendDM(
  userId: string,
  message: string,
  token: string,
): Promise<{ userId: string; success: boolean; error?: string }> {
  // Open a DM channel
  const openRes = await fetch("https://slack.com/api/conversations.open", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ users: userId }),
  });

  const openData = await openRes.json();
  if (!openData.ok) {
    return { userId, success: false, error: `conversations.open: ${openData.error}` };
  }

  const channelId = openData.channel.id;

  // Send the message
  const msgRes = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: channelId,
      text: message,
    }),
  });

  const msgData = await msgRes.json();
  if (!msgData.ok) {
    return { userId, success: false, error: `chat.postMessage: ${msgData.error}` };
  }

  return { userId, success: true };
}

export async function GET() {
  try {
    const botToken = process.env.SLACK_DUGOUT_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json(
        { error: "SLACK_DUGOUT_BOT_TOKEN is not configured" },
        { status: 500 },
      );
    }

    const todayIST = getISTDate();
    const dayOfWeek = todayIST.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json({
        success: true,
        message: "Skipping DMs on weekend",
        sent: 0,
      });
    }

    const todayMidnight = getISTDate();
    todayMidnight.setHours(0, 0, 0, 0);
    const oldest = (todayMidnight.getTime() / 1000).toString();
    const latest = (getISTDate().getTime() / 1000).toString();

    const [usersRes, historyRes] = await Promise.all([
      fetch("https://slack.com/api/users.list", {
        headers: { Authorization: `Bearer ${botToken}` },
      }),
      fetch(
        `https://slack.com/api/conversations.history?channel=${DUGOUT_CHANNEL_ID}&oldest=${oldest}&latest=${latest}`,
        { headers: { Authorization: `Bearer ${botToken}` } },
      ),
    ]);

    const usersData = await usersRes.json();
    const historyData = await historyRes.json();

    if (!usersData.ok)
      throw new Error(`users.list: ${usersData.error}`);
    if (!historyData.ok)
      throw new Error(`conversations.history: ${historyData.error}`);

    const adminUserIds = new Set(
      (process.env.NEXT_PUBLIC_ADMIN_USERS || "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    );

    const activeUserIds = new Set<string>();
    for (const msg of historyData.messages as SlackMessage[]) {
      if (msg.user) activeUserIds.add(msg.user);
      if (msg.reply_users) msg.reply_users.forEach((id) => activeUserIds.add(id));
    }

    const pendingUsers = (usersData.members as SlackUser[]).filter(
      (user) =>
        !user.deleted &&
        !user.is_bot &&
        !user.is_restricted &&
        !user.is_ultra_restricted &&
        !user.is_app_user &&
        user.id !== "USLACKBOT" &&
        !adminUserIds.has(user.id) &&
        !activeUserIds.has(user.id),
    );

    if (pendingUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending users to DM",
        sent: 0,
      });
    }

    const message =
      todayMessages[Math.floor(Math.random() * todayMessages.length)];

    const results: { userId: string; success: boolean; error?: string }[] = [];
    for (const user of pendingUsers) {
      results.push(await sendDM(user.id, message, botToken));
    }

    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: failed === 0,
      sent,
      failed,
      total: pendingUsers.length,
      results,
    });
  } catch (error) {
    console.error("Error in dm-users GET:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

