"use client";

import { useChatContext } from "@/components/chat-provider";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import MessageContent from "./message-content";
import { ScrollArea } from "../ui/scroll-area";

const ChatMessages = () => {
  const { messages } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex flex-col pb-0">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "p-4 space-y-2",
              message.role === "user" ? "bg-gray-800" : "bg-transparent"
            )}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <MessageContent content={message.content} />
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} className="h-0" />
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
