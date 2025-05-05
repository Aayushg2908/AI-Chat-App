import { Button } from "../ui/button";
import {
  Globe,
  Info,
  Zap,
  FlaskConical,
  Clock,
  FileText,
  GlobeIcon,
  X,
  BrainIcon,
  FileUpIcon,
  Sparkles,
  ChevronUpIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const createTooltipIcon = (
  IconComponent: React.ElementType,
  description: string,
  colorClass: string
) => {
  return (
    <TooltipProvider key={description}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <IconComponent className={`size-3 ${colorClass}`} />
        </TooltipTrigger>
        <TooltipContent className="bg-gray-200 text-black dark:bg-black dark:text-white text-xs">
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const MODELS: {
  [key: string]: {
    id: string;
    description: string;
    icons: React.ReactNode[];
    canSearch: boolean;
    canUploadFile: boolean;
  };
} = {
  "Gemini 2.0 Flash": {
    id: "gemini-2.0-flash-001",
    description: "Google's latest Flash model.",
    icons: [
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "Gemini 2.0 Pro": {
    id: "gemini-2.0-pro-exp-02-05",
    description: "Google's latest Experimental Pro model.",
    icons: [
      createTooltipIcon(FlaskConical, "Experimental", "text-red-400"),
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "Gemini 2.0 Flash Lite": {
    id: "gemini-2.0-flash-lite-preview-02-05",
    description: "Google's Experimental and Faster model.",
    icons: [
      createTooltipIcon(Zap, "Very Fast", "text-yellow-500"),
      createTooltipIcon(FlaskConical, "Experimental", "text-red-400"),
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: false,
    canUploadFile: true,
  },
  "Gemini 2.0 Flash Thinking": {
    id: "gemini-2.0-flash-thinking-exp-01-21",
    description: "Google's latest Reasoning model.",
    icons: [
      createTooltipIcon(FlaskConical, "Experimental", "text-red-400"),
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "Gemini 2.5 Pro": {
    id: "gemini-2.5-pro-exp-03-25",
    description: "Google's state of the art thinking model.",
    icons: [
      createTooltipIcon(FlaskConical, "Experimental", "text-red-400"),
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
      createTooltipIcon(BrainIcon, "Reasoning Capabilities", "text-violet-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "Gemini 2.5 Flash": {
    id: "gemini-2.5-flash-preview-04-17",
    description: "Google's latest Flash model.",
    icons: [
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "Gemini 2.5 Flash Thinking": {
    id: "gemini-2.5-flash-thinking",
    description: "Google's latest Flash model.",
    icons: [
      createTooltipIcon(FlaskConical, "Experimental", "text-red-400"),
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
      createTooltipIcon(BrainIcon, "Reasoning Capabilities", "text-violet-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "GPT 4o Mini": {
    id: "gpt-4o-mini",
    description: "OpenAI's small and cheap model.",
    icons: [
      createTooltipIcon(Clock, "Old Model", "text-amber-400"),
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "GPT 4o": {
    id: "gpt-4o",
    description: "OpenAI's old model.",
    icons: [
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "GPT 4.1 Nano": {
    id: "gpt-4.1-nano-2025-04-14",
    description: "OpenAI's new GPT-4.1 Nano model.",
    icons: [
      createTooltipIcon(Zap, "Very Fast", "text-yellow-500"),
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "GPT 4.1 Mini": {
    id: "gpt-4.1-mini-2025-04-14",
    description: "OpenAI's new GPT-4.1 Mini model.",
    icons: [
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "GPT 4.1": {
    id: "gpt-4.1-2025-04-14",
    description: "OpenAI's new GPT-4.1 model.",
    icons: [
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "O3 Mini": {
    id: "o3-mini-2025-01-31",
    description: "OpenAI's Reasoning model.",
    icons: [
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
      createTooltipIcon(BrainIcon, "Reasoning Capabilities", "text-violet-400"),
    ],
    canSearch: true,
    canUploadFile: false,
  },
  "O4 Mini": {
    id: "o4-mini-2025-04-16",
    description: "OpenAI's latest Reasoning model.",
    icons: [
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
      createTooltipIcon(BrainIcon, "Reasoning Capabilities", "text-violet-400"),
    ],
    canSearch: true,
    canUploadFile: false,
  },
  "Deepseek R1 (llama distilled)": {
    id: "deepseek-r1-distill-llama-70b",
    description: "Llama Distilled Deepseek model hosted on Groq",
    icons: [
      createTooltipIcon(BrainIcon, "Reasoning Capabilities", "text-violet-400"),
    ],
    canSearch: false,
    canUploadFile: false,
  },
  "Deepseek R1 (qwen distilled)": {
    id: "deepseek-r1-distill-qwen-32b",
    description: "Qwen Distilled Deepseek model hosted on Groq",
    icons: [
      createTooltipIcon(FlaskConical, "Experimental", "text-red-400"),
      createTooltipIcon(BrainIcon, "Reasoning Capabilities", "text-violet-400"),
    ],
    canSearch: false,
    canUploadFile: false,
  },
  "Qwen 2.5": {
    id: "qwen-2.5-32b",
    description: "Qwen 2.5 model hosted on Groq",
    icons: [createTooltipIcon(FlaskConical, "Experimental", "text-red-400")],
    canSearch: false,
    canUploadFile: false,
  },
  "Qwen QWQ": {
    id: "qwen-qwq-32b",
    description: "Qwen QWQ model hosted on Groq",
    icons: [
      createTooltipIcon(FlaskConical, "Experimental", "text-red-400"),
      createTooltipIcon(BrainIcon, "Reasoning Capabilities", "text-violet-400"),
    ],
    canSearch: false,
    canUploadFile: false,
  },
  "Llama 4 Scout": {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    description: "Llama 4 Scout model hosted on Groq",
    icons: [
      createTooltipIcon(FlaskConical, "Experimental", "text-red-400"),
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
      createTooltipIcon(BrainIcon, "Reasoning Capabilities", "text-violet-400"),
    ],
    canSearch: false,
    canUploadFile: true,
  },
};

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  disabled?: boolean;
  isSearchEnabled?: boolean;
  setIsSearchEnabled?: (enabled: boolean) => void;
  setFiles?: (files: FileList | undefined) => void;
  selectedFile?: File | null;
  setSelectedFile?: (file: File | null) => void;
  effortLevel?: string;
  setEffortLevel?: (level: string) => void;
  threadId?: string;
}

const ModelSelector = ({
  selectedModel,
  setSelectedModel,
  disabled = false,
  isSearchEnabled = false,
  setIsSearchEnabled,
  setFiles,
  selectedFile,
  setSelectedFile,
  effortLevel = "low",
  setEffortLevel,
  threadId,
}: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllModels, setShowAllModels] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultModels = [
    "gemini-2.0-flash-lite-preview-02-05",
    "gpt-4o-mini",
    "meta-llama/llama-4-scout-17b-16e-instruct",
  ];

  useEffect(() => {
    const storedModels = localStorage.getItem("selected-models");
    if (storedModels) {
      setSelectedModels(JSON.parse(storedModels));
    } else {
      setSelectedModels(defaultModels);
      localStorage.setItem("selected-models", JSON.stringify(defaultModels));
    }
  }, []);

  useEffect(() => {
    if (selectedModels.length > 0) {
      localStorage.setItem("selected-models", JSON.stringify(selectedModels));
    }
  }, [selectedModels]);

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(modelId)) {
        return prev.filter((id) => id !== modelId);
      } else {
        if (prev.length >= 10) {
          toast.error(
            "You can only have 10 active models. Remove a model before adding a new one."
          );
          return prev;
        }
        return [...prev, modelId];
      }
    });
  };

  const geminiModels = Object.entries(MODELS).filter(([, { id }]) =>
    id.includes("gemini")
  );
  const gptModels = Object.entries(MODELS).filter(
    ([, { id }]) => id.includes("gpt") || id.includes("o3") || id.includes("o4")
  );
  const groqModels = Object.entries(MODELS).filter(
    ([, { id }]) =>
      !id.includes("gemini") &&
      !id.includes("gpt") &&
      !id.includes("o3") &&
      !id.includes("o4")
  );

  const modelGroups = [
    {
      name: "Google Models",
      models: geminiModels,
    },
    {
      name: "OpenAI Models",
      models: gptModels,
    },
    {
      name: "Groq Models",
      models: groqModels,
    },
  ];

  const allModels = [...geminiModels, ...gptModels, ...groqModels];
  const visibleModels = allModels.filter(([, { id }]) =>
    selectedModels.includes(id)
  );

  const selectedModelName =
    Object.entries(MODELS).find(([, { id }]) => id === selectedModel)?.[0] ||
    "Select Model";

  const canSearch = MODELS[selectedModelName]?.canSearch || false;
  const canUploadFile = MODELS[selectedModelName]?.canUploadFile || false;

  const handleSearchToggle = () => {
    if (setIsSearchEnabled && canSearch) {
      setIsSearchEnabled(!isSearchEnabled);
    }
  };

  const handleFileUpload = () => {
    if (canUploadFile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0 && setFiles && setSelectedFile) {
      setFiles(fileList);
      setSelectedFile(fileList[0]);
    }
  };

  const removeFile = () => {
    if (setFiles && setSelectedFile) {
      setFiles(undefined);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex items-center">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all duration-200",
              "dark:text-gray-300 text-gray-700",
              "hover:dark:text-white hover:text-gray-950",
              "dark:hover:bg-zinc-800 hover:bg-zinc-100",
              "border dark:border-zinc-800 border-zinc-200",
              isOpen && "dark:bg-zinc-800 bg-zinc-100"
            )}
            disabled={disabled}
          >
            <Sparkles className="size-3.5 text-blue-500 mr-0.5" />
            <span className="font-medium">{selectedModelName}</span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-0.5"
            >
              <ChevronUpIcon className="size-3" />
            </motion.div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="p-1 dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg shadow-lg max-h-[80vh] overflow-hidden flex flex-col"
        >
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col h-full"
          >
            <AnimatePresence mode="wait">
              {!showAllModels ? (
                <motion.div
                  key="selected-models"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-medium dark:text-gray-400 text-gray-500">
                    Your Models
                  </DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {visibleModels.map(([name, { id, description, icons }]) => (
                      <DropdownMenuItem
                        key={id}
                        onClick={() => {
                          setSelectedModel(id);
                          if (threadId) {
                            localStorage.setItem(`model:${threadId}`, id);
                          }
                        }}
                        className={cn(
                          "cursor-pointer flex items-center justify-between px-3 py-2 my-0.5 rounded-md transition-colors duration-150",
                          "hover:dark:bg-zinc-800 hover:bg-zinc-100",
                          selectedModel === id && "dark:bg-zinc-800 bg-zinc-100"
                        )}
                      >
                        <div className="flex items-center">
                          <div className="flex items-center">
                            <span className="text-sm">{name}</span>
                          </div>
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger asChild>
                                <Info className="size-3 ml-1.5 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                className="dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 text-sm p-2 max-w-[200px] dark:text-white text-black"
                              >
                                {description}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          {icons.map((icon, index) => (
                            <React.Fragment
                              key={`dropdown-icon-${id}-${index}`}
                            >
                              {icon}
                            </React.Fragment>
                          ))}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="my-1.5 dark:bg-zinc-800 bg-zinc-200" />
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowAllModels(true);
                    }}
                    className="cursor-pointer flex items-center justify-center px-3 py-2 my-0.5 rounded-md transition-colors duration-150 hover:dark:bg-zinc-800 hover:bg-zinc-100"
                  >
                    <span className="text-sm">More Models</span>
                    <ArrowRightIcon className="size-3.5 ml-1.5 text-gray-500" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="all-models"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex flex-col h-full"
                >
                  <div
                    className="overflow-y-auto overflow-x-hidden"
                    style={{ maxHeight: "calc(80vh - 50px)" }}
                  >
                    {modelGroups.map((group, groupIndex) => (
                      <React.Fragment key={`model-group-${groupIndex}`}>
                        <DropdownMenuLabel className="px-3 py-2 text-xs font-medium dark:text-gray-400 text-gray-500">
                          {group.name}
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                          {group.models.map(
                            ([name, { id, description, icons }]) => (
                              <DropdownMenuItem
                                key={id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                className={cn(
                                  "cursor-pointer flex items-center justify-between px-3 py-2 my-0.5 rounded-md transition-colors duration-150",
                                  "hover:dark:bg-zinc-800 hover:bg-zinc-100",
                                  "min-w-0"
                                )}
                              >
                                <div className="flex items-center min-w-0 mr-2">
                                  <div className="flex items-center min-w-0">
                                    <span className="text-sm truncate">
                                      {name}
                                    </span>
                                  </div>
                                  <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                      <TooltipTrigger asChild>
                                        <Info className="size-3 ml-1.5 text-gray-400" />
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="right"
                                        className="dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 text-sm p-2 max-w-[200px] dark:text-white text-black"
                                      >
                                        {description}
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <div className="flex items-center space-x-1.5 flex-shrink-0">
                                  {icons.map((icon, index) => (
                                    <React.Fragment
                                      key={`dropdown-icon-${id}-${index}`}
                                    >
                                      {icon}
                                    </React.Fragment>
                                  ))}
                                  <div
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleModelSelection(id);
                                    }}
                                    className="ml-2 relative inline-flex h-[20px] w-[36px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                    style={{
                                      backgroundColor: selectedModels.includes(
                                        id
                                      )
                                        ? "#145de3"
                                        : "#6b7280",
                                    }}
                                  >
                                    <span
                                      className="pointer-events-none inline-block h-[16px] w-[16px] rounded-full bg-white shadow-lg transform ring-0 transition duration-200 ease-in-out"
                                      style={{
                                        transform: selectedModels.includes(id)
                                          ? "translateX(16px)"
                                          : "translateX(0)",
                                      }}
                                    />
                                  </div>
                                </div>
                              </DropdownMenuItem>
                            )
                          )}
                        </DropdownMenuGroup>
                        {groupIndex < modelGroups.length - 1 && (
                          <DropdownMenuSeparator className="my-1.5 dark:bg-zinc-800 bg-zinc-200" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="mt-auto sticky bottom-0 bg-white dark:bg-zinc-900">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowAllModels(false);
                      }}
                      className="cursor-pointer flex items-center justify-center px-3 py-2 my-0.5 rounded-md transition-colors duration-150 hover:dark:bg-zinc-800 hover:bg-zinc-100"
                    >
                      <ArrowLeftIcon className="size-3.5 mr-1.5 text-gray-500" />
                      <span className="text-sm">Back</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>
      {canSearch && (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "ml-1.5 p-1.5 rounded-full transition-all duration-200",
                  isSearchEnabled
                    ? "text-red-500 dark:bg-red-500/10 bg-red-100"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                )}
                onClick={handleSearchToggle}
                disabled={disabled || !canSearch}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                >
                  <GlobeIcon className="size-4" />
                </motion.div>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 text-xs p-2 dark:text-white text-black"
            >
              {isSearchEnabled ? "Disable web search" : "Enable web search"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {canUploadFile && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.txt,.csv,.md,.json,.js,.py,.html,.css,.tsx,.jsx,.ts"
          />
          {selectedFile ? (
            <div className="relative ml-1.5">
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center dark:bg-zinc-800 bg-zinc-100 rounded-full px-2 py-1 border dark:border-zinc-700 border-zinc-200"
              >
                <div className="flex items-center max-w-[120px]">
                  {selectedFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="h-5 w-5 object-cover rounded-full mr-1.5"
                    />
                  ) : (
                    <FileText className="h-4 w-4 mr-1.5 text-red-500" />
                  )}
                  <span className="text-xs truncate">{selectedFile.name}</span>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5 ml-1 rounded-full hover:dark:bg-zinc-700 hover:bg-zinc-200"
                  onClick={removeFile}
                >
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-3 w-3" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1.5 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    onClick={handleFileUpload}
                    disabled={disabled}
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.1 }}
                    >
                      <FileUpIcon className="size-4" />
                    </motion.div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 text-xs p-2 dark:text-white text-black"
                >
                  Upload file
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </>
      )}
      {(selectedModel === "o3-mini-2025-01-31" ||
        selectedModel === "o4-mini-2025-04-16") &&
        setEffortLevel && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center gap-1.5 ml-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all duration-200",
                  "dark:text-gray-300 text-gray-700",
                  "hover:dark:text-white hover:text-gray-950",
                  "hover:dark:bg-zinc-800 hover:bg-zinc-100",
                  "border dark:border-zinc-800 border-zinc-200"
                )}
                disabled={disabled}
              >
                <BrainIcon className="size-3.5 text-violet-500 mr-0.5" />
                <span className="font-medium capitalize">
                  Effort: {effortLevel}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="p-1 dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg shadow-lg"
            >
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                {["low", "medium", "high"].map((level) => (
                  <DropdownMenuItem
                    key={level}
                    onClick={() => {
                      if (setEffortLevel) setEffortLevel(level);
                    }}
                    className={cn(
                      "cursor-pointer flex items-center px-3 py-2 my-0.5 rounded-md transition-colors duration-150",
                      "hover:dark:bg-zinc-800 hover:bg-zinc-100",
                      effortLevel === level && "dark:bg-zinc-800 bg-zinc-100"
                    )}
                  >
                    <span className="capitalize">{level}</span>
                  </DropdownMenuItem>
                ))}
              </motion.div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
    </div>
  );
};

export default ModelSelector;
