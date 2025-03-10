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
  //   "access_token": "*************************"
  // }
  console.log(members);

  return (
    <div>
      <Header user={session?.user} />
      {/* <pre>{JSON.stringify(members, null, 2)}</pre> */}
      <div className="flex min-h-screen">
        {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
        <Sidebar members={members} />
        <div className="mx-auto w-full px-4">
          {session?.user?.email == "connectbalajidev@gmail.com" && (
            <SendMessage user={session?.user} />
          )}
          <Messages members={members} />
        </div>
      </div>
    </div>
  );
}
