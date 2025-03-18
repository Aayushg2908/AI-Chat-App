import { Button } from "../ui/button";
import {
  ChevronDown,
  Globe,
  Info,
  Zap,
  FlaskConical,
  Clock,
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
import React from "react";

const MODELS: {
  [key: string]: { id: string; description: string; icons: React.ReactNode[] };
} = {
  "Gemini 1.5 Flash": {
    id: "gemini-1.5-flash-latest",
    description: "Google's old Flash model.",
    icons: [
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Clock key="clock" className="size-3 text-amber-400" />
          </TooltipTrigger>
          <TooltipContent className="bg-gray-200 text-black dark:bg-black dark:text-white text-xs">
            Old Model
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    ],
  },
  "Gemini 1.5 Pro": {
    id: "gemini-1.5-pro-latest",
    description: "Google's old Pro model.",
    icons: [
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Clock key="clock" className="size-3 text-amber-400" />
          </TooltipTrigger>
          <TooltipContent className="bg-gray-200 text-black dark:bg-black dark:text-white text-xs">
            Old Model
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    ],
  },
  "Gemini 2.0 Flash": {
    id: "gemini-2.0-flash-001",
    description: "Google's latest Flash model.",
    icons: [
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Globe key="globe" className="size-3 text-green-500" />
          </TooltipTrigger>
          <TooltipContent className="bg-gray-200 text-black dark:bg-black dark:text-white text-xs">
            Web Search
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    ],
  },
  "Gemini 2.0 Pro": {
    id: "gemini-2.0-pro-exp-02-05",
    description: "Google's latest Experimental Pro model.",
    icons: [
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <FlaskConical key="flask" className="size-3 text-red-400" />
          </TooltipTrigger>
          <TooltipContent className="bg-gray-200 text-black dark:bg-black dark:text-white text-xs">
            Experimental
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    ],
  },
  "Gemini 2.0 Flash Lite": {
    id: "gemini-2.0-flash-lite-preview-02-05",
    description: "Google's Experimental and Faster model.",
    icons: [
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Zap key="flash" className="size-3 text-yellow-500" />
          </TooltipTrigger>
          <TooltipContent className="bg-gray-200 text-black dark:bg-black dark:text-white text-xs">
            Very Fast
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <FlaskConical key="flask" className="size-3 text-red-400" />
          </TooltipTrigger>
          <TooltipContent className="bg-gray-200 text-black dark:bg-black dark:text-white text-xs">
            Experimental
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    ],
  },
};

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  disabled?: boolean;
}

const ModelSelector = ({
  selectedModel,
  setSelectedModel,
  disabled = false,
}: ModelSelectorProps) => {
  const selectedModelName =
    Object.entries(MODELS).find(([, { id }]) => id === selectedModel)?.[0] ||
    "Gemini 1.5 Flash";

  const selectedModelDescription = MODELS[selectedModelName]?.description || "";
  const selectedModelIcons = MODELS[selectedModelName]?.icons || [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-xs dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-950 transition-colors"
          disabled={disabled}
        >
          <span>{selectedModelName}</span>
          <ChevronDown className="size-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
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
  );
};

export { MODELS };
export default ModelSelector;
