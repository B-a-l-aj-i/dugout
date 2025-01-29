'use client'

import { useState } from "react";
import useSWR from "swr";
import UserDetails from "./UserDetails";
import Loading from "./Loading";

import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";

export const fetcher1 = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Slack data");
  return res.json();
};


function ThreadModal({ channelId, timestamp ,replyCount}:{channelId:string,timestamp:number,replyCount:number}) {
    
  const [isOpen, setIsOpen] = useState(false);

  // Fetch data **only when modal is open**
  const { data, error, isLoading } = useSWR(
    isOpen ? `/api/threads?channelId=${channelId}&ts=${timestamp}` : null, // Only fetch when `isOpen` is true
    fetcher1,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (error) return <div>error..........</div>;
  if (isLoading) return (
    <DialogTrigger>
      <Button 
      onPress={() => setIsOpen(true)}
      className="inline-flex items-center justify-center rounded-md hover:bg-slate-400 bg-opacity-20 bg-clip-padding border border-white/20 px-3.5 py-2 font-medium font-[inherit] text-base text-gray-400 hover:text-black hover:bg-opacity-30 pressed:bg-opacity-40 transition-colors  outline-none focus-visible:ring-2 focus-visible:ring-white/75 cursor-pointer">
        {replyCount} replies
        {/* <Reply aria-label="Reply" /> */}
      </Button>
      <ModalOverlay
        className={({ isEntering, isExiting }) => `
          fixed inset-0 z-10 overflow-y-auto bg-black/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur
          ${isEntering ? "animate-in fade-in duration-300 ease-out" : ""}
          ${isExiting ? "animate-out fade-out duration-200 ease-in" : ""}
        `}
      >
        <Modal
          className={({ isEntering, isExiting }) => `
            m-auto
            w-full max-w-xl overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl
            ${isEntering ? "animate-in zoom-in-50 ease-out duration-300" : ""}
            ${isExiting ? "animate-out zoom-out-50 ease-in duration-200" : ""}
          `}
        >
          <Dialog role="alertdialog" className="outline-none relative">
            {({ close }) => (
              <>
                <Heading
                  slot="title"
                  className="flex  justify-between  text-xxl font-semibold leading-1 my-0 text-slate-700"
                >
                  Thread
                  <DialogButton
                    className="py-0 px-4 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 w-0  hover:border-slate-300 pressed:bg-slate-300"
                    onPress={close}
                  >
                    X
                  </DialogButton>
                </Heading>
                <p className="text-gray-400">Conversation thread and replies</p>
                <div>
               < Loading />
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );

  return (
    <DialogTrigger>
      <Button 
      onPress={() => setIsOpen(true)}
      className="inline-flex items-center justify-center rounded-md hover:bg-slate-400 bg-opacity-20 bg-clip-padding border border-white/20 px-3.5 py-2 font-medium font-[inherit] text-base text-gray-400 hover:text-black hover:bg-opacity-30 pressed:bg-opacity-40 transition-colors  outline-none focus-visible:ring-2 focus-visible:ring-white/75 cursor-pointer">
        {replyCount} replies
        {/* <Reply aria-label="Reply" /> */}
      </Button>
      <ModalOverlay
        className={({ isEntering, isExiting }) => `
          fixed inset-0 z-10 overflow-y-auto bg-black/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur
          ${isEntering ? "animate-in fade-in duration-300 ease-out" : ""}
          ${isExiting ? "animate-out fade-out duration-200 ease-in" : ""}
        `}
      >
        <Modal
          className={({ isEntering, isExiting }) => `
            m-auto
            w-full max-w-xl overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl
            ${isEntering ? "animate-in zoom-in-50 ease-out duration-300" : ""}
            ${isExiting ? "animate-out zoom-out-50 ease-in duration-200" : ""}
          `}
        >
          <Dialog role="alertdialog" className="outline-none relative">
            {({ close }) => (
              <>
                <Heading
                  slot="title"
                  className="flex  justify-between  text-xxl font-semibold leading-1 my-0 text-slate-700"
                >
                  Thread
                  <DialogButton
                    className="py-0 px-4 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 w-0  hover:border-slate-300 pressed:bg-slate-300"
                    onPress={close}
                  >
                    X
                  </DialogButton>
                </Heading>
                <p className="text-gray-400">Conversation thread and replies</p>

                {/* <UserDetails /> */}

                {data.messages.map((userInfo, key:number) => (
                  <div key={key}>
                    {data.messages[key - 1] != data.messages[key] && (
                      <hr className="mb-5 mt-5" />
                    )}
                    <div
                      className={`p-4 border-2 rounded-md mb-4  ${
                        key == 0 ? "ml-0" : "ml-5"
                      }`}
                    >
                      <UserDetails
                        userId={userInfo.user}
                        timestamp={userInfo.ts}
                      />
                      <p>{userInfo.text}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
function DialogButton({ className, ...props }) {
  return (
    <Button
      {...props}
      className={`inline-flex justify-center rounded-md border border-solid border-transparent px-5 py-2 font-semibold font-[inherit] text-base transition-colors cursor-default outline-none focus-visible:ring-2 ring-blue-500 ring-offset-2 ${className}`}
    />
  );
}

export default ThreadModal;
