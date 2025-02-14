import Header from "@/app/components/Header";
import { SendMessage } from "./components/SendMessage";
import Messages from "./components/Messages";
import Sidebar from "./components/Sidebar";
import { auth } from "./auth";
export default async function App() {
  const session = await auth();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-list`, {
    next: { revalidate: 60 * 1 },
  });
  const { members } = await res.json();

  // console.log(members);

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* <pre>{JSON.stringify(members, null, 2)}</pre> */}
      <Sidebar members={members} />
      <div>
        <Header user={session?.user} />
        {session?.user && <SendMessage user={session?.user} />}
        <Messages />
      </div>
    </div>
  );
}
