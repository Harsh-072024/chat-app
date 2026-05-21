"use client";

import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/convex/_generated/api";
import { useConversation } from "@/hooks/useConversations";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { CirclePlus, File, Image, SendHorizonal, Video } from "lucide-react";
import { useMutation } from "convex/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const chatMessageSchema = z.object({
  content: z.string().min(1, { message: "This field can't be empty" }),
});

const ChatInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { conversationId } = useConversation();

  const { mutate: createMessage, pending } = useMutationState(
    api.message.create
  );
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const uploadFile = async (File: File) => {
    console.log("Uploading file:", File.name, "Size:", File.size, "Type:", File.type);
    // if(File.size)

    const maxSize = 2 * 1024 *1024;

    if(File.size > maxSize) {
      throw new Error("File size exceeds the 2MB limit");
    };

    const uploadUrl = await generateUploadUrl();
    const result = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": File.type },
      body: File,
    });

    const { storageId } = await result.json();
    return storageId;
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileId = await uploadFile(file);

      await createMessage({
        conversationId,
        content: [
          {
            type: "image",
            value: fileId,
          },
        ],
      });
    } catch (error:any) {
      console.log(error)
      toast.error(error.message ||"Image upload failed");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileId = await uploadFile(file);

      await createMessage({
        conversationId,
        content: [
          {
            type: "file",
            value: fileId,
            fileName: file.name,
            mimeType: file.type,
            size: file.size,
          },
        ],
      });
    } catch (error) {
      toast.error("File upload failed");
    }
  };

  const handleVideoSelect = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;

    try {
      const fileId = await uploadFile(file);

      await createMessage({
        conversationId,
        content: [
          {
            type: "video",
            value: fileId,
          },
        ],
      })
    } catch (error: any) {
      toast.error(error.message || "Video upload failed")
    }
  }

  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target;

    if (selectionStart !== null) {
      form.setValue("content", value);
    }
  };

  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    createMessage({
      conversationId,
      content: [
        {
          type: "text",
          value: values.content,
        },
      ],
    })
      .then(() => {
        form.reset();
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "Unexpected error occured",
        );
      });
  };

  return (
    <Card className="w-full p-2 rounded-lg relative">
      <div className="flex gap-2 items-end w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex gap-2 items-end w-full"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                return (
                  <FormItem className="h-full w-full">
                    <FormControl>
                      <TextareaAutosize
                        onKeyDown={async (e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            await form.handleSubmit(handleSubmit)();
                          }
                        }}
                        rows={1}
                        maxRows={3}
                        {...field}
                        onChange={handleInputChange}
                        onClick={handleInputChange}
                        placeholder="Type a message..."
                        className="min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <CirclePlus className="cursor-pointer" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => imageInputRef.current?.click()}
                  className="p-4"
                >
                  <Image className="text-blue-600 " /> Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="p-4">
                <File className="text-blue-600"/>File / PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => videoInputRef.current?.click()} className="p-4">
                <Video className="text-blue-600"/>Video
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button disabled={pending} size="icon" type="submit">
              <SendHorizonal />
            </Button>
          </form>
        </Form>
      </div>
      {/* Hidden Inputs */}
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        className="hidden"
        onChange={handleImageSelect}
      />

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        type="file"
        accept=".mp4"
        ref={videoInputRef}
        className="hidden"
        onChange={handleVideoSelect}
      />
    </Card>
  );
};

export default ChatInput;
