"use client";

import { useChat } from "@ai-sdk/react";
import { KeyboardEvent, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { LoaderCircle, Paperclip, SendHorizontal } from "lucide-react";
import { useLoginModal } from "@/hooks/use-login-modal";
import { useSession } from "@/lib/auth-client";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import MessageContent from "./message-content";
import { Thread } from "@prisma/client";
import { saveThreadMessages } from "@/actions";

export const ChatInterface = ({ thread }: { thread: Thread | null }) => {
  const {
    messages,
    handleInputChange,
    input,
    handleSubmit,
    isLoading,
    status,
    setMessages,
  } = useChat({
    api: "/api/chat",
    onError: (error: Error) => {
      console.error("Chat error:", error);
    },
  });

  useEffect(() => {
    if (thread) {
      setMessages(JSON.parse(thread.messages || "[]"));
    }
  }, []);

  useEffect(() => {
    if (status === "ready" && messages.length > 0) {
      const saveMessages = async () => {
        if (!thread) return;
        await saveThreadMessages(thread.id, JSON.stringify(messages));
      };
      saveMessages();
    }
  }, [status]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { onOpen } = useLoginModal();
  const { data } = useSession();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }
    });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      if (!data?.user && !data?.user.id) {
        onOpen();
        return;
      }

      handleSubmit(e as React.FormEvent<HTMLFormElement>);
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleFileUpload = async () => {
    console.log("handleFileUpload");
    try {
      if (!data?.user && !data?.user.id) {
        onOpen();
        return;
      }
      console.log("File uploaded");
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        {!messages || messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500 text-sm">Start a conversation...</p>
          </div>
        ) : (
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
                    key={`message-${index}-${message.role}`}
                    className={cn(
                      "w-full",
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
                {status === "submitted" && (
                  <div className="flex items-start space-x-2 animate-in fade-in">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto mt-2 w-full">
        <form
          onSubmit={handleSend}
          className="flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden"
        >
          <TextareaAutosize
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isLoading ? "Sending message..." : "Type your message here..."
            }
            className={`w-full scrollbar-hide resize-none bg-transparent text-gray-300 px-3 py-2.5 focus:outline-none placeholder-gray-500 text-sm transition-colors ${
              isLoading ? "placeholder-gray-600" : ""
            }`}
            maxRows={8}
            minRows={2}
            disabled={isLoading}
          />
          <div className="flex items-center justify-end px-3 py-2">
            <Button
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-40 mr-1"
              disabled={isLoading}
              size="icon"
              variant="ghost"
              type="button"
              onClick={() => handleFileUpload()}
            >
              <Paperclip className="size-3.5" />
            </Button>
            <Button
              type="submit"
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-40"
              disabled={!input.trim() || isLoading}
              size="icon"
              variant="ghost"
            >
              {isLoading ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <SendHorizontal className="size-3.5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
