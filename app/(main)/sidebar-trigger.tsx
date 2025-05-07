"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCanvas } from "@/hooks/use-canvas";
import { Check, Copy, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const SidebarTriggerComponent = () => {
  const { isOpen, onClose, code, setIsOpen } = useCanvas();
  const [showCheck, setShowCheck] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 1000);
  };

  return (
    <div className="flex items-center justify-between">
      <SidebarTrigger />
      {isOpen !== null && (
        <div className="mr-6 flex items-center gap-3">
          <div className="flex border-r border-border pr-3 dark:border-border">
            <button
              onClick={() => setIsOpen("editor")}
              className={cn(
                "px-2 py-1 text-sm font-medium transition-colors",
                isOpen === "editor"
                  ? "text-foreground dark:text-foreground"
                  : "text-muted-foreground hover:text-foreground dark:hover:text-foreground"
              )}
            >
              Code
            </button>
            <button
              onClick={() => setIsOpen("preview")}
              className={cn(
                "px-2 py-1 text-sm font-medium transition-colors",
                isOpen === "preview"
                  ? "text-foreground dark:text-foreground"
                  : "text-muted-foreground hover:text-foreground dark:hover:text-foreground"
              )}
            >
              Preview
            </button>
          </div>
          {isOpen === "editor" && (
            <>
              {showCheck ? (
                <Check className="size-[18px] text-green-500" />
              ) : (
                <TooltipComponent description="Copy code">
                  <Copy
                    className="size-[18px] cursor-pointer text-muted-foreground hover:text-foreground dark:hover:text-foreground"
                    onClick={handleCopy}
                  />
                </TooltipComponent>
              )}
            </>
          )}
          <TooltipComponent description="Close panel">
            <X
              className="size-[18px] cursor-pointer text-muted-foreground hover:text-foreground dark:hover:text-foreground"
              onClick={onClose}
            />
          </TooltipComponent>
        </div>
      )}
    </div>
  );
};

export default SidebarTriggerComponent;
