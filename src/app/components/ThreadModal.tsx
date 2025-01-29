'use Client'

import useSWR from "swr";
// import { slackFetcher } from "@/utils/fetchUtils";
import UserDetails from "./UserDetails";

import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";

const fetcher = async ([url, body]) => {
    console.log(url);
    
    const res = await fetch(`/api/slack/fetcher?url=${encodeURIComponent(url)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
  
    if (!res.ok) throw new Error("Failed to fetch Slack data");
  
    return res.json();
  };
function ThreadModal({ channelId, timestamp }) {
    
  const { data, error, isLoading } = useSWR(
    [`https://slack.com/api/conversations.replies?channel=${channelId}&ts=${timestamp}&pretty=1`],
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (error) return <div>error..........</div>;
  if (isLoading) return <div>Loading......</div>;

  console.log(data);

  return (
    <DialogTrigger>
      <Button className="inline-flex items-center justify-center rounded-md hover:bg-slate-400 bg-opacity-20 bg-clip-padding border border-white/20 px-3.5 py-2 font-medium font-[inherit] text-base text-gray-400 hover:text-black hover:bg-opacity-30 pressed:bg-opacity-40 transition-colors  outline-none focus-visible:ring-2 focus-visible:ring-white/75 cursor-pointer">
        {data.messages.length - 1} replies
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

                {data.messages.map((userInfo, key) => (
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
