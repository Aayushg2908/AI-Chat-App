"use client";

import { useChatContext } from "@/components/chat-provider";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import MessageContent from "./message-content";

const ChatMessages = () => {
  const { messages } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }
    });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500 text-sm">Start a conversation...</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
      style={{
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(156, 163, 175, 0.5) transparent",
      }}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="w-full flex flex-col space-y-6 py-4">
          {messages.map((message, index) => (
            <div
              key={`message-${index}-${message.role}-${Date.now()}`}
              className={cn(
                "w-full",
                message.role === "user" ? "flex justify-end" : ""
              )}
            >
              {message.role === "user" ? (
                <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl max-w-[80%]">
                  <MessageContent
                    content={message.content}
                    isUserMessage={true}
                  />
                </div>
              ) : (
                <div className="w-full max-w-full overflow-hidden">
                  <MessageContent
                    content={message.content}
                    isUserMessage={false}
                  />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
