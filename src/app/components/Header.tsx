"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import SmoothDatePicker from "./DatePicker";
import { CircleUserRound, Menu } from "lucide-react";
import { useToggleStore } from "@/utils/store";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Header({ user }: { user: any }) {
  const selectedDay = (date: { oldest: number; latest: number }) => {
    return date;
  };
  const { data: session } = useSession();

  const { isOpen, toggle } = useToggleStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="animate-slideDown sticky top-0 z-20 mx-auto flex w-full bg-white py-3 max-lg:justify-around">
      {!session && (
        <Menu
          onClick={toggle}
          className="mb-5 hidden min-w-11 cursor-pointer align-middle max-lg:inline-flex"
        />
      )}

      {
        <div
          className={`ml-11 flex gap-2 max-md:hidden max-md:${isOpen ? "absolute hidden" : "hidden"}`}
        >
          <h1 className="font-mono text-xl font-[400] tracking-wide">dugout</h1>
        </div>
      }

      {(!session && (
        <div className="mx-auto">
          <SmoothDatePicker getSelectedDay={selectedDay} />
        </div>
      )) || <div className="mx-auto"></div>}
      {/* Desktop User Info */}
      <div className="relative w-fit max-lg:hidden">
        {(user && (
          <div className="group flex cursor-pointer items-center justify-center gap-2 align-middle">
            <div className="mr-11 flex items-center justify-center gap-[10px] align-middle">
              <Image
                alt="profile pic"
                className="rounded-full"
                width={20}
                height={20}
                src={user?.image || "/globe.svg"}
              />
              <p className="pt-1 text-[15px]">{user?.name || "Anonymous"}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="absolute left-6 top-6 hidden rounded-xl border px-2 py-1 text-xs transition-all hover:bg-black hover:text-white group-hover:inline-flex"
            >
              Sign Out
            </button>
          </div>
        )) || (
          <button
            onClick={() => signIn()}
            className="duration-600 rounded-xl border px-2 py-1 text-xs transition-colors hover:bg-black hover:text-white"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Mobile Dropdown Toggle */}
      <div className="relative hidden max-lg:block">
        {(user && (
          <Image
            alt="profile pic"
            className="cursor-pointer rounded-full"
            width={25}
            height={25}
            src={user?.image || "/globe.svg"}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
        )) || (
          <CircleUserRound
            className="hidden min-w-fit cursor-pointer px-2 align-middle max-lg:block"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
        )}

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 rounded-lg border bg-white shadow-lg">
            {user ? (
              <>
                <div className="flex items-center gap-2 p-2">
                  <Image
                    src={user?.image || "/globe.svg"}
                    alt="profile pic"
                    className="rounded-full"
                    width={20}
                    height={20}
                  />
                  <p className="text-sm">{user?.name || "Anonymous"}</p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="w-full rounded-b-lg px-4 py-2 text-left text-sm transition-colors hover:bg-gray-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="w-full rounded-lg px-11 py-2 text-left text-sm transition-colors hover:bg-gray-200"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
