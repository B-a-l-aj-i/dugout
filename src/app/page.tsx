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
  // session format
  // {
  //   "user": {
  //     "name": "Balaji.M",
  //     "email": "connectbalajidev@gmail.com",
  //     "image": "https://avatars.slack-edge.com/2025-01-20/8336513778497_6f16d7fd2dd2c07a48db_512.jpg"
  //   },
  //   "expires": "2025-03-20T06:18:01.758Z",
  //   "access_token": "xoxp-8326339965828-8323731058851-8389782863075-11210026f11810559e34603b8b1d74f1"
  // }
  return (
    <div>
      <Header user={session?.user} />
      <div className="flex min-h-screen">
        {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
        <Sidebar members={members} />
        <div className="mx-auto w-1/2 max-sm:w-[90%]">
          {session?.user?.email == "connectbalajidev@gmail.com" && (
            <SendMessage user={session?.user} />
          )}
          <Messages />
        </div>
      </div>
    </div>
  );
}
