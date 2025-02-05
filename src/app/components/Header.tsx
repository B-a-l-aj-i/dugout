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
    <header className="fixed top-0 mt-0 flex w-[100vw] items-center justify-around bg-white">
      {/* <div > */}
      <div>
        <h1 className="mb-4 text-4xl font-bold">Dugout</h1>
      </div>
      <div>
        {(user && (
          <div className="flex items-center gap-2">
            <p>{user.name}</p>
            <Image
              alt="profile pic"
              className="rounded-full"
              width={50}
              height={50}
              src={user.image}
            />
            <button
              onClick={() => signOut()}
              className="rounded-lg border bg-black p-1 text-white"
            >
              {" "}
              sign Out
            </button>
          </div>
        )) || (
          <button
            onClick={() => signIn()}
            className="rounded-lg bg-black p-1 text-white"
          >
            Sign In
          </button>
        )}
      </div>
      {/* </div> */}
    </header>
  );
}

export default Header;
