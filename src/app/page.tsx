"use client";

import Header from "@/app/components/Header";
import { SendMessage } from "./components/SendMessage";
import { useSession } from "next-auth/react";
import Messages from "./components/Messages";
// import type { Metadata } from "next";

// const CHANNELID = "C089LA005S8";

// export const metadata: Metadata = {
//   title: "Dugout",
// };

export default function App() {
  const { data: session } = useSession();

  return (
    <>
      <Header user={session?.user} />
      {/* <pre>{JSON.stringify(session?.user, null, 2)}</pre> */}
      {session?.user && <SendMessage user={session?.user} />}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <Messages />
    </>
  );
}
