"use client";
//in page.tsx
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
import { Input } from "@/components/ui/input";
import useSWRMutation from "swr/mutation";

const formSchema = z.object({
  message: z
    .string()
    .min(2, { message: "Message must be at least 2 characters." }),
});

async function sendMessage(url, { arg }) {
  console.log(arg);
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

export function SendMessage({ user }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const { trigger, isMutating } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-message`,
    sendMessage,
  );

  async function onSubmit(values) {
    try {
      await trigger({
        channel: "C089LA005S8",
        text: values.message,
        userName: user?.name,
        icon_url: user?.image,
      });
      form.reset(); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-md space-y-4"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Write a message..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <center>
          <Button type="submit" disabled={isMutating}>
            {isMutating ? "Sending..." : "Send"}
          </Button>
        </center>
      </form>
    </Form>
  );
}
