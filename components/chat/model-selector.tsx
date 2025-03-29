import { Button } from "../ui/button";
import {
  ChevronDown,
  Globe,
  Info,
  Zap,
  FlaskConical,
  Clock,
  FileText,
  GlobeIcon,
  ChevronUp,
  X,
  BrainIcon,
  FileUpIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import React, { useState, useRef } from "react";

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

const MODELS: {
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
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
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
    description: "OpenAI's latest model.",
    icons: [
      createTooltipIcon(Globe, "Web Search", "text-green-500"),
      createTooltipIcon(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "O3 Mini": {
    id: "o3-mini-2025-01-31",
    description: "OpenAI's latest Reasoning model.",
    icons: [
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
}: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedModelName =
    Object.entries(MODELS).find(([, { id }]) => id === selectedModel)?.[0] ||
    "Gemini 2.0 Flash";

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

  const handleEffortLevelChange = (level: string) => {
    if (setEffortLevel) {
      setEffortLevel(level);
    }
  };

  return (
    <div className="flex items-center">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-xs dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-950 transition-colors"
            disabled={disabled}
          >
            <span>{selectedModelName}</span>
            {isOpen ? (
              <ChevronDown className="size-3 ml-1" />
            ) : (
              <ChevronUp className="size-3 ml-1" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[300px]">
          {Object.entries(MODELS).map(([name, { id, description, icons }]) => (
            <DropdownMenuItem
              key={id}
              onClick={() => setSelectedModel(id)}
              className={`cursor-pointer flex items-center justify-between ${
                selectedModel === id ? "bg-accent" : ""
              }`}
            >
              <div className="flex items-center">
                <span>{name}</span>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Info className="size-3 ml-1 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-200 text-black dark:bg-black dark:text-white text-xs">
                      {description}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center space-x-1.5">
                {icons.map((icon, index) => (
                  <React.Fragment key={`dropdown-icon-${id}-${index}`}>
                    {icon}
                  </React.Fragment>
                ))}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {canSearch && (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSearchToggle}
                disabled={disabled || !canSearch}
              >
                <GlobeIcon
                  className={`size-4 ${
                    isSearchEnabled ? "text-blue-500" : "text-gray-400"
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-200 text-black dark:bg-black dark:text-white text-xs">
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
            accept="image/*,.pdf"
          />
          {selectedFile ? (
            <div className="relative">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded p-1">
                <div className="flex items-center max-w-[120px]">
                  {selectedFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="h-5 w-5 object-cover rounded mr-1"
                    />
                  ) : (
                    <FileText className="h-5 w-5 mr-1 text-blue-500" />
                  )}
                  <span className="text-xs truncate">{selectedFile.name}</span>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5 ml-1"
                  onClick={removeFile}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFileUpload}
                    disabled={disabled}
                  >
                    <FileUpIcon className="size-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-200 text-black dark:bg-black dark:text-white text-xs">
                  Upload file
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </>
      )}
      {selectedModel === "o3-mini-2025-01-31" && setEffortLevel && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-xs dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-950 transition-colors ml-2"
              disabled={disabled}
            >
              <span>Effort: {effortLevel}</span>
              <ChevronUp className="size-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[150px]">
            {["low", "medium", "high"].map((level) => (
              <DropdownMenuItem
                key={level}
                onClick={() => handleEffortLevelChange(level)}
                className={`cursor-pointer ${
                  effortLevel === level ? "bg-accent" : ""
                }`}
              >
                <span className="capitalize">{level}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export { MODELS };
export default ModelSelector;
