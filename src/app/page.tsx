"use client";

import Header from "@/app/components/Header";
import { SendMessage } from "./components/SendMessage";
import { useSession } from "next-auth/react";
import Messages from "./components/Messages";
import Sidebar from "./components/Sidebar";

export default function App() {
  const { data: session } = useSession();

  return (
    <div>
      <Sidebar />
      <Header user={session?.user} />
      {session?.user && <SendMessage user={session?.user} />}
      <Messages />
    </div>
  );
}
