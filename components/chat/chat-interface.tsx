"use client";

import { useChat } from "@ai-sdk/react";
import { KeyboardEvent, useRef, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  CircleStop,
  LoaderCircle,
  Paperclip,
  SendHorizontal,
  ChevronDown,
  Copy,
  Check,
} from "lucide-react";
import { useLoginModal } from "@/hooks/use-login-modal";
import { useSession } from "@/lib/auth-client";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import MessageContent from "./message-content";
import { Thread } from "@prisma/client";
import { editThread, saveThreadMessages } from "@/actions";

export const ChatInterface = ({ thread }: { thread: Thread | null }) => {
  const {
    messages,
    handleInputChange,
    input,
    handleSubmit,
    isLoading,
    status,
    setMessages,
    stop,
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
      if (messages.length === 2) {
        if (!thread) return;
        editThread(thread.id, messages[0].content);
      }
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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollContainerRef.current;
        const isScrolledUp = scrollHeight - scrollTop - clientHeight > 50;
        setShowScrollButton(isScrolledUp);
      }
    };

    handleScroll();

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);

      window.addEventListener("resize", handleScroll);

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

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

  const handleCopyMessage = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    });
  };

  return (
    <div className="flex flex-col h-full relative">
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
                        <div className="flex justify-end mt-2">
                          <Button
                            onClick={() =>
                              handleCopyMessage(
                                message.content,
                                `message-${index}`
                              )
                            }
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            {copiedMessageId === `message-${index}` ? (
                              <>
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5 mr-1" />
                                Copy response
                              </>
                            )}
                          </Button>
                        </div>
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

      <div className="relative">
        {showScrollButton && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-50">
            <Button
              onClick={scrollToBottom}
              className="rounded-full shadow-md flex items-center gap-1 px-3 py-1"
              size="sm"
              variant="secondary"
            >
              <ChevronDown className="h-4 w-4" />
              <span>Scroll to bottom</span>
            </Button>
          </div>
        )}

        <div className="max-w-3xl mx-auto mt-2 w-full">
          <form
            onSubmit={handleSend}
            className="flex flex-col dark:bg-[#1e1e1e] bg-[#f7f6f6] rounded-lg overflow-hidden"
          >
            <TextareaAutosize
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                isLoading ? "Sending message..." : "Type your message here..."
              }
              className={`w-full scrollbar-hide resize-none bg-transparent dark:text-gray-300 text-gray-700 px-3 py-2.5 focus:outline-none placeholder-gray-500 text-sm transition-colors ${
                isLoading
                  ? "dark:placeholder-gray-600 placeholder-gray-500"
                  : ""
              }`}
              maxRows={8}
              minRows={2}
              disabled={isLoading}
            />
            <div className="flex items-center justify-end px-3 py-2">
              <Button
                className="dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-950 transition-colors disabled:opacity-40 mr-1"
                disabled={isLoading}
                size="icon"
                variant="ghost"
                type="button"
                onClick={() => handleFileUpload()}
              >
                <Paperclip className="size-3.5" />
              </Button>
              {status === "streaming" ? (
                <Button
                  type="button"
                  className="dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-950 transition-colors"
                  onClick={() => stop()}
                  size="icon"
                  variant="ghost"
                >
                  <CircleStop className="size-3.5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-950 transition-colors disabled:opacity-40"
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
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
