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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CustomizationSettings = ({
  aiCustomizations,
}: {
  aiCustomizations: { aiNickname: string | null; aiPersonality: string | null };
}) => {
  const [aiNickname, setAiNickname] = useState(aiCustomizations.aiNickname);
  const [aiPersonality, setAiPersonality] = useState(
    aiCustomizations.aiPersonality
  );

  const hasChanges =
    aiNickname !== aiCustomizations.aiNickname ||
    aiPersonality !== aiCustomizations.aiPersonality;

  const updateMutation = useMutation({
    mutationFn: () => updateAiCustomizations({ aiNickname, aiPersonality }),
    onSuccess: () => {
      toast.success("AI preferences updated successfully");
    },
    onError: () => {
      toast.error("Failed to update AI preferences");
    },
  });

  return (
    <div className="space-y-8">
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

        <div className="flex justify-between items-center">
          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending || !hasChanges}
            className="w-full sm:w-auto"
            variant={hasChanges ? "default" : "outline"}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationSettings;
