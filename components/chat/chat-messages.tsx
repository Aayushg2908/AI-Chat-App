"use client";

import { useChatContext } from "@/components/chat-provider";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import MessageContent from "./message-content";

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
      <div className="h-[calc(100%-111px)] flex items-center justify-center">
        <p className="text-gray-500 text-sm">Start a conversation...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100%-111px)] overflow-y-auto scrollbar-hide">
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn(
            "p-4 space-y-2",
            message.role === "user" ? "bg-gray-800" : "bg-transparent"
          )}
        >
          <div className="flex items-start">
            <div className="font-semibold text-xs text-gray-400 uppercase mr-2">
              {message.role === "user" ? "You" : "AI"}:
            </div>
            <MessageContent content={message.content} />
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
