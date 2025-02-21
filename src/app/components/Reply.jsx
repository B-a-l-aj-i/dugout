//in card.jsx
import React, { useState } from "react";

import { useSession } from "next-auth/react";
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

function Reply({ click, timestamp }) {
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

  return (
    <div className="mx-auto mt-4 w-fit cursor-pointer">
      {click && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mb-2 mt-5 flex max-w-md items-center gap-4"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="w-[35vw] max-md:w-[50vw] max-sm:w-[70vw]"
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
              </Button>
            </center>
          </form>
        </Form>
      )}
    </div>
  );
}

export default Reply;
