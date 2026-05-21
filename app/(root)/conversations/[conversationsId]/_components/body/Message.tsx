import { cn } from "@/lib/utils";
import React from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type messageContent = {
  type: "text" | "image" | "video" | "file";
  value: string;
  fileName?: string;
};
type Props = {
  fromCurrentUser: boolean;
  senderImage: string;
  senderName: string;
  lastByUser: boolean;
  content: messageContent[];
  createdAt: number;
  seen?: React.ReactNode;
};

const Message = ({
  fromCurrentUser,
  senderImage,
  senderName,
  lastByUser,
  content,
  createdAt,
  seen,
}: Props) => {
  const formatTime = (timeStamp: number) => {
    return format(timeStamp, "HH:mm");
  };

  return (
    <div className={cn("flex items-end", { "justify-end": fromCurrentUser })}>
      <div
        className={cn("flex flex-col w-full mx-2 my-4", {
          "order-1 items-end": fromCurrentUser,
          "order-2 items-start": !fromCurrentUser,
        })}
      >
        <div
          className={cn("px-4 py-2 rounded-lg max-w-[70%]", {
            "bg-primary text-primary-foreground": fromCurrentUser,
            "bg-secondary text-secondary-foreground": !fromCurrentUser,
            "rounded-br-none": !lastByUser && fromCurrentUser,
            "rounded-bl-none": !lastByUser && !fromCurrentUser,
          })}
        >
          <div className="flex flex-col gap-2">
            {content.map((item, i) => {
              switch (item.type) {
                case "text":
                  return (
                    <p key={i} className="whitespace-pre-wrap break-all">
                      {item.value}
                    </p>
                  );

                case "image":
                  return (
                    <img
                      key={i}
                      src={item.value}
                      alt="image"
                      className="max-w-[200px] rounded-md"
                    />
                  );

                case "video":
                  return (
                    <video
                      key={i}
                      src={item.value}
                      controls
                      className="max-w-[250px] rounded-md"
                    />
                  );

                case "file":
                  return (
                    <a
                      key={i}
                      href={item.value}
                      target="_blank"
                      className="underline text-sm"
                    >
                    {item.fileName || "Download file"}
                    </a>
                  );

                default:
                  return null;
              }
            })}
          </div>
          <p
            className={cn("text-xs flex w-full my-1", {
              "text-primary-foreground justify-end": fromCurrentUser,
              "text-secondary-foreground justify-start": !fromCurrentUser,
            })}
          >
            {formatTime(createdAt)}
          </p>
        </div>
        {seen}
      </div>

      <Avatar
        className={cn("relative w-8 h-8", {
          "order-2": fromCurrentUser,
          "order-1": !fromCurrentUser,
          invisible: lastByUser,
        })}
      >
        <AvatarImage src={senderImage} />
        <AvatarFallback>{senderName.substring(0, 1)}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Message;
