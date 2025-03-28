"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  CircleStop,
  LoaderCircle,
  SendHorizontal,
  ChevronDown,
  Copy,
  Check,
  Edit,
  RefreshCw,
} from "lucide-react";
import { useLoginModal } from "@/hooks/use-login-modal";
import { useSession } from "@/lib/auth-client";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import MessageContent from "./message-content";
import { Thread } from "@prisma/client";
import { editThread, saveThreadMessages } from "@/actions";
import ModelSelector from "./model-selector";
import { toast } from "sonner";

interface Source {
  id: string;
  sourceType: string;
  title: string;
  url: string;
}

interface MessagePart {
  type: string;
  text?: string;
  source?: Source;
}

interface ExtendedMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: string;
  parts?: MessagePart[];
  sources?: Array<{
    title?: string;
    url: string;
    snippet?: string;
  }>;
}

const ChatInterface = ({ thread }: { thread: Thread | null }) => {
  const [selectedModel, setSelectedModel] = useState<string>(
    localStorage.getItem(`model:${thread?.id}`) ||
      "gemini-2.0-flash-lite-preview-02-05"
  );
  const [isSearchEnabled, setIsSearchEnabled] = useState<boolean>(false);
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [effortLevel, setEffortLevel] = useState<string>("low");
  const [contextItems, setContextItems] = useState<
    Array<{ id: string; text: string }>
  >([]);

  const {
    messages: chatMessages,
    handleInputChange,
    input,
    handleSubmit,
    isLoading,
    status,
    setMessages: setChatMessages,
    stop,
    append,
  } = useChat({
    api: "/api/chat",
    body: {
      model: selectedModel,
      search: isSearchEnabled,
      effortLevel,
      context: contextItems.map((item) => item.text).join("\n"),
    },
    onError: (error: Error) => {
      console.error("Chat error:", error);
    },
    experimental_throttle:
      selectedModel.includes("gpt") || selectedModel.includes("o3") ? 50 : 0,
  });

  const messages = chatMessages as unknown as ExtendedMessage[];
  const setMessages = setChatMessages as unknown as React.Dispatch<
    React.SetStateAction<ExtendedMessage[]>
  >;

  useEffect(() => {
    if (thread) {
      setMessages(JSON.parse(thread.messages || "[]"));
    }
  }, []);

  const [shouldSaveMessages, setShouldSaveMessages] = useState(false);

  useEffect(() => {
    if (status === "ready" && messages.length > 0) {
      setShouldSaveMessages(true);
    }
  }, [status, messages.length]);

  useEffect(() => {
    if (!shouldSaveMessages) return;

    const saveMessagesWithDebounce = setTimeout(async () => {
      if (messages.length === 2 && thread) {
        await editThread(thread.id, messages[0].content);
      }

      if (thread) {
        await saveThreadMessages(thread.id, JSON.stringify(messages));
      }

      setShouldSaveMessages(false);
    }, 300);

    return () => clearTimeout(saveMessagesWithDebounce);
  }, [shouldSaveMessages, messages, thread]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { onOpen } = useLoginModal();
  const { data } = useSession();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(
    null
  );
  const [editedContent, setEditedContent] = useState<string>("");
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

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

      handleSubmit(e as React.FormEvent<HTMLFormElement>, {
        experimental_attachments: files,
      });
      inputRef.current?.focus();
      setFiles(undefined);
      setSelectedFile(null);
      setContextItems([]);
    } catch (error) {
      console.error("Failed to send message:", error);
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

  const handleRetryMessage = (index: number, content: string) => {
    try {
      const previousMessages = messages.slice(0, index);
      setMessages(previousMessages);
      append({
        role: "user",
        content: content.trim(),
      });
    } catch (error) {
      console.error("Failed to retry message:", error);
    }
  };

  const handleEditMessage = (index: number, content: string) => {
    setEditingMessageIndex(index);
    setEditedContent(content);
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.focus();
      }
    }, 0);
  };

  const handleSaveEdit = (index: number) => {
    if (!editedContent.trim()) return;

    try {
      const previousMessages = messages.slice(0, index);
      setMessages(previousMessages);
      setEditingMessageIndex(null);
      setEditedContent("");
      append({
        role: "user",
        content: editedContent.trim(),
      });
    } catch (error) {
      console.error("Failed to edit message:", error);
      setEditingMessageIndex(null);
      setEditedContent("");
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageIndex(null);
    setEditedContent("");
  };

  const addToContext = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText && selectedText.trim()) {
      if (contextItems.length >= 4) {
        toast.error(
          "Maximum of 4 context items allowed. Remove some items before adding more."
        );

        const floatingButton = document.getElementById(
          "floating-context-button"
        );
        if (floatingButton) {
          floatingButton.style.display = "none";
        }

        window.getSelection()?.removeAllRanges();
        return;
      }

      const newContextItem = {
        id: `context-${Date.now()}`,
        text: selectedText.trim(),
      };
      setContextItems((prev) => {
        if (prev.length >= 4) {
          toast.error(
            "Maximum of 4 context items allowed. Remove some items before adding more."
          );
          return prev;
        }
        return [...prev, newContextItem];
      });

      const floatingButton = document.getElementById("floating-context-button");
      if (floatingButton) {
        floatingButton.style.display = "none";
      }

      window.getSelection()?.removeAllRanges();
    }
  };

  const removeFromContext = (id: string) => {
    setContextItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAllContext = () => {
    setContextItems([]);
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();

      if (selection && !selection.isCollapsed) {
        let isWithinAIMessage = false;
        let node = selection.anchorNode;

        while (node && node !== document.body) {
          if (node.parentElement?.closest('[data-message-role="assistant"]')) {
            isWithinAIMessage = true;
            break;
          }
          node = node.parentNode;
        }

        if (isWithinAIMessage) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          let floatingButton = document.getElementById(
            "floating-context-button"
          );
          if (!floatingButton) {
            floatingButton = document.createElement("button");
            floatingButton.id = "floating-context-button";
            floatingButton.className =
              "fixed z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-1.5 text-xs shadow-lg transition-all flex items-center gap-1";
            floatingButton.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg> Add to context';
            floatingButton.onclick = addToContext;
            floatingButton.setAttribute(
              "aria-label",
              "Add selected text to context"
            );
            document.body.appendChild(floatingButton);
          }

          floatingButton.style.display = "flex";

          const buttonWidth = 120;
          const buttonHeight = 28;

          const selectionCoords = getSelectionCoordinates();

          let leftPosition = selectionCoords.x - buttonWidth / 2;
          let topPosition = selectionCoords.y - buttonHeight - 10;

          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;

          if (leftPosition < 10) leftPosition = 10;
          if (leftPosition > windowWidth - buttonWidth - 10)
            leftPosition = windowWidth - buttonWidth - 10;

          if (topPosition < 10) {
            topPosition = selectionCoords.y + 25;
          }

          floatingButton.style.top = `${topPosition}px`;
          floatingButton.style.left = `${leftPosition}px`;
        } else {
          const floatingButton = document.getElementById(
            "floating-context-button"
          );
          if (floatingButton) {
            floatingButton.style.display = "none";
          }
        }
      } else {
        const floatingButton = document.getElementById(
          "floating-context-button"
        );
        if (floatingButton) {
          floatingButton.style.display = "none";
        }
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      const floatingButton = document.getElementById("floating-context-button");
      if (floatingButton) {
        document.body.removeChild(floatingButton);
      }
    };
  }, []);

  const getSelectionCoordinates = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return { x: 0, y: 0 };
    }

    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();

    if (rects.length === 0) {
      const rect = range.getBoundingClientRect();
      return {
        x: window.scrollX + rect.left + rect.width / 2,
        y: window.scrollY + rect.top,
      };
    }

    const firstRect = rects[0];

    return {
      x: window.scrollX + firstRect.left + firstRect.width / 2,
      y: window.scrollY + firstRect.top,
    };
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
                {messages.map((message, index) => {
                  return (
                    <div
                      key={`message-${index}-${message.role}`}
                      className={cn(
                        "w-full",
                        message.role === "user" ? "flex justify-end" : ""
                      )}
                    >
                      {message.role === "user" ? (
                        <div className="flex flex-col items-end group w-full">
                          {editingMessageIndex === index ? (
                            <div className="flex flex-col w-full max-w-[80%]">
                              <TextareaAutosize
                                ref={editTextareaRef}
                                value={editedContent}
                                onChange={(e) =>
                                  setEditedContent(e.target.value)
                                }
                                className="w-full bg-blue-600 text-white px-3 py-2 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                minRows={2}
                                maxRows={8}
                              />
                              <div className="flex justify-end mt-2 space-x-2">
                                <Button
                                  onClick={handleCancelEdit}
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 px-3 text-xs"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => handleSaveEdit(index)}
                                  size="sm"
                                  className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                                  variant="secondary"
                                >
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="bg-blue-600 text-white px-3 py-2 rounded-2xl max-w-[80%]">
                                <MessageContent
                                  content={message.content}
                                  isUserMessage={true}
                                />
                              </div>
                              <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                                <Button
                                  onClick={() =>
                                    handleRetryMessage(index, message.content)
                                  }
                                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg"
                                  variant="ghost"
                                  size="icon"
                                  title="Retry"
                                >
                                  <RefreshCw className="size-2" />
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleEditMessage(index, message.content)
                                  }
                                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg"
                                  variant="ghost"
                                  size="icon"
                                  title="Edit"
                                >
                                  <Edit className="size-2" />
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleCopyMessage(
                                      message.content,
                                      `user-message-${index}`
                                    )
                                  }
                                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg"
                                  variant="ghost"
                                  size="icon"
                                  title="Copy"
                                >
                                  {copiedMessageId ===
                                  `user-message-${index}` ? (
                                    <Check className="size-2" />
                                  ) : (
                                    <Copy className="size-2" />
                                  )}
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div
                          className="w-full max-w-full overflow-hidden"
                          data-message-role="assistant"
                        >
                          <MessageContent
                            content={message.content}
                            isUserMessage={false}
                            sources={message.parts
                              ?.filter((part) => part.type === "source")
                              .map((part) => ({
                                title: part.source?.title || "",
                                url: part.source?.url || "",
                                snippet: part.text,
                              }))}
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
                  );
                })}
                <div ref={messagesEndRef} className="h-4" />
                {status === "submitted" && (
                  <div className="flex items-start space-x-2 animate-in fade-in">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center max-w-[120px]">
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
          {contextItems.length > 0 && (
            <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-1.5">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  Context:
                </div>
                <Button
                  onClick={clearAllContext}
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {contextItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-md px-2 py-1 text-xs group hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="truncate max-w-[300px]">{item.text}</span>
                    <button
                      onClick={() => removeFromContext(item.id)}
                      className="ml-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 opacity-70 group-hover:opacity-100"
                      aria-label="Remove context item"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <form
            onSubmit={handleSend}
            className="flex flex-col dark:bg-[#1e1e1e] bg-[#f7f6f6] rounded-lg overflow-hidden"
          >
            <TextareaAutosize
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
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
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center">
                <ModelSelector
                  threadId={thread?.id}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  disabled={isLoading}
                  isSearchEnabled={isSearchEnabled}
                  setIsSearchEnabled={setIsSearchEnabled}
                  setFiles={setFiles}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  effortLevel={effortLevel}
                  setEffortLevel={setEffortLevel}
                />
              </div>
              <div className="flex items-center space-x-2">
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
