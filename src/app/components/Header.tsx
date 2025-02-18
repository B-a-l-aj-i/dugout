"use client";

import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Logo from "./Logo";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Header({ user }: { user: any }) {
  return (
    <header className="sticky top-0 z-20 flex w-[100vw] justify-around bg-white py-2">
      <div className="flex gap-2">
        <Logo />
        <h1 className="mb-4 text-sm font-bold">Dugout</h1>
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
              className="rounded-xl border px-2 py-1 text-xs transition-all hover:bg-black hover:text-white"
              style={{ transitionDelay: "0.3s" }}
            >
              {" "}
              sign Out
            </button>
          </div>
        )) || (
          <button
            onClick={() => signIn()}
            className="rounded-xl border px-2 py-1 text-xs transition-all ease-in-out hover:bg-black hover:text-white"
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
