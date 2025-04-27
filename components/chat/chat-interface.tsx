"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState, useCallback } from "react";
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
  Mic,
  MicOff,
  GitBranch,
  X,
  LayoutTemplate,
  Info,
} from "lucide-react";
import { useLoginModal } from "@/hooks/use-login-modal";
import { useSession } from "@/lib/auth-client";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import MessageContent from "./message-content";
import { branchThread, editThread, saveThreadMessages } from "@/actions";
import ModelSelector, { MODELS } from "./model-selector";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import useSpeechToText from "react-hook-speech-to-text";
import { useRouter } from "next/navigation";
import { ThreadType } from "@/db/schema";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  modelName?: string;
}

const TooltipComponent = ({
  children,
  description,
}: {
  children: React.ReactNode;
  description: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-gray-200 text-black dark:bg-black dark:text-white text-xs"
        >
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ChatInterface = ({
  thread,
  isEditable,
}: {
  thread: ThreadType | null;
  isEditable: boolean;
}) => {
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
  const [showCanvasDropdown, setShowCanvasDropdown] = useState<boolean>(false);
  const [canvasMode, setCanvasMode] = useState<boolean>(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    messages: chatMessages,
    handleInputChange: originalHandleInputChange,
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
      canvasMode: canvasMode,
    },
    onError: (error: Error) => {
      console.error("Chat error:", error);
    },
    experimental_throttle: 50,
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
  const [messagesChanged, setMessagesChanged] = useState(false);

  const editThreadMutation = useMutation({
    mutationFn: ({ threadId, title }: { threadId: string; title: string }) =>
      editThread(threadId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-user-threads"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to edit thread");
    },
  });

  const saveThreadMessagesMutation = useMutation({
    mutationFn: ({
      threadId,
      messages,
    }: {
      threadId: string;
      messages: string;
    }) => saveThreadMessages(threadId, messages),
    onSuccess: (updatedAt) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const threadDate = new Date(updatedAt);
      threadDate.setHours(0, 0, 0, 0);
      if (threadDate.getTime() === today.getTime()) {
        queryClient.invalidateQueries({ queryKey: ["get-user-threads"] });
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to save thread messages");
    },
  });

  const branchThreadMutation = useMutation({
    mutationFn: ({ title, messages }: { title: string; messages: string }) =>
      branchThread(title, messages),
    onSuccess: ({ threadId }) => {
      queryClient.invalidateQueries({ queryKey: ["get-user-threads"] });
      router.push(`/${threadId}`);
    },
  });

  const originalMessagesRef = useRef<string>("");

  useEffect(() => {
    if (thread) {
      originalMessagesRef.current = thread.messages || "[]";
    }
  }, [thread]);

  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    const currentMessagesString = JSON.stringify(messages);
    if (
      currentMessagesString !== originalMessagesRef.current &&
      messages.length > 0
    ) {
      setMessagesChanged(true);
    }
  }, [messages]);

  useEffect(() => {
    if (status === "ready" && messagesChanged) {
      setShouldSaveMessages(true);
      setMessagesChanged(false);
    }
  }, [status, messagesChanged]);

  useEffect(() => {
    if (!shouldSaveMessages) return;

    const saveMessagesWithDebounce = setTimeout(async () => {
      const updatedMessages = [...messages];
      const lastAssistantIndex = updatedMessages
        .map((msg, index) => ({ msg, index }))
        .filter((item) => item.msg.role === "assistant")
        .pop()?.index;

      if (lastAssistantIndex !== undefined) {
        updatedMessages[lastAssistantIndex] = {
          ...updatedMessages[lastAssistantIndex],
          modelName: selectedModel,
        };
        setMessages(updatedMessages);
      }

      const currentMessagesString = JSON.stringify(updatedMessages);

      if (currentMessagesString !== originalMessagesRef.current) {
        if (messages.length === 2 && thread) {
          editThreadMutation.mutate({
            threadId: thread.id,
            title: messages[0].content,
          });
        }

        if (thread) {
          saveThreadMessagesMutation.mutate({
            threadId: thread.id,
            messages: currentMessagesString,
          });
          originalMessagesRef.current = currentMessagesString;
        }
      }

      setShouldSaveMessages(false);
    }, 300);

    return () => clearTimeout(saveMessagesWithDebounce);
  }, [shouldSaveMessages, messages, thread, selectedModel]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { onOpen } = useLoginModal();
  const { data } = useSession();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(
    null
  );
  const [editedContent, setEditedContent] = useState<string>("");
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    error: speechError,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    timeout: 10000,
  });

  useEffect(() => {
    if (results.length > 0) {
      const latestResult = results[results.length - 1];
      originalHandleInputChange({
        // @ts-expect-error: transcript exists just type issue
        target: { value: latestResult.transcript },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    }
  }, [results]);

  useEffect(() => {
    if (interimResult && isRecording) {
      originalHandleInputChange({
        target: { value: interimResult },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    }
  }, [interimResult]);

  const toggleMicrophone = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
      if (speechError) {
        toast.error("Speech recognition not available in this browser");
      }
    }
  };

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
        onOpen(
          "Sign in to your account to access your chat history, settings and much more."
        );
        return;
      }

      handleSubmit(e as React.FormEvent<HTMLFormElement>, {
        experimental_attachments: files,
      });
      inputRef.current?.focus();
      setFiles(undefined);
      setSelectedFile(null);
      setContextItems([]);
      setCanvasMode(false);
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

  const handleBranchMessage = async (
    index: number,
    title: string | undefined
  ) => {
    const previousMessages = messages.slice(0, index + 2);
    toast.promise(
      branchThreadMutation.mutateAsync({
        title: title!,
        messages: JSON.stringify(previousMessages),
      }),
      {
        loading: "Branching thread...",
        success: "Thread branched successfully",
        error: "Failed to branch thread",
      }
    );
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

  const getDisplayModelName = (modelId: string) => {
    for (const [name, details] of Object.entries(MODELS)) {
      if (details.id === modelId) {
        return name;
      }
    }
    return modelId;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const modelInfo = Object.values(MODELS).find(
        (model) => model.id === selectedModel
      );

      if (!modelInfo?.canUploadFile) {
        toast.error("The selected model doesn't support file uploads");
        return;
      }

      const droppedFiles = e.dataTransfer.files;

      if (droppedFiles && droppedFiles.length > 0) {
        setFiles(droppedFiles);
        setSelectedFile(droppedFiles[0]);
        toast.success(`File "${droppedFiles[0].name}" added successfully`);
      }
    },
    [selectedModel]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.endsWith("@")) {
      setShowCanvasDropdown(true);
    } else {
      setShowCanvasDropdown(false);
    }

    if (originalHandleInputChange) {
      originalHandleInputChange(e);
    }
  };

  const insertCanvasTag = () => {
    const newInput = input.substring(0, input.length - 1);

    if (originalHandleInputChange) {
      originalHandleInputChange({
        target: { value: newInput },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    }

    setCanvasMode(true);
    setShowCanvasDropdown(false);
  };

  const formRef = useRef<HTMLFormElement>(null);

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
                              {isEditable && (
                                <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                                  <TooltipComponent description="Retry">
                                    <Button
                                      onClick={() =>
                                        handleRetryMessage(
                                          index,
                                          message.content
                                        )
                                      }
                                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg"
                                      variant="ghost"
                                      size="icon"
                                    >
                                      <RefreshCw className="size-2" />
                                    </Button>
                                  </TooltipComponent>
                                  <TooltipComponent description="Edit">
                                    <Button
                                      onClick={() =>
                                        handleEditMessage(
                                          index,
                                          message.content
                                        )
                                      }
                                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg"
                                      variant="ghost"
                                      size="icon"
                                    >
                                      <Edit className="size-2" />
                                    </Button>
                                  </TooltipComponent>
                                  <TooltipComponent description="Branch">
                                    <Button
                                      onClick={() =>
                                        handleBranchMessage(
                                          index,
                                          thread?.title
                                        )
                                      }
                                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg"
                                      variant="ghost"
                                      size="icon"
                                    >
                                      <GitBranch className="size-2" />
                                    </Button>
                                  </TooltipComponent>
                                  <TooltipComponent description="Copy">
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
                                    >
                                      {copiedMessageId ===
                                      `user-message-${index}` ? (
                                        <Check className="size-2" />
                                      ) : (
                                        <Copy className="size-2" />
                                      )}
                                    </Button>
                                  </TooltipComponent>
                                </div>
                              )}
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
                          <div className="flex justify-end mt-2 items-center">
                            {message.role === "assistant" &&
                              message.modelName && (
                                <TooltipProvider>
                                  <Tooltip delayDuration={0}>
                                    <TooltipTrigger>
                                      <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                                        {getDisplayModelName(message.modelName)}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-200 text-black dark:bg-black dark:text-white text-xs">
                                      Response generated by{" "}
                                      {getDisplayModelName(message.modelName)}{" "}
                                      model
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
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
        {isEditable && (
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
                      <span className="truncate max-w-[300px]">
                        {item.text}
                      </span>
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
            <AnimatePresence>
              {canvasMode && (
                <motion.div
                  className="flex items-center justify-center py-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                  >
                    Canvas mode
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1 hover:bg-blue-100 dark:hover:bg-blue-800"
                      onClick={() => setCanvasMode(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative">
              <form
                ref={formRef}
                onSubmit={handleSend}
                className="flex flex-col dark:bg-[#1e1e1e] bg-[#f7f6f6] rounded-lg overflow-hidden"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <AnimatePresence>
                  {showCanvasDropdown && (
                    <motion.div
                      className="absolute bottom-[calc(100%+8px)] left-3 z-50"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      <div className="bg-white dark:bg-zinc-900 rounded-md border border-gray-200 dark:border-none shadow-md overflow-hidden">
                        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            AI Agents
                          </h3>
                        </div>
                        <motion.div
                          className="py-2 px-3 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                          onClick={insertCanvasTag}
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <LayoutTemplate className="h-4 w-4 text-blue-500" />
                          <span>Canvas</span>
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                className="dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 text-sm p-2 max-w-[250px] dark:text-white text-black"
                              >
                                Create beautiful UI components using shadcn/ui
                                by describing what you want in natural language
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const fileList = e.target.files;
                    if (fileList && fileList.length > 0) {
                      setFiles(fileList);
                      setSelectedFile(fileList[0]);
                      toast.success(
                        `File "${fileList[0].name}" added successfully`
                      );
                    }
                  }}
                  className="hidden"
                />
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
                    isLoading
                      ? "Sending message..."
                      : "Type your message here..."
                  }
                  className={`w-full scrollbar-hide resize-none bg-transparent dark:text-gray-300 text-gray-700 px-3 py-2.5 focus:outline-none placeholder-gray-500 text-sm transition-colors ${
                    isLoading
                      ? "dark:placeholder-gray-600 placeholder-gray-500"
                      : ""
                  }`}
                  maxRows={8}
                  minRows={2}
                  maxLength={4000}
                  disabled={isLoading}
                />
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-4">
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
                    <span className="text-xs text-gray-500">
                      {input.length}/4000
                    </span>
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
                      <>
                        <TooltipComponent
                          description={
                            isRecording ? "Stop recording" : "Start voice input"
                          }
                        >
                          <Button
                            type="button"
                            className="transition-colors"
                            onClick={toggleMicrophone}
                            size="icon"
                            variant="ghost"
                            disabled={isLoading}
                          >
                            {isRecording ? (
                              <motion.div
                                initial={{ scale: 1 }}
                                animate={{
                                  scale: [1, 1.2, 1],
                                  color: ["#ef4444", "#dc2626", "#ef4444"],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              >
                                <MicOff className="size-3.5" />
                              </motion.div>
                            ) : (
                              <motion.div
                                className="text-gray-600 dark:text-gray-400"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Mic className="size-3.5 hover:text-gray-950 dark:hover:text-white" />
                              </motion.div>
                            )}
                          </Button>
                        </TooltipComponent>
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
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
