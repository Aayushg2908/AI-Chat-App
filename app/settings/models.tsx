"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FlaskConical,
  Globe,
  FileText,
  BrainIcon,
  Zap,
  Clock,
} from "lucide-react";

const createFeatureButton = (
  IconComponent: React.ElementType,
  description: string,
  colorClass: string
) => {
  const getBgAndTextColors = () => {
    switch (colorClass) {
      case "text-green-500":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "text-blue-400":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      case "text-red-400":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      case "text-violet-400":
        return "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400";
      case "text-yellow-500":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
      case "text-amber-400":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
    }
  };

  const colorStyles = getBgAndTextColors();

  return (
    <div
      key={description}
      className={cn(
        "flex items-center space-x-1 px-2 py-1 rounded-md text-xs",
        colorStyles
      )}
    >
      <IconComponent className={`size-3.5`} />
      <span>{description}</span>
    </div>
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
      createFeatureButton(Globe, "Web Search", "text-green-500"),
      createFeatureButton(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "Gemini 2.0 Pro": {
    id: "gemini-2.0-pro-exp-02-05",
    description: "Google's latest Experimental Pro model.",
    icons: [
      createFeatureButton(FlaskConical, "Experimental", "text-red-400"),
      createFeatureButton(Globe, "Web Search", "text-green-500"),
      createFeatureButton(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "Gemini 2.0 Flash Lite": {
    id: "gemini-2.0-flash-lite-preview-02-05",
    description: "Google's Experimental and Faster model.",
    icons: [
      createFeatureButton(Zap, "Very Fast", "text-yellow-500"),
      createFeatureButton(FlaskConical, "Experimental", "text-red-400"),
      createFeatureButton(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: false,
    canUploadFile: true,
  },
  "Gemini 2.0 Flash Thinking": {
    id: "gemini-2.0-flash-thinking-exp-01-21",
    description: "Google's latest Reasoning model.",
    icons: [
      createFeatureButton(FlaskConical, "Experimental", "text-red-400"),
      createFeatureButton(Globe, "Web Search", "text-green-500"),
      createFeatureButton(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "Gemini 2.5 Flash": {
    id: "gemini-2.5-flash-preview-04-17",
    description: "Google's latest Flash model.",
    icons: [
      createFeatureButton(Globe, "Web Search", "text-green-500"),
      createFeatureButton(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "Gemini 2.5 Flash Thinking": {
    id: "gemini-2.5-flash-thinking",
    description: "Google's latest Flash model.",
    icons: [
      createFeatureButton(FlaskConical, "Experimental", "text-red-400"),
      createFeatureButton(Globe, "Web Search", "text-green-500"),
      createFeatureButton(FileText, "File Upload", "text-blue-400"),
      createFeatureButton(
        BrainIcon,
        "Reasoning Capabilities",
        "text-violet-400"
      ),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "Gemini 2.5 Pro": {
    id: "gemini-2.5-pro-exp-03-25",
    description: "Google's state of the art thinking model.",
    icons: [
      createFeatureButton(FlaskConical, "Experimental", "text-red-400"),
      createFeatureButton(Globe, "Web Search", "text-green-500"),
      createFeatureButton(FileText, "File Upload", "text-blue-400"),
      createFeatureButton(
        BrainIcon,
        "Reasoning Capabilities",
        "text-violet-400"
      ),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "Gemini 2.5 Pro Preview": {
    id: "gemini-2.5-pro-preview-05-06",
    description: "Google's state of the art thinking model.",
    icons: [
      createFeatureButton(FlaskConical, "Experimental", "text-red-400"),
      createFeatureButton(Globe, "Web Search", "text-green-500"),
      createFeatureButton(FileText, "File Upload", "text-blue-400"),
      createFeatureButton(
        BrainIcon,
        "Reasoning Capabilities",
        "text-violet-400"
      ),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "GPT 4o Mini": {
    id: "gpt-4o-mini",
    description: "OpenAI's small and cheap model.",
    icons: [
      createFeatureButton(Clock, "Old Model", "text-amber-400"),
      createFeatureButton(Globe, "Web Search", "text-green-500"),
      createFeatureButton(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "GPT 4o": {
    id: "gpt-4o",
    description: "OpenAI's old model.",
    icons: [
      createFeatureButton(Globe, "Web Search", "text-green-500"),
      createFeatureButton(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "GPT 4.1 Nano": {
    id: "gpt-4.1-nano-2025-04-14",
    description: "OpenAI's new GPT-4.1 Nano model.",
    icons: [
      createFeatureButton(Zap, "Very Fast", "text-yellow-500"),
      createFeatureButton(Globe, "Web Search", "text-green-500"),
      createFeatureButton(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "GPT 4.1 Mini": {
    id: "gpt-4.1-mini-2025-04-14",
    description: "OpenAI's new GPT-4.1 Mini model.",
    icons: [
      createFeatureButton(Globe, "Web Search", "text-green-500"),
      createFeatureButton(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "GPT 4.1": {
    id: "gpt-4.1-2025-04-14",
    description: "OpenAI's new GPT-4.1 model.",
    icons: [
      createFeatureButton(Globe, "Web Search", "text-green-500"),
      createFeatureButton(FileText, "File Upload", "text-blue-400"),
    ],
    canSearch: true,
    canUploadFile: true,
  },
  "O3 Mini": {
    id: "o3-mini-2025-01-31",
    description: "OpenAI's Reasoning model.",
    icons: [
      createFeatureButton(Globe, "Web Search", "text-green-500"),
      createFeatureButton(
        BrainIcon,
        "Reasoning Capabilities",
        "text-violet-400"
      ),
    ],
    canSearch: true,
    canUploadFile: false,
  },
  "O4 Mini": {
    id: "o4-mini-2025-04-16",
    description: "OpenAI's latest Reasoning model.",
    icons: [
      createFeatureButton(Globe, "Web Search", "text-green-500"),
      createFeatureButton(
        BrainIcon,
        "Reasoning Capabilities",
        "text-violet-400"
      ),
    ],
    canSearch: true,
    canUploadFile: false,
  },
  "Deepseek R1 (llama distilled)": {
    id: "deepseek-r1-distill-llama-70b",
    description: "Llama Distilled Deepseek model hosted on Groq",
    icons: [
      createFeatureButton(
        BrainIcon,
        "Reasoning Capabilities",
        "text-violet-400"
      ),
    ],
    canSearch: false,
    canUploadFile: false,
  },
  "Deepseek R1 (qwen distilled)": {
    id: "deepseek-r1-distill-qwen-32b",
    description: "Qwen Distilled Deepseek model hosted on Groq",
    icons: [
      createFeatureButton(FlaskConical, "Experimental", "text-red-400"),
      createFeatureButton(
        BrainIcon,
        "Reasoning Capabilities",
        "text-violet-400"
      ),
    ],
    canSearch: false,
    canUploadFile: false,
  },
  "Qwen 2.5": {
    id: "qwen-2.5-32b",
    description: "Qwen 2.5 model hosted on Groq",
    icons: [createFeatureButton(FlaskConical, "Experimental", "text-red-400")],
    canSearch: false,
    canUploadFile: false,
  },
  "Qwen QWQ": {
    id: "qwen-qwq-32b",
    description: "Qwen QWQ model hosted on Groq",
    icons: [
      createFeatureButton(FlaskConical, "Experimental", "text-red-400"),
      createFeatureButton(
        BrainIcon,
        "Reasoning Capabilities",
        "text-violet-400"
      ),
    ],
    canSearch: false,
    canUploadFile: false,
  },
  "Llama 4 Scout": {
    id: "meta-llama/llama-4-scout-17b-16e-instruct",
    description: "Llama 4 Scout model hosted on Groq",
    icons: [
      createFeatureButton(FlaskConical, "Experimental", "text-red-400"),
      createFeatureButton(FileText, "File Upload", "text-blue-400"),
      createFeatureButton(
        BrainIcon,
        "Reasoning Capabilities",
        "text-violet-400"
      ),
    ],
    canSearch: false,
    canUploadFile: true,
  },
};

const ModelSettings = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const toggleModel = (modelId: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(modelId)) {
        if (prev.length <= 1) {
          toast.error("You must have at least one model selected.");
          return prev;
        }
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

  const resetModels = () => {
    setSelectedModels(defaultModels);
    toast.success("Reset to default models");
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
    { name: "Google Models", models: geminiModels },
    { name: "OpenAI Models", models: gptModels },
    { name: "Groq Models", models: groqModels },
  ];

  const filteredModelGroups = modelGroups
    .map((group) => ({
      ...group,
      models: group.models.filter(
        ([name, { description }]) =>
          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.models.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Available Models</h2>
        <p className="text-muted-foreground">
          Choose which models appear in your model selector. This won&apos;t
          affect existing conversations.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filter by Model Name..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetModels}
            className="text-sm"
          >
            Reset All
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        {filteredModelGroups.map((group, groupIndex) => (
          <div key={`model-group-${groupIndex}`} className="space-y-3">
            {group.models.length > 0 && (
              <h3 className="text-sm font-medium text-muted-foreground">
                {group.name}
              </h3>
            )}
            <div className="space-y-3">
              {group.models.map(([name, { id, description, icons }]) => (
                <div
                  key={id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border",
                    "dark:bg-zinc-950 bg-white"
                  )}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{name}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {icons.map((icon, index) => (
                          <span key={`model-icon-${id}-${index}`}>{icon}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                  <Switch
                    id={`model-${id}`}
                    checked={selectedModels.includes(id)}
                    onCheckedChange={() => toggleModel(id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredModelGroups.length === 0 && (
          <div className="flex items-center justify-center h-32 border rounded-lg">
            <p className="text-muted-foreground">
              No models found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelSettings;
