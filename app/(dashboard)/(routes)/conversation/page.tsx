"use client";

import Heading from "@/components/Heading";
import { Divide, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";

const ConversationPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const [data, setData] = useState("");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await axios
      .post("/api/conversation", {
        messages: values.prompt,
      })
      .then((response) => {
        setData(response.data.text);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Generate text-based conversations with Rysex."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:bg-transparent"
                        disabled={isLoading}
                        placeholder="How can I help you ?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && <div>Loading...</div>}
          {data && !isLoading ? (
            <div className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm">
              <p className="text-sm text-gray-500">Response</p>
              <p className="text-lg text-gray-800">{data}</p>
            </div>
          ) : (
            <div>No Message</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
