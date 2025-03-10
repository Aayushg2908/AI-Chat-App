"use client";

import TextareaAutosize from "react-textarea-autosize";
import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { LoaderCircle, Paperclip, SendHorizontal } from "lucide-react";

export const ChatInput = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const message = input.trim();
    if (!message || isLoading) return;

    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Sending message:", message);
      setInput("");
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="z-10 absolute bottom-0 left-0 right-0 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden">
          <TextareaAutosize
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isLoading ? "Sending message..." : "Type your message here..."
            }
            className={`w-full resize-none bg-transparent text-gray-300 px-3 py-2.5 focus:outline-none placeholder-gray-500 text-sm transition-colors ${
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
            >
              <Paperclip className="size-3.5" />
            </Button>
            <Button
              onClick={() => handleSend()}
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
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
