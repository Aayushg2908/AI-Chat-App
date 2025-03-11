"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useChat as useVercelChat } from "@ai-sdk/react";
import { Message } from "@ai-sdk/react";

interface ChatContextProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  append: (message: Message) => void;
  reload: () => void;
  stop: () => void;
  setInput: (input: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    reload,
    stop,
    setInput,
    isLoading,
  } = useVercelChat({
    api: "/api/chat",
    onError: (error: Error) => {
      console.error("Chat error:", error);
    },
  });

  return (
    <ChatContext.Provider
      value={{
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        append,
        reload,
        stop,
        setInput,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
