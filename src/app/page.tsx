import Header from "@/app/components/Header";
import { SendMessage } from "./components/SendMessage";
import Messages from "./components/Messages";
import { auth } from "./auth";

export default async function App() {
  const session = await auth();

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-list`, {
    next: { revalidate: 60 * 1 },
  });
  const { members } = await res.json();

  return (
    <div>
      {/* <pre className="z-[1000]">{JSON.stringify(members, null, 2)}</pre> */}

      <Header user={session?.user} />
      {(!session?.user && (
        <div>
          <div className="mx-auto">
            {session?.user?.email == "connectbalajidev@gmail.com" && (
              <SendMessage user={session?.user} />
            )}
            <Messages members={members} />
          </div>
        </div>
      )) || (
        <div className="flex min-h-screen items-center justify-center">
          Sign In to view contents
        </div>
      )}
    </div>
  );
}
