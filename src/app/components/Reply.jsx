//in card.jsx
import React, { useState } from "react";

import { useSession } from "next-auth/react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import useSWRMutation from "swr/mutation";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";

const formSchema = z.object({
  message: z
    .string()
    .min(1, { message: "Message must be at least 2 characters." }),
});

async function sendMessage(url, { arg }) {
  // console.log(arg);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to send message");
  return data;
}

function Reply({ timestamp }) {
  const { data: session } = useSession();
  // console.log(session);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const { trigger, isMutating } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/reply-message`,
    sendMessage,
  );

  async function onSubmit(values) {
    try {
      await trigger({
        channel: "C089LA005S8",
        text: values.message,
        userName: session?.user?.name,
        icon_url: session?.user?.image,
        ts: timestamp,
      });
      form.reset(); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  let [click, setClick] = useState(false);

  function handleClick() {
    setClick((p) => !p);
  }

  return (
    <div className="ml-3 mt-0 cursor-pointer">
      <TooltipProvider delayDuration={0.2}>
        <Tooltip>
          {session?.user && (
            <TooltipTrigger>
              <svg
                onClick={handleClick}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-reply"
              >
                <polyline points="9 17 4 12 9 7" />
                <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
              </svg>
            </TooltipTrigger>
          )}
          <TooltipContent>
            <p>Click to Reply</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {click &&
        session?.user(
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto mb-2 flex max-w-md items-center gap-4"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className="w-[25vw] max-md:w-[50vw] max-sm:w-[70vw]"
                        placeholder="Write a message..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <center className="relative right-16">
                <Button
                  className="bg-green-600 p-3"
                  type="submit"
                  disabled={isMutating}
                >
                  <SendHorizontal strokeWidth={1} />
                  {""}
                </Button>
              </center>
            </form>
          </Form>,
        )}
    </div>
  );
}

export default Reply;
