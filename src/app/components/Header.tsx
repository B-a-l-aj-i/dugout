"use client";

import { signIn, signOut } from "next-auth/react";
import Image from "next/image";

// interface IUserProps {
//   id: string;
//   name: string;
//   image: string;
// }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Header({ user }: { user: any }) {
  return (
    <header className="sticky top-0 flex w-[100vw] items-center justify-around bg-white py-2">
      <div>
        <h1 className="mb-4 text-4xl font-bold">Dugout</h1>
      </div>
      <div>
        {(user && (
          <div className="flex items-center gap-2">
            <p>{user?.name}</p>
            <Image
              alt="profile pic"
              className="rounded-full"
              width={50}
              height={50}
              src={user?.image}
            />
            <button
              onClick={() => signOut()}
              className="rounded-xl border px-2 py-1 transition-all hover:bg-black hover:text-white"
              style={{ transitionDelay: "0.3s" }}
            >
              {" "}
              sign Out
            </button>
          </div>
        )) || (
          <button
            onClick={() => signIn()}
            className="rounded-xl border px-2 py-1 transition-all ease-in-out hover:bg-black hover:text-white"
            style={{ transitionDelay: "0.3s" }}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
