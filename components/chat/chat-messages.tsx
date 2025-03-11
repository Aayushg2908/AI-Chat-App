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

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Start a conversation...</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="w-full flex flex-col pb-0">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "p-4",
              message.role === "user" ? "flex justify-end" : ""
            )}
          >
            {message.role === "user" ? (
              <div className="bg-blue-600 text-white px-3 py-2 rounded-2xl max-w-[80%]">
                <MessageContent
                  content={message.content}
                  isUserMessage={true}
                />
              </div>
            ) : (
              <div className="w-full">
                <MessageContent
                  content={message.content}
                  isUserMessage={false}
                />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} className="h-0" />
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;
