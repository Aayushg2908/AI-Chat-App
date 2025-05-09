"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Info } from "lucide-react";
import { updateAiCustomizations } from "@/actions";
import { useMutation } from "@tanstack/react-query";
import { useFontSettings, FontFamily } from "@/hooks/use-font";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const CustomizationSettings = ({
  aiCustomizations,
}: {
  aiCustomizations: { aiNickname: string | null; aiPersonality: string | null };
}) => {
  const [aiNickname, setAiNickname] = useState(aiCustomizations.aiNickname);
  const [aiPersonality, setAiPersonality] = useState(
    aiCustomizations.aiPersonality
  );

  const { textFont, codeFont, setTextFont, setCodeFont, resetFonts } =
    useFontSettings();

  const hasAiChanges =
    aiNickname !== aiCustomizations.aiNickname ||
    aiPersonality !== aiCustomizations.aiPersonality;

  const updateAiMutation = useMutation({
    mutationFn: () => {
      return updateAiCustomizations({ aiNickname, aiPersonality });
    },
    onSuccess: () => {
      toast.success("AI preferences updated successfully");
    },
    onError: () => {
      toast.error("Failed to update AI preferences");
    },
  });

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xl font-bold mb-2">AI Communication Preferences</h2>
        <p className="text-muted-foreground mb-6">
          Customize how AllIn1 interacts with you during conversations.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="aiNickname" className="text-base font-medium">
              What should AllIn1 call you?
            </Label>
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs" side="top">
                  This will be used in conversations to personalize how the AI
                  addresses you
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="aiNickname"
            placeholder="John Doe"
            value={aiNickname || ""}
            onChange={(e) => setAiNickname(e.target.value)}
            className="max-w-md"
          />

          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="aiPersonality" className="text-base font-medium">
              What traits should AllIn1 have?
            </Label>
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs" side="top">
                  The AI will adopt these personality traits when responding to
                  your messages
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="aiPersonality"
            placeholder="friendly and casual, uses simple language, provides concise answers, etc."
            value={aiPersonality || ""}
            onChange={(e) => setAiPersonality(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <div className="flex justify-start items-center pt-2">
          <Button
            onClick={() => updateAiMutation.mutate()}
            disabled={updateAiMutation.isPending || !hasAiChanges}
            className="w-full sm:w-auto"
            variant={hasAiChanges ? "default" : "outline"}
          >
            {updateAiMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving AI Preferences...
              </>
            ) : (
              "Save AI Preferences"
            )}
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div>
        <h2 className="text-xl font-bold mb-2">Visual Options</h2>
        <p className="text-muted-foreground mb-6">
          Customize the appearance of the chat interface.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="textFont" className="text-base font-medium">
              Chat Text Font
            </Label>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent
                  className="bg-gray-200 text-black dark:bg-neutral-900 dark:text-white text-sm"
                  side="right"
                >
                  This font will be used for regular texts
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={textFont}
            onValueChange={(value) => setTextFont(value as FontFamily)}
          >
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Select a font family" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="roboto">Roboto</SelectItem>
              <SelectItem value="poppins">Poppins</SelectItem>
              <SelectItem value="openSans">Open Sans</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="codeFont" className="text-base font-medium">
              Code Block Font
            </Label>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent
                  className="bg-gray-200 text-black dark:bg-neutral-900 dark:text-white text-sm"
                  side="right"
                >
                  This font will be used for code blocks
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select
            value={codeFont}
            onValueChange={(value) => setCodeFont(value as FontFamily)}
          >
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Select a font family" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
              <SelectItem value="firaCode">Fira Code</SelectItem>
              <SelectItem value="jetbrainsMono">JetBrains Mono</SelectItem>
              <SelectItem value="sourceCodePro">Source Code Pro</SelectItem>
              <SelectItem value="sans">Sans-serif</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-start items-center pt-2">
          <Button onClick={resetFonts} variant="outline" size="sm">
            Reset to Default Fonts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationSettings;
