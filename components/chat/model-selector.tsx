import { Button } from "../ui/button";
import { ChevronDown, Info } from "lucide-react";
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

const MODELS: { [key: string]: { id: string; description: string } } = {
  "Gemini 1.5 Flash": {
    id: "gemini-1.5-flash-latest",
    description: "Google's old Flash model.",
  },
  "Gemini 1.5 Pro": {
    id: "gemini-1.5-pro-latest",
    description: "Google's old Pro model.",
  },
  "Gemini 2.0 Flash": {
    id: "gemini-2.0-flash-001",
    description: "Google's latest Flash model.",
  },
  "Gemini 2.0 Pro": {
    id: "gemini-2.0-pro-exp-02-05",
    description: "Google's latest Pro model.",
  },
  "Gemini 2.0 Flash Lite": {
    id: "gemini-2.0-flash-lite-preview-02-05",
    description: "Google's Experimental and Faster model.",
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-xs dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-950 transition-colors"
          disabled={disabled}
        >
          {selectedModelName}
          <ChevronDown className="size-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {Object.entries(MODELS).map(([name, { id, description }]) => (
          <DropdownMenuItem
            key={id}
            onClick={() => setSelectedModel(id)}
            className={`cursor-pointer flex items-center justify-between ${
              selectedModel === id ? "bg-accent" : ""
            }`}
          >
            <span>{name}</span>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Info className="size-3 ml-2 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent className="bg-gray-200 text-black dark:bg-black dark:text-white text-xs">
                  {description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { MODELS };
export default ModelSelector;
