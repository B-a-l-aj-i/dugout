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

  console.log(members);
  // let session = { id: "U089HMH1QR1", is_admin: true };
  console.log(session);
  // console.log(members.find((user: { id: string }) => user.id === session?.id));

  return (
    <div>
      <Header user={session?.user} />
      <div className="flex min-h-screen">
        {/* <pre>{JSON.stringify(members, null, 2)}</pre> */}
        <Sidebar members={members} />
        <div className="mx-auto max-w-xl">
          {members.find((user: { id: string }) => user.id === session?.user?.id)
            ?.is_admin && <SendMessage user={session?.user} />}

          <Messages />
        </div>
      </div>
    </div>
  );
}
