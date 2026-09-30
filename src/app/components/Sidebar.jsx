"use client";

import React, { useEffect, useState } from "react";
import { UserContext, UsersContext } from "@/context/user";
import { useRouter, useSearchParams } from "next/navigation";
import { useToggleStore } from "@/utils/store";
import { UserRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function SidebarFilter({ members, pendingUsers, isToday }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterType, setFilterType] = useState("pending");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [resultSummary, setResultSummary] = useState(null);

  async function handleNotifyUsers() {
    setIsSending(true);
    try {
      const res = await fetch("/api/dm-users");
      const data = await res.json();
      setResultSummary(data);
      setConfirmOpen(false);
      setSuccessOpen(true);
    } catch (err) {
      setResultSummary({ error: err?.message || "Request failed" });
      setConfirmOpen(false);
      setSuccessOpen(true);
    } finally {
      setIsSending(false);
    }
  }

  const filteredItemsArray = members?.filter(
    (user) =>
      user.real_name !== "AJ" &&
      user.real_name !== "Slackbot" &&
      user.is_bot === false &&
      user.deleted == false &&
      user.real_name,
  );

  pendingUsers?.sort((a, b) => a.real_name?.localeCompare(b.real_name));
  filteredItemsArray?.sort((a, b) => a.real_name?.localeCompare(b.real_name));

  const { users, setUsers } = UsersContext();
  useEffect(() => {
    setUsers(members);
  }, []);

  const { user, setUser } = UserContext();

  const handleUserClick = (userId) => {
    setUser(userId);
    const params = new URLSearchParams(searchParams.toString());
    if (userId) {
      params.set("user", userId);
    } else {
      params.delete("user");
    }
    router.push(`?${params.toString()}`);
  };

  const { isOpen, toggle } = useToggleStore();

  return (
    <div
      className={`z-40 h-full transform bg-white p-4 text-[15px] transition-transform duration-300 ease-in-out max-lg:top-0 ${isOpen || "max-lg:-translate-x-full"} max-md:block`}
    >
      <div className="mb-4 flex items-center p-2">
        <div className="pb-1">
          <svg
            width="20"
            height="20"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.8125 4.71436C11.8125 6.26766 10.5533 7.52686 8.99998 7.52686C7.4467 7.52686 6.1875 6.26766 6.1875 4.71436C6.1875 3.16105 7.4467 1.90186 8.99998 1.90186C10.5533 1.90186 11.8125 3.16105 11.8125 4.71436Z"
              stroke="#999999"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
            <path
              d="M8.99879 9.77686C5.93646 9.77686 3.61307 11.5959 2.6617 14.1683C2.29254 15.1664 3.14559 16.0981 4.20984 16.0981H13.7878C14.852 16.0981 15.7051 15.1664 15.3359 14.1683C14.3845 11.5959 12.0612 9.77686 8.99879 9.77686Z"
              stroke="#999999"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <select
          className="w-[120px] rounded-md p-2 pr-6 text-[17px] text-gray-600 outline-none"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="all">All Users</option>
        </select>

        {/* Close Button */}
        <button
          onClick={toggle}
          className="ml-auto hidden text-xl font-bold text-gray-600 max-lg:block"
        >
          ✖
        </button>
      </div>

      <div className="max-h-[80vh] space-y-2 overflow-auto">
        {filterType === "all" && (
          <button
            onClick={() => handleUserClick("")}
            className="w-full gap-2 rounded-md bg-gray-200 px-4 pt-1 text-center"
          >
            ALL
          </button>
        )}

        {(filterType === "all" ? filteredItemsArray : pendingUsers)?.map(
          (userInfo, key) => (
            <button
              key={key}
              className={`flex w-full items-center justify-start gap-3 rounded-md p-2 text-left transition-colors duration-200 hover:bg-gray-200 ${
                user === userInfo.id ? "bg-gray-300" : ""
              }`}
              onClick={() => handleUserClick(userInfo.id)}
            >
              <img
                className="h-6 w-6 rounded-full"
                src={userInfo?.profile.image_24 || "/globe.svg"}
                alt="User Avatar"
              />
              <p>{userInfo?.real_name || userInfo?.profile.real_name}</p>
            </button>
          ),
        )}
        {filterType == "pending" && isToday && (
          <button
            onClick={() => setConfirmOpen(true)}
            className="ml-[3%] mt-4 h-7 w-fit items-center justify-center rounded-md bg-[#EDEDED] px-2 py-[5.5px] align-middle transition-colors duration-200 hover:bg-gray-300"
          >
            Notify {pendingUsers?.length} people
          </button>
        )}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notify pending users?</DialogTitle>
            <DialogDescription>
              This will send a private DM from Dugout Bot to{" "}
              {pendingUsers?.length} {pendingUsers?.length === 1 ? "person" : "people"}{" "}
              who haven&apos;t posted today.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button onClick={handleNotifyUsers} disabled={isSending}>
              {isSending ? "Sending…" : "Notify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {resultSummary?.error ? "Something went wrong" : "Notifications sent"}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setSuccessOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SidebarFilter;
