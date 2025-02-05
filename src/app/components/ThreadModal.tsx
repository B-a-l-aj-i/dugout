"use client";

import ThreadMesssage from "./ThreadMesssage";

import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";

function ThreadModal({
  channelId,
  timestamp,
  replyCount,
}: {
  channelId: string;
  timestamp: string;
  replyCount: number;
}) {
  if (replyCount <= 0) return null;

  return (
    <DialogTrigger>
      <Button
        className={`pressed:bg-opacity-40 inline-flex items-center justify-center rounded-md border border-white/20 bg-opacity-20 bg-clip-padding px-3.5 py-2 font-[inherit] text-base font-medium text-gray-400 outline-none transition-colors hover:bg-slate-400 hover:bg-opacity-30 hover:text-black focus-visible:ring-2 focus-visible:ring-white/75`}
      >
        {replyCount} replies
        {/* <Reply aria-label="Reply" /> */}
      </Button>
      <ModalOverlay
        className={({ isEntering, isExiting }) =>
          `fixed inset-0 z-10 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 p-4 text-center backdrop-blur ${isEntering ? "animate-in fade-in duration-300 ease-out" : ""} ${isExiting ? "animate-out fade-out duration-200 ease-in" : ""} `
        }
      >
        <Modal
          className={({ isEntering, isExiting }) =>
            `m-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl ${isEntering ? "animate-in zoom-in-50 duration-300 ease-out" : ""} ${isExiting ? "animate-out zoom-out-50 duration-200 ease-in" : ""} `
          }
        >
          <Dialog role="alertdialog" className="relative outline-none">
            {({ close }) => (
              <>
                <Heading
                  slot="title"
                  className="text-xxl leading-1 my-0 flex justify-between font-semibold text-slate-700"
                >
                  Thread
                  <DialogButton
                    className="pressed:bg-slate-300 w-0 cursor-pointer bg-slate-100 px-4 py-0 text-slate-800 hover:border-slate-300 hover:bg-slate-200"
                    onPress={close}
                  >
                    x
                  </DialogButton>
                </Heading>
                <p className="text-gray-400">Conversation thread and replies</p>

                <ThreadMesssage channelId={channelId} timestamp={timestamp} />
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
function DialogButton({ className = "", ...props }) {
  return (
    <Button
      {...props}
      className={`inline-flex cursor-default justify-center rounded-md border border-solid border-transparent px-5 py-2 font-[inherit] text-base font-semibold outline-none ring-blue-500 ring-offset-2 transition-colors focus-visible:ring-2 ${className}`}
    />
  );
}

export default ThreadModal;
